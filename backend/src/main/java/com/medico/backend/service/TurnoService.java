package com.medico.backend.service;

import com.medico.backend.dto.TurnoRequestDTO;
import com.medico.backend.model.Paciente;
import com.medico.backend.model.Turno;
import com.medico.backend.model.Turno.EstadoTurno;
import com.medico.backend.model.Usuario;
import com.medico.backend.repository.PacienteRepository;
import com.medico.backend.repository.TurnoRepository;
import com.medico.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * TurnoService – capa de negocio para la agenda híbrida.
 *
 * Decisiones de diseño:
 *   1. El medicoId NUNCA se acepta del DTO. Siempre se resuelve desde el
 *      username extraído del JWT (Principal), garantizando multi-tenant estricto.
 *   2. La lógica de "hoy" se calcula en el Service (inicio = 00:00:00,
 *      fin = 23:59:59.999) para no filtrar en el Controller ni en el cliente.
 *   3. Al crear un ORDEN_LLEGADA sin fechaHora, el sistema asigna LocalDateTime.now()
 *      como fechaHora de referencia para poder ordenarlos correctamente.
 *   4. actualizarEstado es un PATCH semántico: solo cambia el estado, no otros
 *      datos del turno, porque el cambio de estado es una operación de workflow
 *      distinta a la edición de datos.
 */
@Service
public class TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private GoogleCalendarService googleCalendarService;

    @Autowired
    private EmailService emailService;

    // ── CREAR TURNO ────────────────────────────────────────────────────────

    @Transactional
    public Turno crearTurno(TurnoRequestDTO dto, String username) {
        // Resolvemos el médico desde el JWT (multi-tenant estricto)
        Usuario medico = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado: " + username));

        // Validamos que el paciente exista y pertenezca a este médico
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .filter(p -> p.getMedico().getUsername().equals(username))
                .orElseThrow(() -> new RuntimeException(
                        "Paciente no encontrado o no pertenece a este médico. ID: " + dto.getPacienteId()));

        Turno turno = new Turno();
        turno.setMedico(medico);
        turno.setPaciente(paciente);
        turno.setTipo(dto.getTipo());
        turno.setMotivoConsulta(dto.getMotivoConsulta());

        // Manejo de fechaHora según tipo
        if (dto.getTipo() == Turno.TipoTurno.ORDEN_LLEGADA) {
            // Walk-in: si no vino hora, usamos el momento actual
            turno.setFechaHora(dto.getFechaHora() != null ? dto.getFechaHora() : LocalDateTime.now());
            turno.setEstado(EstadoTurno.EN_SALA_DE_ESPERA); // walk-in entra directo a la sala
        } else {
            // Turno AGENDADO: la fechaHora es obligatoria
            if (dto.getFechaHora() == null) {
                throw new RuntimeException("Un turno AGENDADO requiere fechaHora.");
            }
            turno.setFechaHora(dto.getFechaHora());
            turno.setEstado(EstadoTurno.PENDIENTE); // agendado empieza como pendiente
        }

        Turno turnoGuardado = turnoRepository.save(turno);

        // Integración con Google Calendar
        if (dto.getGoogleAccessToken() != null && !dto.getGoogleAccessToken().isEmpty()) {
            googleCalendarService.insertarTurnoEnGoogleCalendar(turnoGuardado, dto.getGoogleAccessToken());
        }

        // Envío de correo asíncrono
        if (paciente.getEmailPaciente() != null && !paciente.getEmailPaciente().isEmpty()) {
            String asunto = "Confirmación de Turno - MediCore";
            String fh = turnoGuardado.getFechaHora() != null ? 
                turnoGuardado.getFechaHora().toLocalDate().toString() + " a las " + turnoGuardado.getFechaHora().toLocalTime().toString() 
                : "A la brevedad (orden de llegada)";
                
            String html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>"
                        + "<h2 style='color: #2563eb; text-align: center;'>Confirmación de Turno</h2>"
                        + "<p>Hola <b>" + paciente.getNombre() + "</b>,</p>"
                        + "<p>Te confirmamos que tu turno con el Dr./Dra. <b>" + medico.getNombre() + " " + (medico.getApellido() != null ? medico.getApellido() : "") + "</b> ha sido registrado exitosamente.</p>"
                        + "<div style='background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;'>"
                        + "<p style='margin: 0;'>📅 <b>Fecha y Hora:</b> " + fh + "</p>"
                        + "</div>"
                        + "<p>Por favor, recuerda llegar con 10 minutos de anticipación.</p>"
                        + "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;' />"
                        + "<p style='font-size: 12px; color: #888; text-align: center;'>© 2026 MediCore - Gestión Clínica</p>"
                        + "</div>";

            emailService.enviarCorreoGenerico(paciente.getEmailPaciente(), asunto, html);
        }

        return turnoGuardado;
    }

    // ── LISTAR TURNOS DE HOY ────────────────────────────────────────────────

    public List<Turno> obtenerTurnosDeHoy(String username) {
        LocalDateTime inicioHoy = LocalDate.now().atStartOfDay();
        LocalDateTime finHoy    = LocalDate.now().atTime(LocalTime.MAX);
        return turnoRepository.findTurnosDeHoy(username, inicioHoy, finHoy);
    }

    // ── LISTAR SALA DE ESPERA ───────────────────────────────────────────────

    public List<Turno> obtenerSalaDeEspera(String username) {
        return turnoRepository.findByMedico_UsernameAndEstadoOrderByFechaCreacionAsc(
                username, EstadoTurno.EN_SALA_DE_ESPERA);
    }

    // ── ACTUALIZAR ESTADO (workflow) ────────────────────────────────────────

    @Transactional
    public Turno actualizarEstado(Long turnoId, EstadoTurno nuevoEstado, String username) {
        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado. ID: " + turnoId));

        // Control de acceso multi-tenant
        if (!turno.getMedico().getUsername().equals(username)) {
            throw new RuntimeException("No tienes permiso para modificar este turno.");
        }

        turno.setEstado(nuevoEstado);
        return turnoRepository.save(turno);
    }

    // ── CANCELAR / ELIMINAR ─────────────────────────────────────────────────

    @Transactional
    public void cancelarTurno(Long turnoId, String username) {
        actualizarEstado(turnoId, EstadoTurno.CANCELADO, username);
    }

    // ── TODOS LOS TURNOS DEL MÉDICO (agenda completa) ──────────────────────

    public List<Turno> obtenerTodosMisTurnos(String username) {
        return turnoRepository.findByMedico_UsernameOrderByFechaHoraAsc(username);
    }
}
