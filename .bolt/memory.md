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
- **AI service:** Python service exposes `/analyze` and `/blueprint`; Groq is currently responding successfully at the provider level.
- **Database:** MongoDB via Mongoose; PostgreSQL/Prisma are not used.
- **Authentication:** bcrypt-style password hashing and JWT sessions with 7-day expiry; sign-up, sign-in, sign-out, frontend auth provider, API client, and protected routes are implemented.
- **Project creation:** Draft projects are saved to the authenticated user’s MongoDB account with frontend/backend validation; unauthenticated requests are rejected.
- **AI providers:** The AI service supports provider selection among Gemini, OpenAI, and Groq through configuration. Switching providers is intended to require configuration changes rather than UI rewrites.
- **AI JSON handling:** `/analyze` and `/blueprint` request Groq’s JSON response format where supported and use prompts requiring raw valid JSON without Markdown fences or explanatory text.
- **Response limits:** AI output is bounded through `LLM_MAX_OUTPUT_TOKENS`, currently configured to 8192 in the service changes, to reduce truncation of long blueprints.
- **Validation and errors:** AI responses are checked for truncation, JSON parse failures, and schema/structure validation failures before being accepted. Incomplete or malformed JSON is never silently repaired into a successful blueprint.
- **Logging:** Service errors identify whether the failure is related to model/provider errors, response truncation, JSON parsing, or schema validation while avoiding unsafe secret logging.
- **Compatibility:** Existing frontend response shapes and functionality remain unchanged; no mock AI responses were introduced.
- **Secrets:** Provider API keys belong in AI-service secret settings/environment configuration, not frontend code. The Groq key must be supplied by the user; it cannot be added by the assistant.
- **Deployment target:** Render is planned for the backend; MongoDB Atlas is planned for the database.
- **Phased status:** Project creation (Phase 3) is complete and locally tested. AI analysis/blueprint phases and real saved-project listing/dashboard data remain incomplete.
- **Shared form options:** Example requirement text is maintained in a shared module.

## Open questions & assumptions

- Both AI endpoints still need an end-to-end test using a Library Management System requirement in an environment with Python dependencies and the configured Groq key.
- Confirm that the selected Groq model supports the requested JSON response format and the configured `max_completion_tokens` setting.
- Confirm the effective `LLM_MAX_OUTPUT_TOKENS` value in each deployment environment and monitor logs for remaining truncation.
- Groq API key, MongoDB Atlas connection string, and JWT secret still need to be supplied through secret/environment settings.
- Confirm the AI service endpoint and backend-to-AI-service URL for local and production environments.
- Dashboard and My Projects still use sample/placeholder data until saved-project listing is implemented.
- Render deployment setup remains pending.
- No real project has been confirmed as saved against a live MongoDB instance.