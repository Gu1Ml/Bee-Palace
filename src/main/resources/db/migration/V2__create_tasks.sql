CREATE TABLE tasks (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                       title VARCHAR(255) NOT NULL,
                       description TEXT,
                       priority VARCHAR(20), -- 'HIGH', 'MEDIUM', 'LOW'
                       deadline TIMESTAMP,
                       is_completed BOOLEAN DEFAULT FALSE,
                       recurring_type VARCHAR(20), -- 'NONE', 'DAILY', 'WEEKLY', 'MONTHLY'
                       created_at TIMESTAMP DEFAULT NOW(),
                       updated_at TIMESTAMP DEFAULT NOW(),
                       completed_at TIMESTAMP
);
