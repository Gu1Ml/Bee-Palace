import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTaskDetail } from "../../hooks/useTaskDetail";
import TaskItemsSection from "../components/TaskItemsSection"; // ✅ NOVO
import { RootStackParamList } from "../navigation/AppNavigator";

type TaskDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TaskDetail"
>;

interface Props {
  navigation: TaskDetailScreenNavigationProp;
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

export default function TaskDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { taskId } = route.params;
  const { task, isLoading, error, completeTask, deleteTaskDetail } =
    useTaskDetail(taskId);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    try {
      if (task?.isCompleted) {
        // await incompleteTask();
      } else {
        await completeTask();
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao atualizar tarefa");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Deletar Tarefa",
      `Tem certeza que deseja deletar "${task?.title}"?`,
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Deletar",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteTaskDetail();
              navigation.replace("Tasks");
            } catch (err) {
              Alert.alert("Erro", "Falha ao deletar");
            } finally {
              setIsDeleting(false);
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Tarefa não encontrada</Text>
      </View>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return COLORS.danger;
      case "MEDIUM":
        return COLORS.warning;
      case "LOW":
        return COLORS.success;
      default:
        return COLORS.textLight;
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels = { HIGH: "Alta", MEDIUM: "Média", LOW: "Baixa" };
    return labels[priority as keyof typeof labels] || priority;
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditTask", { taskId: task.id })}
        >
          <Text style={styles.editButton}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Checkbox + Título */}
        <View style={styles.titleSection}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              task.isCompleted && styles.checkboxChecked,
            ]}
            onPress={handleToggleComplete}
          >
            {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>

          <Text
            style={[styles.title, task.isCompleted && styles.titleCompleted]}
          >
            {task.title}
          </Text>
        </View>

        {/* Descrição */}
        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}

        {/* Prioridade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prioridade</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(task.priority) },
            ]}
          >
            <Text style={styles.priorityText}>
              {getPriorityLabel(task.priority)}
            </Text>
          </View>
        </View>

        {/* Deadline */}
        {task.deadline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vencimento</Text>
            <Text style={styles.text}>
              {new Date(task.deadline).toLocaleDateString("pt-BR")}
            </Text>
          </View>
        )}

        {/* Progresso (Subtarefas) */}
        {task.totalItemsCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progresso</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(task.completedItemsCount / task.totalItemsCount) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {task.completedItemsCount} de {task.totalItemsCount} completas
            </Text>
          </View>
        )}

        {/* Datas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <Text style={styles.text}>
            Criada: {new Date(task.createdAt).toLocaleDateString("pt-BR")}
          </Text>
          {task.completedAt && (
            <Text style={styles.text}>
              Concluída:{" "}
              {new Date(task.completedAt).toLocaleDateString("pt-BR")}
            </Text>
          )}
        </View>

        {/* ✅ NOVO: Subtarefas */}
        <TaskItemsSection taskId={task.id} />

        {/* Ações */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.deleteButton, isDeleting && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteButtonText}>Deletar Tarefa</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 
          FUTURAS FEATURES (Descomente quando implementar):
          - Comentários
          - Compartilhado com usuários
          - Anexos
          - Activity log
        */}
      </ScrollView>
    </View>
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
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 28,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: COLORS.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  text: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  priorityText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.success,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  actionsSection: {
    marginTop: 32,
    gap: 12,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ffcdd2",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
