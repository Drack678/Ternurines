package com.ternurines.features.mascotas;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
/**
 * Business service layer for mascota management and transactional logic.
 */
public class MascotaService {

    private final MascotaRepository repository;

    public MascotaService(MascotaRepository repository) {
        this.repository = repository;
    }

    public List<Mascota> listAll() {
        return repository.findAll();
    }

    @Transactional
    public void create(Mascota mascota) {
        repository.save(mascota);
    }

    @Transactional
    public void update(int id, Mascota mascota) {
        mascota.setIdMascota(id);
        repository.update(mascota);
    }

    @Transactional
    public void delete(int id) {
        repository.delete(id);
    }
}
