## 2. Requerimientos funcionales

Los requerimientos funcionales describen **qué debe hacer el sistema**.

### 2.1 Gestión de usuarios

- El sistema debe permitir el registro de usuarios con distintos roles (administrador, veterinario, recepcionista).
- El sistema debe permitir el inicio y cierre de sesión.
- El sistema debe controlar el acceso a funcionalidades según el rol del usuario.

### 2.2 Gestión de clientes

- El sistema debe permitir registrar clientes (nombre, documento, teléfono, dirección, correo).
- El sistema debe permitir consultar, modificar y eliminar información de clientes.
- El sistema debe permitir listar todos los clientes registrados.

### 2.3 Gestión de mascotas

- El sistema debe almacenar información de la mascota (nombre, especie, raza, edad, peso).
- El sistema debe permitir consultar y actualizar la información de las mascotas.

### 2.4 Gestión de citas

- El sistema debe permitir agendar citas veterinarias.
- El sistema debe permitir consultar, modificar y cancelar citas.
- El sistema debe mostrar la disponibilidad de horarios.

### 2.5 Historial clínico

- El sistema debe permitir registrar diagnósticos, tratamientos y observaciones médicas.
- El sistema debe permitir consultar el historial clínico completo de una mascota.
- El sistema debe asociar cada registro clínico a un veterinario y a una fecha.

### 2.6 Gestión de servicios y facturación

- El sistema debe permitir registrar servicios veterinarios realizados.
- El sistema debe generar facturas por los servicios prestados.
- El sistema debe calcular el costo total de la atención.

### 2.7 Gestión de inventario

- El sistema debe permitir registrar productos y medicamentos.
- El sistema debe actualizar el inventario al utilizar o vender productos.
- El sistema debe alertar cuando un producto esté por debajo del stock mínimo.

---

## 3. Requerimientos no funcionales

Los requerimientos no funcionales describen **cómo debe comportarse el sistema** y sus restricciones.

### 3.1 Usabilidad

- El sistema debe contar con una interfaz intuitiva y fácil de usar.
- El sistema debe ser comprensible para usuarios sin conocimientos técnicos avanzados.

### 3.2 Rendimiento

- El sistema debe responder a las solicitudes en un tiempo máximo de 2 segundos.
- El sistema debe soportar múltiples usuarios concurrentes sin degradar su desempeño.

### 3.3 Seguridad

- El sistema debe proteger la información mediante autenticación de usuarios.
- El sistema debe restringir el acceso a datos sensibles según el rol.
- El sistema debe almacenar contraseñas de forma segura.

### 3.4 Disponibilidad

- El sistema debe estar disponible al menos el 99% del tiempo.
- El sistema debe permitir la recuperación de información ante fallos.

### 3.5 Escalabilidad

- El sistema debe permitir agregar nuevas funcionalidades en el futuro.
- El sistema debe soportar el crecimiento en número de usuarios y registros.

### 3.6 Mantenibilidad

- El sistema debe estar desarrollado con una arquitectura clara y modular.
- El código debe permitir correcciones y mejoras sin afectar otras funcionalidades.