package com.ternurines.features.inventario;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductoRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProductoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Producto> findAll() {
        return jdbcTemplate.query("SELECT * FROM producto ORDER BY nombre", new BeanPropertyRowMapper<>(Producto.class));
    }

    public int save(Producto producto) {
        return jdbcTemplate.update(
                "INSERT INTO producto (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?)",
                producto.getIdAdministrador(), producto.getNombre(), producto.getDescripcion(), producto.getPrecio(),
                producto.getStock(), producto.getFechaVencimiento());
    }

    public int update(Producto producto) {
        return jdbcTemplate.update(
                "UPDATE producto SET id_administrador = ?, nombre = ?, descripcion = ?, precio = ?, stock = ?, fecha_vencimiento = ? WHERE id_producto = ?",
                producto.getIdAdministrador(), producto.getNombre(), producto.getDescripcion(), producto.getPrecio(),
                producto.getStock(), producto.getFechaVencimiento(), producto.getIdProducto());
    }

    public int adjustStock(int id, int delta) {
        return jdbcTemplate.update("UPDATE producto SET stock = GREATEST(stock + ?, 0) WHERE id_producto = ?", delta, id);
    }

    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM producto WHERE id_producto = ?", id);
    }
}
