import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { RootStackParamList } from "../navigation/AppNavigator";

import { logout } from "../../store/slices/authSlice";

import { Task } from "../../data/models/task";
import { useTasks } from "../../hooks/useTasks";

type TasksScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Tasks"
>;

interface Props {
  navigation: TasksScreenNavigationProp;
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

export default function TasksScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { tasks, isLoading, error, filter, loadTasks, toggleTask, removeTask } =
    useTasks();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    dispatch(logout());
    navigation.replace("Login");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert("Deletar Tarefa", `Deseja deletar "${task.title}"?`, [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Deletar",
        onPress: () => removeTask(task.id),
        style: "destructive",
      },
    ]);
  };

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

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.isCompleted).length,
    pending: tasks.filter((t) => !t.isCompleted).length,
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      // ✅ NOVO: Abrir detalhes ao clicar
      onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
      style={[styles.taskCard, item.isCompleted && styles.taskCardCompleted]}
      activeOpacity={0.7}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <TouchableOpacity
            // ✅ NOVO: Impedir propagação do clique
            onPress={() => toggleTask(item)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                item.isCompleted && styles.checkboxChecked,
              ]}
            >
              {item.isCompleted && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>

          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                item.isCompleted && styles.taskTitleCompleted,
              ]}
            >
              {item.title}
            </Text>
            {item.description && (
              <Text style={styles.taskDescription} numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.taskFooter}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Text style={styles.priorityText}>
              {getPriorityLabel(item.priority)}
            </Text>
          </View>

          <TouchableOpacity
            // ✅ NOVO: Impedir propagação do clique
            onPress={(e) => {
              e.stopPropagation?.();
              handleDeleteTask(item);
            }}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Deletar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Nenhuma tarefa</Text>
      <Text style={styles.emptySubtitle}>
        {filter === "COMPLETED"
          ? "Você não tem tarefas completas"
          : filter === "PENDING"
            ? "Todas as suas tarefas estão completas! 🎉"
            : "Crie sua primeira tarefa"}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Minhas Tarefas</Text>
          <Text style={styles.headerSubtitle}>
            {stats.pending} pendentes • {stats.completed} completas
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.success }]}>
            {stats.completed}
          </Text>
          <Text style={styles.statLabel}>Completas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.warning }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Lista de Tarefas */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          scrollEnabled={true}
        />
      )}

      {/* Botão Nova Tarefa */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateTask")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    marginHorizontal: 20,
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    elevation: 1,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  taskContent: {
    gap: 12,
  },
  taskHeader: {
    flexDirection: "row",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
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
    fontSize: 14,
    fontWeight: "bold",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: COLORS.textLight,
  },
  taskDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
});
