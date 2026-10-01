-- V9__add_recurrence_to_reminders.sql
-- Data: 2026-09-08
-- Descrição: Adiciona recorrência aos lembretes.
--            `reminder_type` continua sendo o CANAL de entrega (LOCAL/PUSH);
--            `recurrence` passa a ser a REPETIÇÃO (ONCE/DAILY/WEEKLY/MONTHLY),
--            que é o que a UI de lembretes já oferece ao usuário.

ALTER TABLE task_reminders ADD COLUMN recurrence VARCHAR(20);

-- Lembretes já existentes são disparos únicos
UPDATE task_reminders SET recurrence = 'ONCE' WHERE recurrence IS NULL;

-- Backfill das colunas que a entidade declara como NOT NULL mas a V4 criou nullable
UPDATE task_reminders SET reminder_type = 'LOCAL' WHERE reminder_type IS NULL;
UPDATE task_reminders SET is_sent = FALSE WHERE is_sent IS NULL;

ALTER TABLE task_reminders ALTER COLUMN recurrence SET DEFAULT 'ONCE';
ALTER TABLE task_reminders ALTER COLUMN recurrence SET NOT NULL;

ALTER TABLE task_reminders ALTER COLUMN reminder_type SET DEFAULT 'LOCAL';
ALTER TABLE task_reminders ALTER COLUMN reminder_type SET NOT NULL;

ALTER TABLE task_reminders ALTER COLUMN is_sent SET DEFAULT FALSE;
ALTER TABLE task_reminders ALTER COLUMN is_sent SET NOT NULL;

-- Índice para o job que varre lembretes pendentes (findPendingReminders)
CREATE INDEX IF NOT EXISTS idx_task_reminders_pending
    ON task_reminders (is_sent, remind_at);
