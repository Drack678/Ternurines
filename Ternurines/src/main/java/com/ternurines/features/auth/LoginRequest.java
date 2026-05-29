package com.ternurines.features.auth;

/**
 * Registro que representa la solicitud de inicio de sesión.
 * 
 * Este record encapsula las credenciales necesarias para autenticar
 * un usuario en el sistema.
 * 
 * @param correo La dirección de correo electrónico del usuario
 * @param contrasena La contraseña del usuario
 */
public record LoginRequest(String correo, String contrasena) {}
