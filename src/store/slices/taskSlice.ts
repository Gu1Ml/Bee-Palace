import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../data/models/task";

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null; // ✅ NOVO: tarefa atualmente selecionada
  isLoading: boolean;
  isDetailLoading: boolean; // ✅ NOVO: carregando detalhes
  error: string | null;
  filter: "ALL" | "COMPLETED" | "PENDING";
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
  filter: "ALL",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
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
    // ✅ NOVO: Definir tarefa selecionada
    selectTask: (state, action: PayloadAction<Task>) => {
      state.selectedTask = action.payload;
      state.isDetailLoading = false;
    },
    // ✅ NOVO: Limpar tarefa selecionada
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      // Atualizar na lista
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      // Atualizar se estiver selecionada
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      // Limpar se era a selecionada
      if (state.selectedTask?.id === action.payload) {
        state.selectedTask = null;
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
    // ✅ NOVO: Falha ao carregar detalhes
    loadTaskDetailFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isDetailLoading = false;
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
} = taskSlice.actions;

export default taskSlice.reducer;
