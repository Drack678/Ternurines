package com.veterinaria.vetclinic.controller;

import com.veterinaria.vetclinic.entity.Usuario;
import com.veterinaria.vetclinic.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        if (usuario.getRol() != null) {
            usuario.setRol(usuario.getRol().toUpperCase());
        }
        return repository.save(usuario);
    }
}
