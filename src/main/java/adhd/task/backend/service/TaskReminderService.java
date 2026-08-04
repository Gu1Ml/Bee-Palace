package adhd.task.backend.service;

import adhd.task.backend.dto.request.TaskReminderRequest;
import adhd.task.backend.dto.response.TaskReminderResponse;
import adhd.task.backend.entity.Task;
import adhd.task.backend.entity.TaskReminder;
import adhd.task.backend.exception.UnauthorizedException;
import adhd.task.backend.dto.mapper.ReminderMapper;
import adhd.task.backend.repository.TaskReminderRepository;
import adhd.task.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskReminderService {

    private final TaskReminderRepository taskReminderRepository;
    private final TaskRepository taskRepository;
    private final ReminderMapper reminderMapper;



    /**
     * Criar lembrete para uma tarefa
     */
    @Transactional
    public TaskReminderResponse createReminder(UUID taskId, UUID userId, TaskReminderRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para adicionar lembretes a esta tarefa");
        }

        TaskReminder reminder = reminderMapper.reminderRequestToReminder(request);
        reminder.setTask(task);

        TaskReminder savedReminder = taskReminderRepository.save(reminder);
        log.info("Lembrete criado: {} para tarefa: {}", savedReminder.getId(), taskId);

        return reminderMapper.reminderToReminderResponse(savedReminder);
    }

    /**
     * Obter todos os lembretes de uma tarefa
     */
    @Transactional(readOnly = true)
    public List<TaskReminderResponse> getTaskReminders(UUID taskId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para acessar esta tarefa");
        }

        List<TaskReminder> reminders = taskReminderRepository.findByTaskId(taskId);
        return reminderMapper.remindersToReminderResponses(reminders);
    }

    /**
     * Atualizar lembrete
     */
    @Transactional
    public TaskReminderResponse updateReminder(UUID taskId, UUID reminderId, UUID userId, TaskReminderRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para modificar lembretes desta tarefa");
        }

        TaskReminder reminder = taskReminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Lembrete não encontrado"));

        if (!reminder.getTask().getId().equals(taskId)) {
            throw new UnauthorizedException("Este lembrete não pertence a esta tarefa");
        }

        reminderMapper.updateReminderFromRequest(request, reminder);
        TaskReminder updatedReminder = taskReminderRepository.save(reminder);
        log.info("Lembrete atualizado: {}", reminderId);

        return reminderMapper.reminderToReminderResponse(updatedReminder);
    }

    /**
     * Deletar lembrete
     */
    @Transactional
    public void deleteReminder(UUID taskId, UUID reminderId, UUID userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Você não tem permissão para deletar lembretes desta tarefa");
        }

        TaskReminder reminder = taskReminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Lembrete não encontrado"));

        taskReminderRepository.delete(reminder);
        log.info("Lembrete deletado: {}", reminderId);
    }

    /**
     * Obter lembretes pendentes (job scheduler)
     */
    @Transactional(readOnly = true)
    public List<TaskReminder> getPendingReminders() {
        return taskReminderRepository.findPendingReminders(java.time.LocalDateTime.now());
    }

    /**
     * Marcar lembrete como enviado
     */
    @Transactional
    public void markReminderAsSent(UUID reminderId) {
        TaskReminder reminder = taskReminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Lembrete não encontrado"));

        reminder.setIsSent(true);
        taskReminderRepository.save(reminder);
    }
}
