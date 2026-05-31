package com.ternurines.features.clientes;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de negocio para operaciones transaccionales sobre clientes.
 */
@Service
public class ClienteService {

    private final ClienteRepository repository;

    /**
     * Construye el servicio con el repositorio de clientes inyectado.
     *
     * @param repository repositorio de acceso a datos de clientes
     */
    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    /**
     * Lista todos los clientes registrados.
     *
     * @return lista de clientes
     */
    public List<Cliente> listAll() {
        return repository.findAll();
    }

    /**
     * Crea un nuevo cliente en la base de datos.
     *
     * @param cliente entidad con los datos a persistir
     */
    @Transactional
    public void create(Cliente cliente) {
        repository.save(cliente);
    }

    /**
     * Actualiza los datos de un cliente existente.
     *
     * @param id      identificador del cliente
     * @param cliente entidad con los campos actualizados
     */
    @Transactional
    public void update(int id, Cliente cliente) {
        cliente.setIdCliente(id);
        repository.update(cliente);
    }

    /**
     * Elimina un cliente por su identificador.
     *
     * @param id identificador del cliente
     */
    @Transactional
    public void delete(int id) {
        repository.delete(id);
    }
}
