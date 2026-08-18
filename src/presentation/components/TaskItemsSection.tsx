import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTaskItems } from "../../hooks/useTaskItems";
import TaskItemRow from "./TaskItemRow";

interface Props {
  taskId: string;
}

const COLORS = {
  primary: "#2196F3",
  success: "#4CAF50",
  danger: "#f44336",
  text: "#333",
  textLight: "#666",
  border: "#ddd",
  light: "#f9f9f9",
};

export default function TaskItemsSection({ taskId }: Props) {
  const {
    items,
    isLoading,
    error,
    completedCount,
    totalCount,
    progressPercent,
    createItem,
    toggleItem,
    deleteItem,
  } = useTaskItems(taskId);

  const [newItemTitle, setNewItemTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleCreate = async () => {
    if (!newItemTitle.trim()) return;
    setIsCreating(true);
    try {
      await createItem(newItemTitle);
      setNewItemTitle("");
      setShowInput(false);
    } catch {
      // erro tratado no hook
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho da Seção */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          Subtarefas
          {totalCount > 0 && (
            <Text style={styles.countBadge}>
              {" "}
              ({completedCount}/{totalCount})
            </Text>
          )}
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowInput(!showInput)}
        >
          <Text style={styles.addButtonText}>
            {showInput ? "Cancelar" : "+ Adicionar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Progresso */}
      {totalCount > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{progressPercent}%</Text>
        </View>
      )}

      {/* Erro */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Input para nova subtarefa */}
      {showInput && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nome da subtarefa..."
            value={newItemTitle}
            onChangeText={setNewItemTitle}
            autoFocus
            onSubmitEditing={handleCreate}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[
              styles.confirmButton,
              isCreating && styles.confirmButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.confirmButtonText}>✓</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Loading */}
      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={styles.loader} />
      ) : items.length === 0 ? (
        // Lista Vazia
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma subtarefa ainda</Text>
          {!showInput && (
            <TouchableOpacity onPress={() => setShowInput(true)}>
              <Text style={styles.emptyAction}>
                + Adicionar primeira subtarefa
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        // Lista de Items
        <View style={styles.itemsList}>
          {items.map((item) => (
            <TaskItemRow
              key={item.id}
              item={item}
              onToggle={toggleItem}
              onDelete={deleteItem}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  countBadge: {
    color: COLORS.textLight,
    fontWeight: "normal",
  },
  addButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.success,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textLight,
    minWidth: 30,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  confirmButton: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#90CAF9",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    paddingVertical: 16,
  },
  emptyContainer: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: COLORS.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 14,
    marginBottom: 4,
  },
  emptyAction: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  itemsList: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
});
