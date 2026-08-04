CREATE TABLE push_tokens (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                             device_token VARCHAR(255) NOT NULL,
                             platform VARCHAR(20), -- 'iOS', 'Android'
                             is_active BOOLEAN DEFAULT TRUE,
                             created_at TIMESTAMP DEFAULT NOW(),
                             updated_at TIMESTAMP DEFAULT NOW(),
                             UNIQUE(user_id, device_token)
);
