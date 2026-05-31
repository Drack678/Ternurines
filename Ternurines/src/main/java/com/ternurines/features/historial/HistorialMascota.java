package com.ternurines.features.historial;

/**
 * Mascota con nombre del cliente, usada como opción al registrar historial médico.
 */
public class HistorialMascota {
    private Integer idMascota;
    private String nombre;
    private String cliente;

    /**
     * Devuelve el identificador de la mascota.
     *
     * @return identificador de la mascota
     */
    public Integer getIdMascota() {
        return idMascota;
    }

    /**
     * Establece el identificador de la mascota.
     *
     * @param idMascota identificador de la mascota
     */
    public void setIdMascota(Integer idMascota) {
        this.idMascota = idMascota;
    }

    /**
     * Devuelve el nombre de la mascota.
     *
     * @return nombre de la mascota
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre de la mascota.
     *
     * @param nombre nombre de la mascota
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Devuelve el nombre del cliente propietario.
     *
     * @return nombre del cliente
     */
    public String getCliente() {
        return cliente;
    }

    /**
     * Establece el nombre del cliente propietario.
     *
     * @param cliente nombre del cliente
     */
    public void setCliente(String cliente) {
        this.cliente = cliente;
    }
}
