package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.HistorialMedico;
import com.veterinaria.vetclinic.repository.HistorialMedicoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/historiales")
public class HistorialMedicoController {
    private final HistorialMedicoRepository repository;

    public HistorialMedicoController(HistorialMedicoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<HistorialMedico> listar() {
        return repository.findAll();
    }
}
