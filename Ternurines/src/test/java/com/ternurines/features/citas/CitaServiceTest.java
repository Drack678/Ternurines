package com.ternurines.features.citas;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class CitaServiceTest {

    private CitaRepository repository;
    private CitaService service;

    @BeforeEach
    void setup() {
        repository = mock(CitaRepository.class);
        service = new CitaService(repository);
    }

    @Test
    void createShouldSaveCitaWhenVeterinarioIsAvailable() {
        Cita cita = new Cita();
        cita.setIdMascota(1);
        cita.setIdVeterinario(2);
        cita.setIdRecepcionista(3);
        cita.setFecha(LocalDate.now());
        cita.setHora(LocalTime.of(10, 0));
        cita.setMotivo("Consulta general");

        when(repository.isVeterinarioDisponible(cita)).thenReturn(true);
        service.create(cita);
        verify(repository).save(cita);
    }

    @Test
    void createShouldThrowWhenVeterinarioNotAvailable() {
        Cita cita = new Cita();
        cita.setIdVeterinario(2);
        cita.setFecha(LocalDate.now());
        cita.setHora(LocalTime.of(10, 0));

        when(repository.isVeterinarioDisponible(cita)).thenReturn(false);
        assertThrows(IllegalArgumentException.class, () -> service.create(cita));
    }
}
