package adhd.task.backend.dto.response;

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
public class TaskItemResponse {
    private UUID id;
    private UUID taskId;
    private String title;
    private Boolean isCompleted;
    private Integer orderIndex;
    private LocalDateTime createdAt;
}