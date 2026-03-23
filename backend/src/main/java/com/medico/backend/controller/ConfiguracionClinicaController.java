package com.medico.backend.controller;

import com.medico.backend.model.ConfiguracionClinica;
import com.medico.backend.service.ConfiguracionClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/configuracion")
@CrossOrigin(originPatterns = "*")
public class ConfiguracionClinicaController {

    @Autowired
    private ConfiguracionClinicaService service;

    @GetMapping
    public ResponseEntity<ConfiguracionClinica> obtenerConfiguracion(Principal principal) {
        return ResponseEntity.ok(service.obtenerConfiguracionPorUsername(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<ConfiguracionClinica> guardarConfiguracion(Principal principal, @RequestBody ConfiguracionClinica config) {
        return ResponseEntity.ok(service.guardarConfiguracion(principal.getName(), config));
    }
}
