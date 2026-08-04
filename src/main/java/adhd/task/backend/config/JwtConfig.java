package adhd.task.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtConfig {

    private String secret;
    private long expirationMs; // milliseconds
    private long refreshExpirationMs; // milliseconds
    private String headerName = "Authorization";
    private String tokenPrefix = "Bearer ";
    private int tokenRefreshThresholdMs = 60000; // renovar se faltam menos de 1 min

    /**
     * Retorna o tempo de expiração em segundos
     */
    public Long getExpirationTimeInSeconds() {
        return expirationMs / 1000;
    }

    /**
     * Verifica se o token deve ser renovado
     */
    public boolean shouldRefreshToken(long issuedAtMs) {
        long currentTimeMs = System.currentTimeMillis();
        long expiresAtMs = issuedAtMs + expirationMs;
        long timeUntilExpiryMs = expiresAtMs - currentTimeMs;

        return timeUntilExpiryMs < tokenRefreshThresholdMs;
    }
}