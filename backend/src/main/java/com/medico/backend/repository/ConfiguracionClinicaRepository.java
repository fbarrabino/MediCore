package com.medico.backend.repository;

import com.medico.backend.model.ConfiguracionClinica;
import com.medico.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConfiguracionClinicaRepository extends JpaRepository<ConfiguracionClinica, Long> {
    Optional<ConfiguracionClinica> findByUsuario(Usuario usuario);
    Optional<ConfiguracionClinica> findByUsuarioUsername(String username);
}
