import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateReminderRequest,
  parseLocalDateTime,
  RECURRENCE_LABELS,
  Reminder,
  ReminderDisplay,
  UpdateReminderRequest,
} from "../data/models/reminder";
import reminderService from "../data/services/reminderService";
import { AppDispatch, RootState } from "../store";
import {
  addReminder,
  removeReminder,
  setReminders,
  setRemindersLoading,
  updateReminder,
} from "../store/slices/taskSlice";

/** Extrai a mensagem do ErrorResponse do backend, com fallback. */
function apiMessage(err: any, fallback: string): string {
  return err?.response?.data?.message || fallback;
}

export function useReminders(taskId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { reminders, isRemindersLoading } = useSelector(
    (state: RootState) => state.tasks,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadReminders = useCallback(async () => {
    dispatch(setRemindersLoading(true));
    try {
      const data = await reminderService.getReminders(taskId);
      dispatch(setReminders(data));
      setError(null);
    } catch (err: any) {
      setError(apiMessage(err, "Erro ao carregar lembretes"));
      dispatch(setRemindersLoading(false));
    }
  }, [dispatch, taskId]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const createReminder = useCallback(
    async (request: CreateReminderRequest) => {
      setIsSaving(true);
      try {
        const newReminder = await reminderService.createReminder(
          taskId,
          request,
        );
        dispatch(addReminder(newReminder));
        setError(null);
        return newReminder;
      } catch (err: any) {
        setError(apiMessage(err, "Erro ao criar lembrete"));
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [dispatch, taskId],
  );

  const deleteReminder = useCallback(
    async (reminderId: string) => {
      try {
        await reminderService.deleteReminder(taskId, reminderId);
        dispatch(removeReminder(reminderId));
        setError(null);
      } catch (err: any) {
        setError(apiMessage(err, "Erro ao deletar lembrete"));
        throw err;
      }
    },
    [dispatch, taskId],
  );

  const updateReminderData = useCallback(
    async (reminderId: string, data: UpdateReminderRequest) => {
      setIsSaving(true);
      try {
        const updated = await reminderService.updateReminder(
          taskId,
          reminderId,
          data,
        );
        dispatch(updateReminder(updated));
        setError(null);
        return updated;
      } catch (err: any) {
        setError(apiMessage(err, "Erro ao atualizar lembrete"));
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [dispatch, taskId],
  );

  // Formatar reminders para exibição
  const displayReminders = useMemo<ReminderDisplay[]>(() => {
    const now = new Date();

    return reminders.map((r: Reminder) => {
      const when = parseLocalDateTime(r.remindAt);

      return {
        id: r.id,
        taskId: r.taskId,
        time: when.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: when.toLocaleDateString("pt-BR"),
        recurrence: r.recurrence,
        recurrenceLabel: RECURRENCE_LABELS[r.recurrence] ?? r.recurrence,
        daysUntil: daysUntil(when, now),
        // Só um lembrete único "vence": os recorrentes voltam a disparar.
        isOverdue: r.recurrence === "ONCE" && when < now,
        isSent: r.isSent,
      };
    });
  }, [reminders]);

  const upcomingReminders = useMemo(
    () => displayReminders.filter((r) => !r.isOverdue),
    [displayReminders],
  );
  const overdueReminders = useMemo(
    () => displayReminders.filter((r) => r.isOverdue),
    [displayReminders],
  );

  return {
    reminders: displayReminders,
    upcomingReminders,
    overdueReminders,
    isLoading: isRemindersLoading,
    isSaving,
    error,
    loadReminders,
    createReminder,
    deleteReminder,
    updateReminderData,
  };
}

function daysUntil(target: Date, now: Date): number {
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
