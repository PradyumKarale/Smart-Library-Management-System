# SLMS AI Library Assistant

An AI-focused extension for the **Smart Library Management System (SLMS)**. This work is maintained separately from the core SLMS project so the AI features can be developed, demonstrated, and reviewed independently.

- **AI branch:** `feature/aditya-ai-library-assistant`
- **Repository:** [PradyumKarale/Smart-Library-Management-System](https://github.com/PradyumKarale/Smart-Library-Management-System)
- **AI provider:** Groq API
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js and Express
- **Validation:** Zod

> **Project status:** This README documents the AI feature branch. Before presenting or deploying it, run the build and tests described below and confirm the configured Groq model and API key work. Do not describe a check as passing unless it has actually been run successfully.

## Overview

The AI Library Assistant adds a chat experience to SLMS. It is intended to help users discover books and get library-related guidance using the existing application and its catalog, while leaving ordinary library features available when the AI provider is unavailable.

The AI feature is implemented as a backend integration: the browser calls the SLMS API, and the server calls Groq. The Groq API key must remain on the server and must never be embedded in frontend code.

## Features

The AI-focused branch contains the following feature areas:

- AI chat interface and assistant page in the React frontend.
- Frontend AI service and types for communicating with the backend.
- Express routes, controller, validation schema, and service for AI requests.
- Configurable Groq provider/model settings.
- AI-related tests.

Depending on the current implementation and configuration, the assistant can be used for natural-language book discovery, recommendations, book explanations, and library guidance. Catalog-specific answers should be verified against the actual catalog data; the model must not invent book records or availability.

## Requirements

- Node.js and npm compatible with the project's package files.
- The existing SLMS backend and frontend dependencies.
- A Groq account and API key for real AI responses: [Groq Console](https://console.groq.com/keys).
- The existing MySQL/Prisma configuration if the backend or AI service accesses catalog data through the database.

Groq's developer tier has usage limits. It is not unlimited. Handle rate-limit or provider errors gracefully, and do not enable paid usage automatically as a fallback.

## Configuration

1. Copy `backend/.env.example` to `backend/.env` if that example file is present, or update the backend's local environment file using the project's established setup.
2. Set the AI configuration on the **backend only**:

   ```dotenv
   AI_PROVIDER=groq
   GROQ_API_KEY=replace_with_your_own_groq_api_key
   GROQ_MODEL=openai/gpt-oss-20b
   ```

3. Check Groq's current [supported models](https://console.groq.com/docs/models) and select a model available to your account. The model shown above is a suggested value, not a guarantee that it will be available in every account.
4. Configure the existing database and authentication environment variables required by SLMS. Use the existing `.env.example` and backend configuration as the source of truth. Do not use `localhost` in a hosted deployment's database URL unless the database is running inside that same deployment environment.
5. Never commit `backend/.env`, API keys, database passwords, JWT secrets, or email credentials to GitHub.

If no valid Groq key/model is configured, the application should report that AI is unavailable rather than returning a fake answer.

## Running locally

Use two terminals from the repository root. The commands below assume the package scripts in the project provide `dev`; check each `package.json` if the script name differs.

### 1. Start the backend

```powershell
cd backend
npm install
npx prisma generate
npm run dev
```

The backend normally listens on port `5000`, subject to its environment configuration. Make sure the required MySQL database is running and its `DATABASE_URL` is valid before starting the backend if the application uses Prisma at startup.

### 2. Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. Confirm that the frontend API base URL in `frontend/src/services/apiClient.ts` points to the running backend.

## AI API

The AI routes are located under `backend/src/modules/ai/`. The expected chat route is:

```text
POST /api/ai/chat
```

The frontend integration is under `frontend/src/services/aiService.ts`, with related types in `frontend/src/types/ai.ts`. Check those files and `backend/src/modules/ai/ai.schema.js` for the exact request and response shape currently implemented.

Requests should use the application's normal authentication mechanism where required. The backend must validate input and enforce authorization; client-supplied identity or role information must not be trusted.

## Security and privacy

- Keep `GROQ_API_KEY` server-side. Do not prefix it with `VITE_` or expose it to browser code.
- Do not commit real environment files or credentials.
- Validate messages and bound conversation history/request sizes.
- Handle provider failures and HTTP 429 rate-limit responses safely.
- Do not allow the model to execute arbitrary SQL, shell commands, or administrative actions.
- Respect SLMS roles and authorization rules. A student must not access another student's private data.
- Avoid sending unnecessary personal information to the model.
- Do not claim a book was issued, returned, or changed unless an authorized backend operation actually completed.

## Build and test

Run the frontend production build:

```powershell
cd frontend
npm run build
```

Run backend checks from the backend folder using the scripts defined by the current `backend/package.json`. For example, if a test script is available:

```powershell
cd backend
npm test
```

The AI-related test file is `tests/ai/ai.test.js`. Use the command defined in the root `package.json` or the applicable package configuration to execute it. If tests mock Groq, report them as mocked tests; they do not prove that a live Groq request succeeded.

Before a demo, verify:

- The frontend build completes successfully.
- The backend starts with the intended configuration.
- Login/authentication and normal library pages still work.
- The AI endpoint handles a valid request and provider errors correctly.
- A real Groq request succeeds when a valid key and supported model are configured.
- No secret files or credentials are staged for Git.

## Troubleshooting

**AI key missing or invalid**  
Check `GROQ_API_KEY` in the backend's environment and restart the backend after changing it.

**Model unavailable**  
Check Groq's current model list and update `GROQ_MODEL` to one your account can access.

**Rate limit reached**  
The free tier can reject requests when a limit is reached. Retry later; do not assume the request succeeded.

**Chat page cannot reach the API**  
Confirm the backend is running, verify the route registration in `backend/src/app.js`, and check the frontend API base URL and browser console.

**Catalog-dependent responses fail**  
Check that the backend's database configuration is valid and the existing Prisma schema/migrations are in the expected state. Do not reset a database with existing data just to fix the chatbot.

**Frontend appears unstyled or the build fails**  
Check the installed Tailwind version and corresponding `tailwind.config.js`, `postcss.config.js`, Vite setup, and global stylesheet imports. Do not mix Tailwind v3 and v4 configuration instructions.

## Git branch

This AI work is intended to remain separate from the core project until reviewed:

```text
feature/aditya-ai-library-assistant
```

Keep the core `main` branch separate unless the project owner intentionally chooses to merge the AI feature. Review the Git diff before committing, and never commit secrets.

## Credits and external services

- [Groq](https://groq.com/) — AI inference API.
- [Groq documentation](https://console.groq.com/docs/quickstart) — SDK, models, and rate limits.
- SLMS core repository — existing library-management application.
