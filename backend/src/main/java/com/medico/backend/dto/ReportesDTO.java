package com.medico.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ReportesDTO {
    private long totalPacientes;
    private long turnosAtendidos;
    private String tasaAusentismo;
    private List<Map<String, Object>> turnosMensuales;
    private List<Map<String, Object>> turnosDiarios;
    private List<Map<String, Object>> demografiaEdades;
}
