package com.ternurines.features.historial;

/**
 * Medical history entry joining patient and treatment information.
 */
public class HistorialMascota {
    private Integer idMascota;
    private String nombre;
    private String cliente;

    public Integer getIdMascota() {
        return idMascota;
    }

    public void setIdMascota(Integer idMascota) {
        this.idMascota = idMascota;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }
}
