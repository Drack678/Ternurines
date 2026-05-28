package com.ternurines.features.historial;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public class Tratamiento {
    private Integer idTratamiento;
    private Integer idHistorial;
    private Integer idMedicamento;
    private String descripcion;
    private String dosis;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String nombreMedicamento;

    public Integer getIdTratamiento() {
        return idTratamiento;
    }

    public void setIdTratamiento(Integer idTratamiento) {
        this.idTratamiento = idTratamiento;
    }

    @JsonProperty("id")
    public Integer getId() {
        return idTratamiento;
    }

    public Integer getIdHistorial() {
        return idHistorial;
    }

    public void setIdHistorial(Integer idHistorial) {
        this.idHistorial = idHistorial;
    }

    public Integer getIdMedicamento() {
        return idMedicamento;
    }

    public void setIdMedicamento(Integer idMedicamento) {
        this.idMedicamento = idMedicamento;
    }

    @JsonProperty("medicamento_id")
    public Integer getMedicamentoId() {
        return idMedicamento;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @JsonProperty("instrucciones")
    public String getInstrucciones() {
        return descripcion;
    }

    public String getDosis() {
        return dosis;
    }

    public void setDosis(String dosis) {
        this.dosis = dosis;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getNombreMedicamento() {
        return nombreMedicamento;
    }

    public void setNombreMedicamento(String nombreMedicamento) {
        this.nombreMedicamento = nombreMedicamento;
    }

    @JsonProperty("nombre")
    public String getNombre() {
        return nombreMedicamento;
    }
}
