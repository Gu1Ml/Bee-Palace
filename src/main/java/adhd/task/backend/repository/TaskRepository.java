package adhd.task.backend.repository;

import adhd.task.backend.entity.User;
import adhd.task.backend.entity.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByUserIdOrderByDeadlineAsc(UUID userId);

    List<Task> findByUserIdAndIsCompletedFalseOrderByDeadlineAsc(UUID userId);

    List<Task> findByUserIdAndIsCompletedTrue(UUID userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.isCompleted = false ORDER BY t.deadline ASC")
    List<Task> findPendingTasksByUserId(@Param("userId") UUID userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.deadline BETWEEN :startDate AND :endDate ORDER BY t.deadline ASC")
    List<Task> findTasksByUserAndDateRange(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.isCompleted = true")
    long countCompletedTasksByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.isCompleted = false")
    long countPendingTasksByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);

}
