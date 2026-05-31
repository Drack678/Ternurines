package com.ternurines.features.mascotas;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Modelo de mascota registrada en la clínica, vinculada a un cliente.
 */
public class Mascota {
    private Integer idMascota;
    private Integer idCliente;
    private String nombre;
    private String especie;
    private String raza;
    private Integer edad;
    private Double peso;
    private String sexo;
    private String nombreCliente;

    /**
     * Devuelve el identificador interno de la mascota.
     *
     * @return identificador de la mascota
     */
    public Integer getIdMascota() {
        return idMascota;
    }

    /**
     * Establece el identificador interno de la mascota.
     *
     * @param idMascota identificador de la mascota
     */
    public void setIdMascota(Integer idMascota) {
        this.idMascota = idMascota;
    }

    /**
     * Devuelve el identificador de la mascota para la API JSON.
     *
     * @return identificador expuesto como id
     */
    @JsonProperty("id")
    public Integer getId() {
        return idMascota;
    }

    /**
     * Devuelve el identificador del cliente propietario.
     *
     * @return identificador del cliente
     */
    public Integer getIdCliente() {
        return idCliente;
    }

    /**
     * Establece el identificador del cliente propietario.
     *
     * @param idCliente identificador del cliente
     */
    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
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
     * Devuelve la especie de la mascota.
     *
     * @return especie (por ejemplo perro o gato)
     */
    public String getEspecie() {
        return especie;
    }

    /**
     * Establece la especie de la mascota.
     *
     * @param especie especie de la mascota
     */
    public void setEspecie(String especie) {
        this.especie = especie;
    }

    /**
     * Devuelve la raza de la mascota.
     *
     * @return raza de la mascota
     */
    public String getRaza() {
        return raza;
    }

    /**
     * Establece la raza de la mascota.
     *
     * @param raza raza de la mascota
     */
    public void setRaza(String raza) {
        this.raza = raza;
    }

    /**
     * Devuelve la edad de la mascota en años.
     *
     * @return edad en años
     */
    public Integer getEdad() {
        return edad;
    }

    /**
     * Establece la edad de la mascota en años.
     *
     * @param edad edad en años
     */
    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    /**
     * Devuelve el peso de la mascota en kilogramos.
     *
     * @return peso en kg
     */
    public Double getPeso() {
        return peso;
    }

    /**
     * Establece el peso de la mascota en kilogramos.
     *
     * @param peso peso en kg
     */
    public void setPeso(Double peso) {
        this.peso = peso;
    }

    /**
     * Devuelve el sexo de la mascota.
     *
     * @return sexo de la mascota
     */
    public String getSexo() {
        return sexo;
    }

    /**
     * Establece el sexo de la mascota.
     *
     * @param sexo sexo de la mascota
     */
    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    /**
     * Devuelve el nombre del cliente propietario.
     *
     * @return nombre del cliente
     */
    public String getNombreCliente() {
        return nombreCliente;
    }

    /**
     * Establece el nombre del cliente propietario.
     *
     * @param nombreCliente nombre del cliente
     */
    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    /**
     * Devuelve el nombre del dueño para la API JSON.
     *
     * @return nombre del dueño expuesto como dueno_nombre
     */
    @JsonProperty("dueno_nombre")
    public String getDuenoNombre() {
        return nombreCliente;
    }
}
