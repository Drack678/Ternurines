package com.ternurines.features.citas;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Modelo de dominio para la entidad cita persistida por la aplicación.
 * 
 * Representa una cita veterinaria con toda la información asociada, incluyendo
 * referencias a la mascota, veterinario, recepcionista y cliente involucrados.
 */
public class Cita {
    /** Identificador único de la cita */
    private Integer idCita;
    /** Identificador de la mascota asociada a la cita */
    private Integer idMascota;
    /** Identificador del veterinario asignado a la cita */
    private Integer idVeterinario;
    /** Identificador del recepcionista que registró la cita */
    private Integer idRecepcionista;
    /** Fecha en que se realiza la cita */
    private LocalDate fecha;
    /** Hora en que se realiza la cita */
    private LocalTime hora;
    /** Motivo o descripción de la consulta veterinaria */
    private String motivo;
    /** Estado actual de la cita (ej: pendiente, completada, cancelada) */
    private String estado;
    /** Nombre de la mascota */
    private String mascota;
    /** Nombre del cliente propietario de la mascota */
    private String cliente;
    /** Nombre del veterinario asignado */
    private String veterinario;
    /** Nombre del recepcionista */
    private String recepcionista;

    /**
     * Obtiene el identificador único de la cita.
     * 
     * @return el identificador de la cita
     */
    public Integer getIdCita() {
        return idCita;
    }

    /**
     * Establece el identificador único de la cita.
     * 
     * @param idCita el identificador a asignar
     */
    public void setIdCita(Integer idCita) {
        this.idCita = idCita;
    }

    /**
     * Obtiene el identificador de la cita para serialización JSON.
     * 
     * @return el identificador de la cita
     */
    @JsonProperty("id")
    public Integer getId() {
        return idCita;
    }

    /**
     * Obtiene el identificador de la mascota asociada a la cita.
     * 
     * @return el identificador de la mascota
     */
    public Integer getIdMascota() {
        return idMascota;
    }

    /**
     * Establece el identificador de la mascota asociada a la cita.
     * 
     * @param idMascota el identificador de la mascota a asignar
     */
    public void setIdMascota(Integer idMascota) {
        this.idMascota = idMascota;
    }

    /**
     * Obtiene el identificador de la mascota para serialización JSON.
     * 
     * @return el identificador de la mascota
     */
    @JsonProperty("mascota_id")
    public Integer getMascotaId() {
        return idMascota;
    }

    /**
     * Obtiene el identificador del veterinario asignado a la cita.
     * 
     * @return el identificador del veterinario
     */
    public Integer getIdVeterinario() {
        return idVeterinario;
    }

    /**
     * Establece el identificador del veterinario asignado a la cita.
     * 
     * @param idVeterinario el identificador del veterinario a asignar
     */
    public void setIdVeterinario(Integer idVeterinario) {
        this.idVeterinario = idVeterinario;
    }

    /**
     * Obtiene el identificador del veterinario para serialización JSON.
     * 
     * @return el identificador del veterinario
     */
    @JsonProperty("veterinario_id")
    public Integer getVeterinarioId() {
        return idVeterinario;
    }

    /**
     * Obtiene el identificador del recepcionista que registró la cita.
     * 
     * @return el identificador del recepcionista
     */
    public Integer getIdRecepcionista() {
        return idRecepcionista;
    }

    /**
     * Establece el identificador del recepcionista que registró la cita.
     * 
     * @param idRecepcionista el identificador del recepcionista a asignar
     */
    public void setIdRecepcionista(Integer idRecepcionista) {
        this.idRecepcionista = idRecepcionista;
    }

    /**
     * Obtiene el identificador del recepcionista para serialización JSON.
     * 
     * @return el identificador del recepcionista
     */
    @JsonProperty("recepcionista_id")
    public Integer getRecepcionistaId() {
        return idRecepcionista;
    }

    /**
     * Obtiene la fecha en que se realiza la cita.
     * 
     * @return la fecha de la cita
     */
    public LocalDate getFecha() {
        return fecha;
    }

    /**
     * Establece la fecha en que se realiza la cita.
     * 
     * @param fecha la fecha a asignar
     */
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    /**
     * Obtiene la hora en que se realiza la cita.
     * 
     * @return la hora de la cita
     */
    public LocalTime getHora() {
        return hora;
    }

    /**
     * Establece la hora en que se realiza la cita.
     * 
     * @param hora la hora a asignar
     */
    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    /**
     * Obtiene el motivo o descripción de la consulta veterinaria.
     * 
     * @return el motivo de la cita
     */
    public String getMotivo() {
        return motivo;
    }

    /**
     * Establece el motivo o descripción de la consulta veterinaria.
     * 
     * @param motivo el motivo a asignar
     */
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    /**
     * Obtiene el estado actual de la cita.
     * 
     * @return el estado de la cita (ej: pendiente, completada, cancelada)
     */
    public String getEstado() {
        return estado;
    }

    /**
     * Establece el estado actual de la cita.
     * 
     * @param estado el estado a asignar
     */
    public void setEstado(String estado) {
        this.estado = estado;
    }

    /**
     * Obtiene el nombre de la mascota.
     * 
     * @return el nombre de la mascota
     */
    public String getMascota() {
        return mascota;
    }

    /**
     * Establece el nombre de la mascota.
     * 
     * @param mascota el nombre de la mascota a asignar
     */
    public void setMascota(String mascota) {
        this.mascota = mascota;
    }

    /**
     * Obtiene el nombre de la mascota para serialización JSON.
     * 
     * @return el nombre de la mascota
     */
    @JsonProperty("mascota_nombre")
    public String getMascotaNombre() {
        return mascota;
    }

    /**
     * Obtiene el nombre del cliente propietario de la mascota.
     * 
     * @return el nombre del cliente
     */
    public String getCliente() {
        return cliente;
    }

    /**
     * Establece el nombre del cliente propietario de la mascota.
     * 
     * @param cliente el nombre del cliente a asignar
     */
    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    /**
     * Obtiene el nombre del cliente para serialización JSON.
     * 
     * @return el nombre del cliente
     */
    @JsonProperty("cliente_nombre")
    public String getClienteNombre() {
        return cliente;
    }

    /**
     * Obtiene el nombre del veterinario asignado.
     * 
     * @return el nombre del veterinario
     */
    public String getVeterinario() {
        return veterinario;
    }

    /**
     * Establece el nombre del veterinario asignado.
     * 
     * @param veterinario el nombre del veterinario a asignar
     */
    public void setVeterinario(String veterinario) {
        this.veterinario = veterinario;
    }

    /**
     * Obtiene el nombre del veterinario para serialización JSON.
     * 
     * @return el nombre del veterinario
     */
    @JsonProperty("veterinario_nombre")
    public String getVeterinarioNombre() {
        return veterinario;
    }

    /**
     * Obtiene el nombre del recepcionista.
     * 
     * @return el nombre del recepcionista
     */
    public String getRecepcionista() {
        return recepcionista;
    }

    /**
     * Establece el nombre del recepcionista.
     * 
     * @param recepcionista el nombre del recepcionista a asignar
     */
    public void setRecepcionista(String recepcionista) {
        this.recepcionista = recepcionista;
    }

    /**
     * Obtiene el nombre del recepcionista para serialización JSON.
     * 
     * @return el nombre del recepcionista
     */
    @JsonProperty("recepcionista_nombre")
    public String getRecepcionistaNombre() {
        return recepcionista;
    }
}
