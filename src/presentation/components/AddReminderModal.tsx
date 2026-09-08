import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CreateReminderRequest,
  ReminderRecurrence,
  toLocalDateTimeString,
} from "../../data/models/reminder";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (request: CreateReminderRequest) => Promise<void>;
  isSaving?: boolean;
}

const COLORS = {
  primary: "#2196F3",
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#f44336",
  text: "#333",
  textLight: "#666",
  border: "#ddd",
};

export default function AddReminderModal({
  visible,
  onClose,
  onSave,
  isSaving = false,
}: Props) {
  // ✅ Um único estado de dateTime (não separado)
  const [dateTime, setDateTime] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 60); // padrão: 1 hora no futuro
    d.setSeconds(0);
    return d;
  });
  const [recurrence, setRecurrence] = useState<ReminderRecurrence>("ONCE");

  // ✅ Controle independente para cada picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Reabrir o modal deve começar limpo, e não com a data da última tentativa.
  useEffect(() => {
    if (!visible) return;
    const d = new Date();
    d.setMinutes(d.getMinutes() + 60);
    d.setSeconds(0, 0);
    setDateTime(d);
    setRecurrence("ONCE");
    setShowDatePicker(false);
    setShowTimePicker(false);
  }, [visible]);

  // ✅ Handler de data — verifica event.type para evitar reset no Android
  const handleDateChange = useCallback((event: any, selected?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "dismissed") return; // ← usuário cancelou, não muda nada
    }
    if (selected) {
      setDateTime((prev) => {
        const next = new Date(selected);
        // Preservar a hora atual
        next.setHours(prev.getHours());
        next.setMinutes(prev.getMinutes());
        next.setSeconds(0, 0);
        return next;
      });
    }
  }, []);

  // ✅ Handler de hora — mesmo princípio
  const handleTimeChange = useCallback((event: any, selected?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
      if (event.type === "dismissed") return; // ← usuário cancelou, não muda nada
    }
    if (selected) {
      setDateTime((prev) => {
        const next = new Date(prev);
        // Preservar a data atual
        next.setHours(selected.getHours());
        next.setMinutes(selected.getMinutes());
        next.setSeconds(0, 0);
        return next;
      });
    }
  }, []);

  const handleSave = async () => {
    if (dateTime <= new Date() && recurrence === "ONCE") {
      Alert.alert("Erro", "Selecione um horário no futuro");
      return;
    }

    // O backend recebe LocalDateTime (sem fuso). toISOString() converteria para
    // UTC e o horário salvo ficaria deslocado — ver toLocalDateTimeString.
    const request: CreateReminderRequest = {
      remindAt: toLocalDateTimeString(dateTime),
      recurrence,
    };

    try {
      await onSave(request);
      onClose();
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.response?.data?.message || "Falha ao criar lembrete",
      );
    }
  };

  const typeOptions: Array<{
    value: ReminderRecurrence;
    label: string;
  }> = [
    { value: "ONCE", label: "Uma vez" },
    { value: "DAILY", label: "Diário" },
    { value: "WEEKLY", label: "Semanal" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Novo Lembrete</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Data */}
            <View style={styles.section}>
              <Text style={styles.label}>📅 Data</Text>
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => {
                  setShowTimePicker(false); // fechar o outro se estiver aberto
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.inputButtonText}>
                  {dateTime.toLocaleDateString("pt-BR", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
                <Text style={styles.inputButtonIcon}>▼</Text>
              </TouchableOpacity>

              {/* DatePicker — inline no iOS, dialog no Android */}
              {showDatePicker && (
                <DateTimePicker
                  value={dateTime}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  locale="pt-BR"
                  style={styles.picker}
                />
              )}
            </View>

            {/* Hora */}
            <View style={styles.section}>
              <Text style={styles.label}>⏰ Hora</Text>
              <TouchableOpacity
                style={styles.inputButton}
                onPress={() => {
                  setShowDatePicker(false); // fechar o outro se estiver aberto
                  setShowTimePicker(true);
                }}
              >
                <Text style={styles.inputButtonText}>
                  {dateTime.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={styles.inputButtonIcon}>▼</Text>
              </TouchableOpacity>

              {/* TimePicker */}
              {showTimePicker && (
                <DateTimePicker
                  value={dateTime}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleTimeChange}
                  is24Hour
                  style={styles.picker}
                />
              )}
            </View>

            {/* Repetição */}
            <View style={styles.section}>
              <Text style={styles.label}>🔁 Repetição</Text>
              <View style={styles.typeRow}>
                {typeOptions.map(({ value, label }) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.typeButton,
                      recurrence === value && styles.typeButtonActive,
                    ]}
                    onPress={() => setRecurrence(value)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        recurrence === value && styles.typeButtonTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Resumo */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Resumo do lembrete:</Text>
              <Text style={styles.summaryText}>
                📅{" "}
                {dateTime.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}
              </Text>
              <Text style={styles.summaryText}>
                ⏰{" "}
                {dateTime.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text style={styles.summaryText}>
                🔁 {typeOptions.find((t) => t.value === recurrence)?.label}
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveText}>
                {isSaving ? "Salvando..." : "✓ Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  // ✅ Altura fixa baseada na tela — resolve o modal pequeno
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.82,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    fontSize: 22,
    color: COLORS.textLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  inputButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fafafa",
  },
  inputButtonText: {
    fontSize: 15,
    color: COLORS.text,
  },
  inputButtonIcon: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  picker: {
    marginTop: 8,
    backgroundColor: "#fff",
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  typeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  summaryBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    padding: 16,
    gap: 6,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.text,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#90CAF9",
  },
  saveText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
