package com.ternurines.features.historial;

/**
 * Referencia ligera a un medicamento del inventario para asignarlo a un tratamiento.
 */
public class MedicamentoRef {
    private Integer idMedicamento;
    private String nombre;
    private Integer stock;
    private Double precio;

    /**
     * Devuelve el identificador del medicamento.
     *
     * @return identificador del medicamento
     */
    public Integer getIdMedicamento() {
        return idMedicamento;
    }

    /**
     * Establece el identificador del medicamento.
     *
     * @param idMedicamento identificador del medicamento
     */
    public void setIdMedicamento(Integer idMedicamento) {
        this.idMedicamento = idMedicamento;
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
}
