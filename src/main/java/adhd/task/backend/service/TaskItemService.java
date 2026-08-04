package adhd.task.backend.service;

import adhd.task.backend.dto.request.TaskItemRequest;
import adhd.task.backend.dto.response.TaskItemResponse;
import adhd.task.backend.entity.Task;
import adhd.task.backend.entity.TaskItem;
import adhd.task.backend.exception.UnauthorizedException;
import adhd.task.backend.dto.mapper.*;
import adhd.task.backend.repository.TaskItemRepository;
import adhd.task.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskItemService {

    private final TaskItemRepository taskItemRepository;
    private final TaskRepository taskRepository;
    private final adhd.task.backend.dto.mapper.TaskMapper taskMapper;

    /**
     * Criar subtarefa/item
     */
    @Transactional
    public TaskItemResponse createTaskItem(UUID taskId, UUID userId, TaskItemRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        // Validar autorização
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para adicionar items a esta tarefa");
        }

        TaskItem taskItem = taskMapper.taskItemRequestToTaskItem(request);
        taskItem.setTask(task);

        TaskItem savedItem = taskItemRepository.save(taskItem);
        log.info("Subtarefa criada: {} para tarefa: {}", savedItem.getId(), taskId);

        return taskMapper.taskItemToTaskItemResponse(savedItem);
    }

    /**
     * Obter todos os items de uma tarefa
     */
    @Transactional(readOnly = true)
    public List<TaskItemResponse> getTaskItems(UUID taskId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        // Validar autorização
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para acessar esta tarefa");
        }

        List<TaskItem> items = taskItemRepository.findByTaskIdOrderByOrderIndexAsc(taskId);
        return taskMapper.taskItemsToTaskItemResponses(items);
    }

    /**
     * Atualizar item
     */
    @Transactional
    public TaskItemResponse updateTaskItem(UUID taskId, UUID itemId, UUID userId, TaskItemRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para modificar esta tarefa");
        }

        TaskItem item = taskItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        // Garantir que o item pertence a esta tarefa
        if (!item.getTask().getId().equals(taskId)) {
            throw new UnauthorizedException("Este item não pertence a esta tarefa");
        }

        item.setTitle(request.getTitle());
        if (request.getIsCompleted() != null) {
            item.setIsCompleted(request.getIsCompleted());
        }
        if (request.getOrderIndex() != null) {
            item.setOrderIndex(request.getOrderIndex());
        }

        TaskItem updatedItem = taskItemRepository.save(item);
        log.info("Item atualizado: {}", itemId);

        return taskMapper.taskItemToTaskItemResponse(updatedItem);
    }

    /**
     * Marcar item como completo/incompleto
     */
    @Transactional
    public TaskItemResponse toggleTaskItem(UUID taskId, UUID itemId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para modificar esta tarefa");
        }

        TaskItem item = taskItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        item.toggleCompletion();
        TaskItem updatedItem = taskItemRepository.save(item);
        log.info("Item toggleado: {}", itemId);

        return taskMapper.taskItemToTaskItemResponse(updatedItem);
    }

    /**
     * Deletar item
     */
    @Transactional
    public void deleteTaskItem(UUID taskId, UUID itemId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para deletar desta tarefa");
        }

        TaskItem item = taskItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        taskItemRepository.delete(item);
        log.info("Item deletado: {}", itemId);
    }
}
