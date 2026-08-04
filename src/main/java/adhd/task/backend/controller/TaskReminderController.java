package adhd.task.backend.controller;

import adhd.task.backend.dto.request.TaskReminderRequest;
import adhd.task.backend.dto.response.TaskReminderResponse;
import adhd.task.backend.service.TaskReminderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/tasks/{taskId}/reminders")
@RequiredArgsConstructor
public class TaskReminderController {

    private final TaskReminderService taskReminderService;

    private UUID getUserIdFromRequest() {
        HttpServletRequest httpRequest = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes()).getRequest();
        return (UUID) httpRequest.getAttribute("userId");
    }

    /**
     * POST /api/v1/tasks/{taskId}/reminders
     * Criar lembrete
     */
    @PostMapping
    public ResponseEntity<TaskReminderResponse> createReminder(
            @PathVariable UUID taskId,
            @Valid @RequestBody TaskReminderRequest request) {

        UUID userId = getUserIdFromRequest();
        TaskReminderResponse response = taskReminderService.createReminder(taskId, userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/tasks/{taskId}/reminders
     * Obter lembretes de uma tarefa
     */
    @GetMapping
    public ResponseEntity<List<TaskReminderResponse>> getTaskReminders(
            @PathVariable UUID taskId,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        List<TaskReminderResponse> reminders = taskReminderService.getTaskReminders(taskId, userId);

        return ResponseEntity.ok(reminders);
    }

    /**
     * PUT /api/v1/tasks/{taskId}/reminders/{reminderId}
     * Atualizar lembrete
     */
    @PutMapping("/{reminderId}")
    public ResponseEntity<TaskReminderResponse> updateReminder(
            @PathVariable UUID taskId,
            @PathVariable UUID reminderId,
            @Valid @RequestBody TaskReminderRequest request,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        TaskReminderResponse response = taskReminderService.updateReminder(taskId, reminderId, userId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/v1/tasks/{taskId}/reminders/{reminderId}
     * Deletar lembrete
     */
    @DeleteMapping("/{reminderId}")
    public ResponseEntity<Void> deleteReminder(
            @PathVariable UUID taskId,
            @PathVariable UUID reminderId,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        taskReminderService.deleteReminder(taskId, reminderId, userId);

        return ResponseEntity.noContent().build();
    }
}