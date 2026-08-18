import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateTaskItemRequest } from "../data/models/task";
import taskItemService from "../data/services/taskItemService";
import { AppDispatch, RootState } from "../store";
import {
    addItem,
    removeItem,
    setItems,
    setItemsLoading,
    updateItem,
} from "../store/slices/taskSlice";

export function useTaskItems(taskId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isItemsLoading } = useSelector(
    (state: RootState) => state.tasks,
  );
  const [error, setError] = useState<string | null>(null);

  // Carregar items ao montar
  useEffect(() => {
    loadItems();
  }, [taskId]);

  const loadItems = async () => {
    dispatch(setItemsLoading(true));
    try {
      const data = await taskItemService.getItems(taskId);
      dispatch(setItems(data));
      setError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao carregar subtarefas";
      setError(msg);
      dispatch(setItemsLoading(false));
    }
  };

  const createItem = async (title: string) => {
    if (!title.trim()) return;
    try {
      const request: CreateTaskItemRequest = {
        title: title.trim(),
        orderIndex: items.length,
      };
      const newItem = await taskItemService.createItem(taskId, request);
      dispatch(addItem(newItem));
      setError(null);
      return newItem;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao criar subtarefa";
      setError(msg);
      throw err;
    }
  };

  const toggleItem = async (itemId: string) => {
    try {
      const updated = await taskItemService.toggleItem(taskId, itemId);
      dispatch(updateItem(updated));
      setError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao atualizar subtarefa";
      setError(msg);
      throw err;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await taskItemService.deleteItem(taskId, itemId);
      dispatch(removeItem(itemId));
      setError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao deletar subtarefa";
      setError(msg);
      throw err;
    }
  };

  // Calcular progresso
  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    items,
    isLoading: isItemsLoading,
    error,
    completedCount,
    totalCount,
    progressPercent,
    loadItems,
    createItem,
    toggleItem,
    deleteItem,
  };
}
