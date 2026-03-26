package com.medico.backend.config;

import com.mercadopago.MercadoPagoConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class MercadoPagoConfiguration {

    @Value("${MP_ACCESS_TOKEN:}")
    private String accessToken;

    @PostConstruct
    public void init() {
        String token = accessToken;

        // Si Spring no inyecta el token desde las variables de entorno, intentamos leer el .env directamente
        if (token == null || token.trim().isEmpty()) {
            token = readTokenFromEnvFile();
        }

        if (token != null && !token.trim().isEmpty()) {
            MercadoPagoConfig.setAccessToken(token.trim());
        } else {
            System.err.println("Atención: MP_ACCESS_TOKEN no encontrado en el environment ni en el archivo .env!");
        }
    }

    private String readTokenFromEnvFile() {
        try {
            java.io.File envFile = new java.io.File(".env");
            if (envFile.exists()) {
                java.util.Scanner scanner = new java.util.Scanner(envFile);
                while (scanner.hasNextLine()) {
                    String line = scanner.nextLine().trim();
                    if (line.startsWith("MP_ACCESS_TOKEN=")) {
                        scanner.close();
                        return line.substring("MP_ACCESS_TOKEN=".length()).trim();
                    }
                }
                scanner.close();
            }
        } catch (Exception e) {
            System.err.println("Error leyendo .env manualmente: " + e.getMessage());
        }
        return null;
    }
}
