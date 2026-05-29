package com.ternurines.features.servicio;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
/**
 * Data repository for servicio persistence and SQL access.
 */
public class ServicioRepository {

    private final JdbcTemplate jdbcTemplate;

    public ServicioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Servicio> findAll() {
        return jdbcTemplate.query("SELECT * FROM servicio ORDER BY nombre", new BeanPropertyRowMapper<>(Servicio.class));
    }

    public int save(Servicio servicio) {
        return jdbcTemplate.update("INSERT INTO servicio (nombre, descripcion, precio) VALUES (?, ?, ?)",
                servicio.getNombre(), servicio.getDescripcion(), servicio.getPrecio());
    }

    public int update(Servicio servicio) {
        return jdbcTemplate.update("UPDATE servicio SET nombre = ?, descripcion = ?, precio = ? WHERE id_servicio = ?",
                servicio.getNombre(), servicio.getDescripcion(), servicio.getPrecio(), servicio.getIdServicio());
    }

    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM servicio WHERE id_servicio = ?", id);
    }
}
