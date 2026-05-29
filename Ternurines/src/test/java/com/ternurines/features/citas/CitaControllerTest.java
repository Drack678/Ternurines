package com.ternurines.features.citas;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CitaController.class)
public class CitaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CitaService citaService;

    @Test
    void getAllShouldReturnOk() throws Exception {
        when(citaService.listAll()).thenReturn(List.of(new Cita()));
        mockMvc.perform(get("/api/citas")).andExpect(status().isOk());
    }

    @Test
    void addShouldReturnOkWhenCitaPosted() throws Exception {
        mockMvc.perform(post("/api/citas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"idMascota\":1,\"idVeterinario\":2,\"idRecepcionista\":3,\"fecha\":\"2026-05-29\",\"hora\":\"10:00:00\",\"motivo\":\"Consulta\"}"))
                .andExpect(status().isOk());
    }
}
