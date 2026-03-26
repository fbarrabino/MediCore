package com.medico.backend.controller;

import com.medico.backend.service.MercadoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private MercadoPagoService mercadoPagoService;

    @PostMapping("/crear-preferencia")
    public ResponseEntity<?> crearPreferencia(@RequestBody Map<String, String> payload) {
        try {
            String plan = payload.get("plan");
            if (plan == null || plan.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El plan es requerido"));
            }

            String urlPago = mercadoPagoService.createPreference(plan);
            return ResponseEntity.ok(Map.of("url_pago", urlPago));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al crear preferencia de Mercado Pago: " + e.getMessage()));
        }
    }
}
