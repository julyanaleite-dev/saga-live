# Saga Live - Plataforma Interativa SENAI

MVP criado em HTML, CSS e JavaScript para apresentacoes gamificadas no estilo Kahoot/Mentimeter, com identidade visual institucional SENAI.

O arquivo `index.html` e autocontido: possui HTML, CSS e JavaScript no mesmo arquivo, facilitando a publicacao via GitHub Pages e a abertura direta no navegador.

## Atualizacao desta versao

- Apresentacao ampliada para seguir o roteiro rico da **Nova SAGA SENAI de Inovacao 2026**.
- Estrutura com **68 slides**, organizados em **9 secoes**.
- Cada secao tem capa, pergunta de abertura, blocos explicativos e atividade de fechamento.
- Inclusao de integracao com **Google Planilhas + Apps Script** para armazenar sessoes, participantes, respostas e resumos.

## Como abrir rapidamente

1. Abra o arquivo `index.html` em um navegador moderno ou publique com GitHub Pages.
2. Clique em **Configurar Planilha** e cole a URL do Apps Script, se desejar armazenar os dados.
3. Clique em **Modo conectado** ou **Modo auditorio**.
4. Navegue pelos 68 slides.
5. Nas atividades interativas, clique em **Iniciar pergunta** e registre respostas.
6. Gere o relatorio final e baixe o CSV.

## Google Planilhas + Apps Script

A pasta `google-sheets/` contem:

```text
google-sheets/
├─ Code.gs
└─ README.md
```

Use esse script em uma planilha Google para criar as abas:

- `sessoes`
- `participantes`
- `respostas`
- `resumos`
- `eventos`

Depois de publicar o Apps Script como Web App, cole a URL terminada em `/exec` no botao **Configurar Planilha** do prototipo.

## Recursos implementados no prototipo estatico

- Slideshow interativo com 68 slides.
- Modo Auditorio e Modo Conectado simulado.
- Cadastro de participantes: nome, funcao e escola SENAI.
- Multipla escolha.
- Verdadeiro ou falso.
- Nuvem de palavras.
- Preenchimento de lacunas.
- Ordenacao de trilha.
- Jogo da memoria conceitual.
- Associacao de personas e responsabilidades.
- Cenario ramificado.
- Ranking por acerto e tempo de resposta.
- Feedback audiovisual: confete, sirene e efeitos sonoros.
- Dashboard live com taxa de acerto, tempo medio, respostas e engajamento.
- Relatorio final, exportacao CSV e envio para Google Sheets.

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
├─ google-sheets/
│  ├─ Code.gs
│  └─ README.md
└─ server-mvp/
   ├─ package.json
   ├─ src/server.js
   └─ db/schema.sql
```

## Publicacao com GitHub Pages

1. Acesse **Settings** do repositorio.
2. Entre em **Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch `main` e a pasta `/root`.
5. Salve e aguarde o GitHub gerar o link publico.

## Proxima evolucao recomendada

1. Validar a gravacao na planilha Google.
2. Criar dashboards no Google Sheets ou Looker Studio.
3. Evoluir o modo conectado com servidor real-time.
4. Persistir sessoes, participantes e respostas em banco quando houver escala.
5. Criar exportacao PDF/CSV do relatorio final por escola e turma.
