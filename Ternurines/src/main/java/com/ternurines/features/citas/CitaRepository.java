package com.ternurines.features.citas;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Acceso a datos de citas mediante JDBC.
 * Consultas con joins para obtener nombres de mascota, cliente, veterinario y recepcionista.
 */
@Repository
public class CitaRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Construye el repositorio con la plantilla JDBC inyectada.
     *
     * @param jdbcTemplate plantilla para ejecutar consultas SQL
     */
    public CitaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Recupera todas las citas con nombres desnormalizados de entidades relacionadas.
     *
     * @return lista de citas ordenadas por fecha y hora
     */
    public List<Cita> findAll() {
        return jdbcTemplate.query(
                "SELECT c.*, m.nombre AS mascota, cl.nombre AS cliente, v.nombre AS veterinario, r.nombre AS recepcionista " +
                        "FROM cita c " +
                        "JOIN mascota m ON c.id_mascota = m.id_mascota " +
                        "JOIN cliente cl ON m.id_cliente = cl.id_cliente " +
                        "JOIN veterinario v ON c.id_veterinario = v.id_veterinario " +
                        "JOIN recepcionista r ON c.id_recepcionista = r.id_recepcionista " +
                        "ORDER BY c.fecha, c.hora",
                new BeanPropertyRowMapper<>(Cita.class));
    }

    /**
     * Inserta una nueva cita en la base de datos.
     *
     * @param cita entidad con los datos a persistir
     * @return número de filas afectadas
     */
    public int save(Cita cita) {
        return jdbcTemplate.update(
                "INSERT INTO cita (id_mascota, id_veterinario, id_recepcionista, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
                cita.getIdMascota(), cita.getIdVeterinario(), cita.getIdRecepcionista(), cita.getFecha(), cita.getHora(), cita.getMotivo(),
                cita.getEstado() == null ? "Pendiente" : cita.getEstado());
    }

    /**
     * Busca una cita por su identificador.
     *
     * @param id identificador de la cita
     * @return cita encontrada o vacío si no existe
     */
    public Optional<Cita> findById(int id) {
        var results = jdbcTemplate.query("SELECT * FROM cita WHERE id_cita = ?", new BeanPropertyRowMapper<>(Cita.class), id);
        return results.stream().findFirst();
    }

    /**
     * Comprueba si el veterinario está libre en la fecha y hora indicadas.
     *
     * @param cita cita con veterinario, fecha, hora e id (opcional para actualizaciones)
     * @return true si no hay otra cita activa en ese horario
     */
    public boolean isVeterinarioDisponible(Cita cita) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM cita WHERE id_veterinario = ? AND fecha = ? AND hora = ? AND estado <> 'Cancelada' AND (? IS NULL OR id_cita <> ?)",
                Integer.class, cita.getIdVeterinario(), cita.getFecha(), cita.getHora(), cita.getIdCita(), cita.getIdCita());
        return count == null || count == 0;
    }

    /**
     * Actualiza los datos de una cita existente.
     *
     * @param cita entidad con el id y los campos a modificar
     * @return número de filas afectadas
     */
    public int update(Cita cita) {
        return jdbcTemplate.update(
                "UPDATE cita SET id_mascota = ?, id_veterinario = ?, id_recepcionista = ?, fecha = ?, hora = ?, motivo = ?, estado = ? WHERE id_cita = ?",
                cita.getIdMascota(), cita.getIdVeterinario(), cita.getIdRecepcionista(), cita.getFecha(), cita.getHora(), cita.getMotivo(),
                cita.getEstado(), cita.getIdCita());
    }

    /**
     * Cambia únicamente el estado de una cita.
     *
     * @param id     identificador de la cita
     * @param estado nuevo estado (por ejemplo Cancelada o Completada)
     * @return número de filas afectadas
     */
    public int updateEstado(int id, String estado) {
        return jdbcTemplate.update("UPDATE cita SET estado = ? WHERE id_cita = ?", estado, id);
    }

    /**
     * Elimina una cita por su identificador.
     *
     * @param id identificador de la cita
     * @return número de filas afectadas
     */
    public int delete(int id) {
        return jdbcTemplate.update("DELETE FROM cita WHERE id_cita = ?", id);
    }
}
