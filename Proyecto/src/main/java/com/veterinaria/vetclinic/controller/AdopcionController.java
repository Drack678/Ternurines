package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.Adopcion;
import com.veterinaria.vetclinic.entity.AdopcionId;
import com.veterinaria.vetclinic.repository.AdopcionRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/adopciones")
public class AdopcionController {
    private final AdopcionRepository repository;

    public AdopcionController(AdopcionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Adopcion> listar() {
        return repository.findAll();
    }
}
