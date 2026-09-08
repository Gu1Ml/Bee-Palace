import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reminder } from "../../data/models/reminder";
import { Task, TaskItem } from "../../data/models/task";

// ✅ NOVO: Interface para filtros
export interface TaskFilters {
  status: "ALL" | "COMPLETED" | "PENDING";
  priority: "ALL" | "LOW" | "MEDIUM" | "HIGH";
  searchText: string;
  sortBy: "createdAt" | "deadline" | "priority" | "title";
  sortOrder: "asc" | "desc";
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;

  // ✅ NOVO: Filtros (substitui 'filter')
  filters: TaskFilters;

  items: TaskItem[];
  isItemsLoading: boolean;

  // ✅ NOVO: Reminders da tarefa selecionada
  reminders: Reminder[];
  isRemindersLoading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,

  // ✅ NOVO:
  filters: {
    status: "ALL",
    priority: "ALL",
    searchText: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },

  items: [],
  isItemsLoading: false,
  reminders: [],
  isRemindersLoading: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // ── Existentes ────────────────────────────
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDetailLoading: (state, action: PayloadAction<boolean>) => {
      state.isDetailLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    selectTask: (state, action: PayloadAction<Task>) => {
      state.selectedTask = action.payload;
      state.isDetailLoading = false;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
      state.items = [];
      state.reminders = [];
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.tasks[index] = action.payload;
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      if (state.selectedTask?.id === action.payload) {
        state.selectedTask = null;
        state.items = [];
      }
    },
    loadTasksFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    loadTaskDetailFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isDetailLoading = false;
    },
    setItemsLoading: (state, action: PayloadAction<boolean>) => {
      state.isItemsLoading = action.payload;
    },
    setItems: (state, action: PayloadAction<TaskItem[]>) => {
      state.items = action.payload;
      state.isItemsLoading = false;
    },
    addItem: (state, action: PayloadAction<TaskItem>) => {
      state.items.push(action.payload);
      if (state.selectedTask) {
        state.selectedTask.totalItemsCount += 1;
      }
    },
    updateItem: (state, action: PayloadAction<TaskItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        const wasCompleted = state.items[index].isCompleted;
        const isNowCompleted = action.payload.isCompleted;
        state.items[index] = action.payload;

        if (state.selectedTask) {
          if (!wasCompleted && isNowCompleted) {
            state.selectedTask.completedItemsCount += 1;
          } else if (wasCompleted && !isNowCompleted) {
            state.selectedTask.completedItemsCount -= 1;
          }
        }
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      state.items = state.items.filter((i) => i.id !== action.payload);
      if (state.selectedTask) {
        state.selectedTask.totalItemsCount -= 1;
        if (item?.isCompleted) {
          state.selectedTask.completedItemsCount -= 1;
        }
      }
    },

    // ✅ NOVOS: Filtros ────────────────────────────
    setStatusFilter: (
      state,
      action: PayloadAction<"ALL" | "COMPLETED" | "PENDING">,
    ) => {
      state.filters.status = action.payload;
    },
    setPriorityFilter: (
      state,
      action: PayloadAction<"ALL" | "LOW" | "MEDIUM" | "HIGH">,
    ) => {
      state.filters.priority = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.filters.searchText = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<"createdAt" | "deadline" | "priority" | "title">,
    ) => {
      state.filters.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.filters.sortOrder = action.payload;
    },
    // Aplicar múltiplos filtros de uma vez
    setFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Resetar para padrão
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // ── ✅ NOVOS: Reminders ────────────────────────────
    setRemindersLoading: (state, action: PayloadAction<boolean>) => {
      state.isRemindersLoading = action.payload;
    },
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
      state.isRemindersLoading = false;
    },
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    removeReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter((r) => r.id !== action.payload);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(
        (r) => r.id === action.payload.id,
      );
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setDetailLoading,
  setError,
  setTasks,
  selectTask,
  clearSelectedTask,
  addTask,
  updateTask,
  deleteTask,
  loadTasksFailure,
  loadTaskDetailFailure,
  setItemsLoading,
  setItems,
  addItem,
  updateItem,
  removeItem,
  // ✅ NOVOS: Filtros Avançados
  setStatusFilter,
  setPriorityFilter,
  setSearchText,
  setSortBy,
  setSortOrder,
  setFilters,
  resetFilters,
  // ✅ NOVOS: Reminders
  setRemindersLoading,
  setReminders,
  addReminder,
  removeReminder,
  updateReminder,
} = taskSlice.actions;

export default taskSlice.reducer;
