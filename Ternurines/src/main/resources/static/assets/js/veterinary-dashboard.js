// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', () => {
    RoleManager.requireRole(['veterinario']);
    initializeDashboard();
    initializeFilters();
    loadDashboardData();
});

function initializeFilters() {
    const reloaders = {
        citas: loadCitasTable,
        pacientes: loadPacientes,
        historial: loadHistorialesTable,
        recetas: loadRecetasTable
    };
    ['citas-search', 'pacientes-search', 'historial-search', 'recetas-search']
        .forEach(id => FilterUtils.bindInput(id, () => reloaders[FilterUtils.activeSection()]?.()));
}

function initializeDashboard() {
    const user = SessionManager.get('user');
    if (user) {
        document.getElementById('user-name').textContent = user.nombre || 'Veterinario';
        document.getElementById('user-email').textContent = user.email || 'vet@ternurines.com';
    }
}

// ========== NAVEGACIÓN ==========

function navigateTo(section, event) {
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('section-active');
    });
    document.getElementById('dashboard-section').style.display = 'none';

    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('section-active');
    }

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    let activeLink = event?.target?.closest('.nav-link');
    if (!activeLink) {
        activeLink = Array.from(document.querySelectorAll('.nav-link')).find(link => {
            const onclick = link.getAttribute('onclick') || '';
            return onclick.includes(`navigateTo('${section}')`);
        }) || document.querySelector(`.nav-link[data-target="${section}"]`);
    }
    if (activeLink) activeLink.classList.add('active');

    const titles = {
        'dashboard': 'Dashboard',
        'citas': 'Mis Citas',
        'pacientes': 'Mis Pacientes',
        'historial': 'Historial Clínico',
        'recetas': 'Recetas Médicas'
    };
    document.getElementById('page-title').textContent = titles[section] || section;

    switch(section) {
        case 'citas':
            loadCitasTable();
            break;
        case 'pacientes':
            loadPacientes();
            break;
        case 'historial':
            loadPetFilterForHistorial();
            loadHistorialesTable();
            break;
        case 'recetas':
            loadRecetasTable();
            break;
    }

    scrollToTop();
}

function scrollToTop() {
    document.querySelector('.content').scrollTop = 0;
}

// ========== CARGA DE DATOS DASHBOARD ==========

async function loadDashboardData() {
    try {
        Loading.show();

        const user = SessionManager.get('user');
        const citasRes = await API.get('/citas');
        const userCitas = citasRes.filter(c => c.veterinario_id === user.id);

        // Citas hoy
        const todayCitas = userCitas.filter(c => {
            const citaDate = new Date(c.fecha).toDateString();
            const today = new Date().toDateString();
            return citaDate === today;
        });
        document.getElementById('stat-citas-hoy').textContent = todayCitas.length || 0;

        // Próximas citas
        const upcomingCitas = userCitas.filter(c => new Date(c.fecha) > new Date()).slice(0, 5);
        displayUpcomingCitas(upcomingCitas);

        // Cargar historiales
        const historialesRes = await API.get('/historial');
        document.getElementById('stat-historiales').textContent = historialesRes.length || 0;
        displayRecentHistoriales(historialesRes.slice(0, 5));

        // Cargar recetas
        const recetasRes = await API.get('/historial');
        const withMeds = recetasRes.filter(h => h.medicamentos && h.medicamentos.length > 0);
        document.getElementById('stat-recetas').textContent = withMeds.length || 0;

        // Pacientes únicos
        const uniquePacientes = [...new Set(userCitas.map(c => c.mascota_id))];
        document.getElementById('stat-pacientes').textContent = uniquePacientes.length || 0;

        Loading.hide();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        Notify.error('Error al cargar datos');
        Loading.hide();
    }
}

function displayUpcomingCitas(citas) {
    const container = document.getElementById('upcoming-citas');
    if (citas.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay citas próximas</p>';
        return;
    }

    container.innerHTML = citas.map(cita => `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--border-light);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <strong>${cita.mascota_nombre}</strong>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">
                        ${DateFormatter.format(cita.fecha, 'DD/MM/YYYY HH:mm')}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                        ${cita.cliente_nombre} • ${cita.motivo}
                    </div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="startConsultation(${cita.id})">Iniciar</button>
            </div>
        </div>
    `).join('');
}

function displayRecentHistoriales(historiales) {
    const container = document.getElementById('recent-historiales');
    if (historiales.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay registros en el historial</p>';
        return;
    }

    container.innerHTML = '<div class="timeline">' + historiales.map(hist => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-time">${DateFormatter.format(hist.fecha, 'DD/MM/YYYY')}</div>
                <div style="padding: 8px 0;">
                    <strong>${hist.mascota_nombre}</strong>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">
                        ${hist.diagnostico || 'Consulta general'}
                    </div>
                </div>
            </div>
        </div>
    `).join('') + '</div>';
}

// ========== MIS CITAS ==========

async function loadCitasTable() {
    try {
        Loading.show();
        const user = SessionManager.get('user');
        const citasRes = await API.get('/citas');
        const userCitas = citasRes.filter(c => c.veterinario_id === user.id);

        const dateFilter = document.getElementById('cita-date-filter').value;
        const query = FilterUtils.text('citas-search');
        const status = FilterUtils.value('cita-status-filter').toLowerCase();
        let filtered = userCitas;
        if (dateFilter) filtered = filtered.filter(c => c.fecha.startsWith(dateFilter));
        if (status) filtered = filtered.filter(c => FilterUtils.normalize(c.estado) === status);
        if (query) filtered = filtered.filter(c => FilterUtils.matchesText(c, query, ['mascota_nombre', 'cliente_nombre', 'motivo', 'estado']));

        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'mascota_nombre', label: 'Mascota' },
            { key: 'cliente_nombre', label: 'Propietario' },
            { key: 'fecha', label: 'Fecha/Hora', render: (val) => DateFormatter.format(val, 'DD/MM/YYYY HH:mm') },
            { key: 'motivo', label: 'Motivo' },
            { 
                key: 'estado',
                label: 'Estado',
                render: (val) => {
                    const colors = { 'confirmada': 'success', 'pendiente': 'warning', 'cancelada': 'danger' };
                    return `<span class="badge badge-${colors[val] || 'primary'}">${val}</span>`;
                }
            },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-view" onclick="startConsultation(${row.id})">🏥 Consulta</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('citas-table', columns, filtered.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar citas');
        Loading.hide();
    }
}

function startConsultation(citaId) {
    Modal.open('Iniciar Consulta', `
        <div style="display: grid; gap: 16px;">
            <div class="form-group">
                <label for="consult-diagnosis" class="required">Diagnóstico</label>
                <textarea id="consult-diagnosis" placeholder="Describe el diagnóstico..."></textarea>
            </div>
            <div class="form-group">
                <label for="consult-treatment" class="required">Tratamiento</label>
                <textarea id="consult-treatment" placeholder="Describe el tratamiento recomendado..."></textarea>
            </div>
            <div class="form-group">
                <label for="consult-notes">Notas Adicionales</label>
                <textarea id="consult-notes" placeholder="Cualquier nota importante..."></textarea>
            </div>
        </div>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar Consulta', class: 'btn-primary', callback: `saveConsultation(${citaId})` }
    ]);
}

async function saveConsultation(citaId) {
    try {
        const consultData = {
            diagnostico: document.getElementById('consult-diagnosis').value,
            tratamiento: document.getElementById('consult-treatment').value,
            notas: document.getElementById('consult-notes').value
        };

        await API.put(`/citas/${citaId}`, { ...consultData, estado: 'completada' });
        Modal.close();
        Notify.success('Consulta guardada exitosamente');
        loadCitasTable();
        loadDashboardData();
    } catch (error) {
        Notify.error('Error al guardar consulta');
    }
}

// ========== MIS PACIENTES ==========

async function loadPacientes() {
    try {
        Loading.show();
        const user = SessionManager.get('user');
        const citasRes = await API.get('/citas');
        const mascotasRes = await API.get('/mascotas');

        const userCitasMascotasIds = [...new Set(citasRes
            .filter(c => c.veterinario_id === user.id)
            .map(c => c.mascota_id))];

        let pacientes = mascotasRes.filter(m => userCitasMascotasIds.includes(m.id || m.idMascota));
        const query = FilterUtils.text('pacientes-search');
        const species = FilterUtils.value('pacientes-species-filter').toLowerCase();
        pacientes = pacientes.filter(mascota =>
            FilterUtils.matchesText(mascota, query, ['nombre', 'especie', 'raza', 'dueno_nombre', 'nombreCliente']) &&
            (!species || FilterUtils.normalize(mascota.especie) === species)
        );

        const grid = document.getElementById('pacientes-grid');
        if (pacientes.length === 0) {
            grid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">No hay pacientes registrados</p>';
        } else {
            grid.innerHTML = pacientes.map(mascota => `
                <div class="card" style="cursor: pointer;" onclick="viewPacientDetails(${mascota.id || mascota.idMascota})">
                    <div style="text-align: center; margin-bottom: 16px;">
                        <div style="font-size: 3rem; margin-bottom: 8px;">
                            ${mascota.especie === 'perro' ? '🐕' : mascota.especie === 'gato' ? '🐈' : mascota.especie === 'conejo' ? '🐰' : '🐦'}
                        </div>
                    </div>
                    <h3 style="margin: 0 0 4px 0; text-align: center;">${mascota.nombre}</h3>
                    <p style="text-align: center; margin: 0 0 12px 0; color: var(--text-muted); font-size: 0.9rem;">
                        ${mascota.raza}
                    </p>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">
                        <div style="margin-bottom: 6px;"><strong>Edad:</strong> ${mascota.edad} años</div>
                        <div style="margin-bottom: 6px;"><strong>Peso:</strong> ${mascota.peso} kg</div>
                        <div style="margin-bottom: 6px;"><strong>Propietario:</strong> ${mascota.dueno_nombre || mascota.nombreCliente || 'N/A'}</div>
                    </div>
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-light);">
                        <button class="btn btn-sm btn-primary btn-block" onclick="event.stopPropagation(); viewPacientHistory(${mascota.id || mascota.idMascota})">
                            Ver Historial
                        </button>
                    </div>
                </div>
            `).join('');
        }

        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar pacientes');
        Loading.hide();
    }
}

async function viewPacientDetails(petId) {
    try {
        const mascotasRes = await API.get('/mascotas');
        const mascota = mascotasRes.find(m => m.id === petId || m.idMascota === petId);
        if (!mascota) {
            Notify.error('Mascota no encontrada');
            return;
        }

        Modal.open('Detalles del Paciente', `
            <div class="grid" style="gap: 12px;">
                <div style="text-align: center; font-size: 3rem; margin-bottom: 8px;">
                    ${mascota.especie === 'perro' ? '🐕' : mascota.especie === 'gato' ? '🐈' : mascota.especie === 'conejo' ? '🐰' : '🐦'}
                </div>
                <h3 style="margin: 0; text-align: center;">${mascota.nombre}</h3>
                <div style="border-top: 1px solid var(--border-light); padding-top: 12px;">
                    <div style="margin-bottom: 8px;"><strong>Especie:</strong> ${mascota.especie}</div>
                    <div style="margin-bottom: 8px;"><strong>Raza:</strong> ${mascota.raza}</div>
                    <div style="margin-bottom: 8px;"><strong>Edad:</strong> ${mascota.edad} años</div>
                    <div style="margin-bottom: 8px;"><strong>Peso:</strong> ${mascota.peso} kg</div>
                    <div style="margin-bottom: 8px;"><strong>Propietario:</strong> ${mascota.dueno_nombre}</div>
                </div>
            </div>
        `, [
            { label: 'Ver Historial', class: 'btn-primary', callback: `viewPacientHistory(${petId})` },
            { label: 'Cerrar', class: 'btn-outline', callback: 'Modal.close()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar detalles del paciente');
    }
}

function viewPacientHistory(petId) {
    navigateTo('historial');
    setTimeout(() => {
        document.getElementById('historial-pet-filter').value = petId;
        loadHistorialesTable();
    }, 100);
}

// ========== HISTORIAL CLÍNICO ==========

async function loadPetFilterForHistorial() {
    try {
        const user = SessionManager.get('user');
        const citasRes = await API.get('/citas');
        const mascotasRes = await API.get('/mascotas');

        const userCitasMascotasIds = [...new Set(citasRes
            .filter(c => c.veterinario_id === user.id)
            .map(c => c.mascota_id))];

        const pacientes = mascotasRes.filter(m => userCitasMascotasIds.includes(m.id || m.idMascota));

        const select = document.getElementById('historial-pet-filter');
        select.innerHTML = '<option value="">-- Todos los pacientes --</option>' +
            pacientes.map(p => `<option value="${p.id || p.idMascota}">${p.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error loading pet filter:', error);
    }
}

async function loadHistorialesTable() {
    try {
        Loading.show();
        const historialesRes = await API.get('/historial');

        const petFilter = document.getElementById('historial-pet-filter').value;
        const dateFilter = document.getElementById('historial-date-filter').value;
        const query = FilterUtils.text('historial-search');

        let filtered = historialesRes;
        if (petFilter) filtered = filtered.filter(h => h.mascota_id == petFilter);
        if (dateFilter) filtered = filtered.filter(h => h.fecha.startsWith(dateFilter));
        if (query) filtered = filtered.filter(h => FilterUtils.matchesText(h, query, ['mascota_nombre', 'veterinario_nombre', 'diagnostico', 'notas', 'tratamiento']));

        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'mascota_nombre', label: 'Paciente' },
            { key: 'fecha', label: 'Fecha', render: (val) => DateFormatter.format(val, 'DD/MM/YYYY') },
            { key: 'tipo', label: 'Tipo', render: (val) => val || 'Consulta' },
            { key: 'diagnostico', label: 'Diagnóstico' },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-view" onclick="viewHistorialDetails(${row.id})">👁️ Ver</button>
                        <button class="action-btn action-btn-edit" onclick="editHistorial(${row.id})">✏️ Editar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('historiales-table', columns, filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar historiales');
        Loading.hide();
    }
}

function openNewHistorialModal() {
    Modal.open('Nuevo Registro del Historial', `
        <form id="historial-form" class="grid">
            <div class="form-group">
                <label for="hist-mascota" class="required">Paciente</label>
                <select id="hist-mascota">
                    <option value="">-- Selecciona un paciente --</option>
                </select>
            </div>
            <div class="form-group">
                <label for="hist-tipo">Tipo de Registro</label>
                <select id="hist-tipo">
                    <option value="consulta">Consulta</option>
                    <option value="tratamiento">Tratamiento</option>
                    <option value="cirugia">Cirugía</option>
                    <option value="vacuna">Vacuna</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="form-group">
                <label for="hist-diagnostico" class="required">Diagnóstico</label>
                <textarea id="hist-diagnostico" placeholder="Describe el diagnóstico..."></textarea>
            </div>
            <div class="form-group">
                <label for="hist-tratamiento">Tratamiento</label>
                <textarea id="hist-tratamiento" placeholder="Describe el tratamiento..."></textarea>
            </div>
            <div class="form-group">
                <label for="hist-notas">Notas</label>
                <textarea id="hist-notas" placeholder="Notas adicionales..."></textarea>
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar', class: 'btn-primary', callback: 'saveNewHistorial()' }
    ]);

    loadPacientesForSelect();
}

async function loadPacientesForSelect() {
    try {
        const user = SessionManager.get('user');
        const citasRes = await API.get('/citas');
        const mascotasRes = await API.get('/mascotas');

        const userCitasMascotasIds = [...new Set(citasRes
            .filter(c => c.veterinario_id === user.id)
            .map(c => c.mascota_id))];

        const pacientes = mascotasRes.filter(m => userCitasMascotasIds.includes(m.id || m.idMascota));

        const select = document.getElementById('hist-mascota');
        select.innerHTML = '<option value="">-- Selecciona un paciente --</option>' +
            pacientes.map(p => `<option value="${p.id || p.idMascota}">${p.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveNewHistorial() {
    try {
        const historialData = {
            mascota_id: parseInt(document.getElementById('hist-mascota').value),
            tipo: document.getElementById('hist-tipo').value,
            diagnostico: document.getElementById('hist-diagnostico').value,
            tratamiento: document.getElementById('hist-tratamiento').value,
            notas: document.getElementById('hist-notas').value,
            fecha: new Date().toISOString().split('T')[0]
        };

        await API.post('/historial', historialData);
        Modal.close();
        Notify.success('Registro del historial guardado exitosamente');
        loadHistorialesTable();
        loadDashboardData();
    } catch (error) {
        Notify.error('Error al guardar historial');
    }
}

async function viewHistorialDetails(id) {
    try {
        const historialesRes = await API.get('/historial');
        const historial = historialesRes.find(h => h.id === id);
        if (!historial) {
            Notify.error('Historial no encontrado');
            return;
        }

        Modal.open('Detalles del Historial Clínico', `
            <div class="grid" style="gap: 12px;">
                <div><strong>Paciente:</strong> ${historial.mascota_nombre}</div>
                <div><strong>Fecha:</strong> ${DateFormatter.format(historial.fecha, 'DD/MM/YYYY HH:mm')}</div>
                <div><strong>Tipo:</strong> ${historial.tipo || 'Consulta'}</div>
                <div style="border-top: 1px solid var(--border-light); padding-top: 12px;">
                    <strong>Diagnóstico:</strong>
                    <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${historial.diagnostico || 'No especificado'}</p>
                </div>
                <div style="border-top: 1px solid var(--border-light); padding-top: 12px;">
                    <strong>Tratamiento:</strong>
                    <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${historial.tratamiento || 'No especificado'}</p>
                </div>
                ${historial.notas ? `
                <div style="border-top: 1px solid var(--border-light); padding-top: 12px;">
                    <strong>Notas:</strong>
                    <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${historial.notas}</p>
                </div>
                ` : ''}
            </div>
        `, [
            { label: 'Editar', class: 'btn-primary', callback: `editHistorial(${id})` },
            { label: 'Cerrar', class: 'btn-outline', callback: 'Modal.close()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar detalles del historial');
    }
}

async function editHistorial(id) {
    try {
        const historialesRes = await API.get('/historial');
        const historial = historialesRes.find(h => h.id === id);
        if (!historial) {
            Notify.error('Historial no encontrado');
            return;
        }

        Modal.open('Editar Registro del Historial', `
            <form id="edit-historial-form" class="grid">
                <input type="hidden" id="edit-hist-id" value="${historial.id}">
                <div class="form-group">
                    <label for="edit-hist-tipo">Tipo de Registro</label>
                    <select id="edit-hist-tipo" disabled>
                        <option value="consulta" ${historial.tipo === 'consulta' ? 'selected' : ''}>Consulta</option>
                        <option value="tratamiento" ${historial.tipo === 'tratamiento' ? 'selected' : ''}>Tratamiento</option>
                        <option value="cirugia" ${historial.tipo === 'cirugia' ? 'selected' : ''}>Cirugía</option>
                        <option value="vacuna" ${historial.tipo === 'vacuna' ? 'selected' : ''}>Vacuna</option>
                        <option value="otro" ${historial.tipo === 'otro' ? 'selected' : ''}>Otro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-hist-diagnostico" class="required">Diagnóstico</label>
                    <textarea id="edit-hist-diagnostico">${historial.diagnostico || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-hist-tratamiento">Tratamiento</label>
                    <textarea id="edit-hist-tratamiento">${historial.tratamiento || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-hist-notas">Notas Adicionales</label>
                    <textarea id="edit-hist-notas">${historial.notas || ''}</textarea>
                </div>
            </form>
        `, [
            { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
            { label: 'Guardar', class: 'btn-primary', callback: 'saveEditedHistorial()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar historial para editar');
    }
}

async function saveEditedHistorial() {
    try {
        const id = document.getElementById('edit-hist-id').value;
        const historialData = {
            diagnostico: document.getElementById('edit-hist-diagnostico').value,
            tratamiento: document.getElementById('edit-hist-tratamiento').value,
            notas: document.getElementById('edit-hist-notas').value
        };

        await API.put(`/historial/${id}`, historialData);
        Modal.close();
        Notify.success('Historial actualizado exitosamente');
        loadHistorialesTable();
    } catch (error) {
        Notify.error('Error al actualizar historial');
    }
}

// ========== RECETAS MÉDICAS ==========

async function loadRecetasTable() {
    try {
        Loading.show();
        const historialesRes = await API.get('/historial');
        const query = FilterUtils.text('recetas-search');
        const medFilter = FilterUtils.value('recetas-med-filter');
        let recetas = historialesRes.filter(h => h.medicamentos && h.medicamentos.length > 0);
        if (medFilter === 'sin-medicamento') recetas = historialesRes.filter(h => !h.medicamentos || h.medicamentos.length === 0);
        if (query) recetas = recetas.filter(r => FilterUtils.matchesText(r, query, ['mascota_nombre', 'veterinario_nombre', 'diagnostico', 'notas', 'tratamiento']));

        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'mascota_nombre', label: 'Paciente' },
            { key: 'fecha', label: 'Fecha', render: (val) => DateFormatter.format(val, 'DD/MM/YYYY') },
            { key: 'diagnostico', label: 'Diagnóstico' },
            { 
                key: 'medicamentos_count',
                label: 'Medicamentos',
                render: (_, row) => row.medicamentos ? row.medicamentos.length : 0
            },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-view" onclick="viewRecetaDetails(${row.id})">👁️ Ver</button>
                        <button class="action-btn action-btn-edit" onclick="editReceta(${row.id})">✏️ Editar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('recetas-table', columns, recetas);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar recetas');
        Loading.hide();
    }
}

function openNewRecetaModal() {
    Modal.open('Nueva Receta Médica', `
        <form id="receta-form" class="grid">
            <div class="form-group">
                <label for="receta-mascota" class="required">Paciente</label>
                <select id="receta-mascota"></select>
            </div>
            <div class="form-group">
                <label for="receta-diagnostico" class="required">Diagnóstico</label>
                <textarea id="receta-diagnostico" placeholder="Describe el diagnóstico..."></textarea>
            </div>
            <div class="form-group">
                <label for="receta-medicamento" class="required">Medicamento</label>
                <select id="receta-medicamento"></select>
            </div>
            <div class="form-group">
                <label for="receta-dosis" class="required">Dosis</label>
                <input type="text" id="receta-dosis" placeholder="Ej: 500mg cada 8 horas">
            </div>
            <div class="form-group">
                <label for="receta-instrucciones">Instrucciones</label>
                <textarea id="receta-instrucciones" placeholder="Instrucciones para el propietario..."></textarea>
            </div>
            <div class="form-group">
                <label for="receta-dias">Días de Tratamiento</label>
                <input type="number" id="receta-dias" placeholder="10" min="1">
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar Receta', class: 'btn-primary', callback: 'saveNewReceta()' }
    ]);

    loadPacientesForSelect();
    loadMedicinesForReceta();
}

async function loadMedicinesForReceta() {
    try {
        const medicamentos = await API.get('/inventario');
        const select = document.getElementById('receta-medicamento');
        select.innerHTML = '<option value="">-- Selecciona un medicamento --</option>' +
            medicamentos.map(m => `<option value="${m.id}">${m.nombre} - ${m.concentracion}</option>`).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveNewReceta() {
    try {
        const recetaData = {
            mascota_id: parseInt(document.getElementById('receta-mascota').value),
            diagnostico: document.getElementById('receta-diagnostico').value,
            medicamento_id: parseInt(document.getElementById('receta-medicamento').value),
            dosis: document.getElementById('receta-dosis').value,
            instrucciones: document.getElementById('receta-instrucciones').value,
            dias_tratamiento: parseInt(document.getElementById('receta-dias').value) || 1
        };

        await API.post('/historial', recetaData);
        Modal.close();
        Notify.success('Receta guardada exitosamente');
        loadRecetasTable();
    } catch (error) {
        Notify.error('Error al guardar receta');
    }
}

async function viewRecetaDetails(id) {
    try {
        const historialesRes = await API.get('/historial');
        const receta = historialesRes.find(r => r.id === id);
        if (!receta) {
            Notify.error('Receta no encontrada');
            return;
        }

        const medicamento = receta.medicamentos?.[0] || null;
        Modal.open('Detalles de la Receta', `
            <div class="grid" style="gap: 12px;">
                <div><strong>Paciente:</strong> ${receta.mascota_nombre || 'N/A'}</div>
                <div><strong>Fecha:</strong> ${DateFormatter.format(receta.fecha, 'DD/MM/YYYY')}</div>
                <div><strong>Diagnóstico:</strong> ${receta.diagnostico || 'No especificado'}</div>
                <div><strong>Medicamento:</strong> ${medicamento ? medicamento.nombre : (receta.medicamento_nombre || 'No especificado')}</div>
                <div><strong>Dosis:</strong> ${receta.dosis || 'No especificado'}</div>
                <div><strong>Instrucciones:</strong> ${receta.instrucciones || 'No especificado'}</div>
                <div><strong>Días de Tratamiento:</strong> ${receta.dias_tratamiento || '1'}</div>
            </div>
        `, [
            { label: 'Editar', class: 'btn-primary', callback: `editReceta(${id})` },
            { label: 'Cerrar', class: 'btn-outline', callback: 'Modal.close()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar detalles de la receta');
    }
}

async function editReceta(id) {
    try {
        const historialesRes = await API.get('/historial');
        const receta = historialesRes.find(r => r.id === id);
        if (!receta) {
            Notify.error('Receta no encontrada');
            return;
        }

        const medicamentos = await API.get('/inventario');
        const selectedMedId = receta.medicamento_id || receta.medicamentos?.[0]?.id || '';

        Modal.open('Editar Receta Médica', `
            <form id="edit-receta-form" class="grid">
                <input type="hidden" id="edit-receta-id" value="${receta.id}">
                <div class="form-group">
                    <label for="edit-receta-paciente">Paciente</label>
                    <input type="text" id="edit-receta-paciente" value="${receta.mascota_nombre || ''}" disabled>
                </div>
                <div class="form-group">
                    <label for="edit-receta-diagnostico" class="required">Diagnóstico</label>
                    <textarea id="edit-receta-diagnostico">${receta.diagnostico || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-receta-medicamento" class="required">Medicamento</label>
                    <select id="edit-receta-medicamento">
                        <option value="">-- Selecciona un medicamento --</option>
                        ${medicamentos.map(m => `<option value="${m.id}" ${m.id === selectedMedId ? 'selected' : ''}>${m.nombre}${m.concentracion ? ' - ' + m.concentracion : ''}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-receta-dosis" class="required">Dosis</label>
                    <input type="text" id="edit-receta-dosis" value="${receta.dosis || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-receta-instrucciones">Instrucciones</label>
                    <textarea id="edit-receta-instrucciones">${receta.instrucciones || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-receta-dias">Días de Tratamiento</label>
                    <input type="number" id="edit-receta-dias" min="1" value="${receta.dias_tratamiento || 1}">
                </div>
            </form>
        `, [
            { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
            { label: 'Guardar', class: 'btn-primary', callback: 'saveEditedReceta()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar receta para editar');
    }
}

async function saveEditedReceta() {
    try {
        const id = document.getElementById('edit-receta-id').value;
        const recetaData = {
            diagnostico: document.getElementById('edit-receta-diagnostico').value,
            medicamento_id: parseInt(document.getElementById('edit-receta-medicamento').value) || null,
            dosis: document.getElementById('edit-receta-dosis').value,
            instrucciones: document.getElementById('edit-receta-instrucciones').value,
            dias_tratamiento: parseInt(document.getElementById('edit-receta-dias').value) || 1
        };

        await API.put(`/historial/${id}`, recetaData);
        Modal.close();
        Notify.success('Receta actualizada exitosamente');
        loadRecetasTable();
    } catch (error) {
        Notify.error('Error al actualizar receta');
    }
}

// ========== LOGOUT ==========

function logout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        SessionManager.clear();
        window.location.href = '/index.html';
    }
}
