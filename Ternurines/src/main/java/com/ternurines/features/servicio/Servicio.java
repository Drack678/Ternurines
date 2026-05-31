package com.ternurines.features.servicio;

/**
 * Modelo del catálogo de servicios veterinarios ofrecidos por la clínica.
 */
public class Servicio {
    private Integer idServicio;
    private String nombre;
    private String descripcion;
    private Double precio;

    /**
     * Devuelve el identificador del servicio.
     *
     * @return identificador del servicio
     */
    public Integer getIdServicio() {
        return idServicio;
    }

    /**
     * Establece el identificador del servicio.
     *
     * @param idServicio identificador del servicio
     */
    public void setIdServicio(Integer idServicio) {
        this.idServicio = idServicio;
    }

    /**
     * Devuelve el nombre del servicio.
     *
     * @return nombre del servicio
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre del servicio.
     *
     * @param nombre nombre del servicio
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Devuelve la descripción del servicio.
     *
     * @return descripción del servicio
     */
    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Establece la descripción del servicio.
     *
     * @param descripcion descripción del servicio
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    /**
     * Devuelve el precio del servicio.
     *
     * @return precio del servicio
     */
    public Double getPrecio() {
        return precio;
    }

    /**
     * Establece el precio del servicio.
     *
     * @param precio precio del servicio
     */
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
}
