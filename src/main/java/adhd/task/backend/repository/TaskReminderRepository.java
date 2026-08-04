package adhd.task.backend.repository;

import adhd.task.backend.entity.TaskReminder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskReminderRepository extends JpaRepository<TaskReminder, UUID> {
    List<TaskReminder> findByTaskId(UUID taskId);

    @Query("SELECT tr FROM TaskReminder tr WHERE tr.isSent = false AND tr.remindAt <= :now ORDER BY tr.remindAt ASC")
    List<TaskReminder> findPendingReminders(@Param("now") LocalDateTime now);

    @Query("SELECT tr FROM TaskReminder tr WHERE tr.task.user.id = :userId AND tr.isSent = false")
    List<TaskReminder> findPendingRemindersByUserId(@Param("userId") UUID userId);
}