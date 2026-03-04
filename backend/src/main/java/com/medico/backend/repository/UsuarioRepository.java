package com.medico.backend.repository;

import com.medico.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByCodigoVerificacion(String codigoVerificacion);
    boolean existsByEmail(String email);
}