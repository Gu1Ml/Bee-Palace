package adhd.task.backend.dto.response;

import adhd.task.backend.entity.TaskReminder;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskReminderResponse {
    private UUID id;
    private UUID taskId;
    private LocalDateTime remindAt;
    private Boolean isSent;
    private TaskReminder.ReminderType reminderType;
    private TaskReminder.RecurrenceType recurrence;
    private LocalDateTime createdAt;
}