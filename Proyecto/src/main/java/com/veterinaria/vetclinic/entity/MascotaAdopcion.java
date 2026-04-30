package com.veterinaria.vetclinic.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "mascota_adopcion")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MascotaAdopcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mascota_adopcion")
    private Long idMascotaAdopcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_recepcionista", nullable = false)
    private Recepcionista recepcionista;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 50)
    private String especie;

    @Column(length = 50)
    private String raza;

    private Integer edad;

    @Column(name = "estado_salud", length = 100)
    private String estadoSalud;

    @Column(name = "estado_adopcion", length = 50)
    private String estadoAdopcion;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    public MascotaAdopcion() {}

    public Long getIdMascotaAdopcion() {
        return idMascotaAdopcion;
    }

    public void setIdMascotaAdopcion(Long idMascotaAdopcion) {
        this.idMascotaAdopcion = idMascotaAdopcion;
    }

    public Recepcionista getRecepcionista() {
        return recepcionista;
    }

    public void setRecepcionista(Recepcionista recepcionista) {
        this.recepcionista = recepcionista;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public String getEstadoSalud() {
        return estadoSalud;
    }

    public void setEstadoSalud(String estadoSalud) {
        this.estadoSalud = estadoSalud;
    }

    public String getEstadoAdopcion() {
        return estadoAdopcion;
    }

    public void setEstadoAdopcion(String estadoAdopcion) {
        this.estadoAdopcion = estadoAdopcion;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }
}
