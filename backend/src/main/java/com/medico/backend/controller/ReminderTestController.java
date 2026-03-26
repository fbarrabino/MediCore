package com.medico.backend.controller;

import com.medico.backend.service.ReminderSchedulerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Endpoint de testing para disparar manualmente el scheduler de recordatorios.
 * Útil para verificar que el sistema funciona sin esperar las 09:00 AM.
 * En producción podrías proteger este endpoint o eliminarlo.
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(originPatterns = "*")
public class ReminderTestController {

    @Autowired
    private ReminderSchedulerService reminderSchedulerService;

    @PostMapping("/enviar-recordatorios")
    public ResponseEntity<?> triggerReminders() {
        try {
            reminderSchedulerService.ejecutarAhora();
            return ResponseEntity.ok(Map.of("message", "Recordatorios procesados exitosamente. Revisá la consola para el detalle."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al procesar recordatorios: " + e.getMessage()));
        }
    }
}
