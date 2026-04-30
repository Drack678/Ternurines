package com.veterinaria.vetclinic.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
public class RoleBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        String redirectUrl = "/login?error=true";
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        if (authorities.stream().anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"))) {
            redirectUrl = "/admin.html";
        } else if (authorities.stream().anyMatch(role -> role.getAuthority().equals("ROLE_VETERINARIO"))) {
            redirectUrl = "/veterinario.html";
        } else if (authorities.stream().anyMatch(role -> role.getAuthority().equals("ROLE_RECEPCIONISTA"))) {
            redirectUrl = "/recepcionista.html";
        }

        response.sendRedirect(redirectUrl);
    }
}
