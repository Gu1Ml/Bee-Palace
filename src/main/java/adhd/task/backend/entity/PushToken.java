package adhd.task.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "push_tokens", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "device_token"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PushToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Device token é obrigatório")
    @Column(nullable = false, length = 500)
    private String deviceToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Platform platform;

    @Column(nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Enum: Plataforma
    public enum Platform {
        iOS("Apple iOS"),
        ANDROID("Android");

        private final String label;

        Platform(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}