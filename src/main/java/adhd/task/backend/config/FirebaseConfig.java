package adhd.task.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${firebase.credentials-path:src/main/resources/firebase-credentials.json}")
    private String credentialsPath;

    /**
     * Inicializa Firebase Admin SDK
     */
    @Bean
    public FirebaseMessaging firebaseMessaging() throws IOException {
        // Se já está inicializado, retorna o existente
        if (FirebaseApp.getApps().size() > 0) {
            return FirebaseMessaging.getInstance();
        }

        // Carregar credenciais do arquivo
        FileInputStream serviceAccount = new FileInputStream(credentialsPath);

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        FirebaseApp.initializeApp(options);
        log.info("Firebase Admin SDK inicializado com sucesso");

        return FirebaseMessaging.getInstance();
    }
}