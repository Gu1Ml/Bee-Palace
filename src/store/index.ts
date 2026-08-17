import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice'; // ✅ ADICIONAR

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer, // ✅ ADICIONAR
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;