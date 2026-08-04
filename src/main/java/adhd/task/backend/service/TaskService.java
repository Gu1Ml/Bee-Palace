package adhd.task.backend.service;

import adhd.task.backend.dto.request.TaskRequest;
import adhd.task.backend.dto.response.TaskResponse;
import adhd.task.backend.entity.Task;
import adhd.task.backend.entity.User;
import adhd.task.backend.dto.mapper.TaskMapper;
import adhd.task.backend.exception.UnauthorizedException;
import adhd.task.backend.repository.TaskRepository;
import adhd.task.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;


    // Helper method para preencher os counts depois do mapping
    private TaskResponse enrichTaskResponse(Task task) {
        TaskResponse response = taskMapper.taskToTaskResponse(task);
        response.setCompletedItemsCount(task.getCompletedItemsCount());
        response.setTotalItemsCount(task.getTotalItemsCount());
        return response;
    }

    /**
     * Criar nova tarefa
     */
    @Transactional
    public TaskResponse createTask(UUID userId, TaskRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Converter DTO → Entity
        Task task = taskMapper.taskRequestToTask(request);
        task.setUser(user);

        // Salvar
        Task savedTask = taskRepository.save(task);
        log.info("Tarefa criada: {} para usuário: {}", savedTask.getId(), userId);

        return enrichTaskResponse(savedTask);
    }

    /**
     * Obter tarefa por ID
     */
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(UUID taskId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        // Validar autorização
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para acessar esta tarefa");
        }

        return enrichTaskResponse(task);
    }

    /**
     * Obter todas as tarefas do usuário (ordenadas por deadline)
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getUserTasks(UUID userId) {
        List<Task> tasks = taskRepository.findByUserIdOrderByDeadlineAsc(userId);
        return taskMapper.tasksToTaskResponses(tasks);
    }

    /**
     * Obter tarefas pendentes do usuário
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getPendingTasks(UUID userId) {
        List<Task> tasks = taskRepository.findByUserIdAndIsCompletedFalseOrderByDeadlineAsc(userId);
        return taskMapper.tasksToTaskResponses(tasks);
    }

    /**
     * Obter tarefas completas do usuário
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getCompletedTasks(UUID userId) {
        List<Task> tasks = taskRepository.findByUserIdAndIsCompletedTrue(userId);
        return taskMapper.tasksToTaskResponses(tasks);
    }

    /**
     * Obter tarefas em um intervalo de datas
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByDateRange(UUID userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Task> tasks = taskRepository.findTasksByUserAndDateRange(userId, startDate, endDate);
        return taskMapper.tasksToTaskResponses(tasks);
    }

    /**
     * Atualizar tarefa
     */
    @Transactional
    public TaskResponse updateTask(UUID taskId, UUID userId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        // Validar autorização
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para atualizar esta tarefa");
        }

        // Atualizar Entity com dados do DTO
        taskMapper.updateTaskFromRequest(request, task);

        Task updatedTask = taskRepository.save(task);
        log.info("Tarefa atualizada: {}", taskId);

        return taskMapper.taskToTaskResponse(updatedTask);
    }

    /**
     * Marcar tarefa como completa
     */
    @Transactional
    public TaskResponse markTaskAsCompleted(UUID taskId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        // Validar autorização
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para modificar esta tarefa");
        }

        task.markAsCompleted();
        Task updatedTask = taskRepository.save(task);
        log.info("Tarefa marcada como completa: {}", taskId);

        return taskMapper.taskToTaskResponse(updatedTask);
    }

    /**
     * Marcar tarefa como incompleta
     */
    @Transactional
    public TaskResponse markTaskAsIncomplete(UUID taskId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        // Validar autorização
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para modificar esta tarefa");
        }

        task.markAsIncomplete();
        Task updatedTask = taskRepository.save(task);
        log.info("Tarefa marcada como incompleta: {}", taskId);

        return taskMapper.taskToTaskResponse(updatedTask);
    }

    /**
     * Deletar tarefa
     */
    @Transactional
    public void deleteTask(UUID taskId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        // Validar autorização
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para deletar esta tarefa");
        }

        taskRepository.delete(task);
        log.info("Tarefa deletada: {}", taskId);
    }

    /**
     * Obter estatísticas do usuário
     */
    @Transactional(readOnly = true)
    public TaskStatsResponse getTaskStats(UUID userId) {
        long totalTasks = taskRepository.countByUserId(userId);
        long completedTasks = taskRepository.countCompletedTasksByUserId(userId);
        long pendingTasks = taskRepository.countPendingTasksByUserId(userId);

        double completionRate = totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0.0;

        return TaskStatsResponse.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .completionRate(completionRate)
                .build();
    }

    /**
     * DTO para estatísticas
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TaskStatsResponse {
        private long totalTasks;
        private long completedTasks;
        private long pendingTasks;
        private double completionRate; // 0-100%
    }
}