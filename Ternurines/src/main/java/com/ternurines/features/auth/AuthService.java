package com.ternurines.features.auth;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

/**
 * Servicio de autenticación.
 * Valida credenciales contra las tablas de administrador, recepcionista, veterinario y cliente.
 */
@Service
public class AuthService {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el servicio con acceso JDBC a la base de datos.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas SQL de autenticación
     */
    public AuthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Busca al usuario en cada rol hasta encontrar credenciales válidas.
     *
     * @param request solicitud con correo y contraseña
     * @return respuesta con id, nombre, correo y rol del usuario autenticado
     * @throws IllegalArgumentException si ningún rol coincide con las credenciales
     */
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

    /**
     * Ejecuta la consulta SQL para un rol concreto y devuelve el resultado si hay coincidencia.
     *
     * @param request solicitud con correo y contraseña
     * @param sql     consulta parametrizada para el rol
     * @param role    nombre del rol a asignar en la respuesta
     * @return respuesta de login si las credenciales coinciden, vacío en caso contrario
     */
    private java.util.Optional<LoginResponse> authenticateUser(LoginRequest request, String sql, String role) {
        return jdbcTemplate.query(sql, new Object[]{request.correo(), request.contrasena()}, rs -> {
            if (rs.next()) {
                return java.util.Optional.of(new LoginResponse(rs.getInt("id"), rs.getString("nombre"), rs.getString("correo"), role));
            }
            return java.util.Optional.empty();
        });
    }
}
