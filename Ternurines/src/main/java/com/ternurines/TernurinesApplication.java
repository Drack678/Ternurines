package com.ternurines;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicación Spring Boot que inicia el backend de Ternurines.
 */
@SpringBootApplication
public class TernurinesApplication {

    /**
     * Arranca el contexto de Spring Boot y levanta el servidor embebido.
     *
     * @param args argumentos de línea de comandos pasados a la aplicación
     */
    public static void main(String[] args) {
        SpringApplication.run(TernurinesApplication.class, args);
    }
}
