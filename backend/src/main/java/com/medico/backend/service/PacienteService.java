package com.medico.backend.service;

import com.medico.backend.model.Paciente;
import com.medico.backend.model.Usuario;
import com.medico.backend.repository.PacienteRepository;
import com.medico.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Paciente> obtenerPacientesPorMedico(String username) {
        return pacienteRepository.findByMedico_Username(username);
    }

    public Optional<Paciente> obtenerPorDniYMedico(String dni, String username) {
        return pacienteRepository.findByDniAndMedico_Username(dni, username);
    }

    public Optional<Paciente> obtenerPorIdYMedico(Long id, String username) {
        return pacienteRepository.findByIdAndMedico_Username(id, username);
    }

    @Transactional
    public Paciente findOrCreatePaciente(Paciente request, String username) {
        Usuario medico = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Médico logueado no encontrado en la Base de Datos"));

        // Verificar si el paciente ya existe (actualización)
        Optional<Paciente> existente = pacienteRepository.findByDniAndMedico_Username(request.getDni(), username);
        boolean esNuevo = existente.isEmpty();

        // --- CONTROL DE LÍMITE PLAN BÁSICO ---
        if (esNuevo && "BASICO".equals(medico.getPlanActual())) {
            if (medico.getPacientesCreados() >= 200) {
                throw new RuntimeException("LIMITE_ALCANZADO: Has alcanzado el límite de 200 pacientes del Plan Básico. Upgradea a Premium para continuar.");
            }
        }

        Paciente paciente = existente.orElseGet(() -> {
            Paciente nuevo = new Paciente();
            nuevo.setDni(request.getDni());
            nuevo.setMedico(medico);
            return nuevo;
        });

        // Actualizamos los datos
        paciente.setNombre(request.getNombre());
        paciente.setObraSocial(request.getObraSocial());
        paciente.setDireccionBarrio(request.getDireccionBarrio());
        paciente.setContactoFamiliar(request.getContactoFamiliar());
        paciente.setTelefono(request.getTelefono());
        paciente.setEdad(request.getEdad());
        paciente.setAlergiasAlertas(request.getAlergiasAlertas());
        if (request.getEmailPaciente() != null) {
            paciente.setEmailPaciente(request.getEmailPaciente());
        }

        Paciente guardado = pacienteRepository.save(paciente);

        // Incrementar contador solo si es paciente nuevo (nunca decrementa)
        if (esNuevo) {
            medico.setPacientesCreados(medico.getPacientesCreados() + 1);
            usuarioRepository.save(medico);
        }

        return guardado;
    }

    @Transactional
    public Paciente updatePaciente(Paciente paciente, String username) {
        return pacienteRepository.findByIdAndMedico_Username(paciente.getId(), username)
                .map(existente -> {
                    if (paciente.getDni() != null)
                        existente.setDni(paciente.getDni());
                    if (paciente.getNombre() != null)
                        existente.setNombre(paciente.getNombre());
                    if (paciente.getObraSocial() != null)
                        existente.setObraSocial(paciente.getObraSocial());
                    if (paciente.getDireccionBarrio() != null)
                        existente.setDireccionBarrio(paciente.getDireccionBarrio());
                    if (paciente.getContactoFamiliar() != null)
                        existente.setContactoFamiliar(paciente.getContactoFamiliar());
                    if (paciente.getTelefono() != null)
                        existente.setTelefono(paciente.getTelefono());
                    if (paciente.getEdad() != null)
                        existente.setEdad(paciente.getEdad());
                    if (paciente.getAlergiasAlertas() != null)
                        existente.setAlergiasAlertas(paciente.getAlergiasAlertas());
                    if (paciente.getEmailPaciente() != null)
                        existente.setEmailPaciente(paciente.getEmailPaciente());
                    return pacienteRepository.save(existente);
                })
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado o no estás autorizado para modificarlo."));
    }

    @Transactional
    public void eliminarPaciente(Long id, String username) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        if (!paciente.getMedico().getUsername().equals(username)) {
            throw new RuntimeException("No tienes permiso para eliminar este paciente");
        }
        // NOTA: NO restamos pacientesCreados al borrar. Es intencional para evitar
        // que se "resetee" el conteo borrando y volviendo a crear pacientes.
        pacienteRepository.delete(paciente);
    }
}