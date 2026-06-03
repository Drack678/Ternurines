package com.ternurines.features.citas;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Lógica de negocio de citas.
 * Valida disponibilidad del veterinario antes de crear o actualizar una cita.
 */
@Service
public class CitaService {

    private final CitaRepository repository;

    /**
     * Construye el servicio con el repositorio de citas inyectado.
     *
     * @param repository repositorio de acceso a datos de citas
     */
    public CitaService(CitaRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista todas las citas con información de mascota, cliente y personal.
     *
     * @return lista completa de citas
     */
    public List<Cita> listAll() {
        return repository.findAll();
    }

    /**
     * Crea una cita verificando que el veterinario esté disponible en el horario solicitado.
     *
     * @param cita datos de la nueva cita
     * @throws IllegalArgumentException si el veterinario no tiene disponibilidad
     */
    @Transactional
    public void create(Cita cita) {
        validateCita(cita);
        if (cita.getEstado() == null || cita.getEstado().isBlank()) {
            cita.setEstado("Pendiente");
        }
        if (!repository.isVeterinarioDisponible(cita)) {
            throw new IllegalArgumentException("El veterinario no tiene disponibilidad en ese horario");
        }
        repository.save(cita);
    }

    /**
     * Actualiza una cita existente verificando disponibilidad del veterinario.
     *
     * @param id   identificador de la cita a modificar
     * @param cita datos actualizados
     * @throws IllegalArgumentException si el veterinario no tiene disponibilidad
     */
    @Transactional
    public void update(int id, Cita cita) {
        cita.setIdCita(id);
        validateCita(cita);
        if (cita.getEstado() == null || cita.getEstado().isBlank()) {
            cita.setEstado("Pendiente");
        }
        if (!repository.isVeterinarioDisponible(cita)) {
            throw new IllegalArgumentException("El veterinario no tiene disponibilidad en ese horario");
        }
        repository.update(cita);
    }

    private void validateCita(Cita cita) {
        if (cita == null
                || cita.getIdMascota() == null
                || cita.getIdVeterinario() == null
                || cita.getIdRecepcionista() == null
                || cita.getFecha() == null
                || cita.getHora() == null) {
            throw new IllegalArgumentException("Todos los campos de la cita son obligatorios.");
        }
    }

    /**
     * Cancela una cita estableciendo su estado como Cancelada.
     *
     * @param id identificador de la cita
     */
    @Transactional
    public void cancel(int id) {
        repository.updateEstado(id, "Cancelada");
    }

    /**
     * Marca una cita como completada.
     *
     * @param id identificador de la cita
     */
    @Transactional
    public void complete(int id) {
        repository.updateEstado(id, "Completada");
    }

    /**
     * Elimina una cita de la base de datos.
     *
     * @param id identificador de la cita
     */
    @Transactional
    public void delete(int id) {
        repository.delete(id);
    }
}
