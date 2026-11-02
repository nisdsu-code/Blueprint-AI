# BlueprintGen AI API

The backend is an Express server that exposes JSON endpoints under `/api`. Every request and response body is JSON.

## Authentication

Protected endpoints require a session token from sign-in or sign-up:

```
Authorization: Bearer <token>
```

Tokens are valid for 7 days by default (`JWT_EXPIRES_IN`). An expired or missing token returns `401`.

## Errors

Errors use one shape:

```json
{ "message": "Readable explanation of what went wrong" }
```

| Status | Meaning |
| --- | --- |
| 400 | Input is missing or invalid. The message says what to fix. |
| 401 | Not signed in, session expired, or account no longer exists. |
| 404 | No endpoint matches the method and path. |
| 409 | Email already registered. |
| 429 | AI provider rate limit reached. Wait and retry. |
| 500 | Unexpected server error. |
| 502 | AI provider rejected the request or returned an unusable result. |
| 503 | AI service or AI provider could not be reached. |

## Health

### GET /api/health

Returns `{ "status": "ok" }`. Use it to confirm the backend is running.

## Auth

### POST /api/auth/register

Creates an account and signs the user in.

Request:

```json
{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "at-least-8-chars" }
```

Rules: name is required (max 100 characters), email must look valid, password must be at least 8 characters.

Response `201`:

```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "Ada Lovelace", "email": "ada@example.com", "createdAt": "...", "updatedAt": "..." }
}
```

Errors: `400` for invalid input, `409` if the email is already registered.

### POST /api/auth/login

Request: `{ "email": "...", "password": "..." }`

Response `200`: `{ "token": "<jwt>", "user": { ... } }`

Errors: `400` if email or password is missing, `401` if the credentials do not match. The same message is used for both cases so accounts cannot be guessed.

### GET /api/auth/me

Requires a token. Response `200`: `{ "user": { ... } }`.

## Projects

### POST /api/projects

Requires a token. Saves a draft project to the signed-in user's account.

Request:

```json
{
  "name": "Doctor Appointment System",
  "category": "Healthcare",
  "requirement": "A web app where patients book appointments with doctors...",
  "clarifications": [
    { "question": "Who pays for visits?", "answer": "Patients pay online at booking." }
  ],
  "blueprint": { "document_sections": [], "database_tables": [], "...": "..." }
}
```

| Field | Required | Rules |
| --- | --- | --- |
| `name` | Yes | 1 to 120 characters |
| `category` | No | Up to 60 characters. Defaults to `General`. |
| `requirement` | Yes | 20 to 5000 characters |
| `clarifications` | No | Up to 8 items. Each has `question` (max 300) and `answer` (max 1000). Items with a blank answer are dropped. |
| `blueprint` | No | A JSON object up to 200,000 characters, as returned by `/api/ai/blueprint`. |

Response `201`:

```json
{
  "project": {
    "id": "...",
    "name": "Doctor Appointment System",
    "category": "Healthcare",
    "requirement": "...",
    "clarifications": [ { "question": "...", "answer": "..." } ],
    "blueprint": { "...": "..." },
    "status": "draft",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

`status` is one of `draft`, `in-progress`, or `completed`. New projects start as `draft`.

### GET /api/projects

Requires a token. Returns the signed-in user's projects, most recently updated first. Each item includes `id`, `name`, `category`, `status`, `createdAt`, and `updatedAt`. Requirement, clarifications, and blueprint are only returned by the single-project endpoint.

Response `200`: `{ "projects": [ { "id": "...", "name": "...", "category": "...", "status": "draft", "createdAt": "...", "updatedAt": "..." } ] }`

### GET /api/projects/:id

Requires a token. Returns one project with its requirement, clarifications, and blueprint.

Response `200`: `{ "project": { ... } }` (same shape as the create response)

Errors: `404` if the project does not exist or belongs to another user.

### PUT /api/projects/:id

Requires a token. Replaces the editable fields of one of the user's projects. Send the full project: any field left out is cleared (for example, omitting `blueprint` removes it). The same rules as `POST /api/projects` apply, plus:

| Field | Required | Rules |
| --- | --- | --- |
| `status` | No | One of `draft`, `in-progress`, `completed`. Keeps the current status when omitted. |

Response `200`: `{ "project": { ... } }`

Errors: `400` for invalid input, `404` if the project does not exist or belongs to another user.

When the requirement text changes in the editor, the app calls `POST /api/ai/blueprint` first and sends the new blueprint with this update. If blueprint generation fails, the project is not saved.

### DELETE /api/projects/:id

Requires a token. Permanently deletes one of the user's projects, including its blueprint.

Response `204`: no body.

Errors: `404` if the project does not exist or belongs to another user.

## AI

Both AI endpoints require a token and accept the same body as `POST /api/projects` (without `blueprint`). They do not save anything.

### POST /api/ai/analyze

Analyzes the requirement and returns gaps and questions.

Response `200`:

```json
{
  "analysis": {
    "summary": "...",
    "objectives": ["..."],
    "main_functionalities": ["..."],
    "user_roles": ["..."],
    "missing_information": ["..."],
    "ambiguities": ["..."],
    "technical_considerations": ["..."],
    "assumptions": ["..."],
    "clarification_questions": [ { "question": "...", "reason": "..." } ],
    "is_demo": false
  }
}
```

Questions the user has already answered (listed in `clarifications`) are removed from `clarification_questions`.

### POST /api/ai/blueprint

Generates a requirements document, database schema, and architecture.

Response `200`:

```json
{
  "blueprint": {
    "document_sections": [ { "title": "Scope", "content": ["..."] } ],
    "database_tables": [
      {
        "name": "appointments",
        "purpose": "...",
        "columns": [ { "name": "id", "data_type": "uuid", "constraints": "primary key" } ]
      }
    ],
    "relationships": [
      { "from_table": "users", "to_table": "doctors", "cardinality": "one_to_one", "description": "..." }
    ],
    "architecture_components": [ { "name": "API server", "responsibility": "...", "technology": "Express" } ],
    "architecture_links": [ { "from_component": "Web client", "to_component": "API server", "label": "HTTPS JSON" } ],
    "is_demo": false
  }
}
```

`cardinality` is one of `one_to_one`, `one_to_many`, or `many_to_many`.

`is_demo: true` means no AI provider key is configured and a sample result was returned.

## AI service (internal)

The backend calls a separate Python service. Clients should not call it directly.

| Method and path | Auth | Purpose |
| --- | --- | --- |
| GET `/health` | None | Returns `status`, `mode` (`live` or `demo`), and `provider` (`openai` or `gemini`). |
| POST `/analyze` | `X-Service-Token` header | Same behavior as `/api/ai/analyze`. |
| POST `/blueprint` | `X-Service-Token` header | Same behavior as `/api/ai/blueprint`. |

Requests from the backend time out after 120 seconds.

## Configuration

Names only. Values are set in each service's own settings and never committed.

Backend:

- `MONGO_URI`: MongoDB connection string (required)
- `JWT_SECRET`: secret used to sign session tokens (required)
- `JWT_EXPIRES_IN`: token lifetime, default `7d`
- `AI_SERVICE_URL`: address of the AI service
- `AI_SERVICE_TOKEN`: shared secret between backend and AI service (required)
- `CLIENT_ORIGIN`: address of the frontend allowed by CORS, default `http://localhost:5173`
- `PORT`: backend port, default `5000`

AI service:

- `AI_SERVICE_TOKEN`: must match the backend value
- `LLM_PROVIDER`: `openai` (default), `gemini`, or `groq`
- `OPENAI_API_KEY`, `GEMINI_API_KEY`, or `GROQ_API_KEY`: key for the chosen provider. Without it the service runs in demo mode.
- `LLM_MODEL`: optional model override. Defaults are `gpt-4o-mini` for OpenAI, `gemini-2.5-flash` for Gemini, and `llama-3.3-70b-versatile` for Groq.
- `LLM_TIMEOUT_SECONDS`: provider request timeout, default `60`
