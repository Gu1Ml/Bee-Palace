CREATE TABLE task_reminders (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
                                remind_at TIMESTAMP NOT NULL,
                                is_sent BOOLEAN DEFAULT FALSE,
                                reminder_type VARCHAR(20), -- 'PUSH', 'LOCAL'
                                created_at TIMESTAMP DEFAULT NOW()
);
