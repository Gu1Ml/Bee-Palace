package adhd.task.backend.service;

import adhd.task.backend.dto.request.PushTokenRequest;
import adhd.task.backend.dto.response.PushTokenResponse;
import adhd.task.backend.entity.PushToken;
import adhd.task.backend.entity.User;
import adhd.task.backend.exception.UnauthorizedException;
import adhd.task.backend.repository.PushTokenRepository;
import adhd.task.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeviceService {

    private final PushTokenRepository pushTokenRepository;
    private final UserRepository userRepository;

    /**
     * Registrar novo device (push token)
     */
    @Transactional
    public PushTokenResponse registerDevice(UUID userId, PushTokenRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verificar se device já está registrado
        PushToken existing = pushTokenRepository
                .findByDeviceTokenAndUserId(request.getDeviceToken(), userId)
                .orElse(null);

        if (existing != null) {
            // Atualizar timestamp
            existing.setUpdatedAt(LocalDateTime.now());
            existing.setIsActive(true);
            PushToken updated = pushTokenRepository.save(existing);
            log.info("Device token atualizado: {} para usuário: {}", request.getDeviceToken(), userId);
            return mapToResponse(updated);
        }

        // Criar novo
        PushToken pushToken = new PushToken();
        pushToken.setUser(user);
        pushToken.setDeviceToken(request.getDeviceToken());
        pushToken.setPlatform(request.getPlatform());
        pushToken.setIsActive(true);

        PushToken saved = pushTokenRepository.save(pushToken);
        log.info("Device token registrado: {} (plataforma: {}) para usuário: {}",
                request.getDeviceToken(), request.getPlatform(), userId);

        return mapToResponse(saved);
    }

    /**
     * Desregistrar device
     */
    @Transactional
    public void unregisterDevice(UUID userId, String deviceToken) {
        PushToken pushToken = pushTokenRepository
                .findByDeviceTokenAndUserId(deviceToken, userId)
                .orElseThrow(() -> new RuntimeException("Device não encontrado"));

        pushToken.setIsActive(false);
        pushTokenRepository.save(pushToken);
        log.info("Device token desregistrado: {}", deviceToken);
    }

    /**
     * Listar devices do usuário
     */
    @Transactional(readOnly = true)
    public List<PushTokenResponse> getUserDevices(UUID userId) {
        List<PushToken> devices = pushTokenRepository.findByUserIdAndIsActiveTrue(userId);
        return devices.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Renovar push token (quando cliente recebe novo token do FCM)
     */
    @Transactional
    public PushTokenResponse refreshDeviceToken(UUID userId, String oldToken, PushTokenRequest request) {
        PushToken pushToken = pushTokenRepository
                .findByDeviceTokenAndUserId(oldToken, userId)
                .orElseThrow(() -> new UnauthorizedException("Device não encontrado"));

        pushToken.setDeviceToken(request.getDeviceToken());
        pushToken.setPlatform(request.getPlatform());
        pushToken.setUpdatedAt(LocalDateTime.now());

        PushToken updated = pushTokenRepository.save(pushToken);
        log.info("Push token renovado para usuário: {}", userId);

        return mapToResponse(updated);
    }

    /**
     * Obter todos os tokens ativos de um usuário (para enviar notificações)
     */
    @Transactional(readOnly = true)
    public List<String> getActiveDeviceTokensForUser(UUID userId) {
        return pushTokenRepository.findByUserIdAndIsActiveTrue(userId)
                .stream()
                .map(PushToken::getDeviceToken)
                .collect(Collectors.toList());
    }

    private PushTokenResponse mapToResponse(PushToken pushToken) {
        return PushTokenResponse.builder()
                .id(pushToken.getId().toString())
                .deviceToken(pushToken.getDeviceToken())
                .platform(pushToken.getPlatform())
                .isActive(pushToken.getIsActive())
                .createdAt(pushToken.getCreatedAt())
                .updatedAt(pushToken.getUpdatedAt())
                .build();
    }
}