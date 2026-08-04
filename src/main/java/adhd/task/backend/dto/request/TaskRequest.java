package adhd.task.backend.dto.request;

import adhd.task.backend.entity.Task.RecurringType;
import adhd.task.backend.entity.Task.TaskPriority;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class TaskRequest {

    @NotBlank(message = "Título é obrigatório")
    @Size(min = 1, max = 255, message = "Título deve ter entre 1 e 255 caracteres")
    private String title;

    @Size(max = 2000, message = "Descrição deve ter no máximo 2000 caracteres")
    private String description;

    private TaskPriority priority; // Padrão: MEDIUM (Em inglês)

    private LocalDateTime deadline;

    private RecurringType recurringType; // Padrão: NONE (Em inglês)

    // Flags úteis
    private Boolean isCompleted;
}
