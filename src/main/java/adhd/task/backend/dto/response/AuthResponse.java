package adhd.task.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String id;
    private String email;
    private String name;
    private String accessToken;
    private String refreshToken;
    private Long expiresIn; // em segundos
    private String tokenType; // "Bearer"

}