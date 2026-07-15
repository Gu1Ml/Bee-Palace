CREATE TABLE family_groups (
                               id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               name            VARCHAR(120) NOT NULL,
                               invite_code     VARCHAR(8) NOT NULL,
                               created_by      UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
                               created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
                               CONSTRAINT uq_family_groups_invite_code UNIQUE (invite_code)
);

CREATE TABLE family_group_members (
                                      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                      group_id        UUID NOT NULL REFERENCES family_groups (id) ON DELETE CASCADE,
                                      user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                                      role            VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
                                      joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
                                      CONSTRAINT uq_family_group_members_group_user UNIQUE (group_id, user_id),
                                      CONSTRAINT chk_family_group_members_role CHECK (role IN ('OWNER', 'MEMBER'))
);

CREATE INDEX idx_family_group_members_group_id ON family_group_members (group_id);
CREATE INDEX idx_family_group_members_user_id ON family_group_members (user_id);
