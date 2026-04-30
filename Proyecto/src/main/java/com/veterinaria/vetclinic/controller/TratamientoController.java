package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.HistorialMedico;
import com.veterinaria.vetclinic.entity.Medicamento;
import com.veterinaria.vetclinic.entity.Tratamiento;
import com.veterinaria.vetclinic.repository.HistorialMedicoRepository;
import com.veterinaria.vetclinic.repository.MedicamentoRepository;
import com.veterinaria.vetclinic.repository.TratamientoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tratamientos")
public class TratamientoController {
    private final TratamientoRepository repository;
    private final HistorialMedicoRepository historialRepository;
    private final MedicamentoRepository medicamentoRepository;

    public TratamientoController(TratamientoRepository repository,
                                 HistorialMedicoRepository historialRepository,
                                 MedicamentoRepository medicamentoRepository) {
        this.repository = repository;
        this.historialRepository = historialRepository;
        this.medicamentoRepository = medicamentoRepository;
    }

    @GetMapping
    public List<Tratamiento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, String> payload) {
        Long historialId = Long.parseLong(payload.get("historialId"));
        Long medicamentoId = Long.parseLong(payload.get("medicamentoId"));
        HistorialMedico historial = historialRepository.findById(historialId)
                .orElseThrow(() -> new IllegalArgumentException("Historial no encontrado"));
        Medicamento medicamento = medicamentoRepository.findById(medicamentoId)
                .orElseThrow(() -> new IllegalArgumentException("Medicamento no encontrado"));

        Tratamiento tratamiento = new Tratamiento();
        tratamiento.setHistorial(historial);
        tratamiento.setMedicamento(medicamento);
        tratamiento.setDescripcion(payload.get("descripcion"));
        tratamiento.setDosis(payload.get("dosis"));
        tratamiento.setFechaInicio(LocalDate.parse(payload.get("fechaInicio")));
        tratamiento.setFechaFin(LocalDate.parse(payload.get("fechaFin")));
        Tratamiento guardado = repository.save(tratamiento);

        Map<String, Object> response = new HashMap<>();
        response.put("id", guardado.getIdTratamiento());
        response.put("mensaje", "Tratamiento registrado");
        return ResponseEntity.ok(response);
    }
}
