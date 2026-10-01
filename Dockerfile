FROM ubuntu:24.04

# Instalar Java 21
RUN apt-get update && \
    apt-get install -y openjdk-21-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar o JAR gerado
COPY target/*.jar app.jar

EXPOSE 8080

# Rodar aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]

# Variáveis de ambiente
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/tdah_app
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=porta256
ENV APP_JWT_SECRET=TMCFwmm4gyyDM0S6gcy9LZeniubtt6PvLuAVCSp/I3qzG11GhmqrvKYs4pKmezinNk/NKNvtkfHN0U6LnWZY1g==