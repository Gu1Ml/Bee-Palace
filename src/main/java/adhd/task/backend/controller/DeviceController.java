package adhd.task.backend.controller;

import adhd.task.backend.dto.request.PushTokenRequest;
import adhd.task.backend.dto.response.PushTokenResponse;
import adhd.task.backend.service.DeviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    private UUID getUserIdFromRequest() {
        HttpServletRequest httpRequest = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes()).getRequest();
        return (UUID) httpRequest.getAttribute("userId");
    }

    /**
     * POST /api/v1/devices/register
     * Registrar novo device (push token)
     */
    @PostMapping("/register")
    public ResponseEntity<PushTokenResponse> registerDevice(
            @Valid @RequestBody PushTokenRequest request,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        PushTokenResponse response = deviceService.registerDevice(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * DELETE /api/v1/devices/{deviceToken}
     * Desregistrar device
     */
    @DeleteMapping("/{deviceToken}")
    public ResponseEntity<Void> unregisterDevice(
            @PathVariable String deviceToken,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        deviceService.unregisterDevice(userId, deviceToken);

        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/devices
     * Listar devices registrados do usuário
     */
    @GetMapping
    public ResponseEntity<?> getUserDevices(HttpServletRequest httpRequest) {
        UUID userId = (UUID) httpRequest.getAttribute("userId");
        var devices = deviceService.getUserDevices(userId);

        return ResponseEntity.ok(devices);
    }

    /**
     * POST /api/v1/devices/{deviceToken}/refresh
     * Renovar push token de um device
     */
    @PostMapping("/{oldToken}/refresh")
    public ResponseEntity<PushTokenResponse> refreshToken(
            @PathVariable String oldToken,
            @RequestBody PushTokenRequest request,
            HttpServletRequest httpRequest) {

        UUID userId = (UUID) httpRequest.getAttribute("userId");
        PushTokenResponse response = deviceService.refreshDeviceToken(userId, oldToken, request);

        return ResponseEntity.ok(response);
    }
}
