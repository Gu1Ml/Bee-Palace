package adhd.task.backend.repository;

import adhd.task.backend.entity.TaskItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskItemRepository extends JpaRepository<TaskItem, UUID> {
    List<TaskItem> findByTaskIdOrderByOrderIndexAsc(UUID taskId);
}