package com.ternurines.features.clientes;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
/**
 * Data repository for cliente persistence and SQL access.
 */
public class ClienteRepository {

    private final JdbcTemplate jdbcTemplate;

    public ClienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Cliente> findAll() {
        return jdbcTemplate.query("SELECT * FROM cliente ORDER BY nombre", new BeanPropertyRowMapper<>(Cliente.class));
    }

    public Optional<Cliente> findById(int id) {
        var results = jdbcTemplate.query("SELECT * FROM cliente WHERE id_cliente = ?", new BeanPropertyRowMapper<>(Cliente.class), id);
        return results.stream().findFirst();
    }

    public int save(Cliente cliente) {
        return jdbcTemplate.update(
                "INSERT INTO cliente (nombre, documento, telefono, direccion, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)",
                cliente.getNombre(), cliente.getDocumento(), cliente.getTelefono(), cliente.getDireccion(), cliente.getCorreo(), cliente.getContrasena());
    }

    public int update(Cliente cliente) {
        return jdbcTemplate.update(
                "UPDATE cliente SET nombre = ?, documento = ?, telefono = ?, direccion = ?, correo = ?, contrasena = ? WHERE id_cliente = ?",
                cliente.getNombre(), cliente.getDocumento(), cliente.getTelefono(), cliente.getDireccion(), cliente.getCorreo(),
                cliente.getContrasena(), cliente.getIdCliente());
    }

    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM cliente WHERE id_cliente = ?", id);
    }
}
