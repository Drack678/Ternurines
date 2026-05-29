package com.ternurines.features.dashboard;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
public class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Test
    void getSummaryShouldReturnOk() throws Exception {
        when(jdbcTemplate.queryForObject(org.mockito.ArgumentMatchers.anyString(), eq(Integer.class))).thenReturn(0);
        when(jdbcTemplate.query(org.mockito.ArgumentMatchers.anyString(), any(org.springframework.jdbc.core.BeanPropertyRowMapper.class))).thenReturn(List.of());
        mockMvc.perform(get("/api/dashboard/summary").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
