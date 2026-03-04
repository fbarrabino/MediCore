package com.medico.backend.config;

import com.medico.backend.model.Usuario;
import com.medico.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return args -> {

            // ─── admin.demo (superadmin de ejemplo, cambiar credenciales antes de producción) ──
            Usuario admin = usuarioRepository.findByUsername("admin.demo")
                    .orElse(new Usuario());
            admin.setNombre("Admin");
            admin.setApellido("Demo");
            admin.setUsername("admin.demo");
            admin.setPassword(encoder.encode("CambiarPassword123!"));
            admin.setEmail("admin@medicore.example");
            admin.setEstado("ACTIVO");
            admin.setPlanActual(Usuario.PlanSuscripcion.PREMIUM);
            admin.setEstadoPago("ACTIVO");
            admin.setFechaFinSuscripcion(LocalDate.of(2099, 12, 31));
            admin.setSuperAdmin(true);
            admin.setTrialBannerMostrado(true);
            usuarioRepository.save(admin);
            System.out.println("✅ admin.demo → SUPERADMIN / PREMIUM (sin vencimiento)");

            // ─── TEST: usuario.prueba (plan PRUEBA / trial 30 días) ─────────────────
            if (usuarioRepository.findByUsername("usuario.prueba").isEmpty()) {
                Usuario prueba = new Usuario();
                prueba.setNombre("Usuario");
                prueba.setApellido("Prueba");
                prueba.setUsername("usuario.prueba");
                prueba.setPassword(encoder.encode("test1234"));
                prueba.setEmail("prueba@medicore.com");
                prueba.setEstado("ACTIVO");
                prueba.setPlanActual(Usuario.PlanSuscripcion.PRUEBA);
                prueba.setEstadoPago("ACTIVO");
                prueba.setFechaInicioSuscripcion(LocalDate.now());
                prueba.setFechaFinSuscripcion(LocalDate.now().plusDays(30));
                prueba.setTrialBannerMostrado(false);
                usuarioRepository.save(prueba);
                System.out.println("✅ usuario.prueba creado → PRUEBA (30 días trial)");
            }

            // ─── TEST: usuario.basico (plan BÁSICO activo) ───────────────────────────
            if (usuarioRepository.findByUsername("usuario.basico").isEmpty()) {
                Usuario basico = new Usuario();
                basico.setNombre("Usuario");
                basico.setApellido("Básico");
                basico.setUsername("usuario.basico");
                basico.setPassword(encoder.encode("test1234"));
                basico.setEmail("basico@medicore.com");
                basico.setEstado("ACTIVO");
                basico.setPlanActual(Usuario.PlanSuscripcion.BASICO);
                basico.setEstadoPago("ACTIVO");
                basico.setFechaInicioSuscripcion(LocalDate.now().minusMonths(1));
                basico.setFechaFinSuscripcion(LocalDate.now().plusYears(1));
                basico.setTrialBannerMostrado(true);
                usuarioRepository.save(basico);
                System.out.println("✅ usuario.basico creado → BASICO (anual)");
            }

            // ─── TEST: usuario.premium (plan PREMIUM activo) ─────────────────────────
            if (usuarioRepository.findByUsername("usuario.premium").isEmpty()) {
                Usuario premium = new Usuario();
                premium.setNombre("Usuario");
                premium.setApellido("Premium");
                premium.setUsername("usuario.premium");
                premium.setPassword(encoder.encode("test1234"));
                premium.setEmail("premium@medicore.com");
                premium.setEstado("ACTIVO");
                premium.setPlanActual(Usuario.PlanSuscripcion.PREMIUM);
                premium.setEstadoPago("ACTIVO");
                premium.setFechaInicioSuscripcion(LocalDate.now().minusMonths(2));
                premium.setFechaFinSuscripcion(LocalDate.now().plusYears(1));
                premium.setTrialBannerMostrado(true);
                usuarioRepository.save(premium);
                System.out.println("✅ usuario.premium creado → PREMIUM (anual)");
            }
        };
    }
}