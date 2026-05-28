package com.ternurines.features.historial;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class HistorialResponse {
    private Integer idHistorial;
    private Integer idMascota;
    private Integer idVeterinario;
    private String mascota;
    private String veterinario;
    private LocalDate fecha;
    private String diagnostico;
    private String observaciones;
    private List<Tratamiento> tratamientos = new ArrayList<>();

    public Integer getIdHistorial() {
        return idHistorial;
    }

    public void setIdHistorial(Integer idHistorial) {
        this.idHistorial = idHistorial;
    }

    @JsonProperty("id")
    public Integer getId() {
        return idHistorial;
    }

    public Integer getIdMascota() {
        return idMascota;
    }

    public void setIdMascota(Integer idMascota) {
        this.idMascota = idMascota;
    }

    @JsonProperty("mascota_id")
    public Integer getMascotaId() {
        return idMascota;
    }

    public Integer getIdVeterinario() {
        return idVeterinario;
    }

    public void setIdVeterinario(Integer idVeterinario) {
        this.idVeterinario = idVeterinario;
    }

    @JsonProperty("veterinario_id")
    public Integer getVeterinarioId() {
        return idVeterinario;
    }

    public String getMascota() {
        return mascota;
    }

    public void setMascota(String mascota) {
        this.mascota = mascota;
    }

    @JsonProperty("mascota_nombre")
    public String getMascotaNombre() {
        return mascota;
    }

    public String getVeterinario() {
        return veterinario;
    }

    public void setVeterinario(String veterinario) {
        this.veterinario = veterinario;
    }

    @JsonProperty("veterinario_nombre")
    public String getVeterinarioNombre() {
        return veterinario;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    @JsonProperty("notas")
    public String getNotas() {
        return observaciones;
    }

    public List<Tratamiento> getTratamientos() {
        return tratamientos;
    }

    public void setTratamientos(List<Tratamiento> tratamientos) {
        this.tratamientos = tratamientos;
    }

    @JsonProperty("tratamiento")
    public String getTratamientoResumen() {
        if (tratamientos == null || tratamientos.isEmpty()) {
            return null;
        }
        return tratamientos.stream()
                .map(t -> {
                    String nombre = t.getNombreMedicamento() == null ? "Medicamento" : t.getNombreMedicamento();
                    String descripcion = t.getDescripcion() == null ? "" : ": " + t.getDescripcion();
                    String dosis = t.getDosis() == null ? "" : " (" + t.getDosis() + ")";
                    return nombre + descripcion + dosis;
                })
                .reduce((a, b) -> a + "\n" + b)
                .orElse(null);
    }

    @JsonProperty("medicamentos")
    public List<Tratamiento> getMedicamentos() {
        return tratamientos;
    }
}
