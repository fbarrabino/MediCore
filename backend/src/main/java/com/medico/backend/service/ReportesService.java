package com.medico.backend.service;

import com.medico.backend.dto.ReportesDTO;
import com.medico.backend.model.Paciente;
import com.medico.backend.model.Turno;
import com.medico.backend.repository.PacienteRepository;
import com.medico.backend.repository.TurnoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportesService {

    private final PacienteRepository pacienteRepository;
    private final TurnoRepository turnoRepository;

    public ReportesDTO obtenerEstadisticas(String username, String periodo) {
        List<Paciente> pacientesRaw = pacienteRepository.findByMedico_Username(username);
        List<Turno> turnosRaw = turnoRepository.findByMedico_UsernameOrderByFechaHoraAsc(username);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fechaInicio = null;

        if ("mes_actual".equals(periodo)) {
            fechaInicio = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        } else if ("6_meses".equals(periodo)) {
            fechaInicio = now.minusMonths(5).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        }
        // "totalidad" remains null -> no filter

        final LocalDateTime filterStart = fechaInicio;
        List<Turno> turnosFiltrados = turnosRaw.stream()
                .filter(t -> filterStart == null || (t.getFechaHora() != null && !t.getFechaHora().isBefore(filterStart)))
                .toList();

        // Total Pacientes: Usually all-time count, but if the user wants "new patients this month"
        // let's stick to total registered for the medico unless otherwise specified.
        long totalPacientes = pacientesRaw.size();
        
        long atendidos = turnosFiltrados.stream().filter(t -> t.getEstado() == Turno.EstadoTurno.ATENDIDO).count();
        long ausentes = turnosFiltrados.stream().filter(t -> t.getEstado() == Turno.EstadoTurno.AUSENTE).count();
        long totalFinalizados = atendidos + ausentes;

        String tasaAusentismo = totalFinalizados == 0 ? "0%" : 
            String.format("%.1f%%", ((double) ausentes / totalFinalizados) * 100);

        return ReportesDTO.builder()
                .totalPacientes(totalPacientes)
                .turnosAtendidos(atendidos)
                .tasaAusentismo(tasaAusentismo)
                .turnosMensuales(generarHistorialMensual(turnosRaw, periodo))
                .turnosDiarios(generarHistorialDiario(turnosRaw))
                .demografiaEdades(generarDemografiaEdades(pacientesRaw))
                .build();
    }

    private List<Map<String, Object>> generarHistorialDiario(List<Turno> turnos) {
        LocalDateTime now = LocalDateTime.now();
        int diasEnMes = now.toLocalDate().lengthOfMonth();
        List<Map<String, Object>> historial = new ArrayList<>();

        for (int i = 1; i <= diasEnMes; i++) {
            final int dia = i;
            long atendidos = turnos.stream()
                .filter(t -> t.getEstado() == Turno.EstadoTurno.ATENDIDO)
                .filter(t -> t.getFechaHora() != null && 
                             t.getFechaHora().getDayOfMonth() == dia && 
                             t.getFechaHora().getMonth() == now.getMonth() && 
                             t.getFechaHora().getYear() == now.getYear())
                .count();

            long ausentes = turnos.stream()
                .filter(t -> t.getEstado() == Turno.EstadoTurno.AUSENTE)
                .filter(t -> t.getFechaHora() != null && 
                             t.getFechaHora().getDayOfMonth() == dia && 
                             t.getFechaHora().getMonth() == now.getMonth() && 
                             t.getFechaHora().getYear() == now.getYear())
                .count();

            Map<String, Object> dataDia = new HashMap<>();
            dataDia.put("dia", String.valueOf(dia));
            dataDia.put("atendidos", atendidos);
            dataDia.put("ausentes", ausentes);
            historial.add(dataDia);
        }
        return historial;
    }

    private List<Map<String, Object>> generarHistorialMensual(List<Turno> turnos, String periodo) {
        LocalDateTime now = LocalDateTime.now();
        List<Map<String, Object>> historial = new ArrayList<>();
        int mesesAtras = "totalidad".equals(periodo) ? 12 : 6; // Limit "total" to last 12 for chart readability or implement true all-time

        for (int i = mesesAtras - 1; i >= 0; i--) {
            LocalDateTime mesRef = now.minusMonths(i);
            String nombreMes = mesRef.getMonth().getDisplayName(TextStyle.SHORT, Locale.forLanguageTag("es-ES"));
            
            long atendidos = turnos.stream()
                .filter(t -> t.getEstado() == Turno.EstadoTurno.ATENDIDO)
                .filter(t -> t.getFechaHora() != null && t.getFechaHora().getMonth() == mesRef.getMonth() && t.getFechaHora().getYear() == mesRef.getYear())
                .count();

            long ausentes = turnos.stream()
                .filter(t -> t.getEstado() == Turno.EstadoTurno.AUSENTE)
                .filter(t -> t.getFechaHora() != null && t.getFechaHora().getMonth() == mesRef.getMonth() && t.getFechaHora().getYear() == mesRef.getYear())
                .count();

            Map<String, Object> dataMes = new HashMap<>();
            dataMes.put("mes", nombreMes.substring(0, 1).toUpperCase() + nombreMes.substring(1));
            dataMes.put("atendidos", atendidos);
            dataMes.put("ausentes", ausentes);
            historial.add(dataMes);
        }
        return historial;
    }

    private List<Map<String, Object>> generarDemografiaEdades(List<Paciente> pacientes) {
        long cat1 = 0; // 0-18
        long cat2 = 0; // 19-35
        long cat3 = 0; // 36-50
        long cat4 = 0; // 51+

        for (Paciente p : pacientes) {
            try {
                // Edad might be "45 años" or just "45"
                String edadStr = p.getEdad().replaceAll("[^0-9]", "");
                if (edadStr.isEmpty()) continue;
                int edad = Integer.parseInt(edadStr);
                if (edad <= 18) cat1++;
                else if (edad <= 35) cat2++;
                else if (edad <= 50) cat3++;
                else cat4++;
            } catch (Exception e) {
                // Ignore parsing errors
            }
        }

        List<Map<String, Object>> demografia = new ArrayList<>();
        demografia.add(createDemographyItem("0-18 años", cat1));
        demografia.add(createDemographyItem("19-35 años", cat2));
        demografia.add(createDemographyItem("36-50 años", cat3));
        demografia.add(createDemographyItem("51+ años", cat4));
        return demografia;
    }

    private Map<String, Object> createDemographyItem(String name, long value) {
        Map<String, Object> item = new HashMap<>();
        item.put("name", name);
        item.put("value", value);
        return item;
    }
}
