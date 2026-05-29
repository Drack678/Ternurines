package com.ternurines.features.servicio;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ServicioController.class)
public class ServicioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ServicioRepository servicioRepository;

    @Test
    void getAllShouldReturnOk() throws Exception {
        when(servicioRepository.findAll()).thenReturn(List.of(new Servicio()));
        mockMvc.perform(get("/api/servicios")).andExpect(status().isOk());
    }
}
