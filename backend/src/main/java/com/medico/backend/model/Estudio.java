package com.medico.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "paciente_estudios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    @JsonIgnore
    private Paciente paciente;

    private String tipo; // "Resonancia", "Radiografía", "Foto", etc.
    private String fecha; // ISO String
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String archivoUrl; // Base64 for now
}
