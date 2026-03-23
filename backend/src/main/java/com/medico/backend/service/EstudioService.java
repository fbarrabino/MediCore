package com.medico.backend.service;

import com.medico.backend.dto.EstudioRequestDTO;
import com.medico.backend.model.Estudio;
import com.medico.backend.model.Paciente;
import com.medico.backend.repository.EstudioRepository;
import com.medico.backend.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class EstudioService {
    @Autowired
    private EstudioRepository repository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public List<Estudio> listarPorPaciente(Long pacienteId) {
        return repository.findByPacienteId(pacienteId);
    }

    public Estudio guardar(EstudioRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Estudio estudio = new Estudio();
        estudio.setPaciente(paciente);
        estudio.setTipo(dto.getTipo());
        estudio.setFecha(dto.getFecha());
        estudio.setDescripcion(dto.getDescripcion());
        estudio.setArchivoUrl(dto.getArchivoUrl());

        return repository.save(estudio);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
