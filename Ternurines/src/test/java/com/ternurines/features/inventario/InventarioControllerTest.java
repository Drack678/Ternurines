package com.ternurines.features.inventario;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InventarioController.class)
public class InventarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MedicamentoRepository medicamentoRepository;

    @MockBean
    private ProductoRepository productoRepository;

    @Test
    void getInventarioShouldReturnOk() throws Exception {
        when(medicamentoRepository.findAll()).thenReturn(List.of(new Medicamento()));
        when(productoRepository.findAll()).thenReturn(List.of(new Producto()));
        mockMvc.perform(get("/api/inventario")).andExpect(status().isOk());
    }
}
