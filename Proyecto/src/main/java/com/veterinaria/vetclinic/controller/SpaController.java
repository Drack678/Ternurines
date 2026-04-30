package com.veterinaria.vetclinic.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    @GetMapping({"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String forwardSpa() {
        return "forward:/index.html";
    }
}
