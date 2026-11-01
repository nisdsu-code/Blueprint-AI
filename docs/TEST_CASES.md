# BlueprintGen AI Test Cases

Status values: `Not run`, `Pass`, `Fail`. Update the status as cases are executed.

Setup for every case: the backend is running with a connected MongoDB database, and the AI service is running. For AI cases, record whether the service is in `live` or `demo` mode (`GET /health` on the AI service shows this).

## 1. Accounts and access

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| AUTH-01 | Sign up with valid details | Open sign-up, enter name, email, and a password of at least 8 characters, submit | Account is created and the user lands in the app signed in | Not run |
| AUTH-02 | Sign up with an email already in use | Sign up with an existing email | Readable message that the account already exists; no duplicate created | Not run |
| AUTH-03 | Sign up with a short password | Enter a password under 8 characters | Message asks for at least 8 characters; no account created | Not run |
| AUTH-04 | Sign up with an invalid email | Enter `ada@` and submit | Message asks for a valid email address | Not run |
| AUTH-05 | Sign in with correct details | Sign in with a registered account | User reaches the dashboard, greeted by name | Not run |
| AUTH-06 | Sign in with a wrong password | Enter a wrong password | Message says the email or password is incorrect; generic wording only | Not run |
| AUTH-07 | Sign in with fields empty | Submit the sign-in form empty | Form asks for email and password; no request sent or a readable 400 message shown | Not run |
| AUTH-08 | Protected page while signed out | Open the New Project page without signing in | Redirected to sign-in | Not run |
| AUTH-09 | Sign out | Use the logout button in the sidebar | Returned to sign-in; app pages no longer open | Not run |
| AUTH-10 | Session persists on reload | Sign in, then reload the page | Still signed in | Not run |
| AUTH-11 | Expired or invalid session | Replace the stored session with an invalid value and reload | Redirected to sign-in; no crash | Not run |

## 2. Project creation (Phase 3)

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| PRJ-01 | Save a draft project | Enter name and a requirement of 20+ characters, click Save Draft | Confirmation shows the project is saved as a draft | Not run |
| PRJ-02 | Name required | Leave the name empty and save | Message asks for a project name; nothing saved | Not run |
| PRJ-03 | Requirement too short | Enter fewer than 20 characters and save | Message asks for at least 20 characters | Not run |
| PRJ-04 | Requirement too long | Paste more than 5000 characters | Input stops at the limit; counter shows the count | Not run |
| PRJ-05 | Category default | Leave category unchanged and save | Project saved with category General | Not run |
| PRJ-06 | Use an example | Click Use an example | Requirement box fills with the doctor appointment example | Not run |
| PRJ-07 | Create another project | After saving, click Create another project | Form is cleared; previous analysis and blueprint are gone | Not run |
| PRJ-08 | Back to dashboard | After saving, click Back to dashboard | Dashboard opens | Not run |
| PRJ-09 | Save rejected without a session | Call POST /api/projects without a token | 401 response with a readable message | Not run |

## 3. AI analysis (Phase 4)

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| ANA-01 | Analyze a valid requirement | Fill the form, click Analyze Requirement | Analysis panel shows summary, objectives, functionalities, roles, and assumptions | Not run |
| ANA-02 | Analyze with invalid input | Click Analyze with an empty name | Validation message shown; no analysis requested | Not run |
| ANA-03 | Analysis while loading | Click Analyze and watch the button | Button shows Analyzing and cannot be clicked twice | Not run |
| ANA-04 | Analysis failure | Stop the AI service and click Analyze | Readable error message; previous results are not shown as new | Not run |
| ANA-05 | Demo mode label | Analyze with no provider key set | Panel shows the Demo mode label | Not run |
| ANA-06 | Assumptions are labelled | Review the analysis | Assumptions section is titled as not stated by the user | Not run |

## 4. Clarification questions (Phase 5)

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| CLR-01 | Answer a question | Type an answer in a question box | Counter shows one more answered | Not run |
| CLR-02 | Update button disabled | With no answers typed | Update analysis with answers button is disabled | Not run |
| CLR-03 | Update analysis with answers | Answer one question, click Update analysis with answers | Analysis refreshes; the answered question no longer appears | Not run |
| CLR-04 | Answers saved with project | Answer questions, then Save Draft | Saved project includes the answers (checked in the MongoDB database, as no project-fetch endpoint exists before Phase 9) | Not run |
| CLR-05 | Blank answers ignored | Type only spaces in a box and save | Blank answer is not saved | Not run |
| CLR-06 | Too many answers rejected | Send 9 clarification items to POST /api/projects | 400 with message that clarification answers are invalid | Not run |
| CLR-07 | Answer too long | Send an answer over 1000 characters to the API | 400 with a length message | Not run |

## 5. Blueprint generation (Phase 6)

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| BLP-01 | Generate a blueprint | Fill the form, click Generate Blueprint | Blueprint panel shows requirements sections, architecture cards, and database tables | Not run |
| BLP-02 | Generate while loading | Click Generate Blueprint and watch the button | Button shows Generating and cannot be clicked twice | Not run |
| BLP-03 | Generation failure | Stop the AI service and click Generate | Readable error message; no blank panel | Not run |
| BLP-04 | Demo blueprint label | Generate with no provider key set | Panel shows the Demo mode label | Not run |
| BLP-05 | Blueprint saved with project | Generate, then Save Draft | Saved project contains the blueprint | Not run |
| BLP-06 | Create another clears blueprint | Save, then Create another project | Blueprint panel no longer shows | Not run |

## 6. Diagrams (Phase 6)

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| DGM-01 | Architecture diagram draws | Generate a blueprint | Architecture diagram appears with a box per component and labelled arrows | Not run |
| DGM-02 | Entity diagram draws | Generate a blueprint | Entity relationship diagram shows each table with its columns and key markers | Not run |
| DGM-03 | Diagram fallback | Force an invalid diagram source (development only) | Message says the diagram could not be drawn, with the source shown | Not run |
| DGM-04 | Repeated generation | Generate twice in a row | Both diagrams still draw on the second run | Not run |
| DGM-05 | Relationship to unknown table | Blueprint relationship points to a table not in the list | Relationship is left out of the entity diagram; page does not break | Not run |

## 7. AI provider (Phase 7)

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| PRV-01 | OpenAI key set | Set provider to openai with a key; check GET /health on the AI service | Mode is live, provider is openai | Not run |
| PRV-02 | Gemini key set | Set provider to gemini with a key; check GET /health | Mode is live, provider is gemini | Not run |
| PRV-03 | Unknown provider | Set the provider to an unsupported value and start the AI service | Service refuses to start with a clear error about valid values | Not run |
| PRV-04 | Gemini analysis | With Gemini selected, run Analyze Requirement | Analysis returns real content (not demo) | Not run |
| PRV-05 | Gemini blueprint | With Gemini selected, run Generate Blueprint | Blueprint returns real content (not demo) | Not run |
| PRV-06 | Model override | Set a model name in the settings and run an analysis | The chosen model is used | Not run |

## 8. Security and API behavior

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| SEC-01 | AI endpoints need a session | Call POST /api/ai/analyze without a token | 401 response | Not run |
| SEC-02 | AI service rejects wrong token | Call the AI service /analyze with a wrong X-Service-Token | 401 response | Not run |
| SEC-03 | Malformed JSON | Send a broken JSON body to any POST endpoint | 400 with "Request body must be valid JSON" | Not run |
| SEC-04 | Oversized body | Send a body over 300 KB | Request rejected; no crash | Not run |
| SEC-05 | Unknown route | Call GET /api/unknown | 404 with a readable message | Not run |
| SEC-06 | Other users' projects | Create a project as user A, sign in as user B, open user A's project ID from the address bar | Project page shows "Project not found"; the API returns 404 | Not run |
| SEC-07 | Passwords not returned | Sign up and inspect the response | No password or password hash in the response | Not run |

## 9. Saving, editing, and PDF export (Phase 9)

| ID | Case | Steps | Expected result | Status |
| --- | --- | --- | --- | --- |
| SAV-01 | Dashboard shows real projects | Save two projects, open the dashboard | Stat cards and Recent Projects show the saved projects, not sample data | Not run |
| SAV-02 | Empty dashboard | Sign in to a new account with no projects | Dashboard shows "No projects yet" | Not run |
| SAV-03 | My Projects list | Open My Projects | All saved projects listed, most recently updated first, with category, date, and status | Not run |
| SAV-04 | Open a project | Click View on a project | Project page shows name, status, requirement, clarifications, and blueprint | Not run |
| SAV-05 | Project without blueprint | Save a project without generating a blueprint, then open it | Page shows "No blueprint yet" instead of an empty blueprint | Not run |
| SAV-06 | Edit details | Open Edit, change the name and requirement, click Save changes | Returns to the project page with the new values; list shows updated date | Not run |
| SAV-07 | Edit keeps answers | Open a project that has clarification answers, click Edit | Answers appear in the clarification questions and are kept after saving | Not run |
| SAV-08 | Regenerate blueprint on edit | Open Edit, click Generate Blueprint, click Save changes | Saved project shows the new blueprint | Not run |
| SAV-09 | Change status | On Edit, set status to Completed and save | Status badge shows Completed on the project page and list | Not run |
| SAV-10 | Edit validation | Clear the name on Edit and save | Message asks for a project name; nothing changed | Not run |
| SAV-11 | Cancel edit | Open Edit, change a field, click Cancel | Returns to the project page; no changes saved | Not run |
| SAV-12 | Edit a missing project | Open /projects/<unknown-id>/edit | Readable "Project not found" message | Not run |
| SAV-13 | Blueprint required for PDF | Open a project without a blueprint and click Export PDF | A PDF downloads containing the requirement and no blueprint sections; no error | Not run |
| SAV-14 | PDF content | Open a project with a blueprint, click Export PDF | PDF includes name, category, status, requirement, clarifications, requirements document, architecture, and database schema with page numbers | Not run |
| SAV-15 | PDF file name | Export a project named "Doctor Appointment System" | File is named doctor-appointment-system-blueprint.pdf | Not run |
| SAV-16 | Update rejects invalid status | Send PUT /api/projects/:id with status "done" | 400 "Project status is invalid" | Not run |
| SAV-17 | Update another user's project | Send PUT /api/projects/:id for a project owned by another user | 404; project unchanged | Not run |
| SAV-18 | Create then list | Create a project, call GET /api/projects | New project appears in the list | Not run |
| SAV-19 | Delete from view page | Open a project, click Delete, then Delete project | Project is removed; app returns to My projects; project no longer listed | Not run |
| SAV-20 | Cancel delete | Open a project, click Delete, then Cancel | Dialog closes; project is unchanged | Not run |
| SAV-21 | Delete another user's project | Send DELETE /api/projects/:id for a project owned by another user | 404; project still exists | Not run |
| SAV-22 | Regenerate on requirement change | Open Edit, change the requirement text, click Save changes | "Regenerating" message shows; saved blueprint reflects the new requirement | Not run |
| SAV-23 | Keep blueprint when requirement unchanged | Open Edit, change only the status or name, click Save changes | No regeneration; existing blueprint kept | Not run |
| SAV-24 | Regeneration failure | Change the requirement while the AI service is stopped, click Save changes | Error message shown; project keeps its old requirement and blueprint | Not run |
