CREATE TABLE notification_settings (
                                       id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                       task_id             UUID NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
                                       channel             VARCHAR(10) NOT NULL DEFAULT 'LOCAL',
                                       interval_minutes    INTEGER,
                                       custom_times        JSONB,
                                       enabled             BOOLEAN NOT NULL DEFAULT true,
                                       CONSTRAINT uq_notification_settings_task_id UNIQUE (task_id),
                                       CONSTRAINT chk_notification_settings_channel CHECK (channel IN ('LOCAL', 'SHARED'))
);

CREATE TABLE device_tokens (
                               id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                               fcm_token       VARCHAR(255) NOT NULL,
                               platform        VARCHAR(10) NOT NULL,
                               created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
                               CONSTRAINT uq_device_tokens_fcm_token UNIQUE (fcm_token),
                               CONSTRAINT chk_device_tokens_platform CHECK (platform IN ('ANDROID', 'IOS'))
);

CREATE INDEX idx_device_tokens_user_id ON device_tokens (user_id);
