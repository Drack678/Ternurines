package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final ClienteRepository clienteRepository;
    private final MascotaRepository mascotaRepository;
    private final CitaRepository citaRepository;
    private final ServicioRepository servicioRepository;
    private final MascotaAdopcionRepository adopcionRepository;

    public DashboardController(ClienteRepository clienteRepository,
                               MascotaRepository mascotaRepository,
                               CitaRepository citaRepository,
                               ServicioRepository servicioRepository,
                               MascotaAdopcionRepository adopcionRepository) {
        this.clienteRepository = clienteRepository;
        this.mascotaRepository = mascotaRepository;
        this.citaRepository = citaRepository;
        this.servicioRepository = servicioRepository;
        this.adopcionRepository = adopcionRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("clientes", clienteRepository.count());
        summary.put("mascotas", mascotaRepository.count());
        summary.put("citas", citaRepository.count());
        summary.put("servicios", servicioRepository.count());
        summary.put("animalesAdopcion", adopcionRepository.count());
        return summary;
    }
}
