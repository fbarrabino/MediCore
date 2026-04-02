package com.medico.backend.config;

import com.medico.backend.model.Usuario;
import com.medico.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StartupPatch implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        Optional<Usuario> adminOpt = usuarioRepository.findByUsername("franco.admin");
        if (adminOpt.isPresent()) {
            Usuario admin = adminOpt.get();
            if (!admin.isVerificado()) {
                admin.setVerificado(true);
                usuarioRepository.save(admin);
                System.out.println("PARCHE STARTUP: La cuenta 'franco.admin' ha sido verificada correctamente por el sistema.");
            }
        } else {
            System.out.println("PARCHE STARTUP: No se encontro el usuario 'franco.admin'.");
        }
    }
}
