import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { TaskFilters } from "../../store/slices/taskSlice";

interface Props {
  filters: TaskFilters;
  onStatusChange: (status: "ALL" | "COMPLETED" | "PENDING") => void;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
  hasActiveFilters: boolean;
}

const COLORS = {
  primary: "#2196F3",
  success: "#4CAF50",
  warning: "#FF9800",
  text: "#333",
  textLight: "#666",
  border: "#ddd",
};

export default function FilterBar({
  filters,
  onStatusChange,
  onSearchChange,
  onFilterPress,
  hasActiveFilters,
}: Props) {
  const statusOptions: Array<"ALL" | "COMPLETED" | "PENDING"> = [
    "ALL",
    "PENDING",
    "COMPLETED",
  ];

  const statusLabels = {
    ALL: "Todas",
    PENDING: "Pendentes",
    COMPLETED: "Completas",
  };

  return (
    <View style={styles.container}>
      {/* Barra de Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar tarefas..."
          placeholderTextColor={COLORS.textLight}
          value={filters.searchText}
          onChangeText={onSearchChange}
          returnKeyType="done"
        />
      </View>

      {/* Filtros Rápidos */}
      <View style={styles.filterRow}>
        <View style={styles.statusFilters}>
          {statusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                filters.status === status && styles.statusButtonActive,
              ]}
              onPress={() => onStatusChange(status)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  filters.status === status && styles.statusButtonTextActive,
                ]}
              >
                {statusLabels[status]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de Filtros Avançados */}
        <TouchableOpacity
          style={[
            styles.advancedButton,
            hasActiveFilters && styles.advancedButtonActive,
          ]}
          onPress={onFilterPress}
        >
          <Text style={styles.advancedButtonText}>⚙️</Text>
          {hasActiveFilters && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusFilters: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  statusButtonTextActive: {
    color: "#fff",
  },
  advancedButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  advancedButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  advancedButtonText: {
    fontSize: 18,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
});
