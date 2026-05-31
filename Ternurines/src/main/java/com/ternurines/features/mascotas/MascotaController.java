package com.ternurines.features.mascotas;

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
 * Controlador REST de mascotas bajo /api/mascotas.
 * CRUD básico: listar, crear, actualizar y eliminar.
 */
@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    /**
     * Construye el controlador con el servicio de mascotas inyectado.
     *
     * @param mascotaService servicio de lógica de negocio de mascotas
     */
    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    /**
     * Obtiene todas las mascotas registradas con el nombre del cliente propietario.
     *
     * @return lista de mascotas
     */
    @GetMapping
    public ResponseEntity<List<Mascota>> getAll() {
        return ResponseEntity.ok(mascotaService.listAll());
    }

    /**
     * Registra una nueva mascota.
     *
     * @param mascota datos de la mascota a crear
     * @return 200 si la creación fue exitosa
     */
    @PostMapping
    public ResponseEntity<Void> add(@RequestBody Mascota mascota) {
        mascotaService.create(mascota);
        return ResponseEntity.ok().build();
    }

    /**
     * Actualiza una mascota existente por su identificador.
     *
     * @param id      identificador de la mascota
     * @param mascota datos actualizados
     * @return 200 si la actualización fue exitosa
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Mascota mascota) {
        mascotaService.update(id, mascota);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina una mascota por su identificador.
     *
     * @param id identificador de la mascota
     * @return 200 si la eliminación fue exitosa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        mascotaService.delete(id);
        return ResponseEntity.ok().build();
    }
}
