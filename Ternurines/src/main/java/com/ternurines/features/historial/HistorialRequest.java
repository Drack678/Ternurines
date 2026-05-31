package com.ternurines.features.historial;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Cuerpo de la petición para crear un nuevo registro de historial médico.
 */
public class HistorialRequest {

    @NotNull
    private Integer idMascota;

    @NotNull
    private Integer idVeterinario;

    @NotBlank
    private String diagnostico;

    private String observaciones;

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
     * Devuelve el diagnóstico clínico registrado.
     *
     * @return diagnóstico del historial
     */
    public String getDiagnostico() {
        return diagnostico;
    }

    /**
     * Establece el diagnóstico clínico registrado.
     *
     * @param diagnostico diagnóstico del historial
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
}
