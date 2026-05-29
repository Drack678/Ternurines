package com.ternurines.features.mascotas;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
/**
 * Data repository for mascota persistence and SQL access.
 */
public class MascotaRepository {

    private final JdbcTemplate jdbcTemplate;

    public MascotaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Mascota> findAll() {
        return jdbcTemplate.query(
                "SELECT m.*, c.nombre AS nombre_cliente FROM mascota m JOIN cliente c ON m.id_cliente = c.id_cliente ORDER BY m.nombre",
                new BeanPropertyRowMapper<>(Mascota.class));
    }

    public int save(Mascota mascota) {
        return jdbcTemplate.update(
                "INSERT INTO mascota (id_cliente, nombre, especie, raza, edad, peso, sexo) VALUES (?, ?, ?, ?, ?, ?, ?)",
                mascota.getIdCliente(), mascota.getNombre(), mascota.getEspecie(), mascota.getRaza(), mascota.getEdad(), mascota.getPeso(), mascota.getSexo());
    }

    public int update(Mascota mascota) {
        return jdbcTemplate.update(
                "UPDATE mascota SET id_cliente = ?, nombre = ?, especie = ?, raza = ?, edad = ?, peso = ?, sexo = ? WHERE id_mascota = ?",
                mascota.getIdCliente(), mascota.getNombre(), mascota.getEspecie(), mascota.getRaza(), mascota.getEdad(), mascota.getPeso(),
                mascota.getSexo(), mascota.getIdMascota());
    }

    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM mascota WHERE id_mascota = ?", id);
    }
}
