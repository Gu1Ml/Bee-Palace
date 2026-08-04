package adhd.task.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Título é obrigatório")
    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(nullable = false)
    private Boolean isCompleted = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurring_type", nullable = false)
    private RecurringType recurringType = RecurringType.NONE;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Relacionamentos
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<TaskItem> items;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskReminder> reminders;

    // Métodos Auxiliares
    public void markAsCompleted() {
        this.isCompleted = true;
        this.completedAt = LocalDateTime.now();
    }

    public void markAsIncomplete() {
        this.isCompleted = false;
        this.completedAt = null;
    }

    public int getCompletedItemsCount() {
        if (this.items == null || this.items.isEmpty()) {
            return 0;
        }
        return (int) this.items.stream()
                .filter(TaskItem::getIsCompleted)
                .count();
    }

    public int getTotalItemsCount() {
        return this.items == null ? 0 : this.items.size();
    }

    // Enum: Prioridade
    public enum TaskPriority {
        LOW("Baixa"),
        MEDIUM("Média"),
        HIGH("Alta");

        private final String label;

        TaskPriority(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    // Enum: Tipo de Recorrência
    public enum RecurringType {
        NONE("Nenhuma"),
        DAILY("Diária"),
        WEEKLY("Semanal"),
        MONTHLY("Mensal");

        private final String label;

        RecurringType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}