package com.ternurines.features.citas;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
/**
 * Data repository for cita persistence and SQL access.
 */
public class CitaRepository {

    private final JdbcTemplate jdbcTemplate;

    public CitaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Cita> findAll() {
        return jdbcTemplate.query(
                "SELECT c.*, m.nombre AS mascota, cl.nombre AS cliente, v.nombre AS veterinario, r.nombre AS recepcionista " +
                        "FROM cita c " +
                        "JOIN mascota m ON c.id_mascota = m.id_mascota " +
                        "JOIN cliente cl ON m.id_cliente = cl.id_cliente " +
                        "JOIN veterinario v ON c.id_veterinario = v.id_veterinario " +
                        "JOIN recepcionista r ON c.id_recepcionista = r.id_recepcionista " +
                        "ORDER BY c.fecha, c.hora",
                new BeanPropertyRowMapper<>(Cita.class));
    }

    public int save(Cita cita) {
        return jdbcTemplate.update(
                "INSERT INTO cita (id_mascota, id_veterinario, id_recepcionista, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
                cita.getIdMascota(), cita.getIdVeterinario(), cita.getIdRecepcionista(), cita.getFecha(), cita.getHora(), cita.getMotivo(),
                cita.getEstado() == null ? "Pendiente" : cita.getEstado());
    }

    public Optional<Cita> findById(int id) {
        var results = jdbcTemplate.query("SELECT * FROM cita WHERE id_cita = ?", new BeanPropertyRowMapper<>(Cita.class), id);
        return results.stream().findFirst();
    }

    public boolean isVeterinarioDisponible(Cita cita) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM cita WHERE id_veterinario = ? AND fecha = ? AND hora = ? AND estado <> 'Cancelada' AND (? IS NULL OR id_cita <> ?)",
                Integer.class, cita.getIdVeterinario(), cita.getFecha(), cita.getHora(), cita.getIdCita(), cita.getIdCita());
        return count == null || count == 0;
    }

    public int update(Cita cita) {
        return jdbcTemplate.update(
                "UPDATE cita SET id_mascota = ?, id_veterinario = ?, id_recepcionista = ?, fecha = ?, hora = ?, motivo = ?, estado = ? WHERE id_cita = ?",
                cita.getIdMascota(), cita.getIdVeterinario(), cita.getIdRecepcionista(), cita.getFecha(), cita.getHora(), cita.getMotivo(),
                cita.getEstado(), cita.getIdCita());
    }

    public int updateEstado(int id, String estado) {
        return jdbcTemplate.update("UPDATE cita SET estado = ? WHERE id_cita = ?", estado, id);
    }

    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM cita WHERE id_cita = ?", id);
    }
}
