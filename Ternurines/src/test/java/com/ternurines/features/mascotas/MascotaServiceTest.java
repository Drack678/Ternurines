package com.ternurines.features.mascotas;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class MascotaServiceTest {

    private MascotaRepository repository;
    private MascotaService service;

    @BeforeEach
    void setup() {
        repository = mock(MascotaRepository.class);
        service = new MascotaService(repository);
    }

    @Test
    void listAllShouldReturnMascotas() {
        when(repository.findAll()).thenReturn(List.of(new Mascota()));
        service.listAll();
        verify(repository).findAll();
    }

    @Test
    void createShouldSaveMascota() {
        Mascota mascota = new Mascota();
        service.create(mascota);
        verify(repository).save(mascota);
    }
}
