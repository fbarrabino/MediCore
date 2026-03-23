package com.medico.backend.repository;

import com.medico.backend.model.Estudio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EstudioRepository extends JpaRepository<Estudio, Long> {
    List<Estudio> findByPacienteId(Long id);
}
