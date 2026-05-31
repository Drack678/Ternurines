package com.ternurines.features.dashboard;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Representación resumida de una cita para mostrar en el dashboard.
 */
public class DashboardCita {
    private Integer idCita;
    private LocalDate fecha;
    private LocalTime hora;
    private String veterinario;
    private String mascota;
    private String cliente;
    private String motivo;
    private String estado;

    /**
     * Devuelve el identificador de la cita.
     *
     * @return identificador de la cita
     */
    public Integer getIdCita() {
        return idCita;
    }

    /**
     * Establece el identificador de la cita.
     *
     * @param idCita identificador de la cita
     */
    public void setIdCita(Integer idCita) {
        this.idCita = idCita;
    }

    /**
     * Devuelve la fecha de la cita.
     *
     * @return fecha programada
     */
    public LocalDate getFecha() {
        return fecha;
    }

    /**
     * Establece la fecha de la cita.
     *
     * @param fecha fecha programada
     */
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    /**
     * Devuelve la hora de la cita.
     *
     * @return hora programada
     */
    public LocalTime getHora() {
        return hora;
    }

    /**
     * Establece la hora de la cita.
     *
     * @param hora hora programada
     */
    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    /**
     * Devuelve el nombre del veterinario asignado.
     *
     * @return nombre del veterinario
     */
    public String getVeterinario() {
        return veterinario;
    }

    /**
     * Establece el nombre del veterinario asignado.
     *
     * @param veterinario nombre del veterinario
     */
    public void setVeterinario(String veterinario) {
        this.veterinario = veterinario;
    }

    /**
     * Devuelve el nombre de la mascota.
     *
     * @return nombre de la mascota
     */
    public String getMascota() {
        return mascota;
    }

    /**
     * Establece el nombre de la mascota.
     *
     * @param mascota nombre de la mascota
     */
    public void setMascota(String mascota) {
        this.mascota = mascota;
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

    /**
     * Devuelve el motivo de la cita.
     *
     * @return motivo de consulta
     */
    public String getMotivo() {
        return motivo;
    }

    /**
     * Establece el motivo de la cita.
     *
     * @param motivo motivo de consulta
     */
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    /**
     * Devuelve el estado actual de la cita.
     *
     * @return estado de la cita
     */
    public String getEstado() {
        return estado;
    }

    /**
     * Establece el estado actual de la cita.
     *
     * @param estado estado de la cita
     */
    public void setEstado(String estado) {
        this.estado = estado;
    }
}
