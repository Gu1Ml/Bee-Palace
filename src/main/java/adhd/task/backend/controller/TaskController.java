package adhd.task.backend.controller;

import adhd.task.backend.dto.mapper.TaskMapper;
import adhd.task.backend.dto.request.TaskRequest;
import adhd.task.backend.dto.response.TaskResponse;
import adhd.task.backend.entity.Task;
import adhd.task.backend.entity.User;
import adhd.task.backend.exception.UnauthorizedException;
import adhd.task.backend.repository.UserRepository;
import adhd.task.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    /**
     * POST /api/v1/tasks/{id}
     * Criar tarefa
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request) {

        // Pegar userId do RequestContextHolder
        HttpServletRequest httpRequest = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes()).getRequest();

        UUID userId = (UUID) httpRequest.getAttribute("userId");

        // Passa para o service
        TaskResponse response = taskService.createTask(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/tasks/{id}
     * Obter tarefa por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID id) {
        HttpServletRequest httpRequest = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes()).getRequest();

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        TaskResponse response = taskService.getTaskById(id, userId);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/tasks
     * Obter todas as tarefas do usuário
     * Query params:
     *   - status: all, pending, completed
     *   - startDate: yyyy-MM-ddTHH:mm:ss (ISO 8601)
     *   - endDate: yyyy-MM-ddTHH:mm:ss (ISO 8601)
     */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getUserTasks(
            @RequestParam(value = "status", defaultValue = "all") String status,
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        List<TaskResponse> tasks;

        switch (status.toLowerCase()) {
            case "pending":
                tasks = taskService.getPendingTasks(userId);
                break;
            case "completed":
                tasks = taskService.getCompletedTasks(userId);
                break;
            case "range":
                if (startDate == null || endDate == null) {
                    return ResponseEntity.badRequest().build();
                }
                tasks = taskService.getTasksByDateRange(userId, startDate, endDate);
                break;
            default:
                tasks = taskService.getUserTasks(userId);
        }

        return ResponseEntity.ok(tasks);
    }

    /**
     * PUT /api/v1/tasks/{id}
     * Atualizar tarefa
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID id,
            @Valid @RequestBody TaskRequest request,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        TaskResponse response = taskService.updateTask(id, userId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/v1/tasks/{id}/complete
     * Marcar tarefa como completa
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> markTaskAsCompleted(
            @PathVariable UUID id,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        TaskResponse response = taskService.markTaskAsCompleted(id, userId);

        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/v1/tasks/{id}/incomplete
     * Marcar tarefa como incompleta
     */
    @PatchMapping("/{id}/incomplete")
    public ResponseEntity<TaskResponse> markTaskAsIncomplete(
            @PathVariable UUID id,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        TaskResponse response = taskService.markTaskAsIncomplete(id, userId);

        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/v1/tasks/{id}
     * Deletar tarefa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID id,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        taskService.deleteTask(id, userId);

        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/tasks/stats
     * Obter estatísticas de tarefas
     */
    @GetMapping("/stats")
    public ResponseEntity<TaskService.TaskStatsResponse> getTaskStats(
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        TaskService.TaskStatsResponse stats = taskService.getTaskStats(userId);

        return ResponseEntity.ok(stats);
    }
}
