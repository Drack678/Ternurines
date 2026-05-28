package com.ternurines.features.dashboard;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final JdbcTemplate jdbcTemplate;

    public DashboardController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary() {
        DashboardSummary summary = new DashboardSummary();

        summary.setClientesRegistrados(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM cliente", Integer.class));
        summary.setMascotasActivas(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM mascota", Integer.class));
        summary.setCitasHoy(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM cita WHERE fecha = CURRENT_DATE", Integer.class));
        summary.setStockBajo(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM medicamento WHERE stock < 10", Integer.class));

        List<DashboardCita> proximas = jdbcTemplate.query(
                "SELECT c.id_cita, c.fecha, c.hora, v.nombre AS veterinario, m.nombre AS mascota, cl.nombre AS cliente, c.motivo, c.estado " +
                        "FROM cita c " +
                        "JOIN veterinario v ON c.id_veterinario = v.id_veterinario " +
                        "JOIN mascota m ON c.id_mascota = m.id_mascota " +
                        "JOIN cliente cl ON m.id_cliente = cl.id_cliente " +
                        "WHERE c.fecha >= CURRENT_DATE ORDER BY c.fecha, c.hora LIMIT 5",
                new BeanPropertyRowMapper<>(DashboardCita.class));
        summary.setProximasCitas(proximas);

        return ResponseEntity.ok(summary);
    }
}
