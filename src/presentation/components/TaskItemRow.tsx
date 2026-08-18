import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TaskItem } from "../../data/models/task";

interface Props {
  item: TaskItem;
  onToggle: (itemId: string) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
}

const COLORS = {
  success: "#4CAF50",
  danger: "#f44336",
  text: "#333",
  textLight: "#666",
  border: "#ddd",
};

export default function TaskItemRow({ item, onToggle, onDelete }: Props) {
  const [isToggiling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(item.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Remover Subtarefa", `Remover "${item.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => onDelete(item.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Checkbox */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          item.isCompleted && styles.checkboxChecked,
          isToggiling && styles.checkboxDisabled,
        ]}
        onPress={handleToggle}
        disabled={isToggiling}
      >
        {item.isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Título */}
      <Text
        style={[styles.title, item.isCompleted && styles.titleCompleted]}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      {/* Botão Deletar */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: COLORS.textLight,
  },
  deleteButton: {
    padding: 4,
    flexShrink: 0,
  },
  deleteText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: "bold",
  },
});
