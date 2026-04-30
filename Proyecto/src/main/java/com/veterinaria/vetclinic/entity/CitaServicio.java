package com.veterinaria.vetclinic.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cita_servicio")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CitaServicio {
    @EmbeddedId
    private CitaServicioId id;

    @MapsId("idCita")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cita")
    private Cita cita;

    @MapsId("idServicio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_servicio")
    private Servicio servicio;

    public CitaServicio() {}

    public CitaServicio(CitaServicioId id, Cita cita, Servicio servicio) {
        this.id = id;
        this.cita = cita;
        this.servicio = servicio;
    }

    public CitaServicioId getId() {
        return id;
    }

    public void setId(CitaServicioId id) {
        this.id = id;
    }

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }
}
