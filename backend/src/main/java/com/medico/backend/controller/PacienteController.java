package com.medico.backend.controller;

import com.medico.backend.model.Paciente;
import com.medico.backend.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(originPatterns = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    // Obtener todos los pacientes del médico logueado
    @GetMapping
    public List<Paciente> obtenerTodos(Principal principal) {
        return pacienteService.obtenerPacientesPorMedico(principal.getName());
    }

    // Buscar paciente por DNI del médico logueado
    @GetMapping("/dni/{dni}")
    public ResponseEntity<Paciente> obtenerPorDni(@PathVariable String dni, Principal principal) {
        return pacienteService.obtenerPorDniYMedico(dni, principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar paciente por ID del médico logueado
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> obtenerPorId(@PathVariable Long id, Principal principal) {
        return pacienteService.obtenerPorIdYMedico(id, principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREAR PACIENTE
    @PostMapping
    public ResponseEntity<?> guardarPaciente(@RequestBody Paciente paciente, Principal principal) {
        try {
            Paciente guardado = pacienteService.findOrCreatePaciente(paciente, principal.getName());
            return ResponseEntity.ok(guardado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Modificar paciente existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPaciente(@PathVariable Long id, @RequestBody Paciente pacienteDetalles, Principal principal) {
        pacienteDetalles.setId(id);
        try {
            Paciente actualizado = pacienteService.updatePaciente(pacienteDetalles, principal.getName());
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar paciente (solo si pertenece al médico logueado)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPaciente(@PathVariable Long id, Principal principal) {
        try {
            pacienteService.eliminarPaciente(id, principal.getName());
            return ResponseEntity.ok(Map.of("mensaje", "Paciente eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}