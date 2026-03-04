package com.medico.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "Usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    private String nombre;
    private String apellido;

    @Column(name = "email")
    private String email;

    public enum PlanSuscripcion {
        PRUEBA, BASICO, PREMIUM
    }

    private LocalDate fechaFinSuscripcion;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_actual")
    private PlanSuscripcion planActual = PlanSuscripcion.PRUEBA;
    private String estadoPago;

    @Column(name = "pacientes_creados", columnDefinition = "integer default 0")
    private Integer pacientesCreados = 0;

    @Column(name = "fecha_inicio_suscripcion")
    private LocalDate fechaInicioSuscripcion;

    @Column(name = "trial_banner_mostrado", columnDefinition = "boolean default false")
    private Boolean trialBannerMostrado = false;

    @Column(name = "super_admin", columnDefinition = "boolean default false")
    private Boolean superAdmin = false;

    @Column(name = "recordatorios_activos", columnDefinition = "boolean default true")
    private Boolean recordatoriosActivos = true;

    @Column(name = "recordatorio_mensaje", columnDefinition = "TEXT")
    private String recordatorioMensaje;

    @Column(name = "estado", length = 30)
    private String estado = "PENDIENTE"; // PENDIENTE o ACTIVO

    @Column(name = "codigo_verificacion")
    private String codigoVerificacion;

    @Column(name = "verificado", columnDefinition = "boolean default false")
    private boolean verificado = false;

    // --- GETTERS (Para leer los datos) ---
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getEmail() { return email; }
    public LocalDate getFechaFinSuscripcion() { return fechaFinSuscripcion; }
    public PlanSuscripcion getPlanActual() { return planActual; }
    public String getEstadoPago() { return estadoPago; }
    public String getEstado() { return estado; }
    public String getCodigoVerificacion() { return codigoVerificacion; }
    public int getPacientesCreados() { return pacientesCreados != null ? pacientesCreados : 0; }
    public LocalDate getFechaInicioSuscripcion() { return fechaInicioSuscripcion; }
    public boolean isTrialBannerMostrado() { return trialBannerMostrado != null && trialBannerMostrado; }
    public boolean isSuperAdmin() { return superAdmin != null && superAdmin; }
    public boolean isRecordatoriosActivos() { return recordatoriosActivos == null || recordatoriosActivos; }
    public String getRecordatorioMensaje() { return recordatorioMensaje; }

    // --- SETTERS (Para guardar los datos) ---
    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public void setEmail(String email) { this.email = email; }
    public void setFechaFinSuscripcion(LocalDate fechaFinSuscripcion) { this.fechaFinSuscripcion = fechaFinSuscripcion; }
    public void setPlanActual(PlanSuscripcion planActual) { this.planActual = planActual; }
    public void setEstadoPago(String estadoPago) { this.estadoPago = estadoPago; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setCodigoVerificacion(String codigoVerificacion) { this.codigoVerificacion = codigoVerificacion; }
    public void setPacientesCreados(int pacientesCreados) { this.pacientesCreados = pacientesCreados; }
    public void setFechaInicioSuscripcion(LocalDate fechaInicioSuscripcion) { this.fechaInicioSuscripcion = fechaInicioSuscripcion; }
    public void setTrialBannerMostrado(boolean trialBannerMostrado) { this.trialBannerMostrado = trialBannerMostrado; }
    public void setSuperAdmin(boolean superAdmin) { this.superAdmin = superAdmin; }
    public void setRecordatoriosActivos(boolean recordatoriosActivos) { this.recordatoriosActivos = recordatoriosActivos; }
    public void setRecordatorioMensaje(String recordatorioMensaje) { this.recordatorioMensaje = recordatorioMensaje; }
    public boolean isVerificado() { return verificado; }
    public void setVerificado(boolean verificado) { this.verificado = verificado; }
}