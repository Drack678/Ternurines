package com.ternurines.features.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST de autenticación.
 * Expone POST /api/auth/login para validar credenciales y devolver los datos del usuario autenticado.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    /**
     * Construye el controlador con el servicio de autenticación inyectado.
     *
     * @param authService servicio que valida credenciales contra la base de datos
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Autentica al usuario con las credenciales recibidas.
     *
     * @param request cuerpo con correo y contraseña
     * @return 200 con los datos del usuario autenticado, o 400 si la solicitud es inválida
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.authenticate(request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
