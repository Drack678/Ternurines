package com.ternurines.features.mascotas;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de negocio para operaciones transaccionales sobre mascotas.
 */
@Service
public class MascotaService {

    private final MascotaRepository repository;

    /**
     * Construye el servicio con el repositorio de mascotas inyectado.
     *
     * @param repository repositorio de acceso a datos de mascotas
     */
    public MascotaService(MascotaRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista todas las mascotas con el nombre del cliente propietario.
     *
     * @return lista de mascotas
     */
    public List<Mascota> listAll() {
        return repository.findAll();
    }

    /**
     * Crea una nueva mascota en la base de datos.
     *
     * @param mascota entidad con los datos a persistir
     */
    @Transactional
    public void create(Mascota mascota) {
        repository.save(mascota);
    }

    /**
     * Actualiza los datos de una mascota existente.
     *
     * @param id      identificador de la mascota
     * @param mascota entidad con los campos actualizados
     */
    @Transactional
    public void update(int id, Mascota mascota) {
        mascota.setIdMascota(id);
        repository.update(mascota);
    }

    /**
     * Elimina una mascota por su identificador.
     *
     * @param id identificador de la mascota
     */
    @Transactional
    public void delete(int id) {
        repository.delete(id);
    }
}
