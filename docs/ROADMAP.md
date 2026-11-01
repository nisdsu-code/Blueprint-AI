# BlueprintGen AI Roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| 1-2 | Foundation and accounts: sign up, sign in, sign out, protected pages | Complete |
| 3 | Project creation: save draft projects to the user's account | Complete, tested locally |
| 4 | AI requirement analysis | Complete |
| 5 | Clarification questions: answer questions and refine the analysis | Complete |
| 6 | Blueprint generation: requirements document, database schema, architecture, diagrams | Complete |
| 7 | AI provider choice: OpenAI or Gemini | Complete |
| 8 | API documentation, roadmap, and test cases | Complete |
| 9 | Project saving, editing, and PDF export | Complete, ready for testing |
| 10 | Testing, bug fixing, and deployment preparation | Planned |

## Phase 9 details

- Save and update projects, including their analysis answers and blueprint
- Edit saved project details and status; changing the requirement regenerates the blueprint on save
- List saved projects on the dashboard and My Projects page, replacing the sample data
- Project view page showing the full saved blueprint
- Export a project's blueprint as a PDF (requirement, clarifications, requirements document, architecture, and database schema; diagrams are not included)
- Delete a project from its view page, with a confirmation dialog


## Phase 10 details

- Automated tests for the backend endpoints and the AI service
- End-to-end checks of the main flows listed in the test cases document
- Fix issues found during testing
- Prepare deployment: backend on Render, database on MongoDB Atlas, frontend production address, and production environment settings

## Open items

- MongoDB connection string and JWT secret to be provided for production
- Frontend-to-backend address to be finalized for production
- Live testing of AI generation with a real provider key
