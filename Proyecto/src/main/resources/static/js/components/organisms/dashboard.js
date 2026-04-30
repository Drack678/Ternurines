import { createStatCard } from '../atoms/card.js';
import { createTable } from '../molecules/table.js';

const formatDate = dateString => new Date(dateString).toLocaleDateString('es-CO');

export function renderSummary(summary) {
    const container = document.getElementById('dashboard');
    container.innerHTML = '';

    const cards = [
        createStatCard('Clientes', summary.clientes, 'Registros de clientes activos'),
        createStatCard('Mascotas', summary.mascotas, 'Animales registrados en la clínica'),
        createStatCard('Citas', summary.citas, 'Citas agendadas totales'),
        createStatCard('Servicios', summary.servicios, 'Tipos de servicio disponibles')
    ];

    cards.forEach(card => container.appendChild(card));
}

export function renderClientTable(clients) {
    const container = document.getElementById('client-table');
    const headers = ['Nombre', 'Documento', 'Teléfono', 'Correo'];
    const rows = clients.map(cliente => [cliente.nombre, cliente.documento, cliente.telefono || '-', cliente.correo || '-']);
    container.innerHTML = '';
    container.appendChild(createTable(headers, rows));
}

export function renderPetTable(pets) {
    const container = document.getElementById('pet-table');
    const headers = ['Nombre', 'Especie', 'Raza', 'Edad', 'Propietario'];
    const rows = pets.map(mascota => [mascota.nombre, mascota.especie || '-', mascota.raza || '-', mascota.edad || '-', mascota.cliente ? mascota.cliente.nombre : '-']);
    container.innerHTML = '';
    container.appendChild(createTable(headers, rows));
}

export function renderAppointmentTable(citas) {
    const container = document.getElementById('appointment-table');
    const headers = ['Mascota', 'Veterinario', 'Recepcionista', 'Fecha', 'Hora', 'Estado'];
    const rows = citas.map(cita => [
        cita.mascota ? cita.mascota.nombre : '-',
        cita.veterinario ? cita.veterinario.nombre : '-',
        cita.recepcionista ? cita.recepcionista.nombre : '-',
        cita.fecha ? formatDate(cita.fecha) : '-',
        cita.hora || '-',
        cita.estado || '-'
    ]);
    container.innerHTML = '';
    container.appendChild(createTable(headers, rows));
}

export function renderAdoptionTable(adoptions) {
    const container = document.getElementById('adoption-table');
    const headers = ['Adoptante', 'Mascota', 'Fecha'];
    const rows = adoptions.map(adopcion => [
        adopcion.id ? (adopcion.id.idAdoptante || '-') : '-',
        adopcion.id ? (adopcion.id.idMascotaAdopcion || '-') : '-',
        adopcion.fechaAdopcion ? formatDate(adopcion.fechaAdopcion) : '-'
    ]);
    container.innerHTML = '';
    container.appendChild(createTable(headers, rows));
}
