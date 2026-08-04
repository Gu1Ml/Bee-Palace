CREATE INDEX idx_task_reminders_task_id ON task_reminders(task_id);
CREATE INDEX idx_task_items_task_id ON task_items(task_id);
CREATE INDEX idx_users_email ON users(email);