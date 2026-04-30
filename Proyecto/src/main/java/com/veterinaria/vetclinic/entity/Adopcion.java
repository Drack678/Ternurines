package com.veterinaria.vetclinic.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "adopcion")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Adopcion {
    @EmbeddedId
    private AdopcionId id;

    @Column(name = "fecha_adopcion", nullable = false)
    private LocalDate fechaAdopcion;

    public Adopcion() {}

    public Adopcion(AdopcionId id, LocalDate fechaAdopcion) {
        this.id = id;
        this.fechaAdopcion = fechaAdopcion;
    }

    public AdopcionId getId() {
        return id;
    }

    public void setId(AdopcionId id) {
        this.id = id;
    }

    public LocalDate getFechaAdopcion() {
        return fechaAdopcion;
    }

    public void setFechaAdopcion(LocalDate fechaAdopcion) {
        this.fechaAdopcion = fechaAdopcion;
    }
}
