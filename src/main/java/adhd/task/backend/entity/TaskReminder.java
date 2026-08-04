package adhd.task.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "task_reminders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskReminder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(name = "remind_at", nullable = false)
    private LocalDateTime remindAt;

    @Column(nullable = false)
    private Boolean isSent = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "reminder_type", nullable = false)
    private ReminderType reminderType = ReminderType.LOCAL;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Enum: Tipo de Lembrete
    public enum ReminderType {
        LOCAL("Notificação local no device"),
        PUSH("Notificação push (FCM)");

        private final String label;

        ReminderType(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}