package com.veterinaria.vetclinic.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Embeddable
public class CitaServicioId implements Serializable {
    @Column(name = "id_cita")
    private Long idCita;

    @Column(name = "id_servicio")
    private Long idServicio;

    public CitaServicioId() {}

    public CitaServicioId(Long idCita, Long idServicio) {
        this.idCita = idCita;
        this.idServicio = idServicio;
    }

    public Long getIdCita() {
        return idCita;
    }

    public void setIdCita(Long idCita) {
        this.idCita = idCita;
    }

    public Long getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(Long idServicio) {
        this.idServicio = idServicio;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CitaServicioId)) return false;
        CitaServicioId that = (CitaServicioId) o;
        return idCita.equals(that.idCita) && idServicio.equals(that.idServicio);
    }

    @Override
    public int hashCode() {
        return idCita.hashCode() * 31 + idServicio.hashCode();
    }
}
