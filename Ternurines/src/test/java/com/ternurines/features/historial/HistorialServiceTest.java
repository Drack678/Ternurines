package com.ternurines.features.historial;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class HistorialServiceTest {

    private JdbcTemplate jdbcTemplate;
    private HistorialService service;

    @BeforeEach
    void setup() {
        jdbcTemplate = mock(JdbcTemplate.class);
        service = new HistorialService(jdbcTemplate);
    }

    @Test
    void obtenerHistorialesShouldReturnEmptyListWhenNoData() {
        when(jdbcTemplate.query(anyString(), any(BeanPropertyRowMapper.class))).thenReturn(List.of());
        assertEquals(0, service.obtenerHistoriales().size());
    }

    @Test
    void crearHistorialShouldReturnHistorialResponseWithSameData() {
        HistorialRequest request = new HistorialRequest();
        request.setIdMascota(1);
        request.setIdVeterinario(2);
        request.setDiagnostico("Dolor");
        request.setObservaciones("Observación breve");

        when(jdbcTemplate.queryForObject(anyString(), any(Object[].class), any(Class.class))).thenReturn(10);
        HistorialResponse response = service.crearHistorial(request);

        assertEquals(1, response.getIdMascota());
        assertEquals(2, response.getIdVeterinario());
        assertEquals("Dolor", response.getDiagnostico());
        assertEquals("Observación breve", response.getObservaciones());
    }
}
