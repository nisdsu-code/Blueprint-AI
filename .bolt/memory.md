# Project memory

## Product intent & audience

- **BlueprintGen AI** converts natural-language software ideas into structured requirements, database schemas, architectures, and implementation blueprints.
- Primary audience: developers, technical founders, and teams seeking rapid project scaffolding.
- Core workflow: create project → analyze requirement → generate blueprint.

## Brand personality & voice

- Technical, professional, and clear.
- User-facing copy is concise and action-oriented.
- Dashboard experience is personalized to the signed-in user.

## Visual design & UX direction

- Preserve the existing app visual style across authentication and project workflows.
- Sidebar footer should identify the signed-in user and provide logout.
- Protected routes redirect unauthenticated users to sign-in.
- New Project captures name, optional category, and written requirement, with a shared “Use an example” action.
- After saving, users can create another project or return to the dashboard.
- AI actions remain visibly unavailable until the AI service is reachable and configured.
- Analysis views must tolerate missing response fields defensively rather than crash.
- My Projects and dashboard project data remain placeholder/sample experiences until listing is implemented.

## Decisions, constraints & rationale

- **Frontend:** Vite + React.
- **Backend:** Express + Mongoose in a separate `backend` folder.
- **AI service:** Python service exposes `/analyze` and `/blueprint`; provider configuration supports Gemini, OpenAI, and Groq.
- **Database:** MongoDB via Mongoose; PostgreSQL/Prisma are not used.
- **Authentication:** bcrypt-style password hashing, JWT sessions with 7-day expiry, frontend auth provider, API client, sign-up/sign-in/sign-out, and protected routes.
- **Project creation:** Drafts are validated and saved to the authenticated user’s MongoDB account; unauthenticated requests are rejected.
- **AI response integrity:** Responses must be validated for truncation, JSON parsing, and expected structure. Incomplete or malformed output must not be silently repaired or treated as a successful blueprint.
- **Diagnostics:** AI-service completion failures now record model name, finish reason, response length, token usage, and JSON parse context without exposing secrets. Logs are intended to distinguish provider/model failure, output-limit truncation, malformed JSON, and schema failure.
- **Runtime investigation:** JavaScript-style parse errors suggest at least one failing parse may occur in the Node backend or browser rather than Python; all parse points on the request path need to be considered.
- **Structured output:** Strict JSON-schema support depends on the selected Groq model; the current/default Llama setup may provide JSON mode without strict schema enforcement. A model change may be required for schema-constrained output.
- **Output strategy:** Do not rely solely on increasing token limits or regex repair. If complete blueprints exceed reliable response capacity, generate independently validated sections and combine them only after validation.
- **Compatibility:** Preserve existing frontend response shapes and functionality; no mock AI responses.
- **Secrets:** Provider keys belong in AI-service environment/secret configuration, never frontend code. The Groq key must be supplied by the user.
- **Deployment target:** Render is planned for the backend; MongoDB Atlas is planned for the database.
- **Status:** Authentication and project creation are implemented. Real saved-project listing, dashboard data, AI end-to-end validation, and deployment setup remain incomplete.

## Open questions & assumptions

- Run both `/analyze` and `/blueprint` end-to-end with a Library Management System requirement using the configured Groq key and Python dependencies.
- Inspect the new completion and JSON-error logs to establish whether failures are truncation, malformed provider output, wrong-runtime parsing, or schema mismatch.
- Confirm the selected Groq model’s support for strict JSON schema and the configured token parameter.
- Determine whether the observed response length and token usage approach the model’s output limit; do not assume truncation from character count alone.
- Decide whether to switch to a schema-capable model or implement smaller independently validated sections.
- Confirm the effective `LLM_MAX_OUTPUT_TOKENS` and AI-service URL in local and production environments.
- Groq key, MongoDB Atlas connection string, JWT secret, and Render configuration remain environment/deployment concerns.
- No live MongoDB save and no successful live AI endpoint test have been confirmed.