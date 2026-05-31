package com.ternurines.features.historial;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Respuesta de historial médico con datos de mascota, veterinario y tratamientos.
 * Expone alias JSON para compatibilidad con el frontend.
 */
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

    /**
     * Devuelve el identificador interno del historial médico.
     *
     * @return identificador del historial
     */
    public Integer getIdHistorial() {
        return idHistorial;
    }

    /**
     * Establece el identificador interno del historial médico.
     *
     * @param idHistorial identificador del historial
     */
    public void setIdHistorial(Integer idHistorial) {
        this.idHistorial = idHistorial;
    }

    /**
     * Devuelve el identificador del historial para la API JSON.
     *
     * @return identificador expuesto como id
     */
    @JsonProperty("id")
    public Integer getId() {
        return idHistorial;
    }

    /**
     * Devuelve el identificador de la mascota del historial.
     *
     * @return identificador de la mascota
     */
    public Integer getIdMascota() {
        return idMascota;
    }

    /**
     * Establece el identificador de la mascota del historial.
     *
     * @param idMascota identificador de la mascota
     */
    public void setIdMascota(Integer idMascota) {
        this.idMascota = idMascota;
    }

    /**
     * Devuelve el identificador de la mascota para la API JSON.
     *
     * @return identificador expuesto como mascota_id
     */
    @JsonProperty("mascota_id")
    public Integer getMascotaId() {
        return idMascota;
    }

    /**
     * Devuelve el identificador del veterinario responsable.
     *
     * @return identificador del veterinario
     */
    public Integer getIdVeterinario() {
        return idVeterinario;
    }

    /**
     * Establece el identificador del veterinario responsable.
     *
     * @param idVeterinario identificador del veterinario
     */
    public void setIdVeterinario(Integer idVeterinario) {
        this.idVeterinario = idVeterinario;
    }

    /**
     * Devuelve el identificador del veterinario para la API JSON.
     *
     * @return identificador expuesto como veterinario_id
     */
    @JsonProperty("veterinario_id")
    public Integer getVeterinarioId() {
        return idVeterinario;
    }

    /**
     * Devuelve el nombre de la mascota.
     *
     * @return nombre de la mascota
     */
    public String getMascota() {
        return mascota;
    }

    /**
     * Establece el nombre de la mascota.
     *
     * @param mascota nombre de la mascota
     */
    public void setMascota(String mascota) {
        this.mascota = mascota;
    }

    /**
     * Devuelve el nombre de la mascota para la API JSON.
     *
     * @return nombre expuesto como mascota_nombre
     */
    @JsonProperty("mascota_nombre")
    public String getMascotaNombre() {
        return mascota;
    }

    /**
     * Devuelve el nombre del veterinario responsable.
     *
     * @return nombre del veterinario
     */
    public String getVeterinario() {
        return veterinario;
    }

    /**
     * Establece el nombre del veterinario responsable.
     *
     * @param veterinario nombre del veterinario
     */
    public void setVeterinario(String veterinario) {
        this.veterinario = veterinario;
    }

    /**
     * Devuelve el nombre del veterinario para la API JSON.
     *
     * @return nombre expuesto como veterinario_nombre
     */
    @JsonProperty("veterinario_nombre")
    public String getVeterinarioNombre() {
        return veterinario;
    }

    /**
     * Devuelve la fecha del registro clínico.
     *
     * @return fecha del historial
     */
    public LocalDate getFecha() {
        return fecha;
    }

    /**
     * Establece la fecha del registro clínico.
     *
     * @param fecha fecha del historial
     */
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    /**
     * Devuelve el diagnóstico registrado.
     *
     * @return diagnóstico clínico
     */
    public String getDiagnostico() {
        return diagnostico;
    }

    /**
     * Establece el diagnóstico registrado.
     *
     * @param diagnostico diagnóstico clínico
     */
    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    /**
     * Devuelve las observaciones adicionales del historial.
     *
     * @return observaciones clínicas
     */
    public String getObservaciones() {
        return observaciones;
    }

    /**
     * Establece las observaciones adicionales del historial.
     *
     * @param observaciones observaciones clínicas
     */
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    /**
     * Devuelve las observaciones para la API JSON.
     *
     * @return observaciones expuestas como notas
     */
    @JsonProperty("notas")
    public String getNotas() {
        return observaciones;
    }

    /**
     * Devuelve la lista de tratamientos asociados al historial.
     *
     * @return tratamientos del historial
     */
    public List<Tratamiento> getTratamientos() {
        return tratamientos;
    }

    /**
     * Establece la lista de tratamientos asociados al historial.
     *
     * @param tratamientos tratamientos del historial
     */
    public void setTratamientos(List<Tratamiento> tratamientos) {
        this.tratamientos = tratamientos;
    }

    /**
     * Genera un texto resumido de todos los tratamientos para la vista de listado.
     *
     * @return resumen concatenado de tratamientos, o null si no hay ninguno
     */
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

    /**
     * Devuelve los tratamientos para la API JSON bajo la clave medicamentos.
     *
     * @return lista de tratamientos expuesta como medicamentos
     */
    @JsonProperty("medicamentos")
    public List<Tratamiento> getMedicamentos() {
        return tratamientos;
    }
}
