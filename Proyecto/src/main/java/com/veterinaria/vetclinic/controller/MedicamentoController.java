package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.Medicamento;
import com.veterinaria.vetclinic.repository.MedicamentoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/medicamentos")
public class MedicamentoController {
    private final MedicamentoRepository repository;

    public MedicamentoController(MedicamentoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Medicamento> listar() {
        return repository.findAll();
    }
}
