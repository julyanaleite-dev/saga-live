import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import Redis from "ioredis";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const sessions = new Map();
const participants = new Map();

const samplePresentation = {
  id: "saga-live-demo",
  title: "Nova Saga SENAI 2026",
  slides: [
    { id: "s1", type: "content", title: "Da demanda da industria ao mercado", body: "Uma trilha para aprender, criar, testar e transformar." },
    {
      id: "q1",
      type: "multiple_choice",
      title: "Qual e o ponto de partida da Saga?",
      timeLimitMs: 30000,
      maxPoints: 1000,
      options: [
        { id: "a", text: "Uma ideia livre do estudante" },
        { id: "b", text: "Uma demanda real da industria" },
        { id: "c", text: "Uma prova objetiva" },
        { id: "d", text: "Um pitch pronto" }
      ],
      correctAnswer: "b"
    }
  ]
};

function makeAccessCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function room(code) {
  return `session:${code}`;
}

function getCurrentSlide(session) {
  return session.presentation.slides[session.currentSlideIndex];
}

function evaluate(slide, answer) {
  const isCorrect = answer?.value === slide.correctAnswer;
  return { isCorrect, correctnessRatio: isCorrect ? 1 : 0 };
}

function score({ isCorrect, correctnessRatio, responseTimeMs, timeLimitMs, maxPoints }) {
  if (!isCorrect && correctnessRatio <= 0) return 0;
  const speedFactor = Math.max(0, 1 - responseTimeMs / Math.max(timeLimitMs, 1000));
  return Math.round(maxPoints * correctnessRatio * (0.6 + 0.4 * speedFactor));
}

app.post("/api/sessions", (req, res) => {
  const accessCode = makeAccessCode();
  const session = {
    id: uuid(),
    accessCode,
    mode: req.body.mode === "CONNECTED" ? "CONNECTED" : "SYNC",
    currentSlideIndex: 0,
    currentQuestionStartedAt: null,
    presentation: samplePresentation
  };
  sessions.set(accessCode, session);
  res.json({ sessionId: session.id, accessCode, joinUrl: `/player.html?code=${accessCode}` });
});

io.on("connection", socket => {
  socket.on("presenter:join", ({ accessCode }) => {
    const session = sessions.get(accessCode);
    if (!session) return socket.emit("error:message", "Sessao nao encontrada");
    socket.join(room(accessCode));
    socket.join(`presenter:${accessCode}`);
    socket.emit("session:state", { currentSlideIndex: session.currentSlideIndex, currentSlide: getCurrentSlide(session) });
  });

  socket.on("participant:join", ({ accessCode, name, role, senaiSchool }) => {
    const session = sessions.get(accessCode);
    if (!session) return socket.emit("error:message", "Sessao nao encontrada");
    const participant = { id: uuid(), accessCode, name, role, senaiSchool, socketId: socket.id };
    participants.set(participant.id, participant);
    socket.join(room(accessCode));
    socket.emit("participant:joined", { participantId: participant.id, currentSlide: getCurrentSlide(session) });
    io.to(`presenter:${accessCode}`).emit("dashboard:participant_joined", participant);
  });

  socket.on("slide:go", ({ accessCode, direction }) => {
    const session = sessions.get(accessCode);
    if (!session) return;
    const delta = direction === "prev" ? -1 : 1;
    session.currentSlideIndex = Math.max(0, Math.min(session.presentation.slides.length - 1, session.currentSlideIndex + delta));
    session.currentQuestionStartedAt = null;
    io.to(room(accessCode)).emit("slide:changed", { currentSlideIndex: session.currentSlideIndex, slide: getCurrentSlide(session) });
  });

  socket.on("question:start", ({ accessCode }) => {
    const session = sessions.get(accessCode);
    if (!session) return;
    const slide = getCurrentSlide(session);
    session.currentQuestionStartedAt = Date.now();
    io.to(room(accessCode)).emit("question:started", { slideId: slide.id, startedAt: session.currentQuestionStartedAt, timeLimitMs: slide.timeLimitMs || 30000 });
  });

  socket.on("answer:submit", async ({ accessCode, participantId, slideId, answer }) => {
    const session = sessions.get(accessCode);
    const participant = participants.get(participantId);
    if (!session || !participant || !session.currentQuestionStartedAt) return;
    const slide = getCurrentSlide(session);
    if (slide.id !== slideId) return;
    const responseTimeMs = Date.now() - session.currentQuestionStartedAt;
    const ev = evaluate(slide, answer);
    const points = score({ ...ev, responseTimeMs, timeLimitMs: slide.timeLimitMs || 30000, maxPoints: slide.maxPoints || 1000 });
    await redis.zincrby(`session:${accessCode}:leaderboard`, points, participantId);
    socket.emit("answer:feedback", { isCorrect: ev.isCorrect, score: points, responseTimeMs });
    io.to(`presenter:${accessCode}`).emit("dashboard:answer_received", { participantId, slideId, isCorrect: ev.isCorrect, score: points, responseTimeMs });
  });

  socket.on("question:lock", async ({ accessCode }) => {
    const leaders = await redis.zrevrange(`session:${accessCode}:leaderboard`, 0, 9, "WITHSCORES");
    const leaderboard = [];
    for (let i = 0; i < leaders.length; i += 2) {
      const participant = participants.get(leaders[i]);
      leaderboard.push({ position: i / 2 + 1, name: participant?.name || "Participante", score: Number(leaders[i + 1]) });
    }
    io.to(room(accessCode)).emit("question:locked", { leaderboard });
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Saga Live API running on http://localhost:3000");
});
