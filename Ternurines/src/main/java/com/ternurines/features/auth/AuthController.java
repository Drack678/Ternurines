package com.ternurines.features.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
/**
 * Controlador REST que expone endpoints para gestionar operaciones de autenticación.
 *
 * <p>Este controlador proporciona endpoints relacionados con la autenticación como
 * login. Delega la lógica de autenticación actual a una instancia de {@link AuthService}
 * y traduce los resultados del servicio en respuestas HTTP apropiadas.</p>
 *
 * <p>Endpoints de ejemplo:
 * <ul>
 *   <li>POST /api/auth/login - autenticar un usuario y retornar un token o información de sesión</li>
 * </ul>
 * </p>
 */
public class AuthController {

    /** Servicio que realiza operaciones de autenticación. Inyectado por Spring. */
    private final AuthService authService;

    /**
     * Crea un nuevo {@code AuthController}.
     *
     * @param authService el servicio de autenticación utilizado para validar credenciales
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    /**
     * Autentica un usuario utilizando las credenciales proporcionadas.
     *
     * @param request la solicitud de login que contiene las credenciales (usuario/contraseña o similar)
     * @return 200 OK con una {@link LoginResponse} cuando la autenticación es exitosa, o
     *         400 Bad Request cuando la solicitud es inválida (por ejemplo campos faltantes)
     */
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.authenticate(request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
