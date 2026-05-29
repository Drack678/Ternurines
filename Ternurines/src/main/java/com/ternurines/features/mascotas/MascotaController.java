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

@RestController
@RequestMapping("/api/mascotas")
/**
 * HTTP REST controller that exposes endpoints to manage mascota operations.
 */
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @GetMapping
    public ResponseEntity<List<Mascota>> getAll() {
        return ResponseEntity.ok(mascotaService.listAll());
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody Mascota mascota) {
        mascotaService.create(mascota);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Mascota mascota) {
        mascotaService.update(id, mascota);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        mascotaService.delete(id);
        return ResponseEntity.ok().build();
    }
}
