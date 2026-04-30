package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.Servicio;
import com.veterinaria.vetclinic.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/servicios")
public class ServicioController {
    private final ServicioRepository servicioRepository;

    public ServicioController(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    @GetMapping
    public List<Servicio> listar() {
        return servicioRepository.findAll();
    }
}
