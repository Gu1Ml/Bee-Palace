import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Task, UpdateTaskRequest } from "../data/models/task";
import taskDetailService from "../data/services/taskDetailService";
import { AppDispatch, RootState } from "../store";
import {
    clearSelectedTask,
    loadTaskDetailFailure,
    selectTask,
    setDetailLoading,
    updateTask,
} from "../store/slices/taskSlice";

export function useTaskDetail(taskId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTask, isDetailLoading, error } = useSelector(
    (state: RootState) => state.tasks,
  );
  const [localError, setLocalError] = useState<string | null>(null);

  // Carregar detalhes ao montar
  useEffect(() => {
    loadDetail();

    // Limpar ao desmontar
    return () => {
      dispatch(clearSelectedTask());
    };
  }, [taskId]);

  const loadDetail = async () => {
    dispatch(setDetailLoading(true));
    try {
      const detail = await taskDetailService.getTaskDetail(taskId);
      dispatch(selectTask(detail as Task));
      setLocalError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao carregar detalhes";
      dispatch(loadTaskDetailFailure(msg));
      setLocalError(msg);
    }
  };

  // Atualizar tarefa
  const updateTaskDetail = async (data: UpdateTaskRequest) => {
    if (!selectedTask) return;

    try {
      const updated = await taskDetailService.updateTask(selectedTask.id, data);
      dispatch(updateTask(updated));
      setLocalError(null);
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao atualizar";
      setLocalError(msg);
      throw err;
    }
  };

  // Marcar como completa
  const completeTask = async () => {
    if (!selectedTask) return;

    try {
      const updated = await taskDetailService.completeTask(selectedTask.id);
      dispatch(updateTask(updated));
      setLocalError(null);
      return updated;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Erro ao marcar como completa";
      setLocalError(msg);
      throw err;
    }
  };

  // Marcar como incompleta
  const incompleteTask = async () => {
    if (!selectedTask) return;

    try {
      const updated = await taskDetailService.incompleteTask(selectedTask.id);
      dispatch(updateTask(updated));
      setLocalError(null);
      return updated;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Erro ao marcar como incompleta";
      setLocalError(msg);
      throw err;
    }
  };

  // Deletar tarefa
  const deleteTaskDetail = async () => {
    if (!selectedTask) return;

    try {
      await taskDetailService.deleteTask(selectedTask.id);
      dispatch(clearSelectedTask());
      setLocalError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao deletar";
      setLocalError(msg);
      throw err;
    }
  };

  return {
    task: selectedTask,
    isLoading: isDetailLoading,
    error: localError || error,
    loadDetail,
    updateTaskDetail,
    completeTask,
    incompleteTask,
    deleteTaskDetail,
  };
}
