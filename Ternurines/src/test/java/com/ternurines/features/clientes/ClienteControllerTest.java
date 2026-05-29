package com.ternurines.features.clientes;

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

@WebMvcTest(ClienteController.class)
public class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClienteService clienteService;

    @Test
    void getAllShouldReturnOk() throws Exception {
        when(clienteService.listAll()).thenReturn(List.of(new Cliente()));
        mockMvc.perform(get("/api/clientes")).andExpect(status().isOk());
    }

    @Test
    void addShouldAcceptNewCliente() throws Exception {
        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Test\",\"documento\":\"1234\",\"telefono\":\"555\"}"))
                .andExpect(status().isOk());
    }
}
