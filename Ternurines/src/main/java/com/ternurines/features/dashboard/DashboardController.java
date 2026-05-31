package com.ternurines.features.dashboard;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador del panel principal bajo /api/dashboard.
 * Agrega métricas de usuarios, mascotas, citas, inventario y próximas citas.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el controlador con acceso JDBC a la base de datos.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas de agregación
     */
    public DashboardController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Devuelve el resumen consolidado con contadores y las 5 próximas citas no canceladas.
     *
     * @return métricas del dashboard y lista de próximas citas
     */
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary() {
        DashboardSummary summary = new DashboardSummary();

        summary.setTotalUsuarios(jdbcTemplate.queryForObject(
                "SELECT COALESCE((SELECT COUNT(*) FROM administrador) + " +
                        "(SELECT COUNT(*) FROM recepcionista) + " +
                        "(SELECT COUNT(*) FROM veterinario) + " +
                        "(SELECT COUNT(*) FROM cliente), 0)", Integer.class));

        summary.setMascotasRegistradas(jdbcTemplate.queryForObject(
                "SELECT COALESCE(COUNT(DISTINCT id_mascota),0) FROM historial_medico", Integer.class));

        summary.setCitasProgramadas(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM cita", Integer.class));

        summary.setMedicamentosEnStock(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM medicamento", Integer.class));

        summary.setStockBajo(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM medicamento WHERE stock < 10", Integer.class));

        List<DashboardCita> proximas = jdbcTemplate.query(
                "SELECT c.id_cita, c.fecha, c.hora, v.nombre AS veterinario, m.nombre AS mascota, cl.nombre AS cliente, c.motivo, c.estado " +
                        "FROM cita c " +
                        "JOIN veterinario v ON c.id_veterinario = v.id_veterinario " +
                        "JOIN mascota m ON c.id_mascota = m.id_mascota " +
                        "JOIN cliente cl ON m.id_cliente = cl.id_cliente " +
                        "WHERE c.estado NOT ILIKE 'Cancelada' AND c.fecha >= CURRENT_DATE " +
                        "ORDER BY c.fecha, c.hora LIMIT 5",
                new BeanPropertyRowMapper<>(DashboardCita.class));
        summary.setProximasCitas(proximas);

        return ResponseEntity.ok(summary);
    }
}
