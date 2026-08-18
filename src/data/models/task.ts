export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string;
  isCompleted: boolean;
  recurringType: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  totalItemsCount: number;
  completedItemsCount: number;
  items: TaskItem[];
}

// ✅ NOVO: Model para detalhes com relacionamentos
export interface TaskDetail extends Task {
  // Adicione aqui quando houver compartilhamento, comentários, anexos:
  // sharedWith?: SharedUser[];
  // comments?: TaskComment[];
  // attachments?: TaskAttachment[];
  // activityLog?: ActivityLog[];
}

export interface TaskItem {
  id: string;
  taskId: string;
  content: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string;
  recurringType?: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
}

// ✅ NOVO: Separar update para ser mais explícito
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string;
  recurringType?: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
}

// ✅ NOVO: Response da API com mais informações
export interface TaskResponse {
  data: Task;
  message?: string;
}

// ✅ NOVO: Para compartilhamento (future)
export interface SharedUser {
  userId: string;
  name: string;
  email: string;
  role: "VIEWER" | "EDITOR";
  sharedAt: string;
}

// ✅ NOVO: Para comentários (future)
export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ NOVO: Para anexos (future)
export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

// ✅ ATUALIZAR: CreateTaskItemRequest
export interface CreateTaskItemRequest {
  title: string;
  orderIndex?: number;
}

// ✅ ATUALIZAR: UpdateTaskItemRequest
export interface UpdateTaskItemRequest {
  title?: string;
  orderIndex?: number;
}

// ✅ JÁ EXISTE (verificar se está assim):
export interface TaskItem {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}
