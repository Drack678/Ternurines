package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.Cita;
import com.veterinaria.vetclinic.entity.Mascota;
import com.veterinaria.vetclinic.entity.Recepcionista;
import com.veterinaria.vetclinic.entity.Veterinario;
import com.veterinaria.vetclinic.repository.CitaRepository;
import com.veterinaria.vetclinic.repository.MascotaRepository;
import com.veterinaria.vetclinic.repository.RecepcionistaRepository;
import com.veterinaria.vetclinic.repository.VeterinarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/citas")
public class CitaController {
    private final CitaRepository citaRepository;
    private final MascotaRepository mascotaRepository;
    private final VeterinarioRepository veterinarioRepository;
    private final RecepcionistaRepository recepcionistaRepository;

    public CitaController(CitaRepository citaRepository,
                          MascotaRepository mascotaRepository,
                          VeterinarioRepository veterinarioRepository,
                          RecepcionistaRepository recepcionistaRepository) {
        this.citaRepository = citaRepository;
        this.mascotaRepository = mascotaRepository;
        this.veterinarioRepository = veterinarioRepository;
        this.recepcionistaRepository = recepcionistaRepository;
    }

    @GetMapping
    public List<Cita> listar() {
        return citaRepository.findAll();
    }

    @GetMapping("/summary")
    public List<Map<String, Object>> listarResumen() {
        return citaRepository.findAll().stream().map(cita -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", cita.getIdCita());
            dto.put("fecha", cita.getFecha());
            dto.put("hora", cita.getHora());
            dto.put("motivo", cita.getMotivo());
            dto.put("estado", cita.getEstado());
            dto.put("mascota", cita.getMascota() != null ? cita.getMascota().getNombre() : null);
            dto.put("cliente", cita.getMascota() != null && cita.getMascota().getCliente() != null ? cita.getMascota().getCliente().getNombre() : null);
            dto.put("veterinario", cita.getVeterinario() != null ? cita.getVeterinario().getNombre() : null);
            dto.put("recepcionista", cita.getRecepcionista() != null ? cita.getRecepcionista().getNombre() : null);
            return dto;
        }).toList();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, String> payload) {
        Long mascotaId = Long.parseLong(payload.get("mascotaId"));
        Long veterinarioId = Long.parseLong(payload.get("veterinarioId"));
        Long recepcionistaId = Long.parseLong(payload.get("recepcionistaId"));

        Mascota mascota = mascotaRepository.findById(mascotaId)
                .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada"));
        Veterinario veterinario = veterinarioRepository.findById(veterinarioId)
                .orElseThrow(() -> new IllegalArgumentException("Veterinario no encontrado"));
        Recepcionista recepcionista = recepcionistaRepository.findById(recepcionistaId)
                .orElseThrow(() -> new IllegalArgumentException("Recepcionista no encontrado"));

        Cita cita = new Cita();
        cita.setMascota(mascota);
        cita.setVeterinario(veterinario);
        cita.setRecepcionista(recepcionista);
        cita.setFecha(LocalDate.parse(payload.get("fecha")));
        cita.setHora(LocalTime.parse(payload.get("hora")));
        cita.setMotivo(payload.get("motivo"));
        cita.setEstado(payload.getOrDefault("estado", "Pendiente"));

        Cita guardada = citaRepository.save(cita);
        Map<String, Object> response = new HashMap<>();
        response.put("id", guardada.getIdCita());
        response.put("mensaje", "Cita creada correctamente");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
        cita.setEstado(payload.getOrDefault("estado", cita.getEstado()));
        citaRepository.save(cita);
        return ResponseEntity.ok(Map.of("mensaje", "Estado actualizado", "estado", cita.getEstado()));
    }
}
