package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.MascotaAdopcion;
import com.veterinaria.vetclinic.repository.MascotaAdopcionRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/mascotas-adopcion")
public class MascotaAdopcionController {
    private final MascotaAdopcionRepository repository;

    public MascotaAdopcionController(MascotaAdopcionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<MascotaAdopcion> listar() {
        return repository.findAll();
    }
}
