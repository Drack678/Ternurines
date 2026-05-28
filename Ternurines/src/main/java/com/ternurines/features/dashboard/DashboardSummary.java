package com.ternurines.features.dashboard;

import java.util.List;

public class DashboardSummary {
    private int clientesRegistrados;
    private int mascotasActivas;
    private int citasHoy;
    private int stockBajo;
    private List<DashboardCita> proximasCitas;

    public int getClientesRegistrados() {
        return clientesRegistrados;
    }

    public void setClientesRegistrados(int clientesRegistrados) {
        this.clientesRegistrados = clientesRegistrados;
    }

    public int getMascotasActivas() {
        return mascotasActivas;
    }

    public void setMascotasActivas(int mascotasActivas) {
        this.mascotasActivas = mascotasActivas;
    }

    public int getCitasHoy() {
        return citasHoy;
    }

    public void setCitasHoy(int citasHoy) {
        this.citasHoy = citasHoy;
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
