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

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    public ResponseEntity<List<Cita>> getAll() {
        return ResponseEntity.ok(citaService.listAll());
    }

    @PostMapping
    public ResponseEntity<Void> add(@RequestBody Cita cita) {
        citaService.create(cita);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Cita cita) {
        citaService.update(id, cita);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancel(@PathVariable int id) {
        citaService.cancel(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/completar")
    public ResponseEntity<Void> complete(@PathVariable int id) {
        citaService.complete(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        citaService.delete(id);
        return ResponseEntity.ok().build();
    }
}
