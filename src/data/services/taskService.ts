import apiService from '../api/apiService';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task';

class TaskService {
  async getAllTasks(): Promise<Task[]> {
    return apiService.get<Task[]>('/v1/tasks');
  }

  async getTaskById(id: string): Promise<Task> {
    return apiService.get<Task>(`/v1/tasks/${id}`);
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    return apiService.post<Task>('/v1/tasks', request);
  }

  async updateTask(id: string, request: UpdateTaskRequest): Promise<Task> {
    return apiService.put<Task>(`/v1/tasks/${id}`, request);
  }

  async deleteTask(id: string): Promise<void> {
    return apiService.delete<void>(`/v1/tasks/${id}`);
  }

  async markAsCompleted(id: string): Promise<Task> {
    return apiService.patch<Task>(`/v1/tasks/${id}/complete`, {});
  }

  async markAsIncomplete(id: string): Promise<Task> {
    return apiService.patch<Task>(`/v1/tasks/${id}/incomplete`, {});
  }

  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
  }> {
    return apiService.get('/v1/tasks/stats');
  }
}

export default new TaskService();