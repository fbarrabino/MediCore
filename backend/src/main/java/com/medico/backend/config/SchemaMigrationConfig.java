package com.medico.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Drops legacy DB constraints that can't be removed by Hibernate ddl-auto=update.
 * Runs at startup — each statement is wrapped in try/catch so it's idempotent.
 */
@Configuration
public class SchemaMigrationConfig {

    @Bean
    CommandLineRunner dropLegacyConstraints(JdbcTemplate jdbcTemplate) {
        return args -> {
            // Drop old global UNIQUE on pacientes.dni (replaced by composite dni+usuario_id)
            try {
                jdbcTemplate.execute(
                    "ALTER TABLE pacientes DROP CONSTRAINT IF EXISTS uk_hol387x0ourgruynyqewdhv37"
                );
                System.out.println("✅ Constraint uk_hol387x0ourgruynyqewdhv37 dropped (or didn't exist).");
            } catch (Exception e) {
                System.out.println("ℹ️  Constraint drop skipped: " + e.getMessage());
            }

            // Drop any other legacy single-column UNIQUE on dni (defensive)
            try {
                jdbcTemplate.execute(
                    "ALTER TABLE pacientes DROP CONSTRAINT IF EXISTS pacientes_dni_key"
                );
            } catch (Exception ignored) {}

            // Ensure the composite unique index exists (idempotent)
            try {
                jdbcTemplate.execute(
                    "CREATE UNIQUE INDEX IF NOT EXISTS idx_paciente_dni_medico " +
                    "ON pacientes (dni, usuario_id)"
                );
                System.out.println("✅ Composite unique index (dni, usuario_id) ensured.");
            } catch (Exception e) {
                System.out.println("ℹ️  Composite index already exists: " + e.getMessage());
            }
        };
    }
}
