package com.medico.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Pacientes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"dni", "usuario_id"})
})
@Data
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dni;
    private String nombre;
    private String obraSocial;
    private String direccionBarrio;
    private String contactoFamiliar;
    private String edad;
    private String telefono;

    @Column(name = "email_paciente")
    private String emailPaciente;

    @Column(columnDefinition = "TEXT")
    private String alergiasAlertas;

    @JsonIgnore // <--- ACÁ ESTÁ LA MAGIA QUE CORTA EL BUCLE INFINITO
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario medico;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getObraSocial() {
        return obraSocial;
    }

    public void setObraSocial(String obraSocial) {
        this.obraSocial = obraSocial;
    }

    public String getDireccionBarrio() {
        return direccionBarrio;
    }

    public void setDireccionBarrio(String direccionBarrio) {
        this.direccionBarrio = direccionBarrio;
    }

    public String getContactoFamiliar() {
        return contactoFamiliar;
    }

    public void setContactoFamiliar(String contactoFamiliar) {
        this.contactoFamiliar = contactoFamiliar;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEdad() {
        return edad;
    }

    public void setEdad(String edad) {
        this.edad = edad;
    }

    public String getEmailPaciente() {
        return emailPaciente;
    }

    public void setEmailPaciente(String emailPaciente) {
        this.emailPaciente = emailPaciente;
    }

    public String getAlergiasAlertas() {
        return alergiasAlertas;
    }

    public void setAlergiasAlertas(String alergiasAlertas) {
        this.alergiasAlertas = alergiasAlertas;
    }

    public Usuario getMedico() {
        return medico;
    }

    public void setMedico(Usuario medico) {
        this.medico = medico;
    }
}