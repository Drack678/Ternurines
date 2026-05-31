package com.ternurines.features.dashboard;

import java.util.List;

/**
 * DTO con las métricas agregadas y la lista de próximas citas del dashboard.
 */
public class DashboardSummary {
    private int totalUsuarios;
    private int mascotasRegistradas;
    private int citasProgramadas;
    private int medicamentosEnStock;
    private int stockBajo;
    private List<DashboardCita> proximasCitas;

    /**
     * Devuelve el total de usuarios registrados en todos los roles.
     *
     * @return cantidad total de usuarios
     */
    public int getTotalUsuarios() {
        return totalUsuarios;
    }

    /**
     * Establece el total de usuarios registrados.
     *
     * @param totalUsuarios cantidad total de usuarios
     */
    public void setTotalUsuarios(int totalUsuarios) {
        this.totalUsuarios = totalUsuarios;
    }

    /**
     * Devuelve la cantidad de mascotas con historial médico.
     *
     * @return mascotas registradas en historial
     */
    public int getMascotasRegistradas() {
        return mascotasRegistradas;
    }

    /**
     * Establece la cantidad de mascotas con historial médico.
     *
     * @param mascotasRegistradas mascotas registradas en historial
     */
    public void setMascotasRegistradas(int mascotasRegistradas) {
        this.mascotasRegistradas = mascotasRegistradas;
    }

    /**
     * Devuelve la cantidad de citas programadas en el sistema.
     *
     * @return citas programadas
     */
    public int getCitasProgramadas() {
        return citasProgramadas;
    }

    /**
     * Establece la cantidad de citas programadas.
     *
     * @param citasProgramadas citas programadas
     */
    public void setCitasProgramadas(int citasProgramadas) {
        this.citasProgramadas = citasProgramadas;
    }

    /**
     * Devuelve la cantidad de medicamentos en inventario.
     *
     * @return medicamentos en stock
     */
    public int getMedicamentosEnStock() {
        return medicamentosEnStock;
    }

    /**
     * Establece la cantidad de medicamentos en inventario.
     *
     * @param medicamentosEnStock medicamentos en stock
     */
    public void setMedicamentosEnStock(int medicamentosEnStock) {
        this.medicamentosEnStock = medicamentosEnStock;
    }

    /**
     * Devuelve la cantidad de medicamentos con stock bajo.
     *
     * @return medicamentos con stock crítico
     */
    public int getStockBajo() {
        return stockBajo;
    }

    /**
     * Establece la cantidad de medicamentos con stock bajo.
     *
     * @param stockBajo medicamentos con stock crítico
     */
    public void setStockBajo(int stockBajo) {
        this.stockBajo = stockBajo;
    }

    /**
     * Devuelve las próximas citas a mostrar en el dashboard.
     *
     * @return lista de próximas citas
     */
    public List<DashboardCita> getProximasCitas() {
        return proximasCitas;
    }

    /**
     * Establece las próximas citas a mostrar en el dashboard.
     *
     * @param proximasCitas lista de próximas citas
     */
    public void setProximasCitas(List<DashboardCita> proximasCitas) {
        this.proximasCitas = proximasCitas;
    }
}
