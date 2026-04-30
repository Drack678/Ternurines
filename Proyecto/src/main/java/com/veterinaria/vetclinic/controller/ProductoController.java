package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.Producto;
import com.veterinaria.vetclinic.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/productos")
public class ProductoController {
    private final ProductoRepository repository;

    public ProductoController(ProductoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Producto> listar() {
        return repository.findAll();
    }
}
