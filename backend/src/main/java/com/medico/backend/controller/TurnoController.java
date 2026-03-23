package com.medico.backend.controller;

import com.medico.backend.dto.TurnoRequestDTO;
import com.medico.backend.model.Turno;
import com.medico.backend.service.TurnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * TurnoController – API REST para la gestión de agenda híbrida.
 *
 * Base path: /api/turnos
 *
 * Todos los endpoints requieren autenticación JWT (configurado en SecurityConfig).
 * El médico se identifica siempre desde el Principal (JWT), nunca desde el body.
 *
 * Endpoints:
 *   POST   /api/turnos                      → Crear turno (AGENDADO o ORDEN_LLEGADA)
 *   GET    /api/turnos/hoy                  → Panel del día: todos los turnos de hoy
 *   GET    /api/turnos/sala-espera          → Sala de espera en tiempo real
 *   GET    /api/turnos                      → Agenda completa del médico
 *   PATCH  /api/turnos/{id}/estado          → Avanzar el estado del turno (workflow)
 *   DELETE /api/turnos/{id}                 → Cancelar turno (soft: estado → CANCELADO)
 */
@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(originPatterns = "*")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;

    // ── POST /api/turnos ────────────────────────────────────────────────────
    /**
     * Crea un turno nuevo.
     * - tipo = AGENDADO:      fechaHora es obligatoria, estado inicial = PENDIENTE.
     * - tipo = ORDEN_LLEGADA: fechaHora es opcional (default = now), estado = EN_SALA_DE_ESPERA.
     */
    @PostMapping
    public ResponseEntity<?> crearTurno(@RequestBody TurnoRequestDTO dto, Principal principal) {
        try {
            Turno turno = turnoService.crearTurno(dto, principal.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(turno);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── GET /api/turnos/hoy ───────────────────────────────────────────────
    /**
     * Devuelve los turnos del día de hoy del médico logueado.
     * Incluye AGENDADOS (por fechaHora) + ORDEN_LLEGADA (por fechaCreacion).
     * Ordenados cronológicamente. Este es el endpoint principal del "panel de hoy".
     */
    @GetMapping("/hoy")
    public ResponseEntity<List<Turno>> obtenerTurnosDeHoy(Principal principal) {
        List<Turno> turnos = turnoService.obtenerTurnosDeHoy(principal.getName());
        return ResponseEntity.ok(turnos);
    }

    // ── GET /api/turnos/sala-espera ───────────────────────────────────────
    /**
     * Devuelve los pacientes actualmente en sala de espera (estado = EN_SALA_DE_ESPERA).
     * Útil para el componente "sala de espera en tiempo real" de una salita.
     */
    @GetMapping("/sala-espera")
    public ResponseEntity<List<Turno>> obtenerSalaDeEspera(Principal principal) {
        List<Turno> sala = turnoService.obtenerSalaDeEspera(principal.getName());
        return ResponseEntity.ok(sala);
    }

    // ── GET /api/turnos ────────────────────────────────────────────────────
    /**
     * Agenda completa del médico (sin filtro temporal).
     * Útil para vistas de semana/mes.
     */
    @GetMapping
    public ResponseEntity<List<Turno>> obtenerTodos(Principal principal) {
        return ResponseEntity.ok(turnoService.obtenerTodosMisTurnos(principal.getName()));
    }

    // ── PATCH /api/turnos/{id}/estado ─────────────────────────────────────
    /**
     * Actualiza el estado del turno (operación de workflow).
     * Body esperado: { "estado": "EN_SALA_DE_ESPERA" | "ATENDIDO" | "CANCELADO" | "PENDIENTE" }
     *
     * Separado de un PUT completo porque cambiar el estado es una acción
     * clínica distinta a editar los datos del turno.
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestBody TurnoRequestDTO dto,
            Principal principal) {
        try {
            if (dto.getEstado() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "El campo 'estado' es requerido."));
            }
            Turno actualizado = turnoService.actualizarEstado(id, dto.getEstado(), principal.getName());
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── DELETE /api/turnos/{id} ───────────────────────────────────────────
    /**
     * Cancela un turno (cambia estado a CANCELADO — soft delete).
     * No se elimina el registro de BD para conservar el historial/auditoría.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelarTurno(@PathVariable Long id, Principal principal) {
        try {
            turnoService.cancelarTurno(id, principal.getName());
            return ResponseEntity.ok(Map.of("mensaje", "Turno cancelado correctamente."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
