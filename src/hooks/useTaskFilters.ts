import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
    resetFilters,
    setFilters,
    setPriorityFilter,
    setSearchText,
    setSortBy,
    setSortOrder,
    setStatusFilter,
    TaskFilters,
} from "../store/slices/taskSlice";

export function useTaskFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, filters } = useSelector((state: RootState) => state.tasks);

  // Aplicar filtros e ordenação
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Filtrar por status
    if (filters.status === "COMPLETED") {
      result = result.filter((t) => t.isCompleted);
    } else if (filters.status === "PENDING") {
      result = result.filter((t) => !t.isCompleted);
    }

    // 2. Filtrar por prioridade
    if (filters.priority !== "ALL") {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // 3. Filtrar por texto (busca)
    if (filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower),
      );
    }

    // 4. Ordenar
    result.sort((a, b) => {
      let compareValue = 0;

      switch (filters.sortBy) {
        case "title":
          compareValue = a.title.localeCompare(b.title);
          break;
        case "priority":
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          compareValue =
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "deadline":
          if (a.deadline && b.deadline) {
            compareValue =
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          } else if (a.deadline) {
            compareValue = -1;
          } else if (b.deadline) {
            compareValue = 1;
          }
          break;
        case "createdAt":
        default:
          compareValue =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      // Inverter se descending
      return filters.sortOrder === "desc" ? -compareValue : compareValue;
    });

    return result;
  }, [tasks, filters]);

  // Actions
  const updateStatusFilter = (status: "ALL" | "COMPLETED" | "PENDING") => {
    dispatch(setStatusFilter(status));
  };

  const updatePriorityFilter = (
    priority: "ALL" | "LOW" | "MEDIUM" | "HIGH",
  ) => {
    dispatch(setPriorityFilter(priority));
  };

  const updateSearchText = (text: string) => {
    dispatch(setSearchText(text));
  };

  const updateSortBy = (
    sortBy: "createdAt" | "deadline" | "priority" | "title",
  ) => {
    dispatch(setSortBy(sortBy));
  };

  const updateSortOrder = (order: "asc" | "desc") => {
    dispatch(setSortOrder(order));
  };

  const applyFilters = (newFilters: Partial<TaskFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(resetFilters());
  };

  // Verificar se há algum filtro ativo (não padrão)
  const hasActiveFilters = useMemo(() => {
    return (
      filters.status !== "ALL" ||
      filters.priority !== "ALL" ||
      filters.searchText.trim() !== "" ||
      filters.sortBy !== "createdAt" ||
      filters.sortOrder !== "desc"
    );
  }, [filters]);

  return {
    tasks: filteredTasks,
    filters,
    hasActiveFilters,
    updateStatusFilter,
    updatePriorityFilter,
    updateSearchText,
    updateSortBy,
    updateSortOrder,
    applyFilters,
    clearFilters,
  };
}
