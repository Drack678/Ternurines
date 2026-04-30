package com.veterinaria.vetclinic.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {
    @GetMapping("/me")
    public Map<String, Object> currentUser(Authentication authentication) {
        Map<String, Object> userInfo = new HashMap<>();
        if (authentication == null) {
            userInfo.put("authenticated", false);
            return userInfo;
        }
        userInfo.put("authenticated", true);
        userInfo.put("username", authentication.getName());
        userInfo.put("roles", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        return userInfo;
    }
}
