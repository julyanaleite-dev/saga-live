CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slides JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id UUID REFERENCES presentations(id),
  access_code VARCHAR(12) UNIQUE NOT NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('SYNC', 'CONNECTED')),
  status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
  current_slide_index INT NOT NULL DEFAULT 0,
  current_question_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  senai_school TEXT NOT NULL,
  socket_id TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, name, senai_school)
);

CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  slide_id TEXT NOT NULL,
  question_type TEXT NOT NULL,
  answer JSONB NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  correctness_ratio NUMERIC(5,4) NOT NULL DEFAULT 0,
  response_time_ms INT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, participant_id, slide_id)
);

CREATE TABLE leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  slide_id TEXT,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_responses_session ON responses(session_id);
CREATE INDEX idx_responses_participant ON responses(participant_id);
CREATE INDEX idx_participants_session ON participants(session_id);
