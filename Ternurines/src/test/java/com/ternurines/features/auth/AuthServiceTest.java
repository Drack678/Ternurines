package com.ternurines.features.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;

import java.sql.ResultSet;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthServiceTest {

    private JdbcTemplate jdbcTemplate;
    private AuthService authService;

    @BeforeEach
    void setup() {
        jdbcTemplate = mock(JdbcTemplate.class);
        authService = new AuthService(jdbcTemplate);
    }

    @Test
    void authenticateReturnsLoginResponseWhenAdminExists() throws Exception {
        when(jdbcTemplate.query(eq("SELECT id_administrador AS id, nombre, correo FROM administrador WHERE correo = ? AND contrasena = ?"), any(Object[].class), any(ResultSetExtractor.class)))
                .thenAnswer(invocation -> {
                    ResultSetExtractor<?> extractor = invocation.getArgument(2);
                    ResultSet rs = mock(ResultSet.class);
                    when(rs.next()).thenReturn(true);
                    when(rs.getInt("id")).thenReturn(1);
                    when(rs.getString("nombre")).thenReturn("Admin Test");
                    when(rs.getString("correo")).thenReturn("admin@example.com");
                    return extractor.extractData(rs);
                });

        LoginResponse response = authService.authenticate(new LoginRequest("admin@example.com", "secret"));

        assertNotNull(response);
        assertEquals(1, response.id());
        assertEquals("Admin Test", response.usuario());
        assertEquals("ADMINISTRADOR", response.rol());
    }
}
