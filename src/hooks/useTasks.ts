import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Task } from "../data/models/task";
import taskService from "../data/services/taskService";
import { AppDispatch, RootState } from "../store";
import {
  deleteTask,
  setError,
  setLoading,
  setTasks,
  updateTask,
} from "../store/slices/taskSlice";

export function useTasks() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, isLoading, error, filter } = useSelector(
    (state: RootState) => state.tasks,
  );

  // Carregar tarefas ao montar
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    dispatch(setLoading(true));
    try {
      const data = await taskService.getAllTasks();
      dispatch(setTasks(data));
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao carregar tarefas";
      dispatch(setError(msg));
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const updated = task.isCompleted
        ? await taskService.markAsIncomplete(task.id)
        : await taskService.markAsCompleted(task.id);
      dispatch(updateTask(updated));
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao atualizar tarefa";
      dispatch(setError(msg));
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      dispatch(deleteTask(taskId));
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao deletar tarefa";
      dispatch(setError(msg));
    }
  };

  // Filtrar tarefas
  const filteredTasks = tasks.filter((task) => {
    if (filter === "COMPLETED") return task.isCompleted;
    if (filter === "PENDING") return !task.isCompleted;
    return true;
  });

  return {
    tasks: filteredTasks,
    isLoading,
    error,
    filter,
    loadTasks,
    toggleTask,
    removeTask,
  };
}
