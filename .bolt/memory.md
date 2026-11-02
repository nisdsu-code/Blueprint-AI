# Project memory

## Product intent & audience

- **BlueprintGen AI**: AI-powered requirement engineering and software blueprint generation system.
- Converts natural-language ideas into structured software development documents, database schemas, and architectures.
- Audience: developers, technical founders, and teams needing rapid project scaffolding from ideas.
- Core workflow: create project → analyze requirement → generate blueprint.

## Brand personality & voice

- Technical, professional, and clear.
- User-facing copy is concise and action-oriented.
- Dashboard is personalized to the signed-in user.

## Visual design & UX direction

- Sign-in and sign-up pages match the existing app visual style.
- Sidebar footer shows the signed-in user’s name and logout action.
- Protected routes redirect unauthenticated users to sign-in.
- New Project form includes project name, optional category, written requirement, and a shared “Use an example” action.
- After saving, users can create another project or return to the dashboard.
- Analyze Requirement and Generate Blueprint actions remain visibly disabled/unavailable until the AI service is reachable and configured.
- Analysis UI should tolerate incomplete or missing response fields rather than crash; missing-information data is treated defensively.
- My Projects currently has a placeholder state rather than a real saved-project list.

## Decisions, constraints & rationale

- **Frontend:** Vite + React.
- **Backend:** Express + Mongoose in a separate `backend` folder.
- **Database:** MongoDB via Mongoose; PostgreSQL/Prisma are not used.
- **Authentication:** bcrypt-style password hashing and JWT sessions with 7-day expiry; sign-up, sign-in, sign-out, frontend auth provider, API client, and protected routes are implemented.
- **Project creation:** Draft projects are saved to the authenticated user’s MongoDB account with frontend/backend validation; unauthenticated requests are rejected.
- **AI providers:** The AI service supports provider selection among Gemini, OpenAI, and Groq through configuration. Switching providers is intended to require configuration changes rather than UI rewrites.
- **Secrets:** Provider API keys belong in AI-service secret settings/environment configuration, not frontend code. The Groq key must be supplied by the user; it cannot be added by the assistant.
- **AI integration status:** Groq has been added alongside Gemini and OpenAI, and the analysis panel crash caused by reading `.length` from an undefined `missing_information` value has been fixed defensively.
- **Service availability:** The AI service must be running and reachable by the backend. If unavailable, Analyze/Generate should report unavailability rather than produce results.
- **Deployment target:** Render is planned for the backend; MongoDB Atlas is planned for the database.
- **Phased status:** Project creation (Phase 3) is complete and locally tested. AI analysis/blueprint phases and real saved-project listing/dashboard data remain incomplete.
- **Shared form options:** Example requirement text is maintained in a shared module.

## Open questions & assumptions

- Confirm the desired active AI provider and model configuration; Groq, Gemini, and OpenAI are available but provider selection is configuration-driven.
- Groq API key, MongoDB Atlas connection string, and JWT secret still need to be supplied through secret/environment settings.
- Confirm the AI service endpoint and backend-to-AI-service URL for local and production environments.
- Analyze and Generate cannot be fully validated until the AI service is running and reachable.
- Dashboard and My Projects still use sample/placeholder data until saved-project listing is implemented.
- Render deployment setup remains pending.
- No real project has been confirmed as saved against a live MongoDB instance.