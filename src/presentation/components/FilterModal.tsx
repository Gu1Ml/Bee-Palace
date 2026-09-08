import React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TaskFilters } from "../../store/slices/taskSlice";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  filters: TaskFilters;
  onClose: () => void;
  onPriorityChange: (priority: "ALL" | "LOW" | "MEDIUM" | "HIGH") => void;
  onSortByChange: (
    sortBy: "createdAt" | "deadline" | "priority" | "title",
  ) => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
  onReset: () => void;
}

const COLORS = {
  primary: "#2196F3",
  danger: "#f44336",
  success: "#4CAF50",
  warning: "#FF9800",
  text: "#333",
  textLight: "#666",
  border: "#ddd",
};

export default function FilterModal({
  visible,
  filters,
  onClose,
  onPriorityChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: Props) {
  const priorityOptions: Array<"ALL" | "LOW" | "MEDIUM" | "HIGH"> = [
    "ALL",
    "LOW",
    "MEDIUM",
    "HIGH",
  ];

  const priorityLabels = {
    ALL: "Todas",
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
  };

  const sortByOptions: Array<"createdAt" | "deadline" | "priority" | "title"> =
    ["createdAt", "deadline", "priority", "title"];

  const sortByLabels = {
    createdAt: "Criação",
    deadline: "Vencimento",
    priority: "Prioridade",
    title: "Título",
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
            <Text style={styles.title}>Filtros Avançados</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Prioridade */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prioridade</Text>
              <View style={styles.optionsGrid}>
                {priorityOptions.map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.option,
                      filters.priority === priority && styles.optionActive,
                    ]}
                    onPress={() => onPriorityChange(priority)}
                  >
                    <View
                      style={[
                        styles.optionColor,
                        {
                          backgroundColor:
                            priority === "ALL"
                              ? COLORS.border
                              : getPriorityColor(priority),
                        },
                      ]}
                    />
                    <Text style={styles.optionText}>
                      {priorityLabels[priority]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ordenar por */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ordenar por</Text>
              {sortByOptions.map((sortBy) => (
                <TouchableOpacity
                  key={sortBy}
                  style={[
                    styles.listItem,
                    filters.sortBy === sortBy && styles.listItemActive,
                  ]}
                  onPress={() => onSortByChange(sortBy)}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      filters.sortBy === sortBy && styles.listItemTextActive,
                    ]}
                  >
                    {sortByLabels[sortBy]}
                  </Text>
                  {filters.sortBy === sortBy && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Ordem (Ascendente/Descendente) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ordem</Text>
              <View style={styles.orderContainer}>
                <TouchableOpacity
                  style={[
                    styles.orderButton,
                    filters.sortOrder === "asc" && styles.orderButtonActive,
                  ]}
                  onPress={() => onSortOrderChange("asc")}
                >
                  <Text style={styles.orderButtonText}>↑ Crescente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.orderButton,
                    filters.sortOrder === "desc" && styles.orderButtonActive,
                  ]}
                  onPress={() => onSortOrderChange("desc")}
                >
                  <Text style={styles.orderButtonText}>↓ Decrescente</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer - Botões */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Resetar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
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
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Dimensions.get("window").height * 0.75, // ← altura fixa
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
    fontSize: 24,
    color: COLORS.textLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  optionActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#E3F2FD",
  },
  optionColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
  listItemActive: {
    backgroundColor: "#E3F2FD",
  },
  listItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  listItemTextActive: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  checkmark: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  orderContainer: {
    flexDirection: "row",
    gap: 8,
  },
  orderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  orderButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  orderButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  orderButtonTextActive: {
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
    alignItems: "center",
  },
  resetButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
