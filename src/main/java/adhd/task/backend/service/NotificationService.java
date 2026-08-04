package adhd.task.backend.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.SendResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final FirebaseMessaging firebaseMessaging;

    /**
     * Enviar notificação para um único device
     */
    public String sendNotificationToDevice(String deviceToken, String title, String body) {
        try {
            Message message = Message.builder()
                    .setToken(deviceToken)
                    .putData("title", title)
                    .putData("body", body)
                    .setAndroidConfig(com.google.firebase.messaging.AndroidConfig.builder()
                            .setTtl(86400000) // 24h
                            .setNotification(com.google.firebase.messaging.AndroidNotification.builder()
                                    .setTitle(title)
                                    .setBody(body)
                                    .setSound("default")
                                    .build())
                            .build())
                    .setApnsConfig(com.google.firebase.messaging.ApnsConfig.builder()
                            .setAps(com.google.firebase.messaging.Aps.builder()
                                    .setAlert(com.google.firebase.messaging.ApsAlert.builder()
                                            .setTitle(title)
                                            .setBody(body)
                                            .build())
                                    .setSound("default")
                                    .build())
                            .build())
                    .build();

            String messageId = firebaseMessaging.send(message);
            log.info("Notificação enviada para device: {} (messageId: {})", deviceToken, messageId);
            return messageId;

        } catch (Exception e) {
            log.error("Erro ao enviar notificação para device: {}", deviceToken, e);
            throw new RuntimeException("Falha ao enviar notificação", e);
        }
    }

    /**
     * Enviar notificação para múltiplos devices de um usuário
     */
    public void sendNotificationToUser(List<String> deviceTokens, String title, String body) {
        if (deviceTokens == null || deviceTokens.isEmpty()) {
            log.warn("Nenhum device token disponível para enviar notificação");
            return;
        }

        try {
            MulticastMessage message = MulticastMessage.builder()
                    .addAllTokens(deviceTokens)
                    .putData("title", title)
                    .putData("body", body)
                    .setAndroidConfig(com.google.firebase.messaging.AndroidConfig.builder()
                            .setTtl(86400000)
                            .setNotification(com.google.firebase.messaging.AndroidNotification.builder()
                                    .setTitle(title)
                                    .setBody(body)
                                    .setSound("default")
                                    .build())
                            .build())
                    .setApnsConfig(com.google.firebase.messaging.ApnsConfig.builder()
                            .setAps(com.google.firebase.messaging.Aps.builder()
                                    .setAlert(com.google.firebase.messaging.ApsAlert.builder()
                                            .setTitle(title)
                                            .setBody(body)
                                            .build())
                                    .setSound("default")
                                    .build())
                            .build())
                    .build();

            List<SendResponse> responses = firebaseMessaging.sendMulticast(message).getResponses();
            long successCount = responses.stream().filter(SendResponse::isSuccessful).count();
            log.info("Notificações enviadas: {}/{} com sucesso", successCount, responses.size());

        } catch (Exception e) {
            log.error("Erro ao enviar notificações para múltiplos devices", e);
            throw new RuntimeException("Falha ao enviar notificações", e);
        }
    }

    /**
     * Enviar notificação de tarefa vencida
     */
    public void sendOverdueTaskNotification(String deviceToken, String taskTitle) {
        String title = "⏰ Tarefa Vencida";
        String body = "\"" + taskTitle + "\" venceu. Não esqueça!";
        sendNotificationToDevice(deviceToken, title, body);
    }

    /**
     * Enviar notificação de lembrete de tarefa
     */
    public void sendTaskReminderNotification(String deviceToken, String taskTitle) {
        String title = "📌 Lembrete";
        String body = "Hora de fazer: " + taskTitle;
        sendNotificationToDevice(deviceToken, title, body);
    }

    /**
     * Enviar notificação de proximidade de deadline
     */
    public void sendTaskDeadlineNotification(String deviceToken, String taskTitle, int minutesUntilDeadline) {
        String title = "⚠️ Deadline Próximo";
        String body = "\"" + taskTitle + "\" vence em " + minutesUntilDeadline + " minutos";
        sendNotificationToDevice(deviceToken, title, body);
    }

    /**
     * Enviar notificação de tarefa completa (feedback positivo)
     */
    public void sendTaskCompletedNotification(String deviceToken) {
        String title = "✅ Parabéns!";
        String body = "Você completou uma tarefa. Excelente trabalho!";
        sendNotificationToDevice(deviceToken, title, body);
    }
}