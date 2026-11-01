DEMO_ANALYSIS = {
    "summary": (
        "Demo mode: this is a sample analysis of a doctor appointment booking system. "
        "Add an OpenAI API key to the AI service to analyze your own requirement."
    ),
    "objectives": [
        "Let patients book appointments with doctors online",
        "Let doctors manage their availability and schedules",
        "Give patients access to their medical history",
    ],
    "main_functionalities": [
        "Patient registration and sign-in",
        "Doctor schedule management",
        "Appointment booking and status tracking",
        "Viewing medical history",
    ],
    "user_roles": ["Patient", "Doctor", "Administrator"],
    "missing_information": [
        "Whether patients can pay online",
        "Whether doctors must approve appointment requests",
        "How patients are notified about appointments",
    ],
    "ambiguities": [
        "The meaning of 'manage schedules' is not defined (recurring slots or one-off slots)",
    ],
    "technical_considerations": [
        "Prevent double booking of the same doctor time slot",
        "Protect medical history with role-based access",
        "Support web and mobile access",
    ],
    "assumptions": [
        "Appointments are for a single clinic or a shared pool of doctors",
        "Patients book appointments in their local time zone",
    ],
    "clarification_questions": [
        {
            "question": "Should patients be able to make online payments?",
            "reason": "Payments add a billing module and payment provider integration.",
        },
        {
            "question": "Can doctors accept or reject appointment requests?",
            "reason": "This decides whether bookings need an approval workflow.",
        },
    ],
}
