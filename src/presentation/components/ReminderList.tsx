import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  ReminderDisplay,
  ReminderRecurrence,
} from "../../data/models/reminder";

interface Props {
  reminders: ReminderDisplay[];
  overdueReminders: ReminderDisplay[];
  onDelete: (reminderId: string) => Promise<void>;
  onEdit?: (reminder: ReminderDisplay) => void;
}

const COLORS = {
  primary: "#2196F3",
  danger: "#f44336",
  warning: "#FF9800",
  success: "#4CAF50",
  text: "#333",
  textLight: "#666",
  border: "#ddd",
  light: "#f9f9f9",
};

const RECURRENCE_COLORS: Record<ReminderRecurrence, string> = {
  ONCE: COLORS.primary,
  DAILY: COLORS.success,
  WEEKLY: COLORS.warning,
  MONTHLY: COLORS.textLight,
};

export default function ReminderList({
  reminders,
  overdueReminders,
  onDelete,
  onEdit,
}: Props) {
  const handleDelete = (reminder: ReminderDisplay) => {
    Alert.alert("Remover Lembrete", `Remover lembrete para ${reminder.time}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => onDelete(reminder.id),
      },
    ]);
  };

  if (reminders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum lembrete</Text>
        <Text style={styles.emptySubtext}>
          Adicione um lembrete para ser notificado
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Lembretes Vencidos */}
      {overdueReminders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ⚠️ Vencidos ({overdueReminders.length})
          </Text>
          {overdueReminders.map((reminder) => (
            <ReminderRow
              key={reminder.id}
              reminder={reminder}
              onDelete={() => handleDelete(reminder)}
              onEdit={() => onEdit?.(reminder)}
              isOverdue
            />
          ))}
        </View>
      )}

      {/* Lembretes Próximos */}
      {reminders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📅 Próximos ({reminders.length})
          </Text>
          {reminders.map((reminder) => (
            <ReminderRow
              key={reminder.id}
              reminder={reminder}
              onDelete={() => handleDelete(reminder)}
              onEdit={() => onEdit?.(reminder)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

interface RowProps {
  reminder: ReminderDisplay;
  onDelete: () => void;
  onEdit: () => void;
  isOverdue?: boolean;
}

function ReminderRow({ reminder, onDelete, onEdit, isOverdue }: RowProps) {
  return (
    <View style={[styles.row, isOverdue && styles.rowOverdue]}>
      <View style={styles.rowContent}>
        <View style={styles.rowTime}>
          <Text style={[styles.time, isOverdue && styles.timeOverdue]}>
            {reminder.time}
          </Text>
          <Text style={[styles.date, isOverdue && styles.dateOverdue]}>
            {reminder.date}
          </Text>
        </View>

        <View style={styles.rowDetails}>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: RECURRENCE_COLORS[reminder.recurrence],
              },
            ]}
          >
            <Text style={styles.typeText}>{reminder.recurrenceLabel}</Text>
          </View>

          {!isOverdue && reminder.daysUntil > 0 && (
            <Text style={styles.daysUntil}>em {reminder.daysUntil}d</Text>
          )}
        </View>
      </View>

      {/* Ações */}
      <View style={styles.rowActions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEdit}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.actionText}>✎</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionDeleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowOverdue: {
    backgroundColor: "#FFF3E0",
    borderColor: COLORS.warning,
  },
  rowContent: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  rowTime: {
    minWidth: 50,
  },
  time: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  timeOverdue: {
    color: COLORS.warning,
  },
  date: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  dateOverdue: {
    color: COLORS.warning,
  },
  rowDetails: {
    flex: 1,
    gap: 6,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  daysUntil: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  actionDeleteText: {
    fontSize: 14,
    color: COLORS.danger,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
    backgroundColor: COLORS.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});
