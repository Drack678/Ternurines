package com.ternurines.features.clientes;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JDBC para persistencia de clientes en la tabla cliente.
 */
@Repository
public class ClienteRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el repositorio con la plantilla JDBC inyectada.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas SQL
     */
    public ClienteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Recupera todos los clientes ordenados por nombre.
     *
     * @return lista de clientes
     */
    public List<Cliente> findAll() {
        return jdbcTemplate.query("SELECT * FROM cliente ORDER BY nombre", new BeanPropertyRowMapper<>(Cliente.class));
    }

    /**
     * Busca un cliente por su identificador.
     *
     * @param id identificador del cliente
     * @return cliente encontrado o vacío si no existe
     */
    public Optional<Cliente> findById(int id) {
        var results = jdbcTemplate.query("SELECT * FROM cliente WHERE id_cliente = ?", new BeanPropertyRowMapper<>(Cliente.class), id);
        return results.stream().findFirst();
    }

    /**
     * Inserta un nuevo cliente en la base de datos.
     *
     * @param cliente entidad con los datos a persistir
     * @return número de filas afectadas
     */
    public int save(Cliente cliente) {
        return jdbcTemplate.update(
                "INSERT INTO cliente (nombre, documento, telefono, direccion, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)",
                cliente.getNombre(), cliente.getDocumento(), cliente.getTelefono(), cliente.getDireccion(), cliente.getCorreo(), cliente.getContrasena());
    }

    /**
     * Actualiza los datos de un cliente existente.
     *
     * @param cliente entidad con el id y los campos a modificar
     * @return número de filas afectadas
     */
    public int update(Cliente cliente) {
        return jdbcTemplate.update(
                "UPDATE cliente SET nombre = ?, documento = ?, telefono = ?, direccion = ?, correo = ?, contrasena = ? WHERE id_cliente = ?",
                cliente.getNombre(), cliente.getDocumento(), cliente.getTelefono(), cliente.getDireccion(), cliente.getCorreo(),
                cliente.getContrasena(), cliente.getIdCliente());
    }

    /**
     * Elimina un cliente por su identificador.
     *
     * @param id identificador del cliente
     * @return número de filas afectadas
     */
    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM cliente WHERE id_cliente = ?", id);
    }
}
