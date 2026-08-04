package adhd.task.backend.service;

import adhd.task.backend.dto.request.LoginRequest;
import adhd.task.backend.dto.request.RegisterRequest;
import adhd.task.backend.dto.response.AuthResponse;
import adhd.task.backend.entity.User;
import adhd.task.backend.exception.AuthException;
import adhd.task.backend.dto.mapper.UserMapper;
import adhd.task.backend.repository.UserRepository;
import adhd.task.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    /**
     * Register novo usuário
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email já cadastrado");
        }

        if (!request.getPassword().equals(request.getPasswordConfirmation())) {
            throw new AuthException("Senhas não conferem");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        log.info("Novo usuário registrado: {}", savedUser.getEmail());

        return generateAuthResponse(savedUser);
    }

    /**
     * Login
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Email ou senha incorretos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException("Email ou senha incorretos");
        }

        log.info("Usuário autenticado: {}", user.getEmail());
        return generateAuthResponse(user);
    }

    /**
     * Refresh Access Token
     */
    @Transactional(readOnly = true)
    public AuthResponse refreshAccessToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new AuthException("Refresh token inválido ou expirado");
        }

        UUID userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("Usuário não encontrado"));

        log.info("Access token renovado para: {}", user.getEmail());
        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .name(user.getName())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getExpirationTimeInSeconds())
                .tokenType("Bearer")
                .build();
    }
}
