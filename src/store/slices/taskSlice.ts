import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../data/models/task';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: 'ALL' | 'COMPLETED' | 'PENDING';
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'ALL',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<'ALL' | 'COMPLETED' | 'PENDING'>) => {
      state.filter = action.payload;
    },
    loadTasksFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilter,
  loadTasksFailure,
} = taskSlice.actions;

export default taskSlice.reducer;