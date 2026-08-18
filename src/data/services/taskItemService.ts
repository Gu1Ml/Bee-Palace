import apiService from "../api/apiService";
import {
    CreateTaskItemRequest,
    TaskItem,
    UpdateTaskItemRequest,
} from "../models/task";

class TaskItemService {
  /**
   * Lista todos os items de uma tarefa
   */
  async getItems(taskId: string): Promise<TaskItem[]> {
    return apiService.get<TaskItem[]>(`/v1/tasks/${taskId}/items`);
  }

  /**
   * Cria novo item (subtarefa)
   */
  async createItem(
    taskId: string,
    request: CreateTaskItemRequest,
  ): Promise<TaskItem> {
    return apiService.post<TaskItem>(`/v1/tasks/${taskId}/items`, request);
  }

  /**
   * Alterna estado completo/incompleto do item
   */
  async toggleItem(taskId: string, itemId: string): Promise<TaskItem> {
    return apiService.patch<TaskItem>(
      `/v1/tasks/${taskId}/items/${itemId}/toggle`,
      {},
    );
  }

  /**
   * Deleta um item
   */
  async deleteItem(taskId: string, itemId: string): Promise<void> {
    return apiService.delete<void>(`/v1/tasks/${taskId}/items/${itemId}`);
  }

  /**
   * Atualiza um item (ex: editar título)
   */
  async updateItem(
    taskId: string,
    itemId: string,
    request: UpdateTaskItemRequest,
  ): Promise<TaskItem> {
    return apiService.put<TaskItem>(
      `/v1/tasks/${taskId}/items/${itemId}`,
      request,
    );
  }

  // ⬇️ Placeholders para futuras features

  /**
   * Reordenar items
   * (descomentar quando implementar drag & drop)
   */
  // async reorderItems(taskId: string, itemIds: string[]): Promise<void> {
  //   return apiService.patch(`/v1/tasks/${taskId}/items/reorder`, { itemIds });
  // }
}

export default new TaskItemService();
