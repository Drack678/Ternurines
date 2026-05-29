package com.ternurines.features.auth;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
/**
 * Business service layer for auth management and transactional logic.
 * 
 * Esta clase es responsable de autenticar usuarios de diferentes roles en el sistema.
 * Soporta autenticación para administradores, recepcionistas, veterinarios y clientes.
 * 
 * @author Ternurines
 * @version 1.0
 */
public class AuthService {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Constructor que inyecta la dependencia de JdbcTemplate.
     * 
     * @param jdbcTemplate plantilla JDBC para ejecutar consultas a la base de datos
     */
    public AuthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Autentica un usuario verificando sus credenciales en las diferentes tablas de roles.
     * 
     * Intenta autenticar al usuario en el siguiente orden:
     * 1. Como administrador
     * 2. Como recepcionista
     * 3. Como veterinario
     * 4. Como cliente
     * 
     * @param request objeto con las credenciales del usuario (correo y contraseña)
     * @return LoginResponse con los datos del usuario autenticado y su rol
     * @throws IllegalArgumentException si las credenciales son incorrectas o el usuario no existe
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
     * Método privado que ejecuta la consulta de autenticación para un rol específico.
     * 
     * @param request objeto con las credenciales del usuario
     * @param sql consulta SQL parametrizada para buscar el usuario
     * @param role nombre del rol que se está validando
     * @return Optional con LoginResponse si el usuario existe y sus credenciales son válidas, 
     *         Optional vacío en caso contrario
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
