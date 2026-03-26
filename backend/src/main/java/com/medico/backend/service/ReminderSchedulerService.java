package com.medico.backend.service;

import com.medico.backend.model.Turno;
import com.medico.backend.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReminderSchedulerService {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void enviarRecordatoriosTurnos() {
        LocalDateTime inicioMañana = LocalDate.now().plusDays(1).atStartOfDay();
        LocalDateTime finMañana    = LocalDate.now().plusDays(1).atTime(LocalTime.MAX);

        List<Turno> turnosPendientes = turnoRepository.findTurnosParaRecordatorio(inicioMañana, finMañana);

        System.out.println("[Recordatorios] Procesando " + turnosPendientes.size() + " turno(s) para " + inicioMañana.toLocalDate());

        for (Turno turno : turnosPendientes) {
            enviarIndividual(turno);
        }
    }

    @Transactional
    public void ejecutarAhora() {
        LocalDateTime inicioManana = LocalDate.now().plusDays(1).atStartOfDay();
        LocalDateTime finManana    = LocalDate.now().plusDays(1).atTime(LocalTime.MAX);

        List<Turno> turnosPendientes = turnoRepository.findTurnosParaRecordatorio(inicioManana, finManana);

        System.out.println("[Test Manual] Procesando " + turnosPendientes.size() + " turno(s) para el día de mañana (" + inicioManana.toLocalDate() + ")");

        for (Turno turno : turnosPendientes) {
            enviarIndividual(turno);
        }
    }

    private void enviarIndividual(Turno turno) {
        String email = turno.getPaciente().getEmailPaciente();
        String nombre = turno.getPaciente().getNombre();
        LocalDateTime fechaHora = turno.getFechaHora();

        try {
            emailService.enviarRecordatorioTurno(email, nombre, fechaHora);
            turno.setRecordatorioEnviado(true);
            turnoRepository.save(turno);
            System.out.println("[Recordatorios] ✓ Recordatorio enviado a: " + email + " para turno el " + fechaHora);
        } catch (Exception e) {
            System.err.println("[Recordatorios] ✗ Error al enviar a " + email + ": " + e.getMessage());
        }
    }
}
