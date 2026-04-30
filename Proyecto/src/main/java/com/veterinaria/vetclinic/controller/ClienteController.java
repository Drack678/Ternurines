package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.Cliente;
import com.veterinaria.vetclinic.repository.ClienteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/clientes")
public class ClienteController {
    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @GetMapping
    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    @PostMapping
    public Cliente crear(@RequestBody Cliente cliente) {
        return clienteRepository.save(cliente);
    }
}
