# Forms Dashboard

Dashboard pessoal, mobile-first, para acompanhar respostas de um Google Forms conectado ao Google Sheets.

## Stack

- Next.js com App Router
- TypeScript
- Material UI
- Recharts
- Google Sheets API
- Sem banco de dados

## Como configurar o Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto ou selecione um projeto existente.
3. Ative a API **Google Sheets API** em **APIs e servicos > Biblioteca**.
4. Abra **APIs e servicos > Credenciais**.
5. Crie uma **Service Account**.
6. Na Service Account, abra a aba **Chaves** e crie uma chave JSON.
7. Copie do JSON os campos:
   - `client_email`
   - `private_key`

## Como compartilhar a planilha

1. Abra a planilha que recebe as respostas do Google Forms.
2. Clique em **Compartilhar**.
3. Adicione o e-mail da service account, que vem em `client_email`.
4. Dê permissao de **Leitor**.
5. Copie o ID da planilha pela URL:

```txt
https://docs.google.com/spreadsheets/d/SEU_GOOGLE_SHEET_ID/edit
```

## Variaveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
GOOGLE_SHEET_ID=seu_id_da_planilha
GOOGLE_SHEET_RANGE=Form Responses 1!A:Z
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE\n-----END PRIVATE KEY-----\n"
```

Observacoes:

- `GOOGLE_PRIVATE_KEY` precisa manter os `\n`.
- Nunca exponha essas variaveis no frontend.
- A planilha precisa estar compartilhada com `GOOGLE_SERVICE_ACCOUNT_EMAIL`.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra:

```txt
http://localhost:3000
```

## Deploy na Vercel

1. Suba o projeto para um repositorio Git.
2. Importe o repositorio na Vercel.
3. Configure as variaveis de ambiente em **Project Settings > Environment Variables**:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SHEET_RANGE`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
4. Faca o deploy.

## Estrutura principal

```txt
src/
  app/
    api/responses/route.ts
    layout.tsx
    page.tsx
  components/
    dashboard/
    layout/
    theme/
  lib/
    google-sheets.ts
    metrics.ts
    normalize-responses.ts
    theme.ts
  types/
```

## Campos reconhecidos

A normalizacao tenta encontrar automaticamente colunas comuns como:

- timestamp, carimbo de data/hora, data
- nome, nome completo
- email, e-mail
- telefone, WhatsApp, celular
- `3. De qual igreja voce e?`
- `Voce e Lider da Rede Move em sua igreja?`

Se sua planilha usa nomes muito diferentes, ajuste os aliases em `src/lib/normalize-responses.ts`.
