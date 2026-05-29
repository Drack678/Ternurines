# Ternurines

Ternurines es una aplicación de gestión veterinaria construida con Spring Boot, PostgreSQL y un frontend estático. El sistema ofrece control de clientes, mascotas, citas, servicios, inventario y un dashboard administrativo con datos reales extraídos de la base de datos.

## Características principales
- Backend Java Spring Boot con JDBC para acceso SQL directo
- Dashboard administrativo con métricas y próximas citas
- Autenticación de usuario para administrador, recepcionista, veterinario y cliente
- Administración de clientes, mascotas, citas, servicios, inventario y historial médico
- Base de datos PostgreSQL inicializada con `src/main/resources/db/init.sql`
- Frontend estático servido desde `src/main/resources/static`

## Tecnologías
- Java 21
- Spring Boot 3.x
- PostgreSQL
- Maven
- JUnit 5
- Mockito
- Docker Compose

## Requisitos
- Java 21 installed
- Maven 3.8+ installed
- Docker and Docker Compose if running with containers

## Ejecutar en Docker
Desde la raíz del proyecto:

```bash
docker compose up --build
```

Si necesitas reiniciar la base de datos y recrear volúmenes:

```bash
docker compose down -v
```

Abre el navegador en:

- `http://localhost:8080/`

## Ejecutar localmente con Maven
Desde la raíz del proyecto:

```bash
mvn spring-boot:run
```

El frontend se sirve automáticamente en `http://localhost:8080/`.

## Pruebas
Para ejecutar el conjunto de pruebas unitarias:

```bash
mvn test
```

## Credenciales de prueba
- Administrador: `admin@veterinaria.com` / `admin12345`
- Recepcionista: `ana.recep@veterinaria.com` / `recep12345`
- Veterinario: `roberto.vet@vet.com` / `vet12345`

## API disponibles
- `POST /api/auth/login` — inicio de sesión
- `GET /api/dashboard/summary` — resumen de métricas del dashboard
- `GET /api/citas` — lista de citas
- `POST /api/citas` — crear una cita
- `PUT /api/citas/{id}` — actualizar cita
- `DELETE /api/citas/{id}` — eliminar cita
- `GET /api/clientes` — lista de clientes
- `POST /api/clientes` — crear cliente
- `GET /api/mascotas` — lista de mascotas
- `POST /api/mascotas` — crear mascota
- `GET /api/servicios` — lista de servicios
- `POST /api/servicios` — crear servicio
- `GET /api/inventario` — lista de inventario
- `POST /api/inventario/medicamentos` — crear medicamento
- `POST /api/inventario/productos` — crear producto

## Estructura del proyecto
- `src/main/java/com/ternurines` — aplicación Spring Boot
- `src/main/java/com/ternurines/features` — módulos por dominio
- `src/main/resources/static` — frontend HTML, CSS y JavaScript
- `src/main/resources/db/init.sql` — esquema y datos de prueba de PostgreSQL

## Notas de mantenimiento
- La lógica de dashboard usa consultas SQL para extraer métricas reales de la base de datos
- La aplicación está organizada por dominio para facilitar futuras extensiones
- La documentación de clases Java se agregó en todos los modelos, controladores, servicios y repositorios
