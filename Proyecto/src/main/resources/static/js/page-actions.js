const api = {
    fetchJson: async (path, options = {}) => {
        const response = await fetch(path, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error en la solicitud');
        }
        return response.json();
    },

    renderTable: (tbodyId, rows) => {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
    },

    renderCards: (containerId, items, renderer) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.map(renderer).join('');
    },
};

const showToast = (message, variant = 'success') => {
    window.alert(message);
};

const safeText = value => value == null ? '' : String(value);

const loadAdminUsers = async () => {
    const users = await api.fetchJson('/api/usuarios');
    api.renderTable('admin-users-body', users.map(user => [
        safeText(user.username),
        safeText(user.rol),
        safeText(user.idUsuario),
    ]));
};

const loadAdminClientesMascotas = async () => {
    const clientes = await api.fetchJson('/api/clientes');
    const mascotas = await api.fetchJson('/api/mascotas');
    api.renderCards('admin-clientes-list', clientes, cliente => `
        <div class="card-small">
            <h2>${cliente.nombre}</h2>
            <p class="muted-text">Documento: ${cliente.documento}</p>
            <p>${cliente.telefono || 'Sin teléfono'} · ${cliente.correo || 'Sin correo'}</p>
        </div>
    `);
    api.renderCards('admin-mascotas-list', mascotas, mascota => `
        <div class="card-small">
            <h2>${mascota.nombre}</h2>
            <p class="muted-text">${mascota.especie || 'Sin especie'} · ${mascota.raza || 'Sin raza'}</p>
            <p>Cliente: ${mascota.cliente?.nombre || 'No asignado'}</p>
        </div>
    `);
};

const loadAdminCatalogo = async () => {
    const servicios = await api.fetchJson('/api/servicios');
    const medicamentos = await api.fetchJson('/api/medicamentos');
    api.renderTable('admin-servicios-body', servicios.map(servicio => [
        safeText(servicio.nombre),
        safeText(servicio.descripcion),
        safeText(servicio.precio),
    ]));
    api.renderTable('admin-medicamentos-body', medicamentos.map(med => [
        safeText(med.nombre),
        safeText(med.descripcion),
        safeText(med.stock),
        safeText(med.precio),
    ]));
};

const loadAdminAdopciones = async () => {
    const adopciones = await api.fetchJson('/api/adopciones');
    api.renderTable('admin-adopciones-body', adopciones.map(item => [
        safeText(item.idAdopcion || item.id_adopcion),
        safeText(item.adoptante?.nombre || (item.adoptanteId ? 'ID ' + item.adoptanteId : 'N/A')),
        safeText(item.mascotaAdopcion?.nombre || (item.idMascotaAdopcion ? 'ID ' + item.idMascotaAdopcion : 'N/A')),
        safeText(item.fechaAdopcion || item.fecha_adopcion),
    ]));
};

const loadVetCitas = async () => {
    const citas = await api.fetchJson('/api/citas/summary');
    api.renderTable('vet-citas-body', citas.map(cita => [
        safeText(cita.fecha),
        safeText(cita.hora),
        safeText(cita.mascota),
        safeText(cita.motivo),
        safeText(cita.estado),
    ]));
};

const loadVetHistorial = async () => {
    const historiales = await api.fetchJson('/api/historiales');
    api.renderCards('vet-historial-list', historiales, historial => `
        <div class="card-small">
            <h2>${historial.mascota?.nombre || 'Sin mascota'}</h2>
            <p class="muted-text">${historial.fecha || ''}</p>
            <p>${historial.diagnostico || ''}</p>
            <p>${historial.observaciones || ''}</p>
        </div>
    `);
};

const loadVetMascotas = async () => {
    const mascotas = await api.fetchJson('/api/mascotas');
    api.renderCards('vet-mascotas-list', mascotas, mascota => `
        <div class="card-small">
            <h2>${mascota.nombre}</h2>
            <p class="muted-text">${mascota.especie} · ${mascota.raza}</p>
            <p>Edad: ${safeText(mascota.edad)} · Peso: ${safeText(mascota.peso)}</p>
            <p>Cliente: ${mascota.cliente?.nombre || 'No asignado'}</p>
        </div>
    `);
};

const loadRecepClientes = async () => {
    const clientes = await api.fetchJson('/api/clientes');
    api.renderTable('recep-clientes-body', clientes.map(cliente => [
        safeText(cliente.nombre),
        safeText(cliente.documento),
        safeText(cliente.telefono),
        safeText(cliente.correo),
    ]));
};

const loadRecepAdopciones = async () => {
    const mascotas = await api.fetchJson('/api/mascotas-adopcion');
    api.renderTable('recep-adopciones-body', mascotas.map(item => [
        safeText(item.nombre),
        safeText(item.especie),
        safeText(item.raza),
        safeText(item.estadoAdopcion || item.estado_adopcion),
    ]));
};

const loadRecepRecepcion = async () => {
    const citas = await api.fetchJson('/api/citas/summary');
    const rows = citas.map(cita => [
        safeText(cita.fecha),
        safeText(cita.hora),
        safeText(cita.cliente || 'N/A'),
        safeText(cita.mascota),
        safeText(cita.estado),
        cita.estado !== 'Confirmada' ? `<button class="btn-secondary" data-id="${cita.id}" data-action="confirm">Confirmar</button>` : 'Confirmada'
    ]);
    api.renderTable('recep-recepcion-body', rows);
    document.querySelectorAll('[data-action="confirm"]').forEach(button => {
        button.addEventListener('click', async event => {
            const id = event.target.dataset.id;
            await api.fetchJson(`/api/citas/${id}/estado`, {
                method: 'PATCH',
                body: JSON.stringify({ estado: 'Confirmada' }),
            });
            await loadRecepRecepcion();
            showToast('Cita confirmada');
        });
    });
};

const submitNewUsuario = async event => {
    event.preventDefault();
    const form = event.target;
    const payload = {
        username: form.querySelector('#new-username').value,
        contrasena: form.querySelector('#new-password').value,
        rol: form.querySelector('#new-role').value,
    };
    await api.fetchJson('/api/usuarios', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Usuario registrado');
    form.reset();
    loadAdminUsers();
};

const submitNewCita = async event => {
    event.preventDefault();
    const form = event.target;
    const payload = {
        mascotaId: form.querySelector('#cita-mascota').value,
        veterinarioId: '1',
        recepcionistaId: '1',
        fecha: form.querySelector('#cita-fecha').value,
        hora: form.querySelector('#cita-hora').value,
        motivo: form.querySelector('#cita-motivo').value,
    };
    await api.fetchJson('/api/citas', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Cita programada');
    form.reset();
};

const submitNewTratamiento = async event => {
    event.preventDefault();
    const form = event.target;
    const payload = {
        historialId: form.querySelector('#tratamiento-historial').value,
        medicamentoId: form.querySelector('#tratamiento-medicamento').value,
        descripcion: form.querySelector('#tratamiento-descripcion').value,
        dosis: form.querySelector('#tratamiento-dosis').value,
        fechaInicio: form.querySelector('#tratamiento-fecha-inicio').value,
        fechaFin: form.querySelector('#tratamiento-fecha-fin').value,
    };
    await api.fetchJson('/api/tratamientos', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Tratamiento guardado');
    form.reset();
};

const populateSelects = async (selectors) => {
    const promises = selectors.map(async ({ path, selectId, mapper }) => {
        const data = await api.fetchJson(path);
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = data.map(item => `
            <option value="${item[mapper.value]}">${mapper.label(item)}</option>
        `).join('');
    });
    await Promise.all(promises);
};

const initPage = async () => {
    const page = document.body.dataset.page;
    try {
        switch (page) {
            case 'admin-registrar-usuario':
                document.getElementById('admin-user-form')?.addEventListener('submit', submitNewUsuario);
                break;
            case 'admin-gestionar-usuarios':
                await loadAdminUsers();
                break;
            case 'admin-clientes-mascotas':
                await loadAdminClientesMascotas();
                break;
            case 'admin-catalogo':
                await loadAdminCatalogo();
                break;
            case 'admin-adopciones':
                await loadAdminAdopciones();
                break;
            case 'admin-tratamientos':
                await populateSelects([
                    { path: '/api/historiales', selectId: 'tratamiento-historial', mapper: { value: 'idHistorial', label: item => `${item.idHistorial} - ${item.mascota?.nombre || 'Mascota'}` } },
                    { path: '/api/medicamentos', selectId: 'tratamiento-medicamento', mapper: { value: 'idMedicamento', label: item => `${item.nombre} (${item.stock || 0} en stock)` } },
                ]);
                document.getElementById('admin-treatment-form')?.addEventListener('submit', submitNewTratamiento);
                break;
            case 'veterinario-citas':
                await loadVetCitas();
                break;
            case 'veterinario-historial':
                await loadVetHistorial();
                break;
            case 'veterinario-tratamientos':
                await populateSelects([
                    { path: '/api/historiales', selectId: 'tratamiento-historial', mapper: { value: 'idHistorial', label: item => `${item.idHistorial} - ${item.mascota?.nombre || 'Mascota'}` } },
                    { path: '/api/medicamentos', selectId: 'tratamiento-medicamento', mapper: { value: 'idMedicamento', label: item => `${item.nombre} (${item.stock || 0} unidades)` } },
                ]);
                document.getElementById('vet-treatment-form')?.addEventListener('submit', submitNewTratamiento);
                break;
            case 'veterinario-mascotas':
                await loadVetMascotas();
                break;
            case 'recepcionista-citas':
                await loadRecepClientes();
                const mascotas = await api.fetchJson('/api/mascotas');
                const petSelect = document.getElementById('cita-mascota');
                if (petSelect) {
                    petSelect.innerHTML = mascotas.map(mascota => `
                        <option value="${mascota.idMascota}">${mascota.nombre} (${mascota.cliente?.nombre || 'Cliente'})</option>
                    `).join('');
                }
                document.getElementById('recep-appointment-form')?.addEventListener('submit', submitNewCita);
                break;
            case 'recepcionista-clientes':
                await loadRecepClientes();
                break;
            case 'recepcionista-adopciones':
                await loadRecepAdopciones();
                break;
            case 'recepcionista-recepcion':
                await loadRecepRecepcion();
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(error);
        showToast(error.message || 'Error al cargar la página', 'error');
    }
};

window.addEventListener('DOMContentLoaded', initPage);
