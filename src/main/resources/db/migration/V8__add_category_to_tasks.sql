-- V2__Add_Category_To_Tasks.sql
-- Data: 2026-08-15
-- Descrição: Adicionar coluna de categoria às tarefas (Fase 2)

ALTER TABLE tasks ADD COLUMN category VARCHAR(50);

-- Criar tabela de categorias
CREATE TABLE task_categories (
                                 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                 name VARCHAR(100) NOT NULL,
                                 color VARCHAR(7),
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar FK
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_category
    FOREIGN KEY (category) REFERENCES task_categories(id);

-- Índice
CREATE INDEX idx_task_categories_user_id ON task_categories(user_id);