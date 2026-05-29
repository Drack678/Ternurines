package com.ternurines.features.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    void loginShouldReturnOkWhenCredentialsAreValid() throws Exception {
        LoginRequest request = new LoginRequest("admin@example.com", "secret");
        LoginResponse response = new LoginResponse(1, "Admin", "admin@example.com", "ADMINISTRADOR");

        when(authService.authenticate(request)).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"admin@example.com\",\"contrasena\":\"secret\"}"))
                .andExpect(status().isOk());
    }
}
