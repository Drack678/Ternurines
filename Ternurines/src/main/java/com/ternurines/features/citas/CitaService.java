package com.ternurines.features.citas;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CitaService {

    private final CitaRepository repository;

    public CitaService(CitaRepository repository) {
        this.repository = repository;
    }

    public List<Cita> listAll() {
        return repository.findAll();
    }

    @Transactional
    public void create(Cita cita) {
        if (!repository.isVeterinarioDisponible(cita)) {
            throw new IllegalArgumentException("El veterinario no tiene disponibilidad en ese horario");
        }
        repository.save(cita);
    }

    @Transactional
    public void update(int id, Cita cita) {
        cita.setIdCita(id);
        if (!repository.isVeterinarioDisponible(cita)) {
            throw new IllegalArgumentException("El veterinario no tiene disponibilidad en ese horario");
        }
        repository.update(cita);
    }

    @Transactional
    public void cancel(int id) {
        repository.updateEstado(id, "Cancelada");
    }

    @Transactional
    public void complete(int id) {
        repository.updateEstado(id, "Completada");
    }

    @Transactional
    public void delete(int id) {
        repository.delete(id);
    }
}
