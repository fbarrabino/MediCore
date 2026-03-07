# Etapa de construcción
FROM maven:3.9.6-eclipse-temurin-21 AS build
COPY . /app
WORKDIR /app
RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:21-jdk-alpine
# Copiamos el .jar generado en la etapa anterior
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
# Exponemos el puerto
EXPOSE 8080
# Limitamos la memoria de Java para que no explote en servidores gratuitos (-Xmx300m)
ENTRYPOINT ["java", "-Xmx300m", "-jar", "/app.jar"]