-- Habilita geração de UUID nativa do Postgres (gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
                       id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       name            VARCHAR(120) NOT NULL,
                       email           VARCHAR(160) NOT NULL,
                       password_hash   VARCHAR(255) NOT NULL,
                       avatar_color    VARCHAR(20),
                       created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
                       updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
                       CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX idx_users_email ON users (email);
