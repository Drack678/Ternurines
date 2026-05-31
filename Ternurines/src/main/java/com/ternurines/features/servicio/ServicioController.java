package com.ternurines.features.servicio;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST del catálogo de servicios bajo /api/servicios.
 * CRUD básico: listar, crear, actualizar y eliminar.
 */
@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final ServicioRepository repository;

    /**
     * Construye el controlador con el repositorio de servicios inyectado.
     *
     * @param repository repositorio de acceso a datos de servicios
     */
    public ServicioController(ServicioRepository repository) {
        this.repository = repository;
    }

    /**
     * Obtiene todos los servicios del catálogo.
     *
     * @return lista de servicios ordenados por nombre
     */
    @GetMapping
    public ResponseEntity<List<Servicio>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    /**
     * Registra un nuevo servicio en el catálogo.
     *
     * @param servicio datos del servicio a crear
     * @return 200 si la creación fue exitosa
     */
    @PostMapping
    public ResponseEntity<Void> add(@RequestBody Servicio servicio) {
        repository.save(servicio);
        return ResponseEntity.ok().build();
    }

    /**
     * Actualiza un servicio existente por su identificador.
     *
     * @param id       identificador del servicio
     * @param servicio datos actualizados
     * @return 200 si la actualización fue exitosa
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Servicio servicio) {
        servicio.setIdServicio(id);
        repository.update(servicio);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina un servicio del catálogo por su identificador.
     *
     * @param id identificador del servicio
     * @return 200 si la eliminación fue exitosa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        repository.delete(id);
        return ResponseEntity.ok().build();
    }
}
