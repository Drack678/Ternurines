package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.Mascota;
import com.veterinaria.vetclinic.repository.MascotaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/mascotas")
public class MascotaController {
    private final MascotaRepository mascotaRepository;

    public MascotaController(MascotaRepository mascotaRepository) {
        this.mascotaRepository = mascotaRepository;
    }

    @GetMapping
    public List<Mascota> listar() {
        return mascotaRepository.findAll();
    }
}
