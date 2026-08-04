CREATE TABLE task_items (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
                            title VARCHAR(255) NOT NULL,
                            is_completed BOOLEAN DEFAULT FALSE,
                            order_index INT,
                            created_at TIMESTAMP DEFAULT NOW()
);
