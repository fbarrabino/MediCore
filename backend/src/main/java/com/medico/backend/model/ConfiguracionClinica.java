package com.medico.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ConfiguracionClinica")
@Data
public class ConfiguracionClinica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;

    private String nombreInstitucion;
    private String direccion;
    private String localidad;
    private String telefono;
    private String email;

    @Column(columnDefinition = "TEXT")
    private String horariosJson;

    @Column(columnDefinition = "TEXT")
    private String preferenciasJson;

    private String logoUrl;
    private String colorPrincipal;
    private String themePreference; // "light" or "dark"

    // Default constructor for JPA
    public ConfiguracionClinica() {}

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public String getNombreInstitucion() { return nombreInstitucion; }
    public String getDireccion() { return direccion; }
    public String getLocalidad() { return localidad; }
    public String getTelefono() { return telefono; }
    public String getEmail() { return email; }
    public String getHorariosJson() { return horariosJson; }
    public String getPreferenciasJson() { return preferenciasJson; }
    public String getLogoUrl() { return logoUrl; }
    public String getColorPrincipal() { return colorPrincipal; }
    public String getThemePreference() { return themePreference; }

    public void setId(Long id) { this.id = id; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public void setNombreInstitucion(String nombreInstitucion) { this.nombreInstitucion = nombreInstitucion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public void setLocalidad(String localidad) { this.localidad = localidad; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public void setEmail(String email) { this.email = email; }
    public void setHorariosJson(String horariosJson) { this.horariosJson = horariosJson; }
    public void setPreferenciasJson(String preferenciasJson) { this.preferenciasJson = preferenciasJson; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public void setColorPrincipal(String colorPrincipal) { this.colorPrincipal = colorPrincipal; }
    public void setThemePreference(String themePreference) { this.themePreference = themePreference; }
}
