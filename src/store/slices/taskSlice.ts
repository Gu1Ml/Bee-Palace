import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskItem } from "../../data/models/task";

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  filter: "ALL" | "COMPLETED" | "PENDING";

  // ✅ NOVO: items da tarefa selecionada
  items: TaskItem[];
  isItemsLoading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
  filter: "ALL",

  // ✅ NOVO:
  items: [],
  isItemsLoading: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // ── Existentes ──────────────────────────────────────
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
      state.items = []; // ✅ Limpar items também
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
        state.items = []; // ✅ Limpar items também
      }
    },
    setFilter: (
      state,
      action: PayloadAction<"ALL" | "COMPLETED" | "PENDING">,
    ) => {
      state.filter = action.payload;
    },
    loadTasksFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    loadTaskDetailFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isDetailLoading = false;
    },

    // ── ✅ NOVOS: Items ────────────────────────────────
    setItemsLoading: (state, action: PayloadAction<boolean>) => {
      state.isItemsLoading = action.payload;
    },
    setItems: (state, action: PayloadAction<TaskItem[]>) => {
      state.items = action.payload;
      state.isItemsLoading = false;
    },
    addItem: (state, action: PayloadAction<TaskItem>) => {
      state.items.push(action.payload);
      // Atualizar contagem na tarefa selecionada
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

        // Atualizar contagem de completos na tarefa
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
      // Atualizar contagens na tarefa
      if (state.selectedTask) {
        state.selectedTask.totalItemsCount -= 1;
        if (item?.isCompleted) {
          state.selectedTask.completedItemsCount -= 1;
        }
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
  setFilter,
  loadTasksFailure,
  loadTaskDetailFailure,
  // ✅ NOVOS:
  setItemsLoading,
  setItems,
  addItem,
  updateItem,
  removeItem,
} = taskSlice.actions;

export default taskSlice.reducer;
