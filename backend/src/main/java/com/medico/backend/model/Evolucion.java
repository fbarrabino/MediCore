package com.medico.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Evoluciones")
@Data
public class Evolucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String motivoConsulta;
    
    @Column(columnDefinition = "TEXT")
    private String antecedentesEnfermedadActual;
    
    @Column(columnDefinition = "TEXT")
    private String antecedentesGenerales;
    
    @Column(columnDefinition = "TEXT")
    private String estudiosComplementarios;
    
    @Column(columnDefinition = "TEXT")
    private String diagnostico;
    
    @Column(columnDefinition = "TEXT")
    private String indicaciones;

    private LocalDateTime fechaCarga = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMotivoConsulta() {
        return motivoConsulta;
    }

    public void setMotivoConsulta(String motivoConsulta) {
        this.motivoConsulta = motivoConsulta;
    }

    public String getAntecedentesEnfermedadActual() {
        return antecedentesEnfermedadActual;
    }

    public void setAntecedentesEnfermedadActual(String antecedentesEnfermedadActual) {
        this.antecedentesEnfermedadActual = antecedentesEnfermedadActual;
    }

    public String getAntecedentesGenerales() {
        return antecedentesGenerales;
    }

    public void setAntecedentesGenerales(String antecedentesGenerales) {
        this.antecedentesGenerales = antecedentesGenerales;
    }

    public String getEstudiosComplementarios() {
        return estudiosComplementarios;
    }

    public void setEstudiosComplementarios(String estudiosComplementarios) {
        this.estudiosComplementarios = estudiosComplementarios;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }

    public LocalDateTime getFechaCarga() {
        return fechaCarga;
    }

    public void setFechaCarga(LocalDateTime fechaCarga) {
        this.fechaCarga = fechaCarga;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
}