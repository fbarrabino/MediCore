package com.medico.backend.service;

import com.medico.backend.model.Usuario;
import com.medico.backend.model.PasswordResetToken;
import com.medico.backend.repository.UsuarioRepository;
import com.medico.backend.repository.PasswordResetTokenRepository;
import com.medico.backend.model.TokenVerificacion;
import com.medico.backend.repository.TokenVerificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private TokenVerificacionRepository tokenVerificacionRepository;

    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        Optional<Usuario> existente = usuarioRepository.findByUsername(usuario.getUsername());
        if (existente.isPresent()) {
            throw new RuntimeException("El nombre de usuario ya existe.");
        }
        
        if (usuario.getEmail() != null && usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está registrado.");
        }
        
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        
        // Subscription Config
        usuario.setPlanActual(Usuario.PlanSuscripcion.PRUEBA);
        usuario.setEstadoPago("AL_DIA");
        usuario.setFechaFinSuscripcion(LocalDate.now().plusDays(30));
        
        // Verification Config
        usuario.setEstado("PENDIENTE");
        usuario.setVerificado(false); // Reforzando lo pedido
        // El codigoVerificacion ya no se usa acá, usamos TokenVerificacion
        usuario.setCodigoVerificacion(null);

        Usuario guardado = usuarioRepository.save(usuario);
        
        String tokenUuid = UUID.randomUUID().toString();
        TokenVerificacion tv = new TokenVerificacion(tokenUuid, guardado);
        tokenVerificacionRepository.save(tv);
        
        if (usuario.getEmail() != null) {
            emailService.enviarCorreoVerificacion(usuario.getEmail(), tokenUuid);
        }
        
        return guardado;
    }

    public void resetPassword(String username, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
    }
    
    @Transactional
    public boolean verificarUsuario(String tokenStr) {
        Optional<TokenVerificacion> tokenOpt = tokenVerificacionRepository.findByToken(tokenStr);
        if (tokenOpt.isPresent()) {
            TokenVerificacion token = tokenOpt.get();
            if (token.isExpired()) {
                tokenVerificacionRepository.delete(token); // Limpiar expirado
                return false;
            }
            Usuario usuario = token.getUsuario();
            usuario.setEstado("ACTIVO");
            usuario.setVerificado(true);
            usuario.setCodigoVerificacion(null); // por compatibilidad
            usuarioRepository.save(usuario);
            tokenVerificacionRepository.delete(token);
            return true;
        }
        return false;
    }

    @Transactional
    public void generateResetToken(String email, String frontendUrl) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No existe un usuario registrado con este correo."));

        // Eliminar tokens previos si existen
        tokenRepository.findByUsuario(usuario).ifPresent(tokenRepository::delete);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, usuario);
        tokenRepository.save(resetToken);

        try {
            emailService.sendResetPasswordEmail(usuario.getEmail(), token, frontendUrl);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo de recuperación.");
        }
    }

    @Transactional
    public void resetPasswordWithToken(String token, String nuevaPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token de recuperación inválido."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("El token ha expirado. Por favor solicita uno nuevo.");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);

        // Limpiar el token después de usarlo
        tokenRepository.delete(resetToken);
    }
}

