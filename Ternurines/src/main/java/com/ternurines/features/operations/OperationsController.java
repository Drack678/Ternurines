package com.ternurines.features.operations;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controlador de operaciones transversales bajo /api/operaciones.
 * Agrupa gestión de usuarios por rol, adopciones, reportes, finanzas y horarios disponibles.
 */
@RestController
@RequestMapping("/api/operaciones")
public class OperationsController {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el controlador con acceso JDBC a la base de datos.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas SQL
     */
    public OperationsController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Lista unificada de todos los usuarios del sistema con su rol.
     *
     * @return usuarios de todos los roles ordenados por rol y nombre
     */
    @GetMapping("/usuarios")
    public ResponseEntity<List<Map<String, Object>>> usuarios() {
        return ResponseEntity.ok(jdbcTemplate.queryForList(
                "SELECT id_administrador AS id, nombre, documento, telefono, correo, 'ADMINISTRADOR' AS rol, NULL AS especialidad FROM administrador " +
                        "UNION ALL SELECT id_recepcionista AS id, nombre, documento, telefono, correo, 'RECEPCIONISTA' AS rol, NULL AS especialidad FROM recepcionista " +
                        "UNION ALL SELECT id_veterinario AS id, nombre, documento, telefono, correo, 'VETERINARIO' AS rol, especialidad FROM veterinario " +
                        "UNION ALL SELECT id_cliente AS id, nombre, documento, telefono, correo, 'CLIENTE' AS rol, NULL AS especialidad FROM cliente " +
                        "ORDER BY rol, nombre"));
    }

    /**
     * Crea un nuevo usuario según el rol indicado en el cuerpo de la petición.
     *
     * @param usuario mapa con rol y datos del usuario a registrar
     * @return 200 si la creación fue exitosa
     */
    @PostMapping("/usuarios")
    @Transactional
    public ResponseEntity<Void> crearUsuario(@RequestBody Map<String, Object> usuario) {
        String rol = text(usuario, "rol").toUpperCase();
        if ("VETERINARIO".equals(rol)) {
            jdbcTemplate.update(
                    "INSERT INTO veterinario (nombre, documento, telefono, correo, especialidad, num_licencia, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    text(usuario, "nombre"), text(usuario, "documento"), text(usuario, "telefono"), text(usuario, "correo"),
                    text(usuario, "especialidad"), text(usuario, "numLicencia"), text(usuario, "contrasena"));
        } else if ("RECEPCIONISTA".equals(rol)) {
            jdbcTemplate.update("INSERT INTO recepcionista (nombre, documento, telefono, correo, contrasena) VALUES (?, ?, ?, ?, ?)",
                    text(usuario, "nombre"), text(usuario, "documento"), text(usuario, "telefono"), text(usuario, "correo"), text(usuario, "contrasena"));
        } else if ("ADMINISTRADOR".equals(rol)) {
            jdbcTemplate.update("INSERT INTO administrador (nombre, documento, telefono, correo, contrasena) VALUES (?, ?, ?, ?, ?)",
                    text(usuario, "nombre"), text(usuario, "documento"), text(usuario, "telefono"), text(usuario, "correo"), text(usuario, "contrasena"));
        } else {
            jdbcTemplate.update("INSERT INTO cliente (nombre, documento, telefono, direccion, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)",
                    text(usuario, "nombre"), text(usuario, "documento"), text(usuario, "telefono"), text(usuario, "direccion"), text(usuario, "correo"),
                    text(usuario, "contrasena"));
        }
        return ResponseEntity.ok().build();
    }

    /**
     * Registra un nuevo usuario; alias del endpoint de creación para registro público.
     *
     * @param usuario mapa con rol y datos del usuario a registrar
     * @return 200 si la creación fue exitosa
     */
    @PostMapping("/usuarios/registro")
    @Transactional
    public ResponseEntity<Void> registrarNuevoUsuario(@RequestBody Map<String, Object> usuario) {
        return crearUsuario(usuario);
    }

    /**
     * Obtiene los datos básicos de un usuario por rol e identificador.
     *
     * @param rol rol del usuario
     * @param id  identificador del usuario
     * @return datos del usuario o 404 si no existe
     */
    @GetMapping("/usuarios/{rol}/{id}")
    public ResponseEntity<Map<String, Object>> usuarioIndividual(@PathVariable("rol") String rol, @PathVariable("id") int id) {
        return ResponseEntity.of(buscarUsuario(rol, id));
    }

    /**
     * Obtiene el detalle ampliado de un usuario según su rol, incluyendo citas, mascotas u otros datos relacionados.
     *
     * @param rol rol del usuario
     * @param id  identificador del usuario
     * @return detalle del usuario con información contextual, o 404 si no existe
     */
    @GetMapping("/usuarios/{rol}/{id}/detalle")
    public ResponseEntity<Map<String, Object>> detalleUsuario(@PathVariable("rol") String rol, @PathVariable("id") int id) {
        String normalizedRol = normalizeRol(rol);
        Optional<Map<String, Object>> usuario = buscarUsuario(normalizedRol, id);
        if (usuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if ("VETERINARIO".equals(normalizedRol)) {
            return ResponseEntity.ok(Map.of(
                    "usuario", usuario.get(),
                    "citas", jdbcTemplate.queryForList(
                            "SELECT c.*, m.nombre AS mascota, cl.nombre AS cliente FROM cita c " +
                                    "JOIN mascota m ON c.id_mascota = m.id_mascota JOIN cliente cl ON m.id_cliente = cl.id_cliente " +
                                    "WHERE c.id_veterinario = ? ORDER BY c.fecha, c.hora", id),
                    "historiales", jdbcTemplate.queryForList(
                            "SELECT h.*, m.nombre AS mascota FROM historial_medico h JOIN mascota m ON h.id_mascota = m.id_mascota " +
                                    "WHERE h.id_veterinario = ? ORDER BY h.fecha DESC", id)));
        }

        if ("CLIENTE".equals(normalizedRol)) {
            return ResponseEntity.ok(Map.of(
                    "usuario", usuario.get(),
                    "mascotas", jdbcTemplate.queryForList("SELECT * FROM mascota WHERE id_cliente = ? ORDER BY nombre", id),
                    "citas", jdbcTemplate.queryForList(
                            "SELECT c.*, m.nombre AS mascota, v.nombre AS veterinario FROM cita c " +
                                    "JOIN mascota m ON c.id_mascota = m.id_mascota JOIN veterinario v ON c.id_veterinario = v.id_veterinario " +
                                    "WHERE m.id_cliente = ? ORDER BY c.fecha DESC, c.hora DESC", id),
                    "recetas", jdbcTemplate.queryForList(
                            "SELECT m.nombre AS mascota, h.fecha, h.diagnostico, v.nombre AS veterinario, med.nombre AS medicamento, t.dosis, t.descripcion, t.fecha_inicio, t.fecha_fin " +
                                    "FROM tratamiento t JOIN historial_medico h ON t.id_historial = h.id_historial " +
                                    "JOIN mascota m ON h.id_mascota = m.id_mascota JOIN veterinario v ON h.id_veterinario = v.id_veterinario " +
                                    "JOIN medicamento med ON t.id_medicamento = med.id_medicamento WHERE m.id_cliente = ? ORDER BY h.fecha DESC", id)));
        }

        if ("RECEPCIONISTA".equals(normalizedRol)) {
            return ResponseEntity.ok(Map.of(
                    "usuario", usuario.get(),
                    "citasRegistradas", jdbcTemplate.queryForList("SELECT * FROM vista_agenda_diaria WHERE recepcionista = ? ORDER BY fecha, hora", usuario.get().get("nombre")),
                    "mascotasAdopcion", jdbcTemplate.queryForList("SELECT * FROM mascota_adopcion WHERE id_recepcionista = ? ORDER BY fecha_ingreso DESC", id)));
        }

        return ResponseEntity.ok(Map.of(
                "usuario", usuario.get(),
                "usuarios", usuarios().getBody(),
                "reportes", reportes().getBody()));
    }

    /**
     * Elimina un usuario de la tabla correspondiente a su rol.
     *
     * @param rol rol del usuario
     * @param id  identificador del usuario
     * @return 200 si la eliminación fue exitosa
     * @throws IllegalArgumentException si el rol no es válido
     */
    @DeleteMapping("/usuarios/{rol}/{id}")
    @Transactional
    public ResponseEntity<Void> borrarUsuario(@PathVariable("rol") String rol, @PathVariable("id") int id) {
        switch (normalizeRol(rol)) {
            case "ADMINISTRADOR" -> jdbcTemplate.update("DELETE FROM administrador WHERE id_administrador = ?", id);
            case "RECEPCIONISTA" -> jdbcTemplate.update("DELETE FROM recepcionista WHERE id_recepcionista = ?", id);
            case "VETERINARIO" -> jdbcTemplate.update("DELETE FROM veterinario WHERE id_veterinario = ?", id);
            case "CLIENTE" -> jdbcTemplate.update("DELETE FROM cliente WHERE id_cliente = ?", id);
            default -> throw new IllegalArgumentException("Rol no valido");
        }
        return ResponseEntity.ok().build();
    }

    /**
     * Actualiza los datos de un usuario existente según su rol.
     *
     * @param rol     rol del usuario
     * @param id      identificador del usuario
     * @param usuario mapa con los campos a actualizar
     * @return 200 si la actualización fue exitosa
     * @throws IllegalArgumentException si el rol no es válido
     */
    @PutMapping("/usuarios/{rol}/{id}")
    @Transactional
    public ResponseEntity<Void> actualizarUsuario(@PathVariable("rol") String rol, @PathVariable("id") int id,
                                                  @RequestBody Map<String, Object> usuario) {
        switch (normalizeRol(rol)) {
            case "ADMINISTRADOR" -> jdbcTemplate.update(
                    "UPDATE administrador SET nombre = ?, documento = ?, telefono = ?, correo = ?, contrasena = ? WHERE id_administrador = ?",
                    text(usuario, "nombre"), text(usuario, "documento"), text(usuario, "telefono"), text(usuario, "correo"), text(usuario, "contrasena"), id);
            case "RECEPCIONISTA" -> jdbcTemplate.update(
                    "UPDATE recepcionista SET nombre = ?, documento = ?, telefono = ?, correo = ?, contrasena = ? WHERE id_recepcionista = ?",
                    text(usuario, "nombre"), text(usuario, "documento"), text(usuario, "telefono"), text(usuario, "correo"), text(usuario, "contrasena"), id);
            case "VETERINARIO" -> jdbcTemplate.update(
                    "UPDATE veterinario SET nombre = ?, documento = ?, telefono = ?, correo = ?, especialidad = ?, num_licencia = ?, contrasena = ? WHERE id_veterinario = ?",
                    text(usuario, "nombre"), text(usuario, "documento"), text(usuario, "telefono"), text(usuario, "correo"), text(usuario, "especialidad"), text(usuario, "numLicencia"), text(usuario, "contrasena"), id);
            case "CLIENTE" -> jdbcTemplate.update(
                    "UPDATE cliente SET nombre = ?, documento = ?, telefono = ?, direccion = ?, correo = ?, contrasena = ? WHERE id_cliente = ?",
                    text(usuario, "nombre"), text(usuario, "documento"), text(usuario, "telefono"), text(usuario, "direccion"), text(usuario, "correo"), text(usuario, "contrasena"), id);
            default -> throw new IllegalArgumentException("Rol no valido");
        }
        return ResponseEntity.ok().build();
    }

    /**
     * Devuelve mascotas en adopción y procesos de adopción registrados.
     *
     * @return mapa con listas de mascotas disponibles y procesos de adopción
     */
    @GetMapping("/adopciones")
    public ResponseEntity<Map<String, Object>> adopciones() {
        List<Map<String, Object>> mascotas = jdbcTemplate.queryForList(
                "SELECT ma.*, r.nombre AS recepcionista FROM mascota_adopcion ma JOIN recepcionista r ON ma.id_recepcionista = r.id_recepcionista ORDER BY ma.nombre");
        List<Map<String, Object>> procesos = jdbcTemplate.queryForList(
                "SELECT a.fecha_adopcion, ad.nombre AS adoptante, ad.documento, ad.telefono, ma.nombre AS mascota, ma.estado_adopcion " +
                        "FROM adopcion a JOIN adoptante ad ON a.id_adoptante = ad.id_adoptante " +
                        "JOIN mascota_adopcion ma ON a.id_mascota_adopcion = ma.id_mascota_adopcion ORDER BY a.fecha_adopcion DESC");
        return ResponseEntity.ok(Map.of("mascotas", mascotas, "procesos", procesos));
    }

    /**
     * Registra una nueva mascota disponible para adopción.
     *
     * @param mascota datos de la mascota en adopción
     * @return 200 si la creación fue exitosa
     */
    @PostMapping("/adopciones/mascotas")
    public ResponseEntity<Void> crearMascotaAdopcion(@RequestBody Map<String, Object> mascota) {
        jdbcTemplate.update(
                "INSERT INTO mascota_adopcion (id_recepcionista, nombre, especie, raza, edad, estado_salud, estado_adopcion, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                number(mascota, "idRecepcionista", 1), text(mascota, "nombre"), text(mascota, "especie"), text(mascota, "raza"),
                number(mascota, "edad", 0), text(mascota, "estadoSalud"), defaultText(mascota, "estadoAdopcion", "Disponible"),
                LocalDate.parse(defaultText(mascota, "fechaIngreso", LocalDate.now().toString())));
        return ResponseEntity.ok().build();
    }

    /**
     * Registra un proceso de adopción completo: adoptante, vínculo y cambio de estado de la mascota.
     *
     * @param request datos del adoptante y de la mascota adoptada
     * @return 200 si el registro fue exitoso
     */
    @PostMapping("/adopciones")
    @Transactional
    public ResponseEntity<Void> registrarAdopcion(@RequestBody Map<String, Object> request) {
        Integer adoptanteId = jdbcTemplate.query(
                "INSERT INTO adoptante (nombre, documento, telefono, direccion, correo) VALUES (?, ?, ?, ?, ?) RETURNING id_adoptante",
                rs -> rs.next() ? rs.getInt("id_adoptante") : null,
                text(request, "nombre"), text(request, "documento"), text(request, "telefono"), text(request, "direccion"), text(request, "correo"));
        jdbcTemplate.update("INSERT INTO adopcion (id_adoptante, id_mascota_adopcion, fecha_adopcion) VALUES (?, ?, ?)",
                adoptanteId, number(request, "idMascotaAdopcion", 0),
                LocalDate.parse(defaultText(request, "fechaAdopcion", LocalDate.now().toString())));
        jdbcTemplate.update("UPDATE mascota_adopcion SET estado_adopcion = 'Adoptada' WHERE id_mascota_adopcion = ?",
                number(request, "idMascotaAdopcion", 0));
        return ResponseEntity.ok().build();
    }

    /**
     * Cambia el estado de adopción de una mascota (por ejemplo Disponible o Adoptada).
     *
     * @param id     identificador de la mascota en adopción
     * @param estado nuevo estado de adopción
     * @return 200 si la actualización fue exitosa
     */
    @PatchMapping("/adopciones/mascotas/{id}/estado/{estado}")
    public ResponseEntity<Void> cambiarEstadoAdopcion(@PathVariable("id") int id, @PathVariable("estado") String estado) {
        jdbcTemplate.update("UPDATE mascota_adopcion SET estado_adopcion = ? WHERE id_mascota_adopcion = ?", estado, id);
        return ResponseEntity.ok().build();
    }

    /**
     * Genera reportes operativos: ocupación, clientes, mascotas y stock crítico.
     *
     * @return mapa con los distintos conjuntos de datos del reporte
     */
    @GetMapping("/reportes")
    public ResponseEntity<Map<String, Object>> reportes() {
        return ResponseEntity.ok(Map.of(
                "ocupacion", jdbcTemplate.queryForList("SELECT * FROM vista_reporte_ocupacion"),
                "clientes", jdbcTemplate.queryForList("SELECT * FROM vista_clientes_contacto ORDER BY nombre"),
                "mascotas", jdbcTemplate.queryForList("SELECT * FROM vista_todas_mascotas ORDER BY nombre"),
                "stockCritico", jdbcTemplate.queryForList("SELECT nombre, stock, fecha_vencimiento FROM medicamento WHERE stock < 10 ORDER BY stock")));
    }

    /**
     * Genera reportes financieros a partir de citas completadas y servicios asociados.
     *
     * @return ingresos totales, ingresos por mes, promedio por cliente y servicios más rentables
     */
    @GetMapping("/reportes/finanzas")
    public ResponseEntity<Map<String, Object>> reportesFinancieros() {
        Double totalIngresos = jdbcTemplate.queryForObject(
            "SELECT COALESCE(SUM(s.precio),0) FROM cita c JOIN cita_servicio cs ON c.id_cita = cs.id_cita JOIN servicio s ON cs.id_servicio = s.id_servicio WHERE c.estado = 'Completada'",
            Double.class);

        List<Map<String, Object>> ingresosMes = jdbcTemplate.queryForList(
            "SELECT to_char(date_trunc('month', c.fecha), 'YYYY-MM') AS mes, COALESCE(SUM(s.precio),0) AS ingresos " +
                "FROM cita c JOIN cita_servicio cs ON c.id_cita = cs.id_cita JOIN servicio s ON cs.id_servicio = s.id_servicio " +
                "WHERE c.estado = 'Completada' GROUP BY mes ORDER BY mes");

        Double promedioPorCliente = jdbcTemplate.queryForObject(
            "SELECT COALESCE(AVG(cliente_total),0) FROM (" +
                "  SELECT cl.id_cliente, COALESCE(SUM(s.precio),0) AS cliente_total " +
                "  FROM cliente cl " +
                "  LEFT JOIN mascota m ON m.id_cliente = cl.id_cliente " +
                "  LEFT JOIN cita c ON c.id_mascota = m.id_mascota AND c.estado = 'Completada' " +
                "  LEFT JOIN cita_servicio cs ON cs.id_cita = c.id_cita " +
                "  LEFT JOIN servicio s ON s.id_servicio = cs.id_servicio " +
                "  GROUP BY cl.id_cliente" +
                ") sub",
            Double.class);

        List<Map<String, Object>> topServicios = jdbcTemplate.queryForList(
            "SELECT s.nombre, COUNT(*) AS veces, COALESCE(SUM(s.precio),0) AS ingresos " +
                "FROM cita_servicio cs JOIN servicio s ON cs.id_servicio = s.id_servicio " +
                "JOIN cita c ON c.id_cita = cs.id_cita WHERE c.estado = 'Completada' " +
                "GROUP BY s.nombre ORDER BY ingresos DESC LIMIT 10");

        return ResponseEntity.ok(Map.of(
            "totalIngresos", totalIngresos,
            "ingresosMes", ingresosMes,
            "promedioPorCliente", promedioPorCliente,
            "topServicios", topServicios
        ));
    }

    /**
     * Devuelve los horarios libres de un veterinario en una fecha, excluyendo citas no canceladas.
     *
     * @param veterinarioId identificador del veterinario
     * @param fecha         fecha a consultar
     * @return lista de horarios disponibles en formato HH:mm:ss
     */
    @GetMapping("/horarios/{veterinarioId}/{fecha}")
    public ResponseEntity<List<String>> horariosDisponibles(@PathVariable("veterinarioId") int veterinarioId,
                                                            @PathVariable("fecha") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<String> ocupados = jdbcTemplate.queryForList(
                "SELECT hora::text FROM cita WHERE id_veterinario = ? AND fecha = ? AND estado <> 'Cancelada'",
                String.class, veterinarioId, fecha);
        List<String> horarios = List.of("08:00:00", "09:00:00", "10:00:00", "11:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00");
        return ResponseEntity.ok(horarios.stream().filter(hora -> !ocupados.contains(hora)).toList());
    }

    /**
     * Extrae un valor de texto del mapa y lo normaliza eliminando espacios.
     *
     * @param values mapa de valores de entrada
     * @param key    clave a leer
     * @return texto trimmeado o cadena vacía si el valor es null
     */
    private String text(Map<String, Object> values, String key) {
        Object value = values.get(key);
        return value == null ? "" : value.toString().trim();
    }

    /**
     * Extrae un valor de texto del mapa usando un valor por defecto si está vacío.
     *
     * @param values   mapa de valores de entrada
     * @param key      clave a leer
     * @param fallback valor por defecto si el texto está en blanco
     * @return texto leído o el fallback
     */
    private String defaultText(Map<String, Object> values, String key, String fallback) {
        String value = text(values, key);
        return value.isBlank() ? fallback : value;
    }

    /**
     * Extrae un valor entero del mapa, aceptando números o texto parseable.
     *
     * @param values   mapa de valores de entrada
     * @param key      clave a leer
     * @param fallback valor por defecto si el valor está vacío o no es parseable
     * @return entero leído o el fallback
     */
    private Integer number(Map<String, Object> values, String key, int fallback) {
        Object value = values.get(key);
        if (value instanceof Number number) {
            return number.intValue();
        }
        String text = text(values, key);
        return text.isBlank() ? fallback : Integer.parseInt(text);
    }

    /**
     * Busca un usuario en la tabla correspondiente a su rol.
     *
     * @param rol rol del usuario
     * @param id  identificador del usuario
     * @return datos del usuario o vacío si no existe
     * @throws IllegalArgumentException si el rol no es válido
     */
    private Optional<Map<String, Object>> buscarUsuario(String rol, int id) {
        String sql = switch (normalizeRol(rol)) {
            case "ADMINISTRADOR" -> "SELECT id_administrador AS id, nombre, documento, telefono, correo, 'ADMINISTRADOR' AS rol, NULL AS especialidad FROM administrador WHERE id_administrador = ?";
            case "RECEPCIONISTA" -> "SELECT id_recepcionista AS id, nombre, documento, telefono, correo, 'RECEPCIONISTA' AS rol, NULL AS especialidad FROM recepcionista WHERE id_recepcionista = ?";
            case "VETERINARIO" -> "SELECT id_veterinario AS id, nombre, documento, telefono, correo, 'VETERINARIO' AS rol, especialidad FROM veterinario WHERE id_veterinario = ?";
            case "CLIENTE" -> "SELECT id_cliente AS id, nombre, documento, telefono, direccion, correo, 'CLIENTE' AS rol, NULL AS especialidad FROM cliente WHERE id_cliente = ?";
            default -> throw new IllegalArgumentException("Rol no valido");
        };
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, id);
        return result.stream().findFirst();
    }

    /**
     * Normaliza el nombre del rol a mayúsculas sin espacios laterales.
     *
     * @param rol rol en cualquier formato
     * @return rol normalizado o cadena vacía si es null
     */
    private String normalizeRol(String rol) {
        return rol == null ? "" : rol.trim().toUpperCase();
    }
}
