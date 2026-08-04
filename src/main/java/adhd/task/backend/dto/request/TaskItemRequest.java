package adhd.task.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskItemRequest {

    @NotBlank(message = "Título do item é obrigatório")
    @Size(min = 1, max = 255, message = "Título deve ter entre 1 e 255 caracteres")
    private String title;

    private Boolean isCompleted;

    private Integer orderIndex; // Ordem na lista
}