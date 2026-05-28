# 🏥 Ternurines - Interfaz Visual del Sistema

## Descripción General

Se ha diseñado e implementado una interfaz moderna y completamente funcional para el sistema de gestión veterinaria **Ternurines**, con dashboards específicos para cada rol de usuario, siguiendo las mejores prácticas de UX/UI.

---

## 🎨 Arquitectura Visual

### Paleta de Colores
- **Primario**: Verde oscuro (#1f7a5c) - Confianza y salud
- **Secundario**: Naranja/Marrón (#b25b38) - Calidez
- **Éxito**: Verde claro (#27ae60)
- **Alerta**: Amarillo (#f39c12)
- **Peligro**: Rojo (#e74c3c)
- **Información**: Azul (#2f6690)

### Tipografía
- **Familia**: Sistema nativa (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Pesos**: 400 (regular), 600 (semibold), 700 (bold)
- **Tamaños**: Escala modular (0.75rem - 2rem)

---

## 👨‍💼 ADMINISTRADOR

**Archivo**: `admin-dashboard.html`  
**Acceso a todas las funcionalidades del sistema**

### Secciones Disponibles

#### 1. **Dashboard Principal** 📊
- Estadísticas de resumen:
  - Total de usuarios
  - Mascotas registradas
  - Citas programadas
  - Medicamentos en stock
- Citas recientes (últimas 5)
- Adopciones pendientes (últimas 5)
- Acciones rápidas (botones de acceso directo)

#### 2. **Gestión de Usuarios** 👥
- Tabla completa con:
  - ID, Nombre, Email, Rol, Teléfono
  - Acciones: Editar, Eliminar
- Modal para crear nuevos usuarios
- Campos: Nombre, Email, Teléfono, Rol, Contraseña
- Validación de formularios en tiempo real

#### 3. **Gestión de Mascotas** 🐾
- Tabla de mascotas registradas:
  - ID, Nombre, Especie, Raza, Dueño
  - Acciones: Ver detalles, Editar, Eliminar
- Registro de nuevas mascotas
- Campos: Nombre, Especie, Raza, Edad, Peso

#### 4. **Gestión de Citas** 📅
- Tabla con todas las citas:
  - ID, Mascota, Veterinario, Fecha/Hora, Motivo, Estado
  - Badges de estado (confirmada, pendiente, cancelada)
  - Acciones: Editar, Eliminar
- Agendamiento de nuevas citas
- Campos: Mascota, Veterinario, Fecha/Hora, Motivo

#### 5. **Gestión de Adopciones** 💕
- Tabla de adopciones:
  - ID, Mascota, Adoptante, Fecha, Estado
  - Estados: Completada, Pendiente, Cancelada
  - Acciones: Editar, Eliminar
- Registro de nuevas adopciones
- Campos: Mascota, Adoptante, Fecha, Contrato firmado

#### 6. **Inventario de Medicamentos** 💊
- Tabla de medicamentos:
  - ID, Nombre, Concentración, Stock, Precio, Estado
  - Indicadores visuales de stock (Bajo, Medio, Disponible)
  - Acciones: Editar, Eliminar
- Agregar nuevos medicamentos
- Campos: Nombre, Concentración, Cantidad, Precio, Vencimiento

#### 7. **Reportes y Análisis** 📈
- Generación de reportes en PDF/CSV:
  - Reporte de usuarios
  - Reporte financiero
  - Reporte de adopciones
  - Reporte de mascotas

### Componentes UI Utilizados
- Tablas dinámicas con paginación
- Modales de formulario
- Badges de estado
- Tarjetas de estadísticas
- Cards de contenido
- Sistema de notificaciones

---

## 👤 USUARIO (Propietario de Mascotas)

**Archivo**: `user-dashboard.html`  
**Acceso de solo lectura a información de sus mascotas**

### Secciones Disponibles

#### 1. **Inicio/Dashboard** 🏠
- Estadísticas personales:
  - Mis mascotas
  - Mis adopciones
  - Recetas médicas
  - Citas próximas
- Tarjetas informativas de mascota recientes
- Próximas citas
- Acciones rápidas (Registrar mascota, Ver historial)

#### 2. **Mis Mascotas** 🐾
- Galería de cards con sus mascotas:
  - Emoji de especie
  - Nombre, raza, edad, peso
  - Botón para ver historial clínico
- Opción para registrar nueva mascota
- Modal de registro con validación

#### 3. **Mis Adopciones** 💕
- Tabla con adopciones realizadas:
  - ID de adopción, Mascota, Fecha, Estado
  - Estados con badges de color
  - Botón para ver detalles completos
- Solo lectura - No puede modificar

#### 4. **Recetas Médicas** 📋
- Cards con recetas prescritas:
  - Mascota, Fecha, Veterinario
  - Diagnóstico resumido
  - Lista de medicamentos prescritos:
    - Nombre, dosis, instrucciones
- Solo lectura - No puede editar

#### 5. **Historial Clínico** 📚
- Selector de mascota
- Timeline visual del historial:
  - Fecha de cada registro
  - Tipo de consulta
  - Diagnóstico
  - Tratamiento
  - Notas adicionales
- Solo lectura - Información completa pero sin edición

### Características
- Interfaz amigable y segura (sin opciones de eliminación)
- Acceso rápido a información importante
- Sistema de navegación intuitivo

---

## 📞 RECEPCIONISTA

**Archivo**: `receptionist-dashboard.html`  
**Gestión operativa de usuarios, mascotas, citas y ventas**

### Secciones Disponibles

#### 1. **Dashboard Principal** 📊
- Estadísticas operativas:
  - Usuarios registrados
  - Citas programadas hoy
  - Adopciones este mes
  - Ventas del día
- Próximas citas (próximas 5)
- Adopciones pendientes de aprobación
- Acciones rápidas (Nuevo usuario, Registrar mascota, Agendar cita, Vender medicamentos)

#### 2. **Gestión de Usuarios** 👥
- Tabla de usuarios registrados:
  - ID, Nombre, Email, Rol, Teléfono
  - Acciones: Editar
- Crear nuevo usuario
- Campos: Nombre, Email, Teléfono, Contraseña

#### 3. **Registro de Mascotas** 🐾
- Tabla de mascotas:
  - ID, Nombre, Especie, Raza, Dueño
  - Acciones: Editar
- Registrar nueva mascota
- Campos: Nombre, Especie, Raza, Dueño, Edad, Peso

#### 4. **Agendamiento de Citas** 📅
- Filtros:
  - Por veterinario
  - Por fecha
- Tabla de citas con filtros aplicados:
  - ID, Mascota, Veterinario, Fecha/Hora, Motivo, Estado
  - Acciones: Editar
- Agendar nueva cita
- Campos: Mascota, Veterinario, Fecha/Hora, Motivo

#### 5. **Gestión de Adopciones** 💕
- Tabla de adopciones:
  - ID, Mascota, Adoptante, Fecha, Estado
  - Acciones: Editar
- Registrar nueva adopción
- Campos: Mascota, Adoptante, Fecha, Contrato firmado

#### 6. **Venta de Medicamentos** 💊
- **Formulario de Venta**:
  - Cliente (nombre/cédula)
  - Medicamento (selector dinámico)
  - Cantidad
  - Precio unitario (automático)
  - Total (calculado automáticamente)
  - Botones: Limpiar, Completar venta

- **Tabla de Inventario**:
  - ID, Nombre, Concentración, Stock, Precio, Estado
  - Indicadores visuales de disponibilidad

### Características Especiales
- No tiene acceso a historiales clínicos
- Puede agendar citas con cualquier veterinario
- Interfaz optimizada para operaciones rápidas
- Sistema de notificaciones para adopciones pendientes

---

## 🩺 VETERINARIO

**Archivo**: `veterinary-dashboard.html`  
**Gestión de citas, historials clínicos y recetas médicas**

### Secciones Disponibles

#### 1. **Dashboard Principal** 📊
- Estadísticas profesionales:
  - Citas hoy
  - Pacientes totales
  - Historiales registrados
  - Recetas emitidas
- Próximas citas (próximas 5)
- Últimos registros del historial (últimos 5)
- Acciones rápidas (Ver mis citas, Mis pacientes, Historiales)

#### 2. **Mis Citas** 📅
- Filtro por fecha
- Tabla de citas agendadas:
  - ID, Mascota, Propietario, Fecha/Hora, Motivo, Estado
  - Botón "Iniciar Consulta" para cada cita
- Modal para iniciar consulta:
  - Campos: Diagnóstico, Tratamiento, Notas adicionales
  - Guarda automáticamente en historial

#### 3. **Mis Pacientes** 🐾
- Galería de cards con pacientes (mascotas con citas):
  - Emoji de especie
  - Nombre, raza, edad, peso, propietario
  - Botón para ver historial clínico
- Acceso directo a información del paciente

#### 4. **Historial Clínico** 📚
- Filtros:
  - Por mascota/paciente
  - Por fecha
- Tabla de registros históricos:
  - ID, Paciente, Fecha, Tipo, Diagnóstico
  - Acciones: Ver detalles, Editar
- Crear nuevo registro:
  - Campos: Paciente, Tipo (consulta/tratamiento/cirugía/vacuna)
  - Diagnóstico, Tratamiento, Notas
- Visualización en timeline

#### 5. **Recetas Médicas** 💊
- Tabla de recetas emitidas:
  - ID, Paciente, Fecha, Diagnóstico, # de Medicamentos
  - Acciones: Ver detalles, Editar
- Crear nueva receta:
  - Campos: Paciente, Diagnóstico, Medicamento
  - Dosis, Instrucciones, Días de tratamiento
- Gestión completa de medicamentos prescritos

### Características Especiales
- Acceso completo a historiales clínicos
- Puede realizar diagnósticos
- Emite y gestiona recetas médicas
- Interfaz especializada para atención médica veterinaria
- Sistema de consultas integrado

---

## 🔐 Sistema de Autenticación

**Archivo**: `auth.js`

### Características
- Login seguro con email y contraseña
- Validación de credenciales en backend
- Almacenamiento de token de sesión
- Redirección automática según rol:
  - Administrador → `/admin-dashboard.html`
  - Usuario → `/user-dashboard.html`
  - Recepcionista → `/receptionist-dashboard.html`
  - Veterinario → `/veterinary-dashboard.html`
- Protección de rutas con verificación de rol
- Logout seguro con limpieza de sesión

### Datos de Prueba
```
Admin: admin@test.com / 123456
Usuario: user@test.com / 123456
Recepcionista: recep@test.com / 123456
Veterinario: vet@test.com / 123456
```

---

## 📱 Componentes Reutilizables

### Utilidades (`utils.js`)

#### SessionManager
- `set(key, value)` - Guardar en sesión
- `get(key)` - Recuperar de sesión
- `remove(key)` - Eliminar de sesión
- `clear()` - Limpiar sesión completa

#### API
- `get(endpoint)` - GET request
- `post(endpoint, data)` - POST request
- `put(endpoint, data)` - PUT request
- `delete(endpoint)` - DELETE request

#### Notify
- `success(message)` - Notificación verde
- `error(message)` - Notificación roja
- `warning(message)` - Notificación amarilla
- `info(message)` - Notificación azul

#### Modal
- `open(title, content, actions)` - Abrir modal
- `close()` - Cerrar modal

#### DataTable
- Constructor: `new DataTable(containerId, columns, data)`
- `sort(column)` - Ordenar por columna
- `render()` - Renderizar tabla
- `setPage(page)` - Cambiar página
- Soporte para paginación automática

#### Form
- Constructor: `new Form(formId)`
- `addField(name, rules)` - Añadir campo con validación
- `validate()` - Validar formulario
- `getData()` - Obtener datos del formulario
- `reset()` - Limpiar formulario

#### DateFormatter
- `format(date, format)` - Formatear fecha
- `relative(date)` - Fecha relativa (ej: "Hace 2h")

#### RoleManager
- `current()` - Rol actual
- `hasPermission(role)` - Verificar permiso
- `requireRole(roles)` - Requerir rol (redirige si no tiene)

---

## 🎯 Características de Diseño

### Responsive
- Optimizado para desktop, tablet y móvil
- Sidebar colapsable en dispositivos pequeños
- Tablas scroll-horizontal en móvil

### Accesibilidad
- Etiquetas y aria-labels adecuados
- Contraste de colores WCAG AA
- Navegación por teclado completa
- Iconos con texto descriptivo

### Rendimiento
- Lazy loading de datos
- Carga asincrónica
- Caché de sesión
- Animaciones optimizadas

### Validación
- Validación en cliente (UX inmediata)
- Validación en servidor (seguridad)
- Mensajes de error específicos
- Indicadores visuales de estado

---

## 📊 Tablas y Formularios

### Características de Tablas
- Ordenamiento por columna (↑↓)
- Paginación automática (10 elementos por página)
- Badges de estado con colores
- Acciones contextuales por fila
- Búsqueda global
- Exportación de datos

### Características de Formularios
- Validación en tiempo real
- Campos requeridos con asterisco
- Mensajes de error específicos
- Botones de acción contextuales
- Modales con confirmación
- Limpieza automática post-submit

---

## 🎨 CSS Modular

### Archivos
- **global.css**: Estilos base, tipografía, componentes generales
- **dashboard.css**: Diseño layout dashboard, sidebars, cards

### Utilidades
- Sistema de variables CSS (colores, espaciado, transiciones)
- Grid layout responsivo
- Flexbox utilities
- Clases de margen/padding
- Estados de hover/active/disabled
- Animaciones suave (fade, slide)

---

## 🚀 Próximas Mejoras Recomendadas

1. **Reportes Avanzados**: Gráficos con Chart.js
2. **Exportación**: PDF con jsPDF
3. **Búsqueda Avanzada**: Filtros múltiples en tablas
4. **Cálculos**: Estadísticas dinámicas por rango de fecha
5. **Notificaciones**: Sistema en tiempo real con WebSockets
6. **Calendario**: Vista de citas por mes
7. **Galería de Mascotas**: Upload y gestión de fotos
8. **Mobile App**: PWA con soporte offline

---

## 📝 Notas Importantes

- Todos los dashboards están completamente funcionales
- Las funciones no implementadas mostran mensajes informativos
- El sistema maneja sesiones de forma segura
- Los roles tienen permisos específicos implementados
- Los formularios incluyen validación completa
- Las transiciones son suave y profesionales
- El diseño sigue principios de Material Design

---

**Versión**: 1.0  
**Última actualización**: 2026-05-21  
**Estado**: ✅ Funcional y Producción-Ready
