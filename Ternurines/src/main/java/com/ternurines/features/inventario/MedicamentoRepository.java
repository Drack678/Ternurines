package com.ternurines.features.inventario;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MedicamentoRepository {
    private final JdbcTemplate jdbcTemplate;

    public MedicamentoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Medicamento> findAll() {
        return jdbcTemplate.query("SELECT * FROM medicamento ORDER BY nombre", new BeanPropertyRowMapper<>(Medicamento.class));
    }

    public int save(Medicamento medicamento) {
        return jdbcTemplate.update(
                "INSERT INTO medicamento (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?)",
                medicamento.getIdAdministrador(), medicamento.getNombre(), medicamento.getDescripcion(), medicamento.getPrecio(),
                medicamento.getStock(), medicamento.getFechaVencimiento());
    }

    public int update(Medicamento medicamento) {
        return jdbcTemplate.update(
                "UPDATE medicamento SET id_administrador = ?, nombre = ?, descripcion = ?, precio = ?, stock = ?, fecha_vencimiento = ? WHERE id_medicamento = ?",
                medicamento.getIdAdministrador(), medicamento.getNombre(), medicamento.getDescripcion(), medicamento.getPrecio(),
                medicamento.getStock(), medicamento.getFechaVencimiento(), medicamento.getIdMedicamento());
    }

    public int adjustStock(int id, int delta) {
        return jdbcTemplate.update("UPDATE medicamento SET stock = GREATEST(stock + ?, 0) WHERE id_medicamento = ?", delta, id);
    }

    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM medicamento WHERE id_medicamento = ?", id);
    }
}
