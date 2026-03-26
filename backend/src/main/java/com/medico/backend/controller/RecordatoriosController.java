package com.medico.backend.controller;

import com.medico.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

/**
 * Endpoints para configurar las preferencias de Recordatorios Automáticos
 * del médico logueado.
 */
@RestController
@RequestMapping("/api/recordatorios")
public class RecordatoriosController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /** Obtener configuración actual */
    @GetMapping("/config")
    public ResponseEntity<?> getConfig(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return usuarioRepository.findByUsername(principal.getName())
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of(
                        "recordatoriosActivos", u.isRecordatoriosActivos(),
                        "recordatorioMensaje", u.getRecordatorioMensaje() != null
                                ? u.getRecordatorioMensaje()
                                : ""
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    /** Guardar configuración */
    @PutMapping("/config")
    public ResponseEntity<?> saveConfig(
            @RequestBody Map<String, Object> body,
            Principal principal
    ) {
        if (principal == null) return ResponseEntity.status(401).build();
        return usuarioRepository.findByUsername(principal.getName())
                .map(u -> {
                    if (body.containsKey("recordatoriosActivos")) {
                        u.setRecordatoriosActivos(Boolean.TRUE.equals(body.get("recordatoriosActivos")));
                    }
                    if (body.containsKey("recordatorioMensaje")) {
                        String msg = (String) body.get("recordatorioMensaje");
                        u.setRecordatorioMensaje(msg != null ? msg.trim() : null);
                    }
                    usuarioRepository.save(u);
                    return ResponseEntity.<Object>ok(Map.of("ok", true));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
