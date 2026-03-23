package com.medico.backend.controller;

import com.medico.backend.dto.EstudioRequestDTO;
import com.medico.backend.model.Estudio;
import com.medico.backend.service.EstudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estudios")
@CrossOrigin(originPatterns = "*")
public class EstudioController {
    @Autowired
    private EstudioService service;

    @GetMapping("/paciente/{pacienteId}")
    public List<Estudio> listarPorPaciente(@PathVariable Long pacienteId) {
        return service.listarPorPaciente(pacienteId);
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody EstudioRequestDTO estudioDTO) {
        Estudio estudioGuardado = service.guardar(estudioDTO);
        return ResponseEntity.ok(Map.of(
            "mensaje", "Estudio guardado correctamente",
            "estudio", estudioGuardado
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
