package com.medico.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Entidad Turno – representa tanto un "Turno Agendado" (clínica privada)
 * como un "Turno por Orden de Llegada" (salita/efector público).
 *
 * Decisiones de diseño:
 *   - EstadoTurno y TipoTurno son @Enumerated(STRING) para que la BD
 *     almacene el nombre legible ("PENDIENTE") y no un índice numérico
 *     frágil ante reordenamientos del enum.
 *   - La relación @ManyToOne con Usuario garantiza el aislamiento
 *     multi-tenant: cada médico solo ve SUS turnos.
 *   - fechaHora = null es válido para ORDEN_LLEGADA creados en el momento
 *     (el sistema usará la hora de creación como referencia).
 *   - motivoConsulta es opcional tanto para agendados como walk-ins.
 */
@Entity
@Table(name = "Turnos")
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Relaciones Multi-Tenant ────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario medico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Paciente paciente;

    // ── Tiempo ────────────────────────────────────────────────────────────
    /**
     * Para AGENDADO: la fecha/hora del turno programado.
     * Para ORDEN_LLEGADA: puede ser null (se toma fechaCreacion como referencia)
     * o setearse en el momento de registrar en la sala.
     */
    private LocalDateTime fechaHora;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // ── Enums de estado y tipo ─────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTurno estado = EstadoTurno.PENDIENTE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTurno tipo;

    // ── Datos clínicos opcionales ──────────────────────────────────────────
    @Column(columnDefinition = "TEXT")
    private String motivoConsulta;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean recordatorioEnviado = false;

    // ── Getters & Setters ──────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getMedico() { return medico; }
    public void setMedico(Usuario medico) { this.medico = medico; }

    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public EstadoTurno getEstado() { return estado; }
    public void setEstado(EstadoTurno estado) { this.estado = estado; }

    public TipoTurno getTipo() { return tipo; }
    public void setTipo(TipoTurno tipo) { this.tipo = tipo; }

    public String getMotivoConsulta() { return motivoConsulta; }
    public void setMotivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; }

    public boolean isRecordatorioEnviado() { return recordatorioEnviado; }
    public void setRecordatorioEnviado(boolean recordatorioEnviado) { this.recordatorioEnviado = recordatorioEnviado; }

    // ── Enums internos ─────────────────────────────────────────────────────

    /**
     * Máquina de estados del turno:
     *   PENDIENTE       → paciente agendado, aún no llegó
     *   EN_SALA_DE_ESPERA → paciente llegó, está esperando ser llamado
     *   ATENDIDO        → consulta realizada
     *   CANCELADO       → turno anulado (por el médico o el paciente)
     */
    public enum EstadoTurno {
        PENDIENTE,
        EN_SALA_DE_ESPERA,
        ATENDIDO,
        CANCELADO,
        AUSENTE
    }

    /**
     * AGENDADO       → turno programado con fechaHora explícita (agenda clínica)
     * ORDEN_LLEGADA  → walk-in de salita, sin hora específica
     */
    public enum TipoTurno {
        AGENDADO,
        ORDEN_LLEGADA
    }
}
