package adhd.task.backend.config;

import jakarta.validation.Validator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class ValidationConfig {

    @Bean
    public Validator validator() {
        return new org.springframework.validation.beanvalidation.LocalValidatorFactoryBean();
    }
}