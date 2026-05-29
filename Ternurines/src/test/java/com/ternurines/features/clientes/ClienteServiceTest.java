package com.ternurines.features.clientes;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ClienteServiceTest {

    private ClienteRepository repository;
    private ClienteService service;

    @BeforeEach
    void setup() {
        repository = mock(ClienteRepository.class);
        service = new ClienteService(repository);
    }

    @Test
    void listAllShouldReturnAllClientes() {
        when(repository.findAll()).thenReturn(List.of(new Cliente()));
        service.listAll();
        verify(repository).findAll();
    }

    @Test
    void createShouldSaveCliente() {
        Cliente cliente = new Cliente();
        service.create(cliente);
        verify(repository).save(cliente);
    }
}
