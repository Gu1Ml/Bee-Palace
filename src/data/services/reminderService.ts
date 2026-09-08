import apiService from "../api/apiService";
import {
    CreateReminderRequest,
    Reminder,
    UpdateReminderRequest,
} from "../models/reminder";

class ReminderService {
  /**
   * Lista todos os lembretes de uma tarefa
   */
  async getReminders(taskId: string): Promise<Reminder[]> {
    return apiService.get<Reminder[]>(`/v1/tasks/${taskId}/reminders`);
  }

  /**
   * Cria novo lembrete
   */
  async createReminder(
    taskId: string,
    request: CreateReminderRequest,
  ): Promise<Reminder> {
    return apiService.post<Reminder>(`/v1/tasks/${taskId}/reminders`, request);
  }

  /**
   * Deleta um lembrete
   */
  async deleteReminder(taskId: string, reminderId: string): Promise<void> {
    return apiService.delete<void>(
      `/v1/tasks/${taskId}/reminders/${reminderId}`,
    );
  }

  /**
   * Atualiza um lembrete
   */
  async updateReminder(
    taskId: string,
    reminderId: string,
    request: UpdateReminderRequest,
  ): Promise<Reminder> {
    return apiService.put<Reminder>(
      `/v1/tasks/${taskId}/reminders/${reminderId}`,
      request,
    );
  }

  // ⬇️ Placeholder para futuras features

  /**
   * Ativar/desativar lembrete
   */
  // async toggleReminder(reminderId: string, isActive: boolean): Promise<Reminder> {
  //   return apiService.patch(`/v1/reminders/${reminderId}`, { isActive });
  // }

  /**
   * Buscar todos os lembretes do usuário
   */
  // async getAllReminders(): Promise<Reminder[]> {
  //   return apiService.get(`/v1/reminders`);
  // }

  /**
   * Buscar lembretes próximos (próximas 24h)
   */
  // async getUpcomingReminders(): Promise<Reminder[]> {
  //   return apiService.get(`/v1/reminders/upcoming`);
  // }
}

export default new ReminderService();
