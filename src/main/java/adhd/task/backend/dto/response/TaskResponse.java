package adhd.task.backend.dto.response;

import adhd.task.backend.entity.Task;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskResponse {
    private UUID id;
    private UUID userId;
    private String title;
    private String description;
    private Task.TaskPriority priority;
    private LocalDateTime deadline;
    private Boolean isCompleted;
    private Task.RecurringType recurringType;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalItemsCount;
    private Integer completedItemsCount;
    private List<TaskItemResponse> items;
}