package com.ternurines.features.auth;

/**
 * Respuesta devuelta tras un login exitoso con los datos del usuario autenticado.
 *
 * @param id      identificador del usuario en su tabla de rol
 * @param usuario nombre del usuario
 * @param correo  correo electrónico del usuario
 * @param rol     rol asignado (ADMINISTRADOR, RECEPCIONISTA, VETERINARIO o CLIENTE)
 */
public record LoginResponse(Integer id, String usuario, String correo, String rol) {}
