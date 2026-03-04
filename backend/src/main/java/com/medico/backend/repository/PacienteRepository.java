package com.medico.backend.repository;

import com.medico.backend.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByDniAndMedico_Username(String dni, String username);
    Optional<Paciente> findByIdAndMedico_Username(Long id, String username);
    List<Paciente> findByMedico_Username(String username);
}