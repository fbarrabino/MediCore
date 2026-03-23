package com.medico.backend.controller;

import com.medico.backend.dto.ReportesDTO;
import com.medico.backend.service.ReportesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReportesController {

    private final ReportesService reportesService;

    @GetMapping
    public ResponseEntity<ReportesDTO> getReportes(
            @org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "6_meses") String periodo,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(reportesService.obtenerEstadisticas(username, periodo));
    }
}
