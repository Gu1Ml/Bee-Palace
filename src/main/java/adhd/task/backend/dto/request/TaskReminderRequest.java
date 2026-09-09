package adhd.task.backend.dto.request;

import adhd.task.backend.entity.TaskReminder.RecurrenceType;
import adhd.task.backend.entity.TaskReminder.ReminderType;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskReminderRequest {

    @NotNull(message = "Data/hora do lembrete é obrigatória")
    private LocalDateTime remindAt;

    private ReminderType reminderType; // Canal de entrega. Padrão: LOCAL

    private RecurrenceType recurrence; // Repetição. Padrão: ONCE

    private Boolean isSent;
}