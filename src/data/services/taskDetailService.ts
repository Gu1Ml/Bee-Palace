import apiService from "../api/apiService";
import { Task, TaskDetail, UpdateTaskRequest } from "../models/task";

class TaskDetailService {
  /**
   * Busca detalhes completos de uma tarefa
   * Pode incluir: subtarefas, comentários, compartilhamentos (quando implementar)
   */
  async getTaskDetail(id: string): Promise<TaskDetail> {
    const task = await apiService.get<Task>(`/v1/tasks/${id}`);

    // Converter para TaskDetail (no futuro, isso virá do backend)
    return {
      ...task,
      // quando tiver compartilhamento:
      // sharedWith: await this.getSharedUsers(id),
      // comments: await this.getComments(id),
      // attachments: await this.getAttachments(id),
    };
  }

  /**
   * Atualiza uma tarefa existente
   */
  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    return apiService.put<Task>(`/v1/tasks/${id}`, data);
  }

  /**
   * Marca tarefa como completa
   */
  async completeTask(id: string): Promise<Task> {
    return apiService.patch<Task>(`/v1/tasks/${id}/complete`, {});
  }

  /**
   * Marca tarefa como incompleta
   */
  async incompleteTask(id: string): Promise<Task> {
    return apiService.patch<Task>(`/v1/tasks/${id}/incomplete`, {});
  }

  /**
   * Deleta uma tarefa
   */
  async deleteTask(id: string): Promise<void> {
    return apiService.delete<void>(`/v1/tasks/${id}`);
  }

  // ⬇️ Métodos para funcionalidades futuras (descomente quando implementar)

  /**
   * Compartilhar tarefa com outro usuário
   */
  // async shareTask(taskId: string, userId: string, role: 'VIEWER' | 'EDITOR'): Promise<void> {
  //   return apiService.post(`/v1/tasks/${taskId}/share`, { userId, role });
  // }

  /**
   * Obter usuários com quem a tarefa foi compartilhada
   */
  // async getSharedUsers(taskId: string): Promise<SharedUser[]> {
  //   return apiService.get(`/v1/tasks/${taskId}/shared-users`);
  // }

  /**
   * Adicionar comentário na tarefa
   */
  // async addComment(taskId: string, content: string): Promise<TaskComment> {
  //   return apiService.post(`/v1/tasks/${taskId}/comments`, { content });
  // }

  /**
   * Obter comentários da tarefa
   */
  // async getComments(taskId: string): Promise<TaskComment[]> {
  //   return apiService.get(`/v1/tasks/${taskId}/comments`);
  // }

  /**
   * Adicionar anexo à tarefa
   */
  // async uploadAttachment(taskId: string, file: File): Promise<TaskAttachment> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return apiService.post(`/v1/tasks/${taskId}/attachments`, formData);
  // }

  /**
   * Obter anexos da tarefa
   */
  // async getAttachments(taskId: string): Promise<TaskAttachment[]> {
  //   return apiService.get(`/v1/tasks/${taskId}/attachments`);
  // }
}

export default new TaskDetailService();
