package adhd.task.backend.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "task_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @NotBlank(message = "Título do item é obrigatório")
    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false)
    private Boolean isCompleted = false;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Métodos Auxiliares
    public void toggleCompletion() {
        this.isCompleted = !this.isCompleted;
    }
}