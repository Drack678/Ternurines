package com.ternurines.features.mascotas;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JDBC para la tabla mascota, incluye el nombre del cliente propietario.
 */
@Repository
public class MascotaRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el repositorio con la plantilla JDBC inyectada.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas SQL
     */
    public MascotaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Recupera todas las mascotas con el nombre del cliente asociado.
     *
     * @return lista de mascotas ordenadas por nombre
     */
    public List<Mascota> findAll() {
        return jdbcTemplate.query(
                "SELECT m.*, c.nombre AS nombre_cliente FROM mascota m JOIN cliente c ON m.id_cliente = c.id_cliente ORDER BY m.nombre",
                new BeanPropertyRowMapper<>(Mascota.class));
    }

    /**
     * Inserta una nueva mascota en la base de datos.
     *
     * @param mascota entidad con los datos a persistir
     * @return número de filas afectadas
     */
    public int save(Mascota mascota) {
        return jdbcTemplate.update(
                "INSERT INTO mascota (id_cliente, nombre, especie, raza, edad, peso, sexo) VALUES (?, ?, ?, ?, ?, ?, ?)",
                mascota.getIdCliente(), mascota.getNombre(), mascota.getEspecie(), mascota.getRaza(), mascota.getEdad(), mascota.getPeso(), mascota.getSexo());
    }

    /**
     * Actualiza los datos de una mascota existente.
     *
     * @param mascota entidad con el id y los campos a modificar
     * @return número de filas afectadas
     */
    public int update(Mascota mascota) {
        return jdbcTemplate.update(
                "UPDATE mascota SET id_cliente = ?, nombre = ?, especie = ?, raza = ?, edad = ?, peso = ?, sexo = ? WHERE id_mascota = ?",
                mascota.getIdCliente(), mascota.getNombre(), mascota.getEspecie(), mascota.getRaza(), mascota.getEdad(), mascota.getPeso(),
                mascota.getSexo(), mascota.getIdMascota());
    }

    /**
     * Elimina una mascota por su identificador.
     *
     * @param id identificador de la mascota
     * @return número de filas afectadas
     */
    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM mascota WHERE id_mascota = ?", id);
    }
}
