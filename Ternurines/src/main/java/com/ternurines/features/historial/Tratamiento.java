package com.ternurines.features.historial;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

/**
 * Registro de un tratamiento asociado a un historial médico.
 */
public class Tratamiento {
    private Integer idTratamiento;
    private Integer idHistorial;
    private Integer idMedicamento;
    private String descripcion;
    private String dosis;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String nombreMedicamento;

    /**
     * Devuelve el identificador interno del tratamiento.
     *
     * @return identificador del tratamiento
     */
    public Integer getIdTratamiento() {
        return idTratamiento;
    }

    /**
     * Establece el identificador interno del tratamiento.
     *
     * @param idTratamiento identificador del tratamiento
     */
    public void setIdTratamiento(Integer idTratamiento) {
        this.idTratamiento = idTratamiento;
    }

    /**
     * Devuelve el identificador del tratamiento para la API JSON.
     *
     * @return identificador expuesto como id
     */
    @JsonProperty("id")
    public Integer getId() {
        return idTratamiento;
    }

    /**
     * Devuelve el identificador del historial médico asociado.
     *
     * @return identificador del historial
     */
    public Integer getIdHistorial() {
        return idHistorial;
    }

    /**
     * Establece el identificador del historial médico asociado.
     *
     * @param idHistorial identificador del historial
     */
    public void setIdHistorial(Integer idHistorial) {
        this.idHistorial = idHistorial;
    }

    /**
     * Devuelve el identificador interno del medicamento prescrito.
     *
     * @return identificador del medicamento
     */
    public Integer getIdMedicamento() {
        return idMedicamento;
    }

    /**
     * Establece el identificador interno del medicamento prescrito.
     *
     * @param idMedicamento identificador del medicamento
     */
    public void setIdMedicamento(Integer idMedicamento) {
        this.idMedicamento = idMedicamento;
    }

    /**
     * Devuelve el identificador del medicamento para la API JSON.
     *
     * @return identificador expuesto como medicamento_id
     */
    @JsonProperty("medicamento_id")
    public Integer getMedicamentoId() {
        return idMedicamento;
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
     * Devuelve las instrucciones del tratamiento para la API JSON.
     *
     * @return descripción expuesta como instrucciones
     */
    @JsonProperty("instrucciones")
    public String getInstrucciones() {
        return descripcion;
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

    /**
     * Devuelve el nombre del medicamento asociado al tratamiento.
     *
     * @return nombre del medicamento
     */
    public String getNombreMedicamento() {
        return nombreMedicamento;
    }

    /**
     * Establece el nombre del medicamento asociado al tratamiento.
     *
     * @param nombreMedicamento nombre del medicamento
     */
    public void setNombreMedicamento(String nombreMedicamento) {
        this.nombreMedicamento = nombreMedicamento;
    }

    /**
     * Devuelve el nombre del medicamento para la API JSON.
     *
     * @return nombre expuesto como nombre
     */
    @JsonProperty("nombre")
    public String getNombre() {
        return nombreMedicamento;
    }
}
