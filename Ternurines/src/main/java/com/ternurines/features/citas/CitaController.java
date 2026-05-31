package com.ternurines.features.citas;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST de citas bajo /api/citas.
 * Permite listar, crear, actualizar, cancelar, completar y eliminar citas.
 */
@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    /**
     * Construye el controlador con el servicio de citas inyectado.
     *
     * @param citaService servicio de lógica de negocio de citas
     */
    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    /**
     * Obtiene todas las citas registradas con datos relacionados.
     *
     * @return lista de citas ordenadas por fecha y hora
     */
    @GetMapping
    public ResponseEntity<List<Cita>> getAll() {
        return ResponseEntity.ok(citaService.listAll());
    }

    /**
     * Crea una nueva cita validando la disponibilidad del veterinario.
     *
     * @param cita datos de la cita a registrar
     * @return 200 si la creación fue exitosa
     */
    @PostMapping
    public ResponseEntity<Void> add(@RequestBody Cita cita) {
        citaService.create(cita);
        return ResponseEntity.ok().build();
    }

    /**
     * Actualiza una cita existente por su identificador.
     *
     * @param id   identificador de la cita
     * @param cita datos actualizados de la cita
     * @return 200 si la actualización fue exitosa
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Cita cita) {
        citaService.update(id, cita);
        return ResponseEntity.ok().build();
    }

    /**
     * Cancela una cita cambiando su estado a Cancelada.
     *
     * @param id identificador de la cita
     * @return 200 si la cancelación fue exitosa
     */
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancel(@PathVariable int id) {
        citaService.cancel(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Marca una cita como completada.
     *
     * @param id identificador de la cita
     * @return 200 si la operación fue exitosa
     */
    @PatchMapping("/{id}/completar")
    public ResponseEntity<Void> complete(@PathVariable int id) {
        citaService.complete(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina permanentemente una cita de la base de datos.
     *
     * @param id identificador de la cita
     * @return 200 si la eliminación fue exitosa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        citaService.delete(id);
        return ResponseEntity.ok().build();
    }
}
