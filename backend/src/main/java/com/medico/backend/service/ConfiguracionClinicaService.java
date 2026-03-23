package com.medico.backend.service;

import com.medico.backend.model.ConfiguracionClinica;
import com.medico.backend.model.Usuario;
import com.medico.backend.repository.ConfiguracionClinicaRepository;
import com.medico.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfiguracionClinicaService {

    @Autowired
    private ConfiguracionClinicaRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public ConfiguracionClinica obtenerConfiguracionPorUsername(String username) {
        return repository.findByUsuarioUsername(username)
                .orElseGet(() -> {
                    // Si no existe, crear una por defecto vinculada al usuario
                    Usuario usuario = usuarioRepository.findByUsername(username)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
                    ConfiguracionClinica nueva = new ConfiguracionClinica();
                    nueva.setUsuario(usuario);
                    nueva.setNombreInstitucion("Consultorio Dr/a. " + usuario.getApellido());
                    nueva.setHorariosJson("[{\"dia\":\"Lunes\",\"desde\":\"08:00\",\"hasta\":\"18:00\",\"activo\":true},{\"dia\":\"Martes\",\"desde\":\"08:00\",\"hasta\":\"18:00\",\"activo\":true},{\"dia\":\"Miércoles\",\"desde\":\"08:00\",\"hasta\":\"18:00\",\"activo\":true},{\"dia\":\"Jueves\",\"desde\":\"08:00\",\"hasta\":\"18:00\",\"activo\":true},{\"dia\":\"Viernes\",\"desde\":\"08:00\",\"hasta\":\"16:00\",\"activo\":true}]");
                    nueva.setPreferenciasJson("{\"whatsapp\":true,\"email\":true,\"sobreturnos\":false,\"duracion\":\"30 minutos\"}");
                    nueva.setThemePreference("light");
                    nueva.setColorPrincipal("#3b82f6");
                    return repository.save(nueva);
                });
    }


    @Transactional
    public ConfiguracionClinica guardarConfiguracion(String username, ConfiguracionClinica config) {
        ConfiguracionClinica existente = obtenerConfiguracionPorUsername(username);
        
        existente.setNombreInstitucion(config.getNombreInstitucion());
        existente.setDireccion(config.getDireccion());
        existente.setLocalidad(config.getLocalidad());
        existente.setTelefono(config.getTelefono());
        existente.setEmail(config.getEmail());
        existente.setHorariosJson(config.getHorariosJson());
        existente.setPreferenciasJson(config.getPreferenciasJson());
        if (config.getLogoUrl() != null) existente.setLogoUrl(config.getLogoUrl());
        existente.setColorPrincipal(config.getColorPrincipal());
        existente.setThemePreference(config.getThemePreference());

        return repository.save(existente);
    }
}
