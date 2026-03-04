package com.medico.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medico.backend.dto.EvolucionRequestDTO;
import com.medico.backend.model.Evolucion;
import com.medico.backend.model.Paciente;
import com.medico.backend.repository.EvolucionRepository;
import com.medico.backend.repository.PacienteRepository;

@Service
public class EvolucionService {

    @Autowired
    private EvolucionRepository evolucionRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Transactional
    public Evolucion guardarEvolucion(EvolucionRequestDTO request) {
        Evolucion evolucion = new Evolucion();

        // Buscamos el paciente en la BD
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        evolucion.setPaciente(paciente);
        evolucion.setMotivoConsulta(request.getMotivoConsulta());
        evolucion.setAntecedentesEnfermedadActual(request.getAntecedentesEnfermedadActual());
        evolucion.setAntecedentesGenerales(request.getAntecedentesGenerales());
        evolucion.setEstudiosComplementarios(request.getEstudiosComplementarios());
        evolucion.setDiagnostico(request.getDiagnostico());
        evolucion.setIndicaciones(request.getIndicaciones());

        // Guardamos la fecha actual automáticamente
        evolucion.setFechaCarga(java.time.LocalDateTime.now());

        return evolucionRepository.save(evolucion);
    }
}