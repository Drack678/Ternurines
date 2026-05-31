package com.ternurines.features.servicio;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JDBC para la tabla servicio.
 */
@Repository
public class ServicioRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el repositorio con la plantilla JDBC inyectada.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas SQL
     */
    public ServicioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Recupera todos los servicios ordenados por nombre.
     *
     * @return lista de servicios
     */
    public List<Servicio> findAll() {
        return jdbcTemplate.query("SELECT * FROM servicio ORDER BY nombre", new BeanPropertyRowMapper<>(Servicio.class));
    }

    /**
     * Inserta un nuevo servicio en la base de datos.
     *
     * @param servicio entidad con los datos a persistir
     * @return número de filas afectadas
     */
    public int save(Servicio servicio) {
        return jdbcTemplate.update("INSERT INTO servicio (nombre, descripcion, precio) VALUES (?, ?, ?)",
                servicio.getNombre(), servicio.getDescripcion(), servicio.getPrecio());
    }

    /**
     * Actualiza los datos de un servicio existente.
     *
     * @param servicio entidad con el id y los campos a modificar
     * @return número de filas afectadas
     */
    public int update(Servicio servicio) {
        return jdbcTemplate.update("UPDATE servicio SET nombre = ?, descripcion = ?, precio = ? WHERE id_servicio = ?",
                servicio.getNombre(), servicio.getDescripcion(), servicio.getPrecio(), servicio.getIdServicio());
    }

    /**
     * Elimina un servicio por su identificador.
     *
     * @param id identificador del servicio
     * @return número de filas afectadas
     */
    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM servicio WHERE id_servicio = ?", id);
    }
}
