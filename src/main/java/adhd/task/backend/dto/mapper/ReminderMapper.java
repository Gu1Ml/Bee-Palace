package adhd.task.backend.dto.mapper;

import adhd.task.backend.dto.request.TaskReminderRequest;
import adhd.task.backend.dto.response.TaskReminderResponse;
import adhd.task.backend.entity.TaskReminder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReminderMapper {

    public TaskReminder reminderRequestToReminder(TaskReminderRequest request) {
        if (request == null) return null;

        TaskReminder reminder = new TaskReminder();
        reminder.setRemindAt(request.getRemindAt());
        reminder.setReminderType(request.getReminderType() != null
                ? request.getReminderType()
                : TaskReminder.ReminderType.LOCAL);
        reminder.setRecurrence(request.getRecurrence() != null
                ? request.getRecurrence()
                : TaskReminder.RecurrenceType.ONCE);
        reminder.setIsSent(request.getIsSent() != null ? request.getIsSent() : false);

        return reminder;
    }

    public void updateReminderFromRequest(TaskReminderRequest request, TaskReminder reminder) {
        if (request == null || reminder == null) return;

        reminder.setRemindAt(request.getRemindAt());
        if (request.getReminderType() != null) {
            reminder.setReminderType(request.getReminderType());
        }
        if (request.getRecurrence() != null) {
            reminder.setRecurrence(request.getRecurrence());
        }
    }

    public TaskReminderResponse reminderToReminderResponse(TaskReminder reminder) {
        if (reminder == null) return null;

        TaskReminderResponse response = new TaskReminderResponse();
        response.setId(reminder.getId());
        response.setTaskId(reminder.getTask() != null ? reminder.getTask().getId() : null);
        response.setRemindAt(reminder.getRemindAt());
        response.setIsSent(reminder.getIsSent());
        response.setReminderType(reminder.getReminderType());
        response.setRecurrence(reminder.getRecurrence());
        response.setCreatedAt(reminder.getCreatedAt());

        return response;
    }

    public List<TaskReminderResponse> remindersToReminderResponses(List<TaskReminder> reminders) {
        if (reminders == null) return new ArrayList<>();
        return reminders.stream()
                .map(this::reminderToReminderResponse)
                .collect(Collectors.toList());
    }
}