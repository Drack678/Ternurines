# Ternurines

Aplicación veterinaria con Spring Boot, PostgreSQL y frontend estático inspirada en las interfaces del proyecto.

## Características
- Backend Java Spring Boot con JDBC y transacciones
- Inicio completo con Docker Compose
- PostgreSQL con script de esquema y datos de prueba
- Frontend responsivo con diseño similar al dashboard e interfaz de login
- Arquitectura de carpetas basada en módulos (pattern atomic en frontend)

## Ejecutar
Desde la raíz del proyecto:

```bash
docker compose up --build
```

Si ya existía un despliegue anterior con el nombre de base de datos antiguo, usa `docker compose down -v` antes de volver a iniciar para recrear el volumen de PostgreSQL.

Luego abrir:

- `http://localhost:8080/`

## Credenciales de prueba
- admin@veterinaria.com / admin12345
- ana.recep@veterinaria.com / recep12345
- roberto.vet@vet.com / vet12345

## Estructura
- `src/main/java/com/ternurines/features` — módulos de negocio
- `src/main/resources/static` — frontend atómico con `assets/css`, `assets/js`
- `src/main/resources/db/init.sql` — creación de esquema y datos de prueba
