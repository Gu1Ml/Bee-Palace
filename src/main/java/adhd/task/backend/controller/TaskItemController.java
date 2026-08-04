package adhd.task.backend.controller;

import adhd.task.backend.dto.request.TaskItemRequest;
import adhd.task.backend.dto.response.TaskItemResponse;
import adhd.task.backend.service.TaskItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/tasks/{taskId}/items")
@RequiredArgsConstructor
public class TaskItemController {

    private final TaskItemService taskItemService;

    /**
     * POST /api/v1/tasks/{taskId}/items
     * Criar subtarefa
     */
    // Helper
    private UUID getUserIdFromRequest() {
        HttpServletRequest httpRequest = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes()).getRequest();
        return (UUID) httpRequest.getAttribute("userId");
    }

    @PostMapping
    public ResponseEntity<TaskItemResponse> createTaskItem(
            @PathVariable UUID taskId,
            @Valid @RequestBody TaskItemRequest request) {

        UUID userId = getUserIdFromRequest();  // Usa helper

        TaskItemResponse response = taskItemService.createTaskItem(taskId, userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/tasks/{taskId}/items
     * Obter todos os items de uma tarefa
     */
    @GetMapping
    public ResponseEntity<List<TaskItemResponse>> getTaskItems(
            @PathVariable UUID taskId,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        List<TaskItemResponse> items = taskItemService.getTaskItems(taskId, userId);

        return ResponseEntity.ok(items);
    }

    /**
     * PUT /api/v1/tasks/{taskId}/items/{itemId}
     * Atualizar item
     */
    @PutMapping("/{itemId}")
    public ResponseEntity<TaskItemResponse> updateTaskItem(
            @PathVariable UUID taskId,
            @PathVariable UUID itemId,
            @Valid @RequestBody TaskItemRequest request,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        TaskItemResponse response = taskItemService.updateTaskItem(taskId, itemId, userId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/v1/tasks/{taskId}/items/{itemId}/toggle
     * Marcar item como completo/incompleto
     */
    @PatchMapping("/{itemId}/toggle")
    public ResponseEntity<TaskItemResponse> toggleTaskItem(
            @PathVariable UUID taskId,
            @PathVariable UUID itemId,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        TaskItemResponse response = taskItemService.toggleTaskItem(taskId, itemId, userId);

        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/v1/tasks/{taskId}/items/{itemId}
     * Deletar item
     */
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteTaskItem(
            @PathVariable UUID taskId,
            @PathVariable UUID itemId,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        taskItemService.deleteTaskItem(taskId, itemId, userId);

        return ResponseEntity.noContent().build();
    }
}
