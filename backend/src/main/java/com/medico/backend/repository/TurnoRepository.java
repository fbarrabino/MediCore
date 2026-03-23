package com.medico.backend.repository;

import com.medico.backend.model.Turno;
import com.medico.backend.model.Turno.EstadoTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio de Turnos.
 *
 * Queries de filtrado diseñados para el modelo de negocio dual:
 *
 *  findByMedico_UsernameAndFechaHoraBetween
 *    → Lista la agenda diaria de un médico (AGENDADO puro).
 *
 *  findByMedico_UsernameAndFechaCreacionBetween
 *    → Lista los walk-ins del día de un médico (ORDEN_LLEGADA).
 *
 *  findTurnosDeHoy
 *    → Query unificada: devuelve AGENDADOS (por fechaHora) +
 *      ORDEN_LLEGADA (por fechaCreacion) del día de hoy para un médico.
 *      Es el endpoint principal que el frontend consumirá para el "panel de hoy".
 *
 *  findByMedico_UsernameAndEstado
 *    → Filtrar la sala de espera en tiempo real (estado = EN_SALA_DE_ESPERA).
 */
@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    // 1. Todos los turnos de un médico (sin filtro temporal)
    List<Turno> findByMedico_UsernameOrderByFechaHoraAsc(String username);

    // 2. Turnos AGENDADOS de un médico entre dos fechas (rango de agenda)
    List<Turno> findByMedico_UsernameAndFechaHoraBetweenOrderByFechaHoraAsc(
            String username,
            LocalDateTime desde,
            LocalDateTime hasta
    );

    // 3. Walk-ins registrados hoy (por fecha de creación del registro)
    List<Turno> findByMedico_UsernameAndFechaCreacionBetweenOrderByFechaCreacionAsc(
            String username,
            LocalDateTime desde,
            LocalDateTime hasta
    );

    // 4. Turnos de HOY → unifica AGENDADOS (por fechaHora) + ORDEN_LLEGADA (por fechaCreacion)
    @Query("""
        SELECT t FROM Turno t
        WHERE t.medico.username = :username
          AND (
            (t.tipo = 'AGENDADO'      AND t.fechaHora      BETWEEN :inicioHoy AND :finHoy)
         OR (t.tipo = 'ORDEN_LLEGADA' AND t.fechaCreacion  BETWEEN :inicioHoy AND :finHoy)
          )
        ORDER BY
          CASE t.tipo
            WHEN 'AGENDADO'      THEN t.fechaHora
            WHEN 'ORDEN_LLEGADA' THEN t.fechaCreacion
          END ASC
        """)
    List<Turno> findTurnosDeHoy(
            @Param("username")  String username,
            @Param("inicioHoy") LocalDateTime inicioHoy,
            @Param("finHoy")    LocalDateTime finHoy
    );

    // 5. Sala de espera en tiempo real (estado = EN_SALA_DE_ESPERA)
    List<Turno> findByMedico_UsernameAndEstadoOrderByFechaCreacionAsc(
            String username,
            EstadoTurno estado
    );

    // 6. Turnos de mañana con email de paciente para recordatorios automáticos
    @Query("""
        SELECT t FROM Turno t
        WHERE t.tipo = 'AGENDADO'
          AND t.recordatorioEnviado = false
          AND t.estado NOT IN ('CANCELADO', 'ATENDIDO')
          AND t.fechaHora BETWEEN :inicioMañana AND :finMañana
          AND t.paciente.emailPaciente IS NOT NULL
          AND t.paciente.emailPaciente <> ''
        ORDER BY t.fechaHora ASC
        """)
    List<Turno> findTurnosParaRecordatorio(
            @Param("inicioMañana") LocalDateTime inicioMañana,
            @Param("finMañana")    LocalDateTime finMañana
    );

    // 7. [TESTING] Turnos de los próximos 7 días para disparar manualmente
    @Query("""
        SELECT t FROM Turno t
        WHERE t.tipo = 'AGENDADO'
          AND t.estado NOT IN ('CANCELADO', 'ATENDIDO')
          AND t.fechaHora > :ahora
          AND t.fechaHora <= :enSieteDias
          AND t.paciente.emailPaciente IS NOT NULL
          AND t.paciente.emailPaciente <> ''
        ORDER BY t.fechaHora ASC
        """)
    List<Turno> findTurnosParaTestManual(
            @Param("ahora")       LocalDateTime ahora,
            @Param("enSieteDias") LocalDateTime enSieteDias
    );
}
