package com.ternurines.features.dashboard;

import java.util.List;

/**
 * Dashboard summary payload returned by the dashboard API.
 */
public class DashboardSummary {
    private int totalUsuarios;
    private int mascotasRegistradas;
    private int citasProgramadas;
    private int medicamentosEnStock;
    private int stockBajo;
    private List<DashboardCita> proximasCitas;

    public int getTotalUsuarios() {
        return totalUsuarios;
    }

    public void setTotalUsuarios(int totalUsuarios) {
        this.totalUsuarios = totalUsuarios;
    }

    public int getMascotasRegistradas() {
        return mascotasRegistradas;
    }

    public void setMascotasRegistradas(int mascotasRegistradas) {
        this.mascotasRegistradas = mascotasRegistradas;
    }

    public int getCitasProgramadas() {
        return citasProgramadas;
    }

    public void setCitasProgramadas(int citasProgramadas) {
        this.citasProgramadas = citasProgramadas;
    }

    public int getMedicamentosEnStock() {
        return medicamentosEnStock;
    }

    public void setMedicamentosEnStock(int medicamentosEnStock) {
        this.medicamentosEnStock = medicamentosEnStock;
    }

    public int getStockBajo() {
        return stockBajo;
    }

    public void setStockBajo(int stockBajo) {
        this.stockBajo = stockBajo;
    }

    public List<DashboardCita> getProximasCitas() {
        return proximasCitas;
    }

    public void setProximasCitas(List<DashboardCita> proximasCitas) {
        this.proximasCitas = proximasCitas;
    }
}
