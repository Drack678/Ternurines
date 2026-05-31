package com.ternurines.features.inventario;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controlador REST del inventario bajo /api/inventario.
 * Gestiona medicamentos y productos, incluyendo ajustes de stock.
 */
@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    private final MedicamentoRepository medicamentoRepository;
    private final ProductoRepository productoRepository;

    /**
     * Construye el controlador con los repositorios de inventario inyectados.
     *
     * @param medicamentoRepository repositorio de medicamentos
     * @param productoRepository    repositorio de productos
     */
    public InventarioController(MedicamentoRepository medicamentoRepository, ProductoRepository productoRepository) {
        this.medicamentoRepository = medicamentoRepository;
        this.productoRepository = productoRepository;
    }

    /**
     * Obtiene el inventario completo de medicamentos y productos.
     *
     * @return mapa con listas de medicamentos y productos
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getInventario() {
        return ResponseEntity.ok(Map.of(
                "medicamentos", medicamentoRepository.findAll(),
                "productos", productoRepository.findAll()
        ));
    }

    /**
     * Registra un nuevo medicamento en el inventario.
     *
     * @param medicamento datos del medicamento a crear
     * @return 200 si la creación fue exitosa
     */
    @PostMapping("/medicamentos")
    public ResponseEntity<Void> addMedicamento(@RequestBody Medicamento medicamento) {
        medicamentoRepository.save(medicamento);
        return ResponseEntity.ok().build();
    }

    /**
     * Actualiza un medicamento existente por su identificador.
     *
     * @param id          identificador del medicamento
     * @param medicamento datos actualizados
     * @return 200 si la actualización fue exitosa
     */
    @PutMapping("/medicamentos/{id}")
    public ResponseEntity<Void> updateMedicamento(@PathVariable int id, @RequestBody Medicamento medicamento) {
        medicamento.setIdMedicamento(id);
        medicamentoRepository.update(medicamento);
        return ResponseEntity.ok().build();
    }

    /**
     * Ajusta el stock de un medicamento sumando o restando una cantidad.
     *
     * @param id    identificador del medicamento
     * @param delta cantidad a sumar (negativa para restar)
     * @return 200 si el ajuste fue exitoso
     */
    @PatchMapping("/medicamentos/{id}/stock/{delta}")
    public ResponseEntity<Void> adjustMedicamentoStock(@PathVariable int id, @PathVariable int delta) {
        medicamentoRepository.adjustStock(id, delta);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina un medicamento del inventario por su identificador.
     *
     * @param id identificador del medicamento
     * @return 200 si la eliminación fue exitosa
     */
    @DeleteMapping("/medicamentos/{id}")
    public ResponseEntity<Void> deleteMedicamento(@PathVariable int id) {
        medicamentoRepository.delete(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Registra un nuevo producto en el inventario.
     *
     * @param producto datos del producto a crear
     * @return 200 si la creación fue exitosa
     */
    @PostMapping("/productos")
    public ResponseEntity<Void> addProducto(@RequestBody Producto producto) {
        productoRepository.save(producto);
        return ResponseEntity.ok().build();
    }

    /**
     * Actualiza un producto existente por su identificador.
     *
     * @param id       identificador del producto
     * @param producto datos actualizados
     * @return 200 si la actualización fue exitosa
     */
    @PutMapping("/productos/{id}")
    public ResponseEntity<Void> updateProducto(@PathVariable int id, @RequestBody Producto producto) {
        producto.setIdProducto(id);
        productoRepository.update(producto);
        return ResponseEntity.ok().build();
    }

    /**
     * Ajusta el stock de un producto sumando o restando una cantidad.
     *
     * @param id    identificador del producto
     * @param delta cantidad a sumar (negativa para restar)
     * @return 200 si el ajuste fue exitosa
     */
    @PatchMapping("/productos/{id}/stock/{delta}")
    public ResponseEntity<Void> adjustProductoStock(@PathVariable int id, @PathVariable int delta) {
        productoRepository.adjustStock(id, delta);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina un producto del inventario por su identificador.
     *
     * @param id identificador del producto
     * @return 200 si la eliminación fue exitosa
     */
    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable int id) {
        productoRepository.delete(id);
        return ResponseEntity.ok().build();
    }
}
