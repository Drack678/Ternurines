package com.veterinaria.vetclinic.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                 UserDetailsService userDetailsService,
                                                 RoleBasedAuthenticationSuccessHandler successHandler) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/login", "/login.html", "/index.html", "/favicon.ico",
                                "/css/**", "/js/**", "/images/**", "/**/*.svg", "/**/*.ico"
                        ).permitAll()
                        .requestMatchers("/admin.html", "/admin-*.html").hasRole("ADMIN")
                        .requestMatchers("/veterinario.html", "/veterinario-*.html").hasRole("VETERINARIO")
                        .requestMatchers("/recepcionista.html", "/recepcionista-*.html").hasRole("RECEPCIONISTA")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/login")
                        .successHandler(successHandler)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}
