package com.ternurines.features.auth;

/**
 * Objeto de transferencia de datos que representa la carga de respuesta
 * para operaciones de inicio de sesión (login).
 *
 * <p>Esta clase inmutable (record) contiene la información mínima que el
 * servidor devuelve al cliente tras un proceso de autenticación exitoso.
 *
 * Componentes:
 * <ul>
 *   <li>id: Identificador único del usuario.</li>
 *   <li>usuario: Nombre de usuario o alias.</li>
 *   <li>correo: Dirección de correo electrónico asociada al usuario.</li>
 *   <li>rol: Rol o perfil del usuario (por ejemplo: "ADMIN", "USER").</li>
 * </ul>
 *
 * @param id Identificador único del usuario.
 * @param usuario Nombre de usuario o alias.
 * @param correo Dirección de correo electrónico del usuario.
 * @param rol Rol o perfil del usuario.
 */
public record LoginResponse(Integer id, String usuario, String correo, String rol) {}
