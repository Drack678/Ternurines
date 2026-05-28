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

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    private final MedicamentoRepository medicamentoRepository;
    private final ProductoRepository productoRepository;

    public InventarioController(MedicamentoRepository medicamentoRepository, ProductoRepository productoRepository) {
        this.medicamentoRepository = medicamentoRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getInventario() {
        return ResponseEntity.ok(Map.of(
                "medicamentos", medicamentoRepository.findAll(),
                "productos", productoRepository.findAll()
        ));
    }

    @PostMapping("/medicamentos")
    public ResponseEntity<Void> addMedicamento(@RequestBody Medicamento medicamento) {
        medicamentoRepository.save(medicamento);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/medicamentos/{id}")
    public ResponseEntity<Void> updateMedicamento(@PathVariable int id, @RequestBody Medicamento medicamento) {
        medicamento.setIdMedicamento(id);
        medicamentoRepository.update(medicamento);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/medicamentos/{id}/stock/{delta}")
    public ResponseEntity<Void> adjustMedicamentoStock(@PathVariable int id, @PathVariable int delta) {
        medicamentoRepository.adjustStock(id, delta);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/medicamentos/{id}")
    public ResponseEntity<Void> deleteMedicamento(@PathVariable int id) {
        medicamentoRepository.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/productos")
    public ResponseEntity<Void> addProducto(@RequestBody Producto producto) {
        productoRepository.save(producto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<Void> updateProducto(@PathVariable int id, @RequestBody Producto producto) {
        producto.setIdProducto(id);
        productoRepository.update(producto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/productos/{id}/stock/{delta}")
    public ResponseEntity<Void> adjustProductoStock(@PathVariable int id, @PathVariable int delta) {
        productoRepository.adjustStock(id, delta);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable int id) {
        productoRepository.delete(id);
        return ResponseEntity.ok().build();
    }
}
