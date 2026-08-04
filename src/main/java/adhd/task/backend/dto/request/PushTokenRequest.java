package adhd.task.backend.dto.request;

import adhd.task.backend.entity.PushToken.Platform;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PushTokenRequest {

    @NotBlank(message = "Device token é obrigatório")
    @JsonAlias("newDeviceToken")
    private String deviceToken;

    private Platform platform; // iOS ou ANDROID

    private Boolean isActive;
}