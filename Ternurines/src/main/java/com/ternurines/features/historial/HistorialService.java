package com.ternurines.features.historial;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class HistorialService {

    private final JdbcTemplate jdbcTemplate;

    public HistorialService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<HistorialMascota> obtenerMascotas() {
        String sql = "SELECT m.id_mascota AS idMascota, m.nombre, c.nombre AS cliente " +
                     "FROM mascota m " +
                     "JOIN cliente c ON m.id_cliente = c.id_cliente " +
                     "ORDER BY m.nombre";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(HistorialMascota.class));
    }

    public List<Veterinario> obtenerVeterinarios() {
        String sql = "SELECT id_veterinario AS idVeterinario, nombre, especialidad " +
                     "FROM veterinario ORDER BY nombre";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Veterinario.class));
    }

    public List<MedicamentoRef> obtenerMedicamentos() {
        String sql = "SELECT id_medicamento AS idMedicamento, nombre, stock, precio " +
                     "FROM medicamento ORDER BY nombre";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(MedicamentoRef.class));
    }

    public List<HistorialResponse> obtenerHistoriales() {
        String sql = "SELECT h.id_historial AS idHistorial, h.id_mascota AS idMascota, h.id_veterinario AS idVeterinario, " +
                     "m.nombre AS mascota, v.nombre AS veterinario, h.fecha, h.diagnostico, h.observaciones " +
                     "FROM historial_medico h " +
                     "JOIN mascota m ON h.id_mascota = m.id_mascota " +
                     "JOIN veterinario v ON h.id_veterinario = v.id_veterinario " +
                     "ORDER BY h.fecha DESC, h.id_historial DESC";

        List<HistorialResponse> historiales = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(HistorialResponse.class));
        historiales.forEach(historial -> historial.setTratamientos(obtenerTratamientos(historial.getIdHistorial())));
        return historiales;
    }

    public List<HistorialResponse> obtenerHistorialPorMascota(int idMascota) {
        String sql = "SELECT h.id_historial AS idHistorial, h.id_mascota AS idMascota, h.id_veterinario AS idVeterinario, " +
                     "m.nombre AS mascota, v.nombre AS veterinario, h.fecha, h.diagnostico, h.observaciones " +
                     "FROM historial_medico h " +
                     "JOIN mascota m ON h.id_mascota = m.id_mascota " +
                     "JOIN veterinario v ON h.id_veterinario = v.id_veterinario " +
                     "WHERE h.id_mascota = ? ORDER BY h.fecha DESC";

        List<HistorialResponse> historiales = jdbcTemplate.query(sql, new Object[]{idMascota},
                new BeanPropertyRowMapper<>(HistorialResponse.class));

        historiales.forEach(historial -> historial.setTratamientos(obtenerTratamientos(historial.getIdHistorial())));
        return historiales;
    }

    public HistorialResponse crearHistorial(HistorialRequest request) {
        String sql = "INSERT INTO historial_medico (id_mascota, id_veterinario, fecha, diagnostico, observaciones) " +
                     "VALUES (?, ?, ?, ?, ?) RETURNING id_historial";
        Integer idHistorial = jdbcTemplate.queryForObject(sql,
                new Object[]{request.getIdMascota(), request.getIdVeterinario(), Date.valueOf(LocalDate.now()), request.getDiagnostico(), request.getObservaciones()},
                Integer.class);

        HistorialResponse creado = new HistorialResponse();
        creado.setIdHistorial(idHistorial);
        creado.setIdMascota(request.getIdMascota());
        creado.setIdVeterinario(request.getIdVeterinario());
        creado.setFecha(LocalDate.now());
        creado.setDiagnostico(request.getDiagnostico());
        creado.setObservaciones(request.getObservaciones());
        creado.setTratamientos(new ArrayList<>());
        return creado;
    }

    public Tratamiento crearTratamiento(int historialId, TratamientoRequest request) {
        String sql = "INSERT INTO tratamiento (id_historial, id_medicamento, descripcion, dosis, fecha_inicio, fecha_fin) " +
                     "VALUES (?, ?, ?, ?, ?, ?) RETURNING id_tratamiento";
        Integer idTratamiento = jdbcTemplate.queryForObject(sql,
                new Object[]{historialId, request.getIdMedicamento(), request.getDescripcion(), request.getDosis(), Date.valueOf(request.getFechaInicio()), Date.valueOf(request.getFechaFin())},
                Integer.class);

        Tratamiento tratamiento = new Tratamiento();
        tratamiento.setIdTratamiento(idTratamiento);
        tratamiento.setIdHistorial(historialId);
        tratamiento.setIdMedicamento(request.getIdMedicamento());
        tratamiento.setDescripcion(request.getDescripcion());
        tratamiento.setDosis(request.getDosis());
        tratamiento.setFechaInicio(request.getFechaInicio());
        tratamiento.setFechaFin(request.getFechaFin());
        return tratamiento;
    }

    private List<Tratamiento> obtenerTratamientos(int historialId) {
        String sql = "SELECT t.id_tratamiento AS idTratamiento, t.id_historial AS idHistorial, t.id_medicamento AS idMedicamento, " +
                     "t.descripcion, t.dosis, t.fecha_inicio AS fechaInicio, t.fecha_fin AS fechaFin, m.nombre AS nombreMedicamento " +
                     "FROM tratamiento t " +
                     "JOIN medicamento m ON t.id_medicamento = m.id_medicamento " +
                     "WHERE t.id_historial = ? ORDER BY t.fecha_inicio DESC";
        return jdbcTemplate.query(sql, new Object[]{historialId}, new BeanPropertyRowMapper<>(Tratamiento.class));
    }
}
