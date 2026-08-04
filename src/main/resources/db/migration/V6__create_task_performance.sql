CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_task_reminders_remind_at ON task_reminders(remind_at);
CREATE INDEX idx_task_reminders_is_sent ON task_reminders(is_sent);
CREATE INDEX idx_push_tokens_user_id ON push_tokens(user_id);
