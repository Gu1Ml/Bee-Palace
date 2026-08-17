export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline?: string;
  isCompleted: boolean;
  recurringType: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  totalItemsCount: number;
  completedItemsCount: number;
  items: TaskItem[];
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
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline?: string;
  recurringType?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline?: string;
  recurringType?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
}