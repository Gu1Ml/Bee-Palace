package adhd.task.backend.controller;

import adhd.task.backend.dto.request.LoginRequest;
import adhd.task.backend.dto.request.RegisterRequest;
import adhd.task.backend.dto.response.AuthResponse;
import adhd.task.backend.exception.AuthException;
import adhd.task.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (AuthException ex) {
            log.warn("Erro no registro: {}", ex.getMessage());
            throw ex;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (AuthException ex) {
            log.warn("Erro no login: {}", ex.getMessage());
            throw ex;
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
        try {
            AuthResponse response = authService.refreshAccessToken(request.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (AuthException ex) {
            log.warn("Erro ao renovar token: {}", ex.getMessage());
            throw ex;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class RefreshTokenRequest {
        private String refreshToken;
    }
}
