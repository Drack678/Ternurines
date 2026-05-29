package com.ternurines.features.operations;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OperationsController.class)
public class OperationsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Test
    void usuariosEndpointShouldReturnOk() throws Exception {
        when(jdbcTemplate.queryForList(org.mockito.ArgumentMatchers.anyString())).thenReturn(java.util.List.of(java.util.Map.of("id", 1)));
        mockMvc.perform(get("/api/operaciones/usuarios")).andExpect(status().isOk());
    }
}
