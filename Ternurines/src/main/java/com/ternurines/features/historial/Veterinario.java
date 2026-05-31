package com.ternurines.features.historial;

/**
 * Datos básicos del veterinario para selección en formularios de historial.
 */
public class Veterinario {
    private Integer idVeterinario;
    private String nombre;
    private String especialidad;

    /**
     * Devuelve el identificador del veterinario.
     *
     * @return identificador del veterinario
     */
    public Integer getIdVeterinario() {
        return idVeterinario;
    }

    /**
     * Establece el identificador del veterinario.
     *
     * @param idVeterinario identificador del veterinario
     */
    public void setIdVeterinario(Integer idVeterinario) {
        this.idVeterinario = idVeterinario;
    }

    /**
     * Devuelve el nombre del veterinario.
     *
     * @return nombre del veterinario
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre del veterinario.
     *
     * @param nombre nombre del veterinario
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Devuelve la especialidad del veterinario.
     *
     * @return especialidad del veterinario
     */
    public String getEspecialidad() {
        return especialidad;
    }

    /**
     * Establece la especialidad del veterinario.
     *
     * @param especialidad especialidad del veterinario
     */
    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }
}
