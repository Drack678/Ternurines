import { renderSummary, renderClientTable, renderPetTable, renderAppointmentTable, renderAdoptionTable } from '../components/organisms/dashboard.js';

const fetchJson = async (path) => {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }
    return response.json();
};

export async function renderDashboardSection() {
    try {
        const [summary, clientes, mascotas, citas, adopciones] = await Promise.all([
            fetchJson('/api/dashboard/summary'),
            fetchJson('/api/clientes'),
            fetchJson('/api/mascotas'),
            fetchJson('/api/citas'),
            fetchJson('/api/adopciones')
        ]);

        renderSummary(summary);
        renderClientTable(clientes);
        renderPetTable(mascotas);
        renderAppointmentTable(citas.slice(0, 6));
        renderAdoptionTable(adopciones.slice(0, 6));
    } catch (error) {
        console.error('Dashboard error', error);
        const dashboard = document.getElementById('dashboard');
        dashboard.innerHTML = '<div class="card">No se pudo cargar el dashboard. Revisa los servicios del backend.</div>';
    }
}
