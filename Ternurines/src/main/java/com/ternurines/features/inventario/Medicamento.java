package com.ternurines.features.inventario;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

/**
 * Modelo de medicamento del inventario con precio, stock y fecha de vencimiento.
 */
public class Medicamento {
    private Integer idMedicamento;
    private Integer idAdministrador;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private LocalDate fechaVencimiento;

    /**
     * Devuelve el identificador interno del medicamento.
     *
     * @return identificador del medicamento
     */
    public Integer getIdMedicamento() {
        return idMedicamento;
    }

    /**
     * Establece el identificador interno del medicamento.
     *
     * @param idMedicamento identificador del medicamento
     */
    public void setIdMedicamento(Integer idMedicamento) {
        this.idMedicamento = idMedicamento;
    }

    /**
     * Devuelve el identificador del medicamento para la API JSON.
     *
     * @return identificador expuesto como id
     */
    @JsonProperty("id")
    public Integer getId() {
        return idMedicamento;
    }

    /**
     * Devuelve el identificador del administrador responsable.
     *
     * @return identificador del administrador
     */
    public Integer getIdAdministrador() {
        return idAdministrador;
    }

    /**
     * Establece el identificador del administrador responsable.
     *
     * @param idAdministrador identificador del administrador
     */
    public void setIdAdministrador(Integer idAdministrador) {
        this.idAdministrador = idAdministrador;
    }

    /**
     * Devuelve el nombre del medicamento.
     *
     * @return nombre del medicamento
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre del medicamento.
     *
     * @param nombre nombre del medicamento
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Devuelve la descripción del medicamento.
     *
     * @return descripción del medicamento
     */
    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Establece la descripción del medicamento.
     *
     * @param descripcion descripción del medicamento
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    /**
     * Devuelve el precio del medicamento.
     *
     * @return precio unitario
     */
    public Double getPrecio() {
        return precio;
    }

    /**
     * Establece el precio del medicamento.
     *
     * @param precio precio unitario
     */
    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    /**
     * Devuelve la cantidad en stock del medicamento.
     *
     * @return stock disponible
     */
    public Integer getStock() {
        return stock;
    }

    /**
     * Establece la cantidad en stock del medicamento.
     *
     * @param stock stock disponible
     */
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    /**
     * Devuelve la fecha de vencimiento del medicamento.
     *
     * @return fecha de vencimiento
     */
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    /**
     * Establece la fecha de vencimiento del medicamento.
     *
     * @param fechaVencimiento fecha de vencimiento
     */
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
}
