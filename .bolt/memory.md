# Project memory

## Product intent & audience

- **BlueprintGen AI**: AI-powered requirement engineering and software blueprint generation system.
- Converts natural-language ideas into structured software development documents, database schemas, and architectures.
- Audience: developers, technical founders, and teams needing rapid project scaffolding from ideas.
- Core workflow: create project (name, category, requirement) → analyze requirement → generate blueprint.

## Brand personality & voice

- Technical, professional, and clear.
- User-facing copy is concise and action-oriented (e.g., "sign in", "sign up", "logout", "Use an example").
- Dashboard personalized to signed-in user (greeting by name).

## Visual design & UX direction

- Sign-in and sign-up pages match the app's existing visual style.
- Sidebar footer replaced with signed-in user's name + logout button (replacing placeholder footer).
- Dashboard greeting personalized to authenticated user.
- Protected routes: unauthenticated users redirected to sign-in; app pages only accessible when signed in.
- New Project page: form with project name, optional category dropdown, written requirement; "Use an example" button fills doctor appointment idea.
- Post-save confirmation shows "Create another project" and "Back to dashboard" options.
- Analyze Requirement and Generate Blueprint buttons visible but disabled (greyed out) until AI features built.
- My Projects page: placeholder state (no real project list yet).

## Decisions, constraints & rationale

- **Database:** MongoDB chosen by user (via Mongoose). PostgreSQL/Prisma not used.
- **Folder layout:** Separate `backend` folder for server/API code (user-approved).
- **Frontend:** Vite + React.
- **Backend:** Express + Mongoose; separate from frontend.
- **Auth implementation:** bcrypt-style password hashing; JWT-based sessions with 7-day expiry.
- **Auth flow:** Sign-up, sign-in, sign-out, protected routes on frontend; auth provider + API client wiring.
- **Project creation (Phase 3):** New Project page saves draft projects to user's account in MongoDB; input validation on frontend and backend; unauthenticated requests rejected.
- **Shared form options:** Example text extracted to shared module (dashboard references shared example instead of own copy).
- **Backend verification:** Routes tested without live DB (syntax + non-DB routes pass; invalid input returns readable messages). User has now tested locally.
- **Deployment target:** Render planned for backend; MongoDB Atlas for database.
- **Environment config:** MongoDB connection string and JWT secret key stored in backend settings/env, not in frontend app.
- **Phased build:** Phase 3 (project creation) complete & locally tested. Phases 4–6 (AI analyze/generate) pending. Phase 9 (list saved projects, dashboard real data) pending.
- **AI provider flexibility:** User wants to use Gemini instead of OpenAI. Google provides an OpenAI-compatible endpoint for Gemini, so AI service can support both providers via config change (endpoint URL + API key + model name). Change not yet implemented; awaiting user confirmation to proceed.

## Open questions & assumptions

- User unclear on what to build next — may want Phase 7 or to test Phases 3–6 locally; needs clarification.
- AI provider: user prefers Gemini over OpenAI; implementation pending confirmation of endpoint details and provider-switch approach.
- MongoDB Atlas connection string and JWT secret not yet provided by user.
- Frontend-to-backend API URL configuration not yet finalized for production.
- AI blueprint generation features (Phases 4–6, core product value) not yet built — Analyze/Generate buttons disabled.
- Dashboard and My Projects still use sample/placeholder data until saved-project listing implemented (Phase 9).
- Render deployment setup steps still pending.
- No real project saved against live MongoDB yet.