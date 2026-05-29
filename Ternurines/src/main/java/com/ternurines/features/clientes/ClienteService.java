package com.ternurines.features.clientes;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
/**
 * Business service layer for cliente management and transactional logic.
 */
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listAll() {
        return repository.findAll();
    }

    @Transactional
    public void create(Cliente cliente) {
        repository.save(cliente);
    }

    @Transactional
    public void update(int id, Cliente cliente) {
        cliente.setIdCliente(id);
        repository.update(cliente);
    }

    @Transactional
    public void delete(int id) {
        repository.delete(id);
    }
}
