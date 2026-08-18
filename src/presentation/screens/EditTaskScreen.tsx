import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UpdateTaskRequest } from "../../data/models/task";
import { useTaskDetail } from "../../hooks/useTaskDetail";
import { RootStackParamList } from "../navigation/AppNavigator";

type EditTaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditTask"
>;

interface Props {
  navigation: EditTaskScreenNavigationProp;
  route: any;
}

const COLORS = {
  primary: "#2196F3",
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#f44336",
  light: "#f5f5f5",
  text: "#333",
  textLight: "#666",
  border: "#ddd",
};

export default function EditTaskScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { taskId } = route.params;
  const { task, isLoading, updateTaskDetail } = useTaskDetail(taskId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Preencher campos ao carregar tarefa
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
    }
  }, [task]);

  const handleSave = async () => {
    if (!title.trim()) {
      setLocalError("O título é obrigatório.");
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const request: UpdateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      };

      await updateTaskDetail(request);

      Alert.alert("Sucesso", "Tarefa atualizada!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Erro ao atualizar";
      setLocalError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Tarefa</Text>
        </View>

        {/* Error */}
        {localError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{localError}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fazer compras"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Leite, pão, ovos..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.priorityContainer}>
              {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === p && styles.priorityButtonTextActive,
                    ]}
                  >
                    {p === "HIGH" ? "Alta" : p === "MEDIUM" ? "Média" : "Baixa"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Mudanças</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    color: "#c62828",
    fontSize: 13,
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  priorityButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  priorityButtonTextActive: {
    color: "#fff",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: "#90CAF9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
