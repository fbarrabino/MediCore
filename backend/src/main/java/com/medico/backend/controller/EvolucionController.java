package com.medico.backend.controller;

import com.medico.backend.dto.EvolucionRequestDTO;
import com.medico.backend.model.Evolucion;
import com.medico.backend.repository.EvolucionRepository;
import com.medico.backend.service.EvolucionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evoluciones")
@CrossOrigin(originPatterns = "*") // <--- ACÁ ESTÁ EL CAMBIO PARA PERMITIR A VERCEL
public class EvolucionController {

    @Autowired
    private EvolucionService evolucionService;

    @Autowired
    private EvolucionRepository evolucionRepository;

    @PostMapping
    public ResponseEntity<?> guardarEvolucion(@RequestBody EvolucionRequestDTO request) {
        Evolucion evolucionGuardada = evolucionService.guardarEvolucion(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Evolución guardada correctamente", "evolucion", evolucionGuardada));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Evolucion>> obtenerHistorial(@PathVariable Long pacienteId) {
        List<Evolucion> historial = evolucionRepository.findByPacienteIdOrderByFechaCargaDesc(pacienteId);
        return ResponseEntity.ok(historial);
    }

    // NUEVO: Endpoint para modificar una evolución existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEvolucion(@PathVariable Long id, @RequestBody EvolucionRequestDTO request) {
        return evolucionRepository.findById(id).map(evolucion -> {
            // Actualizamos los campos con los datos nuevos
            evolucion.setMotivoConsulta(request.getMotivoConsulta());
            evolucion.setAntecedentesEnfermedadActual(request.getAntecedentesEnfermedadActual());
            evolucion.setAntecedentesGenerales(request.getAntecedentesGenerales());
            evolucion.setEstudiosComplementarios(request.getEstudiosComplementarios());
            evolucion.setDiagnostico(request.getDiagnostico());
            evolucion.setIndicaciones(request.getIndicaciones());
            
            evolucionRepository.save(evolucion);
            return ResponseEntity.ok(Map.of("mensaje", "Evolución actualizada correctamente"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Evolución no encontrada")));
    }

    // NUEVO: Endpoint para eliminar una evolución
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEvolucion(@PathVariable Long id) {
        return evolucionRepository.findById(id).map(evolucion -> {
            evolucionRepository.delete(evolucion);
            return ResponseEntity.ok(Map.of("mensaje", "Evolución eliminada correctamente"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Evolución no encontrada")));
    }
}