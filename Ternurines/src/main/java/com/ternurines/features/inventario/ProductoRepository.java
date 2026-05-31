package com.ternurines.features.inventario;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JDBC para la tabla producto.
 */
@Repository
public class ProductoRepository {
    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el repositorio con la plantilla JDBC inyectada.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas SQL
     */
    public ProductoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Recupera todos los productos ordenados por nombre.
     *
     * @return lista de productos
     */
    public List<Producto> findAll() {
        return jdbcTemplate.query("SELECT * FROM producto ORDER BY nombre", new BeanPropertyRowMapper<>(Producto.class));
    }

    /**
     * Inserta un nuevo producto en la base de datos.
     *
     * @param producto entidad con los datos a persistir
     * @return número de filas afectadas
     */
    public int save(Producto producto) {
        return jdbcTemplate.update(
                "INSERT INTO producto (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?)",
                producto.getIdAdministrador(), producto.getNombre(), producto.getDescripcion(), producto.getPrecio(),
                producto.getStock(), producto.getFechaVencimiento());
    }

    /**
     * Actualiza los datos de un producto existente.
     *
     * @param producto entidad con el id y los campos a modificar
     * @return número de filas afectadas
     */
    public int update(Producto producto) {
        return jdbcTemplate.update(
                "UPDATE producto SET id_administrador = ?, nombre = ?, descripcion = ?, precio = ?, stock = ?, fecha_vencimiento = ? WHERE id_producto = ?",
                producto.getIdAdministrador(), producto.getNombre(), producto.getDescripcion(), producto.getPrecio(),
                producto.getStock(), producto.getFechaVencimiento(), producto.getIdProducto());
    }

    /**
     * Suma una cantidad al stock sin permitir valores negativos.
     *
     * @param id    identificador del producto
     * @param delta cantidad a sumar al stock actual
     * @return número de filas afectadas
     */
    public int adjustStock(int id, int delta) {
        return jdbcTemplate.update("UPDATE producto SET stock = GREATEST(stock + ?, 0) WHERE id_producto = ?", delta, id);
    }

    /**
     * Elimina un producto por su identificador.
     *
     * @param id identificador del producto
     * @return número de filas afectadas
     */
    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM producto WHERE id_producto = ?", id);
    }
}
