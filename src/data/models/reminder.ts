// Contrato alinhado com o backend (TaskReminderRequest / TaskReminderResponse).
//
// Atenção aos dois conceitos, que são ortogonais:
//   - reminderType => CANAL de entrega   (LOCAL | PUSH)
//   - recurrence   => REPETIÇÃO          (ONCE | DAILY | WEEKLY | MONTHLY)

export type ReminderChannel = "LOCAL" | "PUSH";
export type ReminderRecurrence = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface Reminder {
  id: string;
  taskId: string;
  /** LocalDateTime do backend, sem fuso: "2026-09-08T15:30:00" */
  remindAt: string;
  isSent: boolean;
  reminderType: ReminderChannel;
  recurrence: ReminderRecurrence;
  createdAt: string;
}

export interface CreateReminderRequest {
  remindAt: string;
  recurrence?: ReminderRecurrence;
  reminderType?: ReminderChannel;
}

export interface UpdateReminderRequest {
  /** Obrigatório: o backend valida remindAt com @NotNull também no PUT. */
  remindAt: string;
  recurrence?: ReminderRecurrence;
  reminderType?: ReminderChannel;
}

// Helper: formato legível para a UI
export interface ReminderDisplay {
  id: string;
  taskId: string;
  time: string; // HH:mm
  date: string; // dd/MM/yyyy
  recurrence: ReminderRecurrence;
  recurrenceLabel: string; // "Uma vez", "Diariamente", ...
  daysUntil: number; // quantos dias até o lembrete
  isOverdue: boolean; // já passou do horário? (só faz sentido para ONCE)
  isSent: boolean;
}

// ── Conversão de data ───────────────────────────────────────────────
// O backend usa LocalDateTime, que NÃO carrega fuso. Serializar com
// toISOString() converteria para UTC e o "Z" seria descartado, então um
// lembrete das 15:00 em BRT chegaria ao banco como 18:00. Formatamos os
// componentes locais na mão para que o horário salvo seja o escolhido.

const pad = (n: number) => String(n).padStart(2, "0");

export function toLocalDateTimeString(date: Date): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/**
 * Faz o parse de "2026-09-08T15:30:00" como horário LOCAL.
 * Parse explícito em vez de new Date(str) porque o tratamento de strings sem
 * fuso já variou entre engines (Hermes/JSC) e um off-by-timezone aqui é mudo.
 */
export function parseLocalDateTime(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(
    value,
  );
  if (!match) return new Date(value); // formato inesperado: deixa o engine tentar

  const [, year, month, day, hour, minute, second] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second ?? 0),
  );
}

export const RECURRENCE_LABELS: Record<ReminderRecurrence, string> = {
  ONCE: "Uma vez",
  DAILY: "Diariamente",
  WEEKLY: "Semanalmente",
  MONTHLY: "Mensalmente",
};
