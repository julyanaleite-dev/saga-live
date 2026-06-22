# Saga Live - Plataforma Interativa SENAI

MVP criado em HTML, CSS e JavaScript para apresentacoes gamificadas no estilo Kahoot/Mentimeter, com identidade visual institucional SENAI.

## Como abrir rapidamente

1. Abra o arquivo `index.html` em um navegador moderno.
2. Clique em **Modo conectado** ou **Modo auditorio**.
3. No modo conectado, use **Adicionar turma demo** para simular participantes.
4. Clique em **Iniciar pergunta**, responda ou use **Responder automaticamente**.
5. Gere o relatorio final e baixe o CSV.

## Recursos implementados no prototipo estatico

- Slideshow interativo.
- Modo Auditorio e Modo Conectado simulado.
- Cadastro de participantes: nome, funcao e escola SENAI.
- Multipla escolha.
- Verdadeiro ou falso.
- Enquete em tempo real simulada.
- Nuvem de palavras.
- Preenchimento de lacunas.
- Arrastar e soltar.
- Jogo da memoria.
- Cenario ramificado.
- Ranking por acerto e tempo de resposta.
- Feedback audiovisual: confete, sirene e efeitos sonoros.
- Dashboard live com taxa de acerto, tempo medio, respostas e engajamento.
- Relatorio final e exportacao CSV.

## Atalhos

- Seta direita: proximo slide.
- Seta esquerda: slide anterior.
- S: iniciar pergunta.
- R: gerar relatorio.

## Observacao importante

Este pacote entrega um MVP navegavel e apresentavel. Para uso real com varios celulares conectados em dispositivos diferentes, use ou evolua a pasta `server-mvp`, que contem a base para servidor Node.js com Socket.IO, Redis e PostgreSQL.

## Estrutura

```text
saga-live/
├─ index.html
├─ assets/
│  ├─ css/style.css
│  └─ js/app.js
└─ server-mvp/
   ├─ package.json
   ├─ src/server.js
   └─ db/schema.sql
```

## Proxima evolucao recomendada

1. Publicar o prototipo via GitHub Pages.
2. Evoluir o modo conectado com servidor real-time.
3. Persistir sessoes, participantes e respostas em PostgreSQL.
4. Criar exportacao PDF/CSV do relatorio final por escola e turma.
