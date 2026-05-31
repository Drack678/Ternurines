package com.ternurines.features.historial;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST del historial médico bajo /api/historial.
 * Consulta historiales, catálogos auxiliares y creación de historiales y tratamientos.
 */
@RestController
@RequestMapping("/api/historial")
public class HistorialController {

    private final HistorialService historialService;

    /**
     * Construye el controlador con el servicio de historial inyectado.
     *
     * @param historialService servicio de lógica de negocio del historial médico
     */
    public HistorialController(HistorialService historialService) {
        this.historialService = historialService;
    }

    /**
     * Obtiene todos los historiales médicos con sus tratamientos asociados.
     *
     * @return lista de historiales ordenados por fecha descendente
     */
    @GetMapping
    public ResponseEntity<List<HistorialResponse>> getHistoriales() {
        return ResponseEntity.ok(historialService.obtenerHistoriales());
    }

    /**
     * Lista las mascotas disponibles para registrar un historial médico.
     *
     * @return mascotas con nombre del cliente propietario
     */
    @GetMapping("/mascotas")
    public ResponseEntity<List<HistorialMascota>> getMascotasParaHistorial() {
        return ResponseEntity.ok(historialService.obtenerMascotas());
    }

    /**
     * Lista los veterinarios disponibles para asignar a un historial.
     *
     * @return veterinarios con nombre y especialidad
     */
    @GetMapping("/veterinarios")
    public ResponseEntity<List<Veterinario>> getVeterinarios() {
        return ResponseEntity.ok(historialService.obtenerVeterinarios());
    }

    /**
     * Lista los medicamentos del inventario para asignar a tratamientos.
     *
     * @return referencias de medicamentos con stock y precio
     */
    @GetMapping("/medicamentos")
    public ResponseEntity<List<MedicamentoRef>> getMedicamentos() {
        return ResponseEntity.ok(historialService.obtenerMedicamentos());
    }

    /**
     * Obtiene el historial médico de una mascota específica.
     *
     * @param id identificador de la mascota
     * @return historiales de la mascota con sus tratamientos
     */
    @GetMapping("/mascota/{id}")
    public ResponseEntity<List<HistorialResponse>> getHistorialPorMascota(@PathVariable int id) {
        return ResponseEntity.ok(historialService.obtenerHistorialPorMascota(id));
    }

    /**
     * Crea un nuevo registro de historial médico.
     *
     * @param request datos validados del historial a crear
     * @return historial creado con su identificador asignado
     */
    @PostMapping
    public ResponseEntity<HistorialResponse> crearHistorial(@Valid @RequestBody HistorialRequest request) {
        HistorialResponse creado = historialService.crearHistorial(request);
        return ResponseEntity.ok(creado);
    }

    /**
     * Registra un tratamiento asociado a un historial médico existente.
     *
     * @param historialId identificador del historial médico
     * @param request       datos validados del tratamiento
     * @return tratamiento creado con su identificador asignado
     */
    @PostMapping("/{historialId}/tratamientos")
    public ResponseEntity<Tratamiento> crearTratamiento(@PathVariable int historialId,
                                                       @Valid @RequestBody TratamientoRequest request) {
        Tratamiento tratamiento = historialService.crearTratamiento(historialId, request);
        return ResponseEntity.ok(tratamiento);
    }
}
