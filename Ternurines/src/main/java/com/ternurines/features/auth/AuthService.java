package com.ternurines.features.auth;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JdbcTemplate jdbcTemplate;

    public AuthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public LoginResponse authenticate(LoginRequest request) {
        String sqlAdmin = "SELECT id_administrador AS id, nombre, correo FROM administrador WHERE correo = ? AND contrasena = ?";
        String sqlRecep = "SELECT id_recepcionista AS id, nombre, correo FROM recepcionista WHERE correo = ? AND contrasena = ?";
        String sqlVet = "SELECT id_veterinario AS id, nombre, correo FROM veterinario WHERE correo = ? AND contrasena = ?";
        String sqlCliente = "SELECT id_cliente AS id, nombre, correo FROM cliente WHERE correo = ? AND contrasena = ?";

        return authenticateUser(request, sqlAdmin, "ADMINISTRADOR")
                .or(() -> authenticateUser(request, sqlRecep, "RECEPCIONISTA"))
                .or(() -> authenticateUser(request, sqlVet, "VETERINARIO"))
                .or(() -> authenticateUser(request, sqlCliente, "CLIENTE"))
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas"));
    }

    private java.util.Optional<LoginResponse> authenticateUser(LoginRequest request, String sql, String role) {
        return jdbcTemplate.query(sql, new Object[]{request.correo(), request.contrasena()}, rs -> {
            if (rs.next()) {
                return java.util.Optional.of(new LoginResponse(rs.getInt("id"), rs.getString("nombre"), rs.getString("correo"), role));
            }
            return java.util.Optional.empty();
        });
    }
}
