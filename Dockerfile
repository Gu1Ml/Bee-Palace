# Apenas Java 21 para rodar o JAR
FROM eclipse-temurin:21-jdk-slim

WORKDIR /app

# Copiar o JAR já buildado
COPY target/*.jar app.jar

# Expor porta
EXPOSE 8080

# Variáveis de ambiente
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/tdah_app
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=porta256
ENV APP_JWT_SECRET=TMCFwmm4gyyDM0S6gcy9LZeniubtt6PvLuAVCSp/I3qzG11GhmqrvKYs4pKmezinNk/NKNvtkfHN0U6LnWZY1g==

# Rodar aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]