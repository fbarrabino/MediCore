package com.medico.backend.dto;

import com.medico.backend.model.Turno.EstadoTurno;
import com.medico.backend.model.Turno.TipoTurno;

import java.time.LocalDateTime;

/**
 * DTO para crear o actualizar un Turno desde el frontend.
 *
 * Por qué un DTO en lugar de exponer la entidad directamente:
 *   1. El frontend envía IDs escalares (pacienteId), no objetos Paciente completos.
 *   2. Evita que el cliente pueda sobreescribir campos sensibles como medicoId
 *      (el médico real se extrae del Principal/JWT en el Service).
 *   3. Separa el contrato de la API del modelo de persistencia.
 */
public class TurnoRequestDTO {

    private Long pacienteId;

    /**
     * Opcional para ORDEN_LLEGADA.
     * Obligatorio para AGENDADO.
     * Formato ISO 8601: "2026-03-20T10:30:00"
     */
    private LocalDateTime fechaHora;

    private TipoTurno tipo;           // AGENDADO | ORDEN_LLEGADA
    private EstadoTurno estado;       // Se usa al actualizar estado
    private String motivoConsulta;
    private String googleAccessToken;

    // ── Getters & Setters ──────────────────────────────────────────────────
    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public TipoTurno getTipo() { return tipo; }
    public void setTipo(TipoTurno tipo) { this.tipo = tipo; }

    public EstadoTurno getEstado() { return estado; }
    public void setEstado(EstadoTurno estado) { this.estado = estado; }

    public String getMotivoConsulta() { return motivoConsulta; }
    public void setMotivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; }

    public String getGoogleAccessToken() { return googleAccessToken; }
    public void setGoogleAccessToken(String googleAccessToken) { this.googleAccessToken = googleAccessToken; }
}
