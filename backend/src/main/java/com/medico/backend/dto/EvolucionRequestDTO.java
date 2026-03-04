package com.medico.backend.dto;

public class EvolucionRequestDTO {
    private Long pacienteId;
    private Long medicoId;
    private String motivoConsulta;
    private String antecedentesEnfermedadActual;
    private String antecedentesGenerales;
    private String estudiosComplementarios;
    private String diagnostico;
    private String indicaciones;

    // Getters y Setters
    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public Long getMedicoId() { return medicoId; }
    public void setMedicoId(Long medicoId) { this.medicoId = medicoId; }

    public String getMotivoConsulta() { return motivoConsulta; }
    public void setMotivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; }

    public String getAntecedentesEnfermedadActual() { return antecedentesEnfermedadActual; }
    public void setAntecedentesEnfermedadActual(String antecedentesEnfermedadActual) { this.antecedentesEnfermedadActual = antecedentesEnfermedadActual; }

    public String getAntecedentesGenerales() { return antecedentesGenerales; }
    public void setAntecedentesGenerales(String antecedentesGenerales) { this.antecedentesGenerales = antecedentesGenerales; }

    public String getEstudiosComplementarios() { return estudiosComplementarios; }
    public void setEstudiosComplementarios(String estudiosComplementarios) { this.estudiosComplementarios = estudiosComplementarios; }

    public String getDiagnostico() { return diagnostico; }
    public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }

    public String getIndicaciones() { return indicaciones; }
    public void setIndicaciones(String indicaciones) { this.indicaciones = indicaciones; }
}