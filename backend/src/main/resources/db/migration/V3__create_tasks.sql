CREATE TABLE tasks (
                       id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       title               VARCHAR(160) NOT NULL,
                       description         TEXT,
                       owner_id            UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                       assigned_to_id      UUID REFERENCES users (id) ON DELETE SET NULL,
                       group_id            UUID REFERENCES family_groups (id) ON DELETE SET NULL,
                       task_type           VARCHAR(10) NOT NULL DEFAULT 'PERSONAL',
                       deadline            TIMESTAMPTZ,
                       recurrence_rule     VARCHAR(50),
                       priority            VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
                       status              VARCHAR(15) NOT NULL DEFAULT 'PENDING',
                       snoozed_until       TIMESTAMPTZ,
                       created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
                       updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
                       CONSTRAINT chk_tasks_task_type CHECK (task_type IN ('PERSONAL', 'SHARED')),
                       CONSTRAINT chk_tasks_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
                       CONSTRAINT chk_tasks_status CHECK (status IN ('PENDING', 'DONE', 'SNOOZED', 'OVERDUE'))
);

CREATE INDEX idx_tasks_owner_id ON tasks (owner_id);
CREATE INDEX idx_tasks_assigned_to_id ON tasks (assigned_to_id);
CREATE INDEX idx_tasks_group_id ON tasks (group_id);
-- Acelera o job que varre tarefas pendentes com prazo vencido
CREATE INDEX idx_tasks_status_deadline ON tasks (status, deadline);

CREATE TABLE task_completions (
                                  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                  task_id         UUID NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
                                  completed_by    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                                  completed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                                  notes           VARCHAR(255)
);

CREATE INDEX idx_task_completions_task_id ON task_completions (task_id, completed_at DESC);
