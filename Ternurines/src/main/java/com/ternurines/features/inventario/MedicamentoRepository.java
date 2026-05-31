package com.ternurines.features.inventario;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JDBC para la tabla medicamento.
 */
@Repository
public class MedicamentoRepository {
    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el repositorio con la plantilla JDBC inyectada.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas SQL
     */
    public MedicamentoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Recupera todos los medicamentos ordenados por nombre.
     *
     * @return lista de medicamentos
     */
    public List<Medicamento> findAll() {
        return jdbcTemplate.query("SELECT * FROM medicamento ORDER BY nombre", new BeanPropertyRowMapper<>(Medicamento.class));
    }

    /**
     * Inserta un nuevo medicamento en la base de datos.
     *
     * @param medicamento entidad con los datos a persistir
     * @return número de filas afectadas
     */
    public int save(Medicamento medicamento) {
        return jdbcTemplate.update(
                "INSERT INTO medicamento (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?)",
                medicamento.getIdAdministrador(), medicamento.getNombre(), medicamento.getDescripcion(), medicamento.getPrecio(),
                medicamento.getStock(), medicamento.getFechaVencimiento());
    }

    /**
     * Actualiza los datos de un medicamento existente.
     *
     * @param medicamento entidad con el id y los campos a modificar
     * @return número de filas afectadas
     */
    public int update(Medicamento medicamento) {
        return jdbcTemplate.update(
                "UPDATE medicamento SET id_administrador = ?, nombre = ?, descripcion = ?, precio = ?, stock = ?, fecha_vencimiento = ? WHERE id_medicamento = ?",
                medicamento.getIdAdministrador(), medicamento.getNombre(), medicamento.getDescripcion(), medicamento.getPrecio(),
                medicamento.getStock(), medicamento.getFechaVencimiento(), medicamento.getIdMedicamento());
    }

    /**
     * Suma una cantidad al stock sin permitir valores negativos.
     *
     * @param id    identificador del medicamento
     * @param delta cantidad a sumar al stock actual
     * @return número de filas afectadas
     */
    public int adjustStock(int id, int delta) {
        return jdbcTemplate.update("UPDATE medicamento SET stock = GREATEST(stock + ?, 0) WHERE id_medicamento = ?", delta, id);
    }

    /**
     * Elimina un medicamento por su identificador.
     *
     * @param id identificador del medicamento
     * @return número de filas afectadas
     */
    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM medicamento WHERE id_medicamento = ?", id);
    }
}
