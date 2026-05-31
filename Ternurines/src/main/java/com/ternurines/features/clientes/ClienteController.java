package com.ternurines.features.clientes;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST de clientes bajo /api/clientes.
 * CRUD básico: listar, crear, actualizar y eliminar.
 */
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    /**
     * Construye el controlador con el servicio de clientes inyectado.
     *
     * @param clienteService servicio de lógica de negocio de clientes
     */
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /**
     * Obtiene todos los clientes registrados.
     *
     * @return lista de clientes ordenados por nombre
     */
    @GetMapping
    public ResponseEntity<List<Cliente>> getAll() {
        return ResponseEntity.ok(clienteService.listAll());
    }

    /**
     * Registra un nuevo cliente.
     *
     * @param cliente datos del cliente a crear
     * @return 200 si la creación fue exitosa
     */
    @PostMapping
    public ResponseEntity<Void> add(@RequestBody Cliente cliente) {
        clienteService.create(cliente);
        return ResponseEntity.ok().build();
    }

    /**
     * Actualiza un cliente existente por su identificador.
     *
     * @param id      identificador del cliente
     * @param cliente datos actualizados
     * @return 200 si la actualización fue exitosa
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Cliente cliente) {
        clienteService.update(id, cliente);
        return ResponseEntity.ok().build();
    }

    /**
     * Elimina un cliente por su identificador.
     *
     * @param id identificador del cliente
     * @return 200 si la eliminación fue exitosa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        clienteService.delete(id);
        return ResponseEntity.ok().build();
    }
}
