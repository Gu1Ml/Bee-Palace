CREATE TABLE appointments (
                              id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              title           VARCHAR(160) NOT NULL,
                              location        VARCHAR(200),
                              start_time      TIMESTAMPTZ NOT NULL,
                              end_time        TIMESTAMPTZ,
                              owner_id        UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                              group_id        UUID REFERENCES family_groups (id) ON DELETE SET NULL,
                              notes           TEXT,
                              created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_owner_id ON appointments (owner_id);
CREATE INDEX idx_appointments_group_id ON appointments (group_id);
-- Acelera as queries de calendário (?from=&to=)
CREATE INDEX idx_appointments_start_time ON appointments (start_time);
