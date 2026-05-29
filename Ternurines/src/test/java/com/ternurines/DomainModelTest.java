package com.ternurines;

import com.ternurines.features.auth.LoginRequest;
import com.ternurines.features.auth.LoginResponse;
import com.ternurines.features.citas.Cita;
import com.ternurines.features.clientes.Cliente;
import com.ternurines.features.dashboard.DashboardCita;
import com.ternurines.features.dashboard.DashboardSummary;
import com.ternurines.features.historial.HistorialRequest;
import com.ternurines.features.historial.HistorialResponse;
import com.ternurines.features.historial.Tratamiento;
import com.ternurines.features.historial.TratamientoRequest;
import com.ternurines.features.inventario.Medicamento;
import com.ternurines.features.inventario.Producto;
import com.ternurines.features.mascotas.Mascota;
import com.ternurines.features.servicio.Servicio;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DomainModelTest {

    @Test
    void shouldAllowSettingAndGettingModelProperties() {
        Cita cita = new Cita();
        cita.setIdCita(1);
        cita.setMotivo("Consulta general");
        cita.setFecha(LocalDate.of(2026, 5, 29));
        cita.setHora(LocalTime.of(9, 0));

        assertEquals(1, cita.getIdCita());
        assertEquals("Consulta general", cita.getMotivo());

        Cliente cliente = new Cliente();
        cliente.setNombre("Test Nombre");
        assertEquals("Test Nombre", cliente.getNombre());

        Mascota mascota = new Mascota();
        mascota.setNombre("Fido");
        assertEquals("Fido", mascota.getNombre());

        Medicamento medicamento = new Medicamento();
        medicamento.setNombre("Amoxicilina");
        assertEquals("Amoxicilina", medicamento.getNombre());

        Producto producto = new Producto();
        producto.setNombre("Jabón");
        assertEquals("Jabón", producto.getNombre());

        Servicio servicio = new Servicio();
        servicio.setNombre("Consulta");
        assertEquals("Consulta", servicio.getNombre());

        LoginRequest loginRequest = new LoginRequest("user@test.com", "1234");
        assertEquals("user@test.com", loginRequest.correo());

        LoginResponse loginResponse = new LoginResponse(1, "User", "user@test.com", "CLIENTE");
        assertEquals("CLIENTE", loginResponse.rol());

        HistorialRequest historialRequest = new HistorialRequest();
        historialRequest.setDiagnostico("Malestar");
        assertEquals("Malestar", historialRequest.getDiagnostico());

        HistorialResponse historialResponse = new HistorialResponse();
        historialResponse.setDiagnostico("Chequeo");
        assertEquals("Chequeo", historialResponse.getDiagnostico());

        TratamientoRequest tratamientoRequest = new TratamientoRequest();
        tratamientoRequest.setDescripcion("Aplicar crema");
        assertEquals("Aplicar crema", tratamientoRequest.getDescripcion());

        Tratamiento tratamiento = new Tratamiento();
        tratamiento.setDescripcion("Aplicar crema");
        assertEquals("Aplicar crema", tratamiento.getDescripcion());

        DashboardSummary summary = new DashboardSummary();
        summary.setTotalUsuarios(5);
        assertEquals(5, summary.getTotalUsuarios());

        DashboardCita dashboardCita = new DashboardCita();
        dashboardCita.setMascota("Fido");
        assertEquals("Fido", dashboardCita.getMascota());
    }
}
