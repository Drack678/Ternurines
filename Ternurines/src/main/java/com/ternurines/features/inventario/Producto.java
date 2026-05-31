package com.ternurines.features.inventario;

import java.time.LocalDate;

/**
 * Modelo de producto comercial del inventario (no medicamentoso).
 */
public class Producto {
    private Integer idProducto;
    private Integer idAdministrador;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private LocalDate fechaVencimiento;

    /**
     * Devuelve el identificador del producto.
     *
     * @return identificador del producto
     */
    public Integer getIdProducto() {
        return idProducto;
    }

    /**
     * Establece el identificador del producto.
     *
     * @param idProducto identificador del producto
     */
    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
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
     * Devuelve el nombre del producto.
     *
     * @return nombre del producto
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre del producto.
     *
     * @param nombre nombre del producto
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Devuelve la descripción del producto.
     *
     * @return descripción del producto
     */
    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Establece la descripción del producto.
     *
     * @param descripcion descripción del producto
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    /**
     * Devuelve el precio del producto.
     *
     * @return precio unitario
     */
    public Double getPrecio() {
        return precio;
    }

    /**
     * Establece el precio del producto.
     *
     * @param precio precio unitario
     */
    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    /**
     * Devuelve la cantidad en stock del producto.
     *
     * @return stock disponible
     */
    public Integer getStock() {
        return stock;
    }

    /**
     * Establece la cantidad en stock del producto.
     *
     * @param stock stock disponible
     */
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    /**
     * Devuelve la fecha de vencimiento del producto.
     *
     * @return fecha de vencimiento
     */
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    /**
     * Establece la fecha de vencimiento del producto.
     *
     * @param fechaVencimiento fecha de vencimiento
     */
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
}
