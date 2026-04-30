package com.veterinaria.vetclinic.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Embeddable
public class AdopcionId implements Serializable {
    @Column(name = "id_adoptante")
    private Long idAdoptante;

    @Column(name = "id_mascota_adopcion")
    private Long idMascotaAdopcion;

    public AdopcionId() {}

    public AdopcionId(Long idAdoptante, Long idMascotaAdopcion) {
        this.idAdoptante = idAdoptante;
        this.idMascotaAdopcion = idMascotaAdopcion;
    }

    public Long getIdAdoptante() {
        return idAdoptante;
    }

    public void setIdAdoptante(Long idAdoptante) {
        this.idAdoptante = idAdoptante;
    }

    public Long getIdMascotaAdopcion() {
        return idMascotaAdopcion;
    }

    public void setIdMascotaAdopcion(Long idMascotaAdopcion) {
        this.idMascotaAdopcion = idMascotaAdopcion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AdopcionId)) return false;
        AdopcionId that = (AdopcionId) o;
        return idAdoptante.equals(that.idAdoptante) && idMascotaAdopcion.equals(that.idMascotaAdopcion);
    }

    @Override
    public int hashCode() {
        return idAdoptante.hashCode() * 31 + idMascotaAdopcion.hashCode();
    }
}
