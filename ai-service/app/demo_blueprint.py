DEMO_BLUEPRINT = {
    "document_sections": [
        {
            "title": "Scope",
            "content": [
                "Online booking of doctor appointments by patients",
                "Schedule management for doctors",
                "Access to medical history for patients",
            ],
        },
        {
            "title": "Functional requirements",
            "content": [
                "Patients can search doctors and book an available time slot",
                "Doctors can publish and update their weekly availability",
                "Patients can cancel or reschedule an upcoming appointment",
                "Patients can view their past visits and medical records",
            ],
        },
        {
            "title": "Non-functional requirements",
            "content": [
                "Medical records are accessible only to the patient and treating doctor",
                "Booking must prevent two patients taking the same slot",
                "The system works on desktop and mobile browsers",
            ],
        },
        {
            "title": "User roles",
            "content": [
                "Patient: books, reschedules, and cancels appointments",
                "Doctor: manages availability and views upcoming appointments",
                "Administrator: manages doctor accounts and clinic settings",
            ],
        },
        {
            "title": "Assumptions",
            "content": [
                "Appointments are booked in fixed slots of 30 minutes",
                "Payments are out of scope for this version",
            ],
        },
    ],
    "database_tables": [
        {
            "name": "users",
            "purpose": "Stores login details and the role of every account",
            "columns": [
                {"name": "id", "data_type": "uuid", "constraints": "primary key"},
                {"name": "email", "data_type": "varchar(255)", "constraints": "unique, not null"},
                {"name": "password_hash", "data_type": "varchar(255)", "constraints": "not null"},
                {"name": "role", "data_type": "varchar(20)", "constraints": "not null"},
            ],
        },
        {
            "name": "doctors",
            "purpose": "Profile details for each doctor",
            "columns": [
                {"name": "id", "data_type": "uuid", "constraints": "primary key"},
                {"name": "user_id", "data_type": "uuid", "constraints": "foreign key to users, unique"},
                {"name": "specialty", "data_type": "varchar(100)", "constraints": "not null"},
            ],
        },
        {
            "name": "patients",
            "purpose": "Profile details for each patient",
            "columns": [
                {"name": "id", "data_type": "uuid", "constraints": "primary key"},
                {"name": "user_id", "data_type": "uuid", "constraints": "foreign key to users, unique"},
                {"name": "date_of_birth", "data_type": "date", "constraints": ""},
            ],
        },
        {
            "name": "availability_slots",
            "purpose": "Time slots a doctor has opened for booking",
            "columns": [
                {"name": "id", "data_type": "uuid", "constraints": "primary key"},
                {"name": "doctor_id", "data_type": "uuid", "constraints": "foreign key to doctors"},
                {"name": "starts_at", "data_type": "timestamptz", "constraints": "not null"},
                {"name": "is_booked", "data_type": "boolean", "constraints": "default false"},
            ],
        },
        {
            "name": "appointments",
            "purpose": "A booked visit between one patient and one doctor",
            "columns": [
                {"name": "id", "data_type": "uuid", "constraints": "primary key"},
                {"name": "slot_id", "data_type": "uuid", "constraints": "foreign key to availability_slots, unique"},
                {"name": "patient_id", "data_type": "uuid", "constraints": "foreign key to patients"},
                {"name": "status", "data_type": "varchar(20)", "constraints": "scheduled, cancelled, or completed"},
            ],
        },
        {
            "name": "medical_records",
            "purpose": "Notes and documents from completed visits",
            "columns": [
                {"name": "id", "data_type": "uuid", "constraints": "primary key"},
                {"name": "appointment_id", "data_type": "uuid", "constraints": "foreign key to appointments"},
                {"name": "notes", "data_type": "text", "constraints": ""},
            ],
        },
    ],
    "relationships": [
        {"from_table": "users", "to_table": "doctors", "cardinality": "one_to_one", "description": "A doctor account has one profile"},
        {"from_table": "users", "to_table": "patients", "cardinality": "one_to_one", "description": "A patient account has one profile"},
        {"from_table": "doctors", "to_table": "availability_slots", "cardinality": "one_to_many", "description": "A doctor publishes many slots"},
        {"from_table": "availability_slots", "to_table": "appointments", "cardinality": "one_to_one", "description": "A slot holds at most one appointment"},
        {"from_table": "patients", "to_table": "appointments", "cardinality": "one_to_many", "description": "A patient has many appointments"},
        {"from_table": "appointments", "to_table": "medical_records", "cardinality": "one_to_many", "description": "A visit can produce several records"},
    ],
    "architecture_components": [
        {"name": "Web client", "responsibility": "Patient and doctor screens in the browser", "technology": "React and Vite"},
        {"name": "API server", "responsibility": "Authentication, booking rules, and data access", "technology": "Express"},
        {"name": "Database", "responsibility": "Stores users, slots, appointments, and records", "technology": "MongoDB"},
    ],
    "architecture_links": [
        {"from_component": "Web client", "to_component": "API server", "label": "HTTPS JSON requests"},
        {"from_component": "API server", "to_component": "Database", "label": "Reads and writes"},
    ],
}
