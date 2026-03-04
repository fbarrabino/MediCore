package com.medico.backend.controller;

import com.medico.backend.model.Usuario;
import com.medico.backend.repository.UsuarioRepository;
import com.medico.backend.security.JwtUtil;
import com.medico.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        // Validamos usuario y contraseña (usando equals para legacy y matches para bcrypt)
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            boolean passwordMatch = false;

            // Compatibilidad hacia atrás: si la contraseña no está encriptada con bcrypt, comprobarla con equals.
            if (usuario.getPassword().startsWith("$2a$") || usuario.getPassword().startsWith("$2b$")) {
                passwordMatch = passwordEncoder.matches(password, usuario.getPassword());
            } else {
                passwordMatch = usuario.getPassword().equals(password);
            }

            if (passwordMatch) {
                // Check if account is verified
                if (!usuario.isVerificado()) {
                    return ResponseEntity.status(401).body(Map.of("error", "Cuenta no verificada. Por favor revisa tu correo electrónico para verificar tu cuenta antes de iniciar sesión."));
                }
                
                // ¡Credenciales correctas! Generamos el token y lo devolvemos
                String token = jwtUtil.generateToken(usuario.getUsername());
                return ResponseEntity.ok(Map.of(
                        "message", "Login exitoso",
                        "token", token,
                        "usuario", usuario
                ));
            }
        }
        
        return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint administrativo para resetear contraseña
    @PostMapping("/reset-password-admin")
    public ResponseEntity<?> resetPasswordAdmin(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String nuevaPassword = body.get("nuevaPassword");
            if (username == null || nuevaPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "username y nuevaPassword requeridos"));
            }
            usuarioService.resetPassword(username, nuevaPassword);
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada para: " + username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body, @RequestHeader(value = "referer", required = false) String referer) {
        try {
            String email = body.get("email");
            if (email == null) return ResponseEntity.badRequest().body("Email requerido");
            
            // Usamos el referer como frontend url base, o uno por defecto
            String frontendUrl = "http://localhost:5173"; 
            if (referer != null && !referer.isEmpty()) {
                 // Limpiar el referer para obtener solo el host
                 frontendUrl = referer.split("/")[0] + "//" + referer.split("/")[2];
            }

            usuarioService.generateResetToken(email, frontendUrl);
            return ResponseEntity.ok(Map.of("message", "Si el correo está registrado, se habrá enviado un link de recuperación."));
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("No existe un usuario registrado con este correo")) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                        .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            String nuevaPassword = body.get("nuevaPassword");
            if (token == null || nuevaPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "token y nuevaPassword requeridos"));
            }
            usuarioService.resetPasswordWithToken(token, nuevaPassword);
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint para listar todos los usuarios (verificación)
    @GetMapping("/usuarios")
    public ResponseEntity<?> listUsers() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/verificar")
    public ResponseEntity<?> verificarCuenta(@RequestParam String token) {
        boolean verificado = usuarioService.verificarUsuario(token);
        if (verificado) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
                                 .location(java.net.URI.create("http://localhost:5173/login?verified=true"))
                                 .build();
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "El token de verificación es inválido o expiró."));
        }
    }

    // Refrescar datos del usuario autenticado (para detectar cambios de plan)
    @GetMapping("/me")
    public ResponseEntity<?> me(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        return usuarioRepository.findByUsername(principal.getName())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Marcar que el banner de trial ya fue mostrado
    @PostMapping("/trial-banner-visto")
    public ResponseEntity<?> marcarTrialBannerVisto(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        return usuarioRepository.findByUsername(principal.getName())
                .map(u -> {
                    u.setTrialBannerMostrado(true);
                    usuarioRepository.save(u);
                    return ResponseEntity.<Object>ok(Map.of("ok", true));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
