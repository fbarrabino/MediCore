package com.medico.backend.repository;

import com.medico.backend.model.Evolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvolucionRepository extends JpaRepository<Evolucion, Long> {
    List<Evolucion> findByPacienteIdOrderByFechaCargaDesc(Long pacienteId);
}