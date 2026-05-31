package com.ternurines.features.historial;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * Cuerpo de la petición para registrar un tratamiento en un historial existente.
 */
public class TratamientoRequest {

    @NotNull
    private Integer idMedicamento;

    @NotBlank
    private String descripcion;

    @NotBlank
    private String dosis;

    @NotNull
    private LocalDate fechaInicio;

    @NotNull
    private LocalDate fechaFin;

    /**
     * Devuelve el identificador del medicamento prescrito.
     *
     * @return identificador del medicamento
     */
    public Integer getIdMedicamento() {
        return idMedicamento;
    }

    /**
     * Establece el identificador del medicamento prescrito.
     *
     * @param idMedicamento identificador del medicamento
     */
    public void setIdMedicamento(Integer idMedicamento) {
        this.idMedicamento = idMedicamento;
    }

    /**
     * Devuelve la descripción o instrucciones del tratamiento.
     *
     * @return descripción del tratamiento
     */
    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Establece la descripción o instrucciones del tratamiento.
     *
     * @param descripcion descripción del tratamiento
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    /**
     * Devuelve la dosis indicada para el tratamiento.
     *
     * @return dosis prescrita
     */
    public String getDosis() {
        return dosis;
    }

    /**
     * Establece la dosis indicada para el tratamiento.
     *
     * @param dosis dosis prescrita
     */
    public void setDosis(String dosis) {
        this.dosis = dosis;
    }

    /**
     * Devuelve la fecha de inicio del tratamiento.
     *
     * @return fecha de inicio
     */
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    /**
     * Establece la fecha de inicio del tratamiento.
     *
     * @param fechaInicio fecha de inicio
     */
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    /**
     * Devuelve la fecha de fin del tratamiento.
     *
     * @return fecha de fin
     */
    public LocalDate getFechaFin() {
        return fechaFin;
    }

    /**
     * Establece la fecha de fin del tratamiento.
     *
     * @param fechaFin fecha de fin
     */
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
}
