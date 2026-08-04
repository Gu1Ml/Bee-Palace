package adhd.task.backend.dto.mapper;

import adhd.task.backend.dto.response.UserResponse;
import adhd.task.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * Converte User (Entity) → UserResponse (DTO)
     */
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}