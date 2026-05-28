package com.ternurines.features.citas;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;

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

    public Integer getIdCita() {
        return idCita;
    }

    public void setIdCita(Integer idCita) {
        this.idCita = idCita;
    }

    @JsonProperty("id")
    public Integer getId() {
        return idCita;
    }

    public Integer getIdMascota() {
        return idMascota;
    }

    public void setIdMascota(Integer idMascota) {
        this.idMascota = idMascota;
    }

    @JsonProperty("mascota_id")
    public Integer getMascotaId() {
        return idMascota;
    }

    public Integer getIdVeterinario() {
        return idVeterinario;
    }

    public void setIdVeterinario(Integer idVeterinario) {
        this.idVeterinario = idVeterinario;
    }

    @JsonProperty("veterinario_id")
    public Integer getVeterinarioId() {
        return idVeterinario;
    }

    public Integer getIdRecepcionista() {
        return idRecepcionista;
    }

    public void setIdRecepcionista(Integer idRecepcionista) {
        this.idRecepcionista = idRecepcionista;
    }

    @JsonProperty("recepcionista_id")
    public Integer getRecepcionistaId() {
        return idRecepcionista;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMascota() {
        return mascota;
    }

    public void setMascota(String mascota) {
        this.mascota = mascota;
    }

    @JsonProperty("mascota_nombre")
    public String getMascotaNombre() {
        return mascota;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    @JsonProperty("cliente_nombre")
    public String getClienteNombre() {
        return cliente;
    }

    public String getVeterinario() {
        return veterinario;
    }

    public void setVeterinario(String veterinario) {
        this.veterinario = veterinario;
    }

    @JsonProperty("veterinario_nombre")
    public String getVeterinarioNombre() {
        return veterinario;
    }

    public String getRecepcionista() {
        return recepcionista;
    }

    public void setRecepcionista(String recepcionista) {
        this.recepcionista = recepcionista;
    }

    @JsonProperty("recepcionista_nombre")
    public String getRecepcionistaNombre() {
        return recepcionista;
    }
}
