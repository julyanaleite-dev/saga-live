# Google Planilhas + Apps Script para o Saga Live

Esta pasta contém o arquivo `Code.gs`, que transforma uma planilha Google em uma base leve para armazenar os dados de cada sessão do Saga Live.

## O que será armazenado

O script cria e alimenta cinco abas:

| Aba | Finalidade |
|---|---|
| `sessoes` | abertura de sessão, modo, data e total de slides |
| `participantes` | nome, função e escola SENAI dos participantes |
| `respostas` | respostas por slide, acerto, tempo e pontuação |
| `resumos` | consolidação final da sessão |
| `eventos` | testes e eventos gerais |

## Como configurar

1. Crie uma planilha no Google Sheets chamada, por exemplo, `Saga Live - Base de Sessões`.
2. Na planilha, acesse **Extensões > Apps Script**.
3. Apague o conteúdo padrão do editor.
4. Cole o conteúdo do arquivo `Code.gs`.
5. Salve o projeto.
6. Execute manualmente a função `setup` uma vez e autorize o script.
7. Clique em **Implantar > Nova implantação**.
8. Em tipo, escolha **App da Web**.
9. Configure:
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa com o link** ou a opção permitida pela política institucional
10. Clique em **Implantar**.
11. Copie a URL terminada em `/exec`.
12. Abra o Saga Live, clique em **Configurar Planilha** e cole a URL.

## Observação sobre segurança e LGPD

A planilha receberá nome, função, escola, respostas, tempo e pontuação. Restrinja o compartilhamento da planilha à equipe autorizada e evite publicar relatórios nominais de estudantes sem validação institucional.

## Referência oficial

A solução usa o padrão de Web App do Google Apps Script com `doPost(e)` e `ContentService`, além do serviço `SpreadsheetApp` para gravar linhas em uma planilha.
