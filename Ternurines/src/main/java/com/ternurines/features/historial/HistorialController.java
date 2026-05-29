package com.ternurines.features.historial;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
/**
 * HTTP REST controller that exposes endpoints to manage historial operations.
 */
public class HistorialController {

    private final HistorialService historialService;

    public HistorialController(HistorialService historialService) {
        this.historialService = historialService;
    }

    @GetMapping
    public ResponseEntity<List<HistorialResponse>> getHistoriales() {
        return ResponseEntity.ok(historialService.obtenerHistoriales());
    }

    @GetMapping("/mascotas")
    public ResponseEntity<List<HistorialMascota>> getMascotasParaHistorial() {
        return ResponseEntity.ok(historialService.obtenerMascotas());
    }

    @GetMapping("/veterinarios")
    public ResponseEntity<List<Veterinario>> getVeterinarios() {
        return ResponseEntity.ok(historialService.obtenerVeterinarios());
    }

    @GetMapping("/medicamentos")
    public ResponseEntity<List<MedicamentoRef>> getMedicamentos() {
        return ResponseEntity.ok(historialService.obtenerMedicamentos());
    }

    @GetMapping("/mascota/{id}")
    public ResponseEntity<List<HistorialResponse>> getHistorialPorMascota(@PathVariable int id) {
        return ResponseEntity.ok(historialService.obtenerHistorialPorMascota(id));
    }

    @PostMapping
    public ResponseEntity<HistorialResponse> crearHistorial(@Valid @RequestBody HistorialRequest request) {
        HistorialResponse creado = historialService.crearHistorial(request);
        return ResponseEntity.ok(creado);
    }

    @PostMapping("/{historialId}/tratamientos")
    public ResponseEntity<Tratamiento> crearTratamiento(@PathVariable int historialId,
                                                       @Valid @RequestBody TratamientoRequest request) {
        Tratamiento tratamiento = historialService.crearTratamiento(historialId, request);
        return ResponseEntity.ok(tratamiento);
    }
}
