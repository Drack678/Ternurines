package com.ternurines.features.citas;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Modelo de dominio de una cita veterinaria.
 * Incluye referencias a mascota, veterinario, recepcionista y nombres desnormalizados para la API.
 */
public class Cita {
    private Integer idCita;
    private Integer idMascota;
    private Integer idVeterinario;
    private Integer idRecepcionista;
    private LocalDate fecha;
    private LocalTime hora;
    private String motivo;
    private String estado;
    private String mascota;
    private String cliente;
    private String veterinario;
    private String recepcionista;

    /**
     * Devuelve el identificador interno de la cita.
     *
     * @return identificador de la cita
     */
    public Integer getIdCita() {
        return idCita;
    }

    /**
     * Establece el identificador interno de la cita.
     *
     * @param idCita identificador de la cita
     */
    public void setIdCita(Integer idCita) {
        this.idCita = idCita;
    }

    /**
     * Devuelve el identificador de la cita para la API JSON.
     *
     * @return identificador expuesto como id
     */
    @JsonProperty("id")
    public Integer getId() {
        return idCita;
    }

    /**
     * Devuelve el identificador de la mascota asociada.
     *
     * @return identificador de la mascota
     */
    public Integer getIdMascota() {
        return idMascota;
    }

    /**
     * Establece el identificador de la mascota asociada.
     *
     * @param idMascota identificador de la mascota
     */
    public void setIdMascota(Integer idMascota) {
        this.idMascota = idMascota;
    }

    /**
     * Devuelve el identificador de la mascota para la API JSON.
     *
     * @return identificador expuesto como mascota_id
     */
    @JsonProperty("mascota_id")
    public Integer getMascotaId() {
        return idMascota;
    }

    /**
     * Devuelve el identificador del veterinario asignado.
     *
     * @return identificador del veterinario
     */
    public Integer getIdVeterinario() {
        return idVeterinario;
    }

    /**
     * Establece el identificador del veterinario asignado.
     *
     * @param idVeterinario identificador del veterinario
     */
    public void setIdVeterinario(Integer idVeterinario) {
        this.idVeterinario = idVeterinario;
    }

    /**
     * Devuelve el identificador del veterinario para la API JSON.
     *
     * @return identificador expuesto como veterinario_id
     */
    @JsonProperty("veterinario_id")
    public Integer getVeterinarioId() {
        return idVeterinario;
    }

    /**
     * Devuelve el identificador del recepcionista que registró la cita.
     *
     * @return identificador del recepcionista
     */
    public Integer getIdRecepcionista() {
        return idRecepcionista;
    }

    /**
     * Establece el identificador del recepcionista que registró la cita.
     *
     * @param idRecepcionista identificador del recepcionista
     */
    public void setIdRecepcionista(Integer idRecepcionista) {
        this.idRecepcionista = idRecepcionista;
    }

    /**
     * Devuelve el identificador del recepcionista para la API JSON.
     *
     * @return identificador expuesto como recepcionista_id
     */
    @JsonProperty("recepcionista_id")
    public Integer getRecepcionistaId() {
        return idRecepcionista;
    }

    /**
     * Devuelve la fecha programada de la cita.
     *
     * @return fecha de la cita
     */
    public LocalDate getFecha() {
        return fecha;
    }

    /**
     * Establece la fecha programada de la cita.
     *
     * @param fecha fecha de la cita
     */
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    /**
     * Devuelve la hora programada de la cita.
     *
     * @return hora de la cita
     */
    public LocalTime getHora() {
        return hora;
    }

    /**
     * Establece la hora programada de la cita.
     *
     * @param hora hora de la cita
     */
    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    /**
     * Devuelve el motivo de la consulta.
     *
     * @return motivo de la cita
     */
    public String getMotivo() {
        return motivo;
    }

    /**
     * Establece el motivo de la consulta.
     *
     * @param motivo motivo de la cita
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

    /**
     * Devuelve el nombre de la mascota asociada.
     *
     * @return nombre de la mascota
     */
    public String getMascota() {
        return mascota;
    }

    /**
     * Establece el nombre de la mascota asociada.
     *
     * @param mascota nombre de la mascota
     */
    public void setMascota(String mascota) {
        this.mascota = mascota;
    }

    /**
     * Devuelve el nombre de la mascota para la API JSON.
     *
     * @return nombre expuesto como mascota_nombre
     */
    @JsonProperty("mascota_nombre")
    public String getMascotaNombre() {
        return mascota;
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
     * Devuelve el nombre del cliente para la API JSON.
     *
     * @return nombre expuesto como cliente_nombre
     */
    @JsonProperty("cliente_nombre")
    public String getClienteNombre() {
        return cliente;
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
     * Devuelve el nombre del veterinario para la API JSON.
     *
     * @return nombre expuesto como veterinario_nombre
     */
    @JsonProperty("veterinario_nombre")
    public String getVeterinarioNombre() {
        return veterinario;
    }

    /**
     * Devuelve el nombre del recepcionista que registró la cita.
     *
     * @return nombre del recepcionista
     */
    public String getRecepcionista() {
        return recepcionista;
    }

    /**
     * Establece el nombre del recepcionista que registró la cita.
     *
     * @param recepcionista nombre del recepcionista
     */
    public void setRecepcionista(String recepcionista) {
        this.recepcionista = recepcionista;
    }

    /**
     * Devuelve el nombre del recepcionista para la API JSON.
     *
     * @return nombre expuesto como recepcionista_nombre
     */
    @JsonProperty("recepcionista_nombre")
    public String getRecepcionistaNombre() {
        return recepcionista;
    }
}
