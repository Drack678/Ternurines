package com.ternurines.features.clientes;

/**
 * Modelo de dominio del cliente de la clínica veterinaria.
 */
public class Cliente {
    private Integer idCliente;
    private String nombre;
    private String documento;
    private String telefono;
    private String direccion;
    private String correo;
    private String contrasena;

    /**
     * Devuelve el identificador del cliente.
     *
     * @return identificador del cliente
     */
    public Integer getIdCliente() {
        return idCliente;
    }

    /**
     * Establece el identificador del cliente.
     *
     * @param idCliente identificador del cliente
     */
    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    /**
     * Devuelve el nombre del cliente.
     *
     * @return nombre del cliente
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre del cliente.
     *
     * @param nombre nombre del cliente
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Devuelve el documento de identidad del cliente.
     *
     * @return documento del cliente
     */
    public String getDocumento() {
        return documento;
    }

    /**
     * Establece el documento de identidad del cliente.
     *
     * @param documento documento del cliente
     */
    public void setDocumento(String documento) {
        this.documento = documento;
    }

    /**
     * Devuelve el teléfono de contacto del cliente.
     *
     * @return teléfono del cliente
     */
    public String getTelefono() {
        return telefono;
    }

    /**
     * Establece el teléfono de contacto del cliente.
     *
     * @param telefono teléfono del cliente
     */
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    /**
     * Devuelve la dirección del cliente.
     *
     * @return dirección del cliente
     */
    public String getDireccion() {
        return direccion;
    }

    /**
     * Establece la dirección del cliente.
     *
     * @param direccion dirección del cliente
     */
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    /**
     * Devuelve el correo electrónico del cliente.
     *
     * @return correo del cliente
     */
    public String getCorreo() {
        return correo;
    }

    /**
     * Establece el correo electrónico del cliente.
     *
     * @param correo correo del cliente
     */
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    /**
     * Devuelve la contraseña del cliente.
     *
     * @return contraseña del cliente
     */
    public String getContrasena() {
        return contrasena;
    }

    /**
     * Establece la contraseña del cliente.
     *
     * @param contrasena contraseña del cliente
     */
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}
