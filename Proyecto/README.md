# Veterinary Clinic App

Aplicación demo de clínica veterinaria usando Spring Boot y un frontend basado en el patrón Atomic Design.

## Estructura creada
- `src/main/java/com/veterinaria/vetclinic` - backend Spring Boot
- `src/main/resources/static/js/components/atoms` - componentes más pequeños
- `src/main/resources/static/js/components/molecules` - componentes compuestos
- `src/main/resources/static/js/components/organisms` - secciones amplias
- `src/main/resources/static/js/pages` - páginas completas
- `src/main/resources/static/css` - estilos globales
- `src/main/resources/data.sql` - datos iniciales con la base de datos provista

## Sprint 1
- Estructura de entidades principales: `Cliente`, `Mascota`, `Veterinario`, `Recepcionista`, `Cita`, `Servicio`
- Endpoints REST para consultas básicas de clientes, mascotas, citas y servicios
- Interfaz de dashboard con resumen de actividad inicial
- Módulo de seguridad con login, logout y control de acceso por roles
- Usuarios de ejemplo: `admin/admin123`, `recepcionista/recepcion123`, `veterinario/veterinario123`

## Sprint 2
- Extensión de modelo para adopciones, inventario y tratamiento
- Endpoints adicionales para `MascotaAdopcion`, `Adoptante`, `Adopcion`, `Medicamento`, `Producto`
- Página de adopción e inventario en el frontend

## Ejecutar
1. Instalar dependencias del frontend:
   - `npm install`
2. Construir el frontend React:
   - `npm run build`
3. Importar como proyecto Maven.
4. Ejecutar `mvn spring-boot:run`.
5. Abrir `http://localhost:8080`.

## Frontend React
La interfaz se ha actualizado para usar la carpeta `src/app` con un SPA de React alimentado por Vite.
El build se genera automáticamente en `src/main/resources/static`.

## PostgreSQL con Docker
1. Ejecutar `docker compose up -d` en la raíz del proyecto.
2. El servicio PostgreSQL quedará disponible en `localhost:5432` con:
   - Base de datos: `veterinaria`
   - Usuario: `postgres`
   - Password: `postgres`
3. Iniciar la aplicación Spring Boot y la configuración de `src/main/resources/application.properties` usará el contenedor PostgreSQL.

## Notas
- `application.properties` ya está configurado para usar PostgreSQL vía variables de entorno.
- Si necesitas volver a H2 local, cambia manualmente las propiedades en `src/main/resources/application.properties`.
