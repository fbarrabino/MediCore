package com.medico.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Endpoint temporal administrativo para migraciones de BD.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(originPatterns = "*")
public class AdminController {

    @Autowired
    private DataSource dataSource;

    /**
     * Elimina el constraint único global del DNI y crea uno compuesto (dni, usuario_id).
     * Esto permite que dos médicos distintos tengan pacientes con el mismo DNI.
     */
    @PostMapping("/migrate-dni-constraint")
    public ResponseEntity<?> migrateDniConstraint() {
        List<String> results = new ArrayList<>();
        String[] statements = {
            // Try both casing variants
            "ALTER TABLE pacientes DROP CONSTRAINT IF EXISTS pacientes_dni_key",
            "ALTER TABLE pacientes DROP CONSTRAINT IF EXISTS uk_dni",
            "ALTER TABLE pacientes DROP CONSTRAINT IF EXISTS uk_pacientes_dni_usuario_id",
            "ALTER TABLE pacientes DROP CONSTRAINT IF EXISTS uk_dni_medico",
            "ALTER TABLE pacientes DROP CONSTRAINT IF EXISTS pacientes_dni_usuario_id_key",
            "ALTER TABLE \"Pacientes\" DROP CONSTRAINT IF EXISTS pacientes_dni_key",
            "ALTER TABLE \"Pacientes\" DROP CONSTRAINT IF EXISTS uk_dni",
            "ALTER TABLE \"Pacientes\" DROP CONSTRAINT IF EXISTS uk_pacientes_dni_usuario_id",
            "ALTER TABLE \"Pacientes\" DROP CONSTRAINT IF EXISTS uk_dni_medico",
            // Add composite constraint
            "ALTER TABLE pacientes ADD CONSTRAINT uk_dni_medico UNIQUE (dni, usuario_id)"
        };

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(true);
            for (String sql : statements) {
                try (Statement stmt = conn.createStatement()) {
                    stmt.execute(sql);
                    results.add("OK: " + sql);
                } catch (Exception e) {
                    results.add("SKIP: " + sql + " -> " + e.getMessage());
                }
            }
            return ResponseEntity.ok(Map.of(
                "mensaje", "Migración completada",
                "detalles", results
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
