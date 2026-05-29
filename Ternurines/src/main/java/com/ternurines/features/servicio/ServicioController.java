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

@RestController
@RequestMapping("/api/servicios")
/**
 * HTTP REST controller that exposes endpoints to manage servicio operations.
 */
public class ServicioController {

    private final ServicioRepository repository;

    public ServicioController(ServicioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Servicio>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody Servicio servicio) {
        repository.save(servicio);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Servicio servicio) {
        servicio.setIdServicio(id);
        repository.update(servicio);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        repository.delete(id);
        return ResponseEntity.ok().build();
    }
}
