package com.medico.backend.dto;

import lombok.Data;

@Data
public class EstudioRequestDTO {
    private Long pacienteId;
    private String tipo;
    private String fecha;
    private String descripcion;
    private String archivoUrl;
}
