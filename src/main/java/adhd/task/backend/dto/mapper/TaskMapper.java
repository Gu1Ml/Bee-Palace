package adhd.task.backend.dto.mapper;

import adhd.task.backend.dto.request.TaskItemRequest;
import adhd.task.backend.dto.request.TaskRequest;
import adhd.task.backend.dto.response.TaskItemResponse;
import adhd.task.backend.dto.response.TaskResponse;
import adhd.task.backend.entity.Task;
import adhd.task.backend.entity.TaskItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {

    // ===== TASK =====

    public Task taskRequestToTask(TaskRequest request) {
        if (request == null) return null;

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Task.TaskPriority.MEDIUM);
        task.setDeadline(request.getDeadline());
        task.setRecurringType(request.getRecurringType() != null ? request.getRecurringType() : Task.RecurringType.NONE);
        task.setIsCompleted(request.getIsCompleted() != null ? request.getIsCompleted() : false);

        return task;
    }

    public void updateTaskFromRequest(TaskRequest request, Task task) {
        if (request == null || task == null) return;

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDeadline(request.getDeadline());
        if (request.getRecurringType() != null) {
            task.setRecurringType(request.getRecurringType());
        }
    }

    public TaskResponse taskToTaskResponse(Task task) {
        if (task == null) return null;

        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setUserId(task.getUser() != null ? task.getUser().getId() : null);
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setPriority(task.getPriority());
        response.setDeadline(task.getDeadline());
        response.setIsCompleted(task.getIsCompleted());
        response.setRecurringType(task.getRecurringType());
        response.setCompletedAt(task.getCompletedAt());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        response.setTotalItemsCount(task.getTotalItemsCount());
        response.setCompletedItemsCount(task.getCompletedItemsCount());
        response.setItems(taskItemsToTaskItemResponses(task.getItems()));

        return response;
    }

    public List<TaskResponse> tasksToTaskResponses(List<Task> tasks) {
        if (tasks == null) return new ArrayList<>();
        return tasks.stream()
                .map(this::taskToTaskResponse)
                .collect(Collectors.toList());
    }

    // ===== TASK ITEM =====

    public TaskItem taskItemRequestToTaskItem(TaskItemRequest request) {
        if (request == null) return null;

        TaskItem item = new TaskItem();
        item.setTitle(request.getTitle());
        item.setIsCompleted(request.getIsCompleted() != null ? request.getIsCompleted() : false);
        item.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);

        return item;
    }

    public void updateTaskItemFromRequest(TaskItemRequest request, TaskItem item) {
        if (request == null || item == null) return;

        item.setTitle(request.getTitle());
        if (request.getOrderIndex() != null) {
            item.setOrderIndex(request.getOrderIndex());
        }
    }

    public TaskItemResponse taskItemToTaskItemResponse(TaskItem item) {
        if (item == null) return null;

        TaskItemResponse response = new TaskItemResponse();
        response.setId(item.getId());
        response.setTaskId(item.getTask() != null ? item.getTask().getId() : null);
        response.setTitle(item.getTitle());
        response.setIsCompleted(item.getIsCompleted());
        response.setOrderIndex(item.getOrderIndex());
        response.setCreatedAt(item.getCreatedAt());

        return response;
    }

    public List<TaskItemResponse> taskItemsToTaskItemResponses(List<TaskItem> items) {
        if (items == null) return new ArrayList<>();
        return items.stream()
                .map(this::taskItemToTaskItemResponse)
                .collect(Collectors.toList());
    }
}