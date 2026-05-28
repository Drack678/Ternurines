const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');

const state = {
    clientes: [],
    mascotas: [],
    citas: [],
    usuarios: [],
    veterinarios: [],
    recepcionistas: [],
    medicamentos: [],
    productos: [],
    servicios: [],
    adopciones: { mascotas: [], procesos: [] },
    usuarioDetalle: null
};

let currentSession = null;
const editState = {};

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginError.textContent = '';
        const correo = document.querySelector('#correo').value;
        const contrasena = document.querySelector('#contrasena').value;

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ correo, contrasena })
        });

        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('ternurinesUser', JSON.stringify({ correo, ...user }));
            window.location.href = '/dashboard.html';
        } else {
            loginError.textContent = 'Usuario o contrasena incorrectos';
        }
    });
}

const logoutBtn = document.querySelector('#logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('ternurinesUser');
        window.location.href = '/';
    });
}

const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

if (navLinks.length > 0) {
    currentSession = JSON.parse(localStorage.getItem('ternurinesUser') || 'null');
    if (!currentSession) {
        window.location.href = '/';
    } else {
        document.querySelector('#currentUser').textContent = currentSession.usuario || currentSession.correo;
        document.querySelector('#currentRole').textContent = currentSession.rol || 'Usuario';
    }

    applyRoleAccess();
    navLinks.forEach(link => link.addEventListener('click', () => showPage(link.dataset.target)));
    document.querySelectorAll('[data-jump]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.jump)));

    bindForms();
    bindSearchFilters();
    loadAll();
}

function showPage(target) {
    navLinks.forEach(nav => nav.classList.toggle('active', nav.dataset.target === target));
    pages.forEach(page => page.classList.toggle('active', page.id === target));
}

function applyRoleAccess() {
    const role = currentSession?.rol || '';
    const allowedPages = {
        ADMINISTRADOR: ['dashboard', 'usuarios', 'clientes', 'mascotas', 'citas', 'historial', 'catalogo', 'inventario', 'adopciones', 'reportes'],
        VETERINARIO: ['dashboard', 'citas', 'historial', 'catalogo'],
        CLIENTE: ['dashboard', 'mascotas', 'historial', 'catalogo'],
        RECEPCIONISTA: ['dashboard', 'usuarios', 'clientes', 'mascotas', 'citas', 'catalogo', 'inventario', 'adopciones']
    }[role] || ['dashboard'];

    navLinks.forEach(link => {
        const visible = allowedPages.includes(link.dataset.target);
        link.hidden = !visible;
    });
    pages.forEach(page => {
        if (!allowedPages.includes(page.id)) page.classList.remove('active');
    });
    if (!allowedPages.includes(document.querySelector('.page.active')?.id)) {
        showPage(allowedPages[0]);
    }

    // Solo admin puede crear servicios, medicamentos y productos
    toggleElement('#servicioForm', isAdmin());
    toggleElement('#medicamentoForm', isAdmin());
    toggleElement('#productoForm', isAdmin());
    // Solo admin y veterinario pueden crear/modificar historias clínicas
    toggleElement('#newHistorialForm', isAdmin() || isVeterinario());
    // Clientes pueden registrar sus mascotas, admin y recepcionista pueden crear para otros
    toggleElement('#mascotaForm', isAdmin() || isRecepcionista() || isCliente());
    toggleElement('#adopcionMascotaForm', isAdmin() || isRecepcionista());
    toggleElement('#adopcionForm', isAdmin() || isRecepcionista());
    // Clientes no pueden buscar mascotas, solo ver las suyas
    toggleElement('#mascotasSearchBar', !isCliente());

    const rolSelect = document.querySelector('#rolUsuario');
    if (rolSelect && isRecepcionista()) {
        rolSelect.innerHTML = '<option>CLIENTE</option>';
    }
}

function toggleElement(selector, visible) {
    const node = document.querySelector(selector);
    if (node) node.hidden = !visible;
}

function isAdmin() { return currentSession?.rol === 'ADMINISTRADOR'; }
function isVeterinario() { return currentSession?.rol === 'VETERINARIO'; }
function isCliente() { return currentSession?.rol === 'CLIENTE'; }
function isRecepcionista() { return currentSession?.rol === 'RECEPCIONISTA'; }

async function api(path, options = {}) {
    const response = await fetch(path, {
        headers: {'Content-Type': 'application/json', ...(options.headers || {})},
        ...options
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'No se pudo completar la operacion');
    }
    const type = response.headers.get('content-type') || '';
    return type.includes('application/json') ? response.json() : null;
}

async function loadAll() {
    await loadUsuarios();
    await loadClientes();
    await loadMascotas();
    await loadCitas();
    await Promise.all([loadDashboard(), loadInventario(), loadServicios(), loadAdopciones(), cargarOpcionesHistorial(), loadReportes(), loadFinanzas()]);
    await loadUsuarioDetalle();
    renderClientes(scopedClientes());
    renderMascotas(scopedMascotas());
    renderCitas(scopedCitas());
}

async function loadUsuarioDetalle() {
    if (!currentSession?.id || !currentSession?.rol) return;
    state.usuarioDetalle = await api(`/api/operaciones/usuarios/${currentSession.rol}/${currentSession.id}/detalle`);
}

async function loadDashboard() {
    const data = await api('/api/dashboard/summary');
    setText('#clientesCount', data.clientesRegistrados || 0);
    setText('#mascotasCount', data.mascotasActivas || 0);
    setText('#citasCount', data.citasHoy || 0);
    setText('#stockCount', data.stockBajo || 0);
    let proximas = data.proximasCitas || [];
    if (isVeterinario()) proximas = proximas.filter(cita => cita.idVeterinario === currentSession.id || cita.veterinario === currentSession.usuario);
    if (isCliente()) {
        const nombres = scopedMascotas().map(mascota => mascota.nombre);
        proximas = proximas.filter(cita => nombres.includes(cita.mascota));
    }
    renderList('#proximasCitas', proximas, cita => `
        <div class="item-row">
            <div><strong>${safe(cita.mascota)}</strong><p>${safe(cita.cliente)} - ${safe(cita.veterinario)}</p></div>
            <span class="status-badge">${safe(cita.estado || 'Programada')}</span>
        </div>
        <div class="item-row"><p>${safe(cita.fecha)}</p><p>${safe(cita.hora)}</p></div>`);
}

async function loadUsuarios() {
    state.usuarios = await api('/api/operaciones/usuarios');
    state.veterinarios = state.usuarios.filter(u => u.rol === 'VETERINARIO');
    state.recepcionistas = state.usuarios.filter(u => u.rol === 'RECEPCIONISTA');
    renderUsuarios();
    fillUserSelects();
}

function renderUsuarios() {
    const users = isRecepcionista() ? state.usuarios.filter(user => user.rol === 'CLIENTE') : state.usuarios;
    renderList('#usuariosGrid', users, user => `
        <div class="item-row">
            <div><strong>${safe(user.nombre)}</strong><p>${safe(user.correo)} - ${safe(user.documento)}</p></div>
            <span class="item-tag">${safe(user.rol)}</span>
        </div>
        <p>${safe(user.telefono || 'Sin telefono')} ${user.especialidad ? '- ' + safe(user.especialidad) : ''}</p>
        <div class="action-row">
            <button class="mini-button" onclick="verDetalleUsuario('${user.rol}', ${user.id})">Ver detalle</button>
            ${isAdmin() ? `<button class="mini-button" onclick="editarUsuario('${user.rol}', ${user.id})">Editar</button><button class="mini-button danger" onclick="borrarUsuario('${user.rol}', ${user.id})">Borrar</button>` : ''}
        </div>`);
}

async function verDetalleUsuario(rol, id) {
    const detalle = await api(`/api/operaciones/usuarios/${rol}/${id}/detalle`);
    const status = document.querySelector('#usuarioStatus');
    if (!status) return;
    const resumen = Object.entries(detalle)
        .filter(([key]) => key !== 'usuario')
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.length : Object.keys(value || {}).length}`)
        .join(' | ');
    status.textContent = `${detalle.usuario?.nombre || 'Usuario'} (${detalle.usuario?.rol || rol}) - ${resumen || 'sin registros asociados'}`;
}

async function borrarUsuario(rol, id) {
    if (!isAdmin()) return;
    await api(`/api/operaciones/usuarios/${rol}/${id}`, { method: 'DELETE' });
    await loadUsuarios();
}

async function loadClientes() {
    state.clientes = await api('/api/clientes');
    renderClientes(scopedClientes());
    fillClienteSelects();
}

function scopedClientes() {
    return isCliente() ? state.clientes.filter(cliente => cliente.idCliente === currentSession.id) : state.clientes;
}

function renderClientes(clientes) {
    renderList('#clientesGrid', clientes, cliente => `
        <div class="item-row">
            <div><strong>${safe(cliente.nombre)}</strong><p>${safe(cliente.correo)} - ${safe(cliente.documento)}</p></div>
            <span class="item-tag">${safe(cliente.telefono || 'Sin telefono')}</span>
        </div>
        <p>${safe(cliente.direccion || 'Sin direccion')}</p>
        <div class="action-row">
            ${isAdmin() || isRecepcionista() ? `<button class="mini-button" onclick="editarCliente(${cliente.idCliente})">Editar</button>` : ''}
            ${isAdmin() ? `<button class="mini-button danger" onclick="borrarEntidad('/api/clientes/${cliente.idCliente}', loadClientes)">Borrar</button>` : ''}
        </div>`);
}

async function loadMascotas() {
    state.mascotas = await api('/api/mascotas');
    renderMascotas(scopedMascotas());
    fillMascotaSelects();
}

function scopedMascotas() {
    return isCliente() ? state.mascotas.filter(mascota => mascota.idCliente === currentSession.id) : state.mascotas;
}

function renderMascotas(mascotas) {
    renderList('#mascotasGrid', mascotas, mascota => `
        <div class="item-row">
            <div><strong>${safe(mascota.nombre)}</strong><p>${safe(mascota.especie || 'Especie')} - ${safe(mascota.raza || 'Raza')}</p></div>
            <span class="item-tag">${safe(mascota.sexo || 'N/A')}</span>
        </div>
        <div class="item-meta">
            <div><p><strong>Edad</strong></p><p>${safe(mascota.edad || '-')} anos</p></div>
            <div><p><strong>Peso</strong></p><p>${safe(mascota.peso || '-')} kg</p></div>
            <div><p><strong>Dueno</strong></p><p>${safe(mascota.nombreCliente || '-')}</p></div>
        </div>
        <div class="action-row">
            ${(isAdmin() || isRecepcionista() || isCliente()) ? `<button class="mini-button" onclick="editarMascota(${mascota.idMascota})">Editar</button>` : ''}
            ${isAdmin() ? `<button class="mini-button danger" onclick="borrarEntidad('/api/mascotas/${mascota.idMascota}', loadMascotas)">Borrar</button>` : ''}
        </div>`);
}

async function loadCitas() {
    state.citas = await api('/api/citas');
    renderCitas(scopedCitas());
}

function scopedCitas() {
    if (isVeterinario()) return state.citas.filter(cita => cita.idVeterinario === currentSession.id);
    if (isCliente()) {
        const ids = scopedMascotas().map(mascota => mascota.idMascota);
        return state.citas.filter(cita => ids.includes(cita.idMascota));
    }
    return state.citas;
}

function renderCitas(citas) {
    renderList('#citasGrid', citas, cita => `
        <div class="item-row">
            <div><strong>${safe(cita.mascota || 'Mascota')}</strong><p>${safe(cita.motivo || 'Consulta')}</p></div>
            <span class="status-badge">${safe(cita.estado || 'Pendiente')}</span>
        </div>
        <div class="item-meta">
            <div><p><strong>Cliente</strong></p><p>${safe(cita.cliente || '-')}</p></div>
            <div><p><strong>Veterinario</strong></p><p>${safe(cita.veterinario || '-')}</p></div>
            <div><p><strong>Fecha</strong></p><p>${safe(cita.fecha)} ${safe(cita.hora || '')}</p></div>
        </div>
        <div class="action-row">
            ${isVeterinario() || isAdmin() ? `<button class="mini-button" onclick="atenderCita(${cita.idMascota})">Atender</button><button class="mini-button" onclick="cambiarEstadoCita(${cita.idCita}, 'completar')">Completar</button>` : ''}
            ${isRecepcionista() || isAdmin() ? `<button class="mini-button danger" onclick="cambiarEstadoCita(${cita.idCita}, 'cancelar')">Cancelar</button>` : ''}
            ${(isAdmin() || isRecepcionista()) ? `<button class="mini-button" onclick="editarCita(${cita.idCita})">Editar</button>` : ''}
            ${isAdmin() ? `<button class="mini-button danger" onclick="borrarEntidad('/api/citas/${cita.idCita}', loadCitas)">Borrar</button>` : ''}
        </div>`);
}

function atenderCita(idMascota) {
    showPage('historial');
    const select = document.querySelector('#histMascotaSelect');
    if (select) select.value = String(idMascota);
    cargarHistorial(idMascota);
}

async function cambiarEstadoCita(id, accion) {
    await api(`/api/citas/${id}/${accion}`, { method: 'PATCH' });
    await Promise.all([loadCitas(), loadDashboard(), loadReportes()]);
}

async function loadInventario() {
    const data = await api('/api/inventario');
    state.medicamentos = data.medicamentos || [];
    state.productos = data.productos || [];
    renderInventario();
    fillMedicamentos();
}

function renderInventario() {
    renderStockList('#medicamentosGrid', state.medicamentos, 'medicamentos', 'idMedicamento');
    renderStockList('#productosGrid', state.productos, 'productos', 'idProducto');
    renderList('#catalogoProductosGrid', state.productos, item => itemCatalogo(item, 'Producto'));
}

function renderStockList(selector, items, tipo, idKey) {
    renderList(selector, items, item => `
        <div class="item-row">
            <div><strong>${safe(item.nombre)}</strong><p>${safe(item.descripcion || 'Sin descripcion')}</p></div>
            <span class="item-tag">Stock ${safe(item.stock)}</span>
        </div>
        <div class="item-row"><p>$${safe(item.precio)}</p><p>Vence ${safe(item.fechaVencimiento || 'N/A')}</p></div>
        <div class="action-row">
            ${isAdmin() ? `<button class="mini-button" onclick="editarInventario('${tipo}', ${item[idKey]})">Editar</button><button class="mini-button" onclick="ajustarStock('${tipo}', ${item[idKey]}, 1)">+1</button>` : ''}
            ${isAdmin() || isRecepcionista() ? `<button class="mini-button" onclick="ajustarStock('${tipo}', ${item[idKey]}, -1)">Vender -1</button>` : ''}
            ${isAdmin() ? `<button class="mini-button danger" onclick="borrarEntidad('/api/inventario/${tipo}/${item[idKey]}', loadInventario)">Borrar</button>` : ''}
        </div>`);
}

async function ajustarStock(tipo, id, delta) {
    await api(`/api/inventario/${tipo}/${id}/stock/${delta}`, { method: 'PATCH' });
    await Promise.all([loadInventario(), loadDashboard(), loadReportes()]);
}

async function loadServicios() {
    state.servicios = await api('/api/servicios');
    renderList('#serviciosGrid', state.servicios, item => `${itemCatalogo(item, 'Servicio')}${isAdmin() ? `<div class="action-row"><button class="mini-button" onclick="editarServicio(${item.idServicio})">Editar</button><button class="mini-button danger" onclick="borrarEntidad('/api/servicios/${item.idServicio}', loadServicios)">Borrar</button></div>` : ''}`);
}

function itemCatalogo(item, tipo) {
    return `<div class="item-row"><div><strong>${safe(item.nombre)}</strong><p>${safe(item.descripcion || tipo)}</p></div><span class="item-tag">$${safe(item.precio)}</span></div>`;
}

async function loadAdopciones() {
    state.adopciones = await api('/api/operaciones/adopciones');
    renderList('#adopcionMascotasGrid', state.adopciones.mascotas || [], mascota => `
        <div class="item-row">
            <div><strong>${safe(mascota.nombre)}</strong><p>${safe(mascota.especie)} - ${safe(mascota.raza || 'Sin raza')}</p></div>
            <span class="status-badge">${safe(mascota.estado_adopcion)}</span>
        </div>
        <p>${safe(mascota.estado_salud || 'Sin observaciones')} - ingreso ${safe(mascota.fecha_ingreso || '')}</p>`);
    renderList('#adopcionesGrid', state.adopciones.procesos || [], proceso => `
        <div class="item-row">
            <div><strong>${safe(proceso.mascota)}</strong><p>Adoptante: ${safe(proceso.adoptante)}</p></div>
            <span class="item-tag">${safe(proceso.fecha_adopcion)}</span>
        </div>
        <p>${safe(proceso.documento)} - ${safe(proceso.telefono || 'Sin telefono')}</p>`);
    fillAdopcionSelects();
}

async function loadReportes() {
    const data = await api('/api/operaciones/reportes');
    const container = document.querySelector('#reportesGrid');
    if (!container) return;
    container.innerHTML = [
        reportTable('Ocupacion veterinaria', data.ocupacion || []),
        reportTable('Contactos de clientes', data.clientes || []),
        reportTable('Mascotas registradas', data.mascotas || []),
        reportTable('Stock critico', data.stockCritico || [])
    ].join('');
}

async function loadFinanzas() {
    try {
        const data = await api('/api/operaciones/reportes/finanzas');
        // Resumen
        const summary = document.querySelector('#finanzasSummary');
        if (summary) {
            summary.innerHTML = `
                <div class="finance-card">
                    <h4>Total ingresos</h4>
                    <p class="finance-value">$${(data.totalIngresos || 0).toFixed(2)}</p>
                </div>
                <div class="finance-card">
                    <h4>Promedio por cliente</h4>
                    <p class="finance-value">$${(data.promedioPorCliente || 0).toFixed(2)}</p>
                </div>
            `;
        }

        // Top servicios
        const top = document.querySelector('#topServicios');
        if (top) {
            const topHtml = (data.topServicios || []).map(s => `
                <div class="service-item">
                    <div class="service-header">
                        <strong>${safe(s.nombre)}</strong>
                        <span class="service-revenue">$${Number(s.ingresos).toFixed(2)}</span>
                    </div>
                    <div class="service-stats">
                        <span class="stat-badge">Veces: ${s.veces}</span>
                    </div>
                </div>
            `).join('');
            top.innerHTML = `<h4>Servicios top</h4><div class="services-list">${topHtml}</div>`;
        }

        // Ingresos por mes chart
        const ingresos = data.ingresosMes || [];
        const labels = ingresos.map(r => r.mes);
        const values = ingresos.map(r => Number(r.ingresos));
        const ctx = document.querySelector('#ingresosChart');
        if (ctx && window.Chart) {
            if (window._ingresosChart) window._ingresosChart.destroy();
            window._ingresosChart = new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Ingresos por mes',
                        data: values,
                        backgroundColor: 'rgba(76, 175, 80, 0.7)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, labels: { font: { size: 12 } } },
                        title: { display: true, text: 'Ingresos por mes' }
                    },
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Ingresos ($)' } }
                    }
                }
            });
        }
    } catch (e) {
        console.error('Error cargando finanzas', e);
    }
}

function reportTable(title, rows) {
    if (!rows.length) return `<div class="report-card"><h3>${title}</h3><p>No hay datos.</p></div>`;
    const headers = Object.keys(rows[0]);
    return `<div class="report-card"><h3>${title}</h3><div class="table-scroll"><table class="data-table"><thead><tr>${headers.map(h => `<th>${safe(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map(h => `<td>${safe(row[h])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}

function bindForms() {
    bindJsonForm('#usuarioForm', '/api/operaciones/usuarios', async () => { await loadUsuarios(); }, '#usuarioStatus');
    bindJsonForm('#clienteForm', '/api/clientes', async () => { await Promise.all([loadClientes(), loadDashboard()]); }, '#clienteStatus');
    bindJsonForm('#mascotaForm', '/api/mascotas', async () => { await Promise.all([loadMascotas(), loadDashboard(), cargarOpcionesHistorial()]); }, '#mascotaStatus', numericPayload(['idCliente', 'edad', 'peso']));
    bindJsonForm('#servicioForm', '/api/servicios', async () => { await loadServicios(); }, null, numericPayload(['precio']));
    bindJsonForm('#medicamentoForm', '/api/inventario/medicamentos', async () => { await Promise.all([loadInventario(), loadDashboard()]); }, null, payload => ({...numericPayload(['precio', 'stock'])(payload), idAdministrador: 1}));
    bindJsonForm('#productoForm', '/api/inventario/productos', async () => { await loadInventario(); }, null, payload => ({...numericPayload(['precio', 'stock'])(payload), idAdministrador: 1}));
    bindJsonForm('#adopcionMascotaForm', '/api/operaciones/adopciones/mascotas', async () => { await loadAdopciones(); }, null, numericPayload(['idRecepcionista', 'edad']));
    bindJsonForm('#adopcionForm', '/api/operaciones/adopciones', async () => { await Promise.all([loadAdopciones(), loadReportes()]); }, null, numericPayload(['idMascotaAdopcion']));

    const citaForm = document.querySelector('#citaForm');
    if (citaForm) {
        citaForm.addEventListener('submit', async event => {
            event.preventDefault();
            const payload = numericPayload(['idMascota', 'idVeterinario', 'idRecepcionista'])(formPayload(citaForm));
            await api('/api/citas', { method: 'POST', body: JSON.stringify(payload) });
            setStatus('#citaStatus', 'Cita registrada correctamente.');
            citaForm.reset();
            await Promise.all([loadCitas(), loadDashboard(), loadReportes()]);
        });
        ['#citaVeterinarioSelect', '#citaFecha'].forEach(selector => {
            const field = document.querySelector(selector);
            if (field) field.addEventListener('change', loadHorariosCita);
        });
    }

    initHistorialModule();
}

function bindJsonForm(selector, endpoint, afterSave, statusSelector, mapper = payload => payload) {
    const form = document.querySelector(selector);
    if (!form) return;
    const cancelBtn = form.querySelector('[data-action="cancel-edit"]');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => resetEditForm(form));
    }
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const payload = mapper(formPayload(form));
        const id = payload.id;
        let url = endpoint;
        if (id) {
            if (endpoint === '/api/operaciones/usuarios' && payload.rol) {
                url = `${endpoint}/${payload.rol}/${id}`;
            } else {
                url = `${endpoint}/${id}`;
            }
        }
        const method = id ? 'PUT' : 'POST';
        await api(url, { method, body: JSON.stringify(payload) });
        if (statusSelector) setStatus(statusSelector, id ? 'Registro actualizado correctamente.' : 'Registro guardado correctamente.');
        resetEditForm(form);
        await afterSave();
    });
}

function startEditForm(formSelector, values, statusSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    populateForm(form, values);
    form.dataset.editing = 'true';
    const cancelBtn = form.querySelector('[data-action="cancel-edit"]');
    if (cancelBtn) cancelBtn.hidden = false;
    if (statusSelector) setStatus(statusSelector, 'Modo edición activado. Ajusta los datos y guarda.');
}

function resetEditForm(form) {
    if (!form) return;
    form.reset();
    delete form.dataset.editing;
    const cancelBtn = form.querySelector('[data-action="cancel-edit"]');
    if (cancelBtn) cancelBtn.hidden = true;
    const hiddenId = form.querySelector('input[type="hidden"][name="id"]');
    if (hiddenId) hiddenId.value = '';
}

function populateForm(form, values) {
    Object.entries(values).forEach(([key, value]) => {
        const field = form.querySelector(`[name="${key}"]`);
        if (!field) return;
        if (field.type === 'date' && typeof value === 'string' && value.length >= 10) {
            field.value = value.slice(0, 10);
        } else {
            field.value = value ?? '';
        }
    });
}

function formPayload(form) {
    return Object.fromEntries(new FormData(form).entries());
}

function numericPayload(keys) {
    return payload => {
        const copy = {...payload};
        keys.forEach(key => {
            if (copy[key] !== undefined && copy[key] !== '') copy[key] = Number(copy[key]);
        });
        return copy;
    };
}

async function loadHorariosCita() {
    const vet = document.querySelector('#citaVeterinarioSelect')?.value;
    const fecha = document.querySelector('#citaFecha')?.value;
    const select = document.querySelector('#citaHoraSelect');
    if (!vet || !fecha || !select) return;
    const horarios = await api(`/api/operaciones/horarios/${vet}/${fecha}`);
    select.innerHTML = horarios.map(hora => `<option value="${hora}">${hora.slice(0, 5)}</option>`).join('');
}

function initHistorialModule() {
    const searchForm = document.querySelector('#historialSearchForm');
    const newForm = document.querySelector('#newHistorialForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async event => {
            event.preventDefault();
            const mascotaId = document.querySelector('#mascotaSelect').value;
            if (mascotaId) await cargarHistorial(mascotaId);
        });
    }
    if (newForm) {
        newForm.addEventListener('submit', async event => {
            event.preventDefault();
            await guardarNuevaConsulta();
        });
    }
}

async function cargarOpcionesHistorial() {
    const [mascotas, veterinarios, medicamentos] = await Promise.all([
        api('/api/historial/mascotas'),
        api('/api/historial/veterinarios'),
        api('/api/historial/medicamentos')
    ]);
    let mascotasPermitidas = mascotas;
    if (isCliente()) {
        const ids = scopedMascotas().map(mascota => mascota.idMascota);
        mascotasPermitidas = mascotas.filter(mascota => ids.includes(mascota.idMascota));
    }
    if (isVeterinario()) {
        const ids = scopedCitas().map(cita => cita.idMascota);
        mascotasPermitidas = mascotas.filter(mascota => ids.includes(mascota.idMascota));
    }
    const veterinariosPermitidos = isVeterinario() ? veterinarios.filter(vet => vet.idVeterinario === currentSession.id) : veterinarios;
    fillSelect('#mascotaSelect', mascotasPermitidas, 'idMascota', item => `${item.nombre} (${item.cliente})`, 'Selecciona una mascota');
    fillSelect('#histMascotaSelect', mascotasPermitidas, 'idMascota', item => `${item.nombre} (${item.cliente})`, 'Mascota');
    fillSelect('#histVeterinarioSelect', veterinariosPermitidos, 'idVeterinario', item => `${item.nombre} - ${item.especialidad || 'General'}`, 'Veterinario');
    fillSelect('#medicamentoSelect', medicamentos, 'idMedicamento', item => `${item.nombre} (${item.stock} en stock)`, 'Medicamento');
}

async function cargarHistorial(mascotaId) {
    const historiales = await api(`/api/historial/mascota/${mascotaId}`);
    const table = document.querySelector('#historialTable');
    if (!table) return;
    table.innerHTML = historiales.length ? historiales.map(historial => {
        const tratamientos = historial.tratamientos || [];
        const receta = tratamientos.map(t => `<div class="recipe-line"><strong>${safe(t.nombreMedicamento || 'Medicamento')}</strong>: ${safe(t.dosis)}<br><span>${safe(t.descripcion || '')}</span></div>`).join('') || 'Sin tratamientos';
        return `<tr><td>${safe(historial.fecha)}</td><td>${safe(historial.veterinario)}</td><td>${safe(historial.diagnostico)}</td><td>${receta}</td></tr>`;
    }).join('') : '<tr><td colspan="4">No hay registros para esta mascota.</td></tr>';
}

async function guardarNuevaConsulta() {
    const mascotaId = document.querySelector('#histMascotaSelect').value;
    const veterinarioId = isVeterinario() ? currentSession.id : Number(document.querySelector('#histVeterinarioSelect').value);
    const historial = await api('/api/historial', {
        method: 'POST',
        body: JSON.stringify({
            idMascota: Number(mascotaId),
            idVeterinario: veterinarioId,
            diagnostico: document.querySelector('#diagnostico').value,
            observaciones: document.querySelector('#observaciones').value
        })
    });
    await api(`/api/historial/${historial.idHistorial}/tratamientos`, {
        method: 'POST',
        body: JSON.stringify({
            idMedicamento: Number(document.querySelector('#medicamentoSelect').value),
            descripcion: 'Receta digital emitida desde consulta veterinaria',
            dosis: document.querySelector('#dosis').value,
            fechaInicio: document.querySelector('#fechaInicio').value,
            fechaFin: document.querySelector('#fechaFin').value
        })
    });
    setStatus('#historialStatus', 'Consulta, tratamiento y receta guardados.');
    document.querySelector('#newHistorialForm').reset();
    await Promise.all([cargarHistorial(mascotaId), loadInventario()]);
}

function bindSearchFilters() {
    bindSearch('#clientesSearch', () => scopedClientes(), ['nombre', 'documento', 'correo'], renderClientes);
    // Clientes no pueden buscar mascotas, solo ver/registrar las suyas
    if (!isCliente()) {
        bindSearch('#mascotasSearch', () => scopedMascotas(), ['nombre', 'especie', 'raza', 'nombreCliente'], renderMascotas);
    }
    bindSearch('#citasSearch', () => scopedCitas(), ['mascota', 'cliente', 'motivo', 'veterinario'], renderCitas);
}

function bindSearch(selector, source, fields, render) {
    const input = document.querySelector(selector);
    if (!input) return;
    input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        render(source().filter(item => fields.some(field => String(item[field] || '').toLowerCase().includes(query))));
    });
}

function fillClienteSelects() {
    fillSelect('#mascotaClienteSelect', scopedClientes(), 'idCliente', item => item.nombre, 'Cliente responsable');
}

function fillMascotaSelects() {
    fillSelect('#citaMascotaSelect', scopedMascotas(), 'idMascota', item => `${item.nombre} (${item.nombreCliente || 'cliente'})`, 'Mascota');
}

function fillUserSelects() {
    fillSelect('#citaVeterinarioSelect', state.veterinarios, 'id', item => `${item.nombre} - ${item.especialidad || 'General'}`, 'Veterinario');
    fillSelect('#citaRecepcionistaSelect', state.recepcionistas, 'id', item => item.nombre, 'Recepcionista');
    fillSelect('#adopcionRecepcionistaSelect', state.recepcionistas, 'id', item => item.nombre, 'Recepcionista');
    loadHorariosCita();
}

function fillMedicamentos() {
    fillSelect('#medicamentoSelect', state.medicamentos, 'idMedicamento', item => `${item.nombre} (${item.stock} en stock)`, 'Medicamento');
}

function fillAdopcionSelects() {
    const disponibles = (state.adopciones.mascotas || []).filter(m => m.estado_adopcion !== 'Adoptada');
    fillSelect('#adopcionMascotaSelect', disponibles, 'id_mascota_adopcion', item => `${item.nombre} - ${item.estado_adopcion}`, 'Mascota a adoptar');
}

function fillSelect(selector, items, valueKey, labelFn, placeholder) {
    const select = document.querySelector(selector);
    if (!select) return;
    select.innerHTML = `<option value="">${placeholder}</option>` + items.map(item => `<option value="${item[valueKey]}">${safe(labelFn(item))}</option>`).join('');
}

function editarUsuario(rol, id) {
    const usuario = state.usuarios.find(u => u.id === id && u.rol === rol);
    if (!usuario) return;
    startEditForm('#usuarioForm', {
        id: usuario.id,
        nombre: usuario.nombre,
        documento: usuario.documento,
        telefono: usuario.telefono || '',
        correo: usuario.correo,
        contrasena: '',
        rol: usuario.rol,
        direccion: usuario.direccion || '',
        especialidad: usuario.especialidad || '',
        numLicencia: usuario.numLicencia || ''
    }, '#usuarioStatus');
    showPage('usuarios');
}

function editarCliente(id) {
    const cliente = state.clientes.find(item => item.idCliente === id);
    if (!cliente) return;
    startEditForm('#clienteForm', {
        id: cliente.idCliente,
        nombre: cliente.nombre,
        documento: cliente.documento,
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        correo: cliente.correo,
        contrasena: cliente.contrasena || ''
    }, '#clienteStatus');
    showPage('clientes');
}

function editarMascota(id) {
    const mascota = state.mascotas.find(item => item.idMascota === id);
    if (!mascota) return;
    startEditForm('#mascotaForm', {
        id: mascota.idMascota,
        idCliente: mascota.idCliente,
        nombre: mascota.nombre,
        especie: mascota.especie || '',
        raza: mascota.raza || '',
        edad: mascota.edad || '',
        peso: mascota.peso || '',
        sexo: mascota.sexo || 'No especificado'
    }, '#mascotaStatus');
    showPage('mascotas');
}

function editarCita(id) {
    const cita = state.citas.find(item => item.idCita === id);
    if (!cita) return;
    startEditForm('#citaForm', {
        id: cita.idCita,
        idMascota: cita.idMascota,
        idVeterinario: cita.idVeterinario,
        idRecepcionista: cita.idRecepcionista,
        fecha: cita.fecha,
        hora: cita.hora ? cita.hora.toString().slice(0, 5) : '',
        motivo: cita.motivo || '',
        estado: cita.estado || 'Pendiente'
    }, '#citaStatus');
    showPage('citas');
    loadHorariosCita();
}

function editarServicio(id) {
    const servicio = state.servicios.find(item => item.idServicio === id);
    if (!servicio) return;
    startEditForm('#servicioForm', {
        id: servicio.idServicio,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        precio: servicio.precio || ''
    }, null);
    showPage('catalogo');
}

function editarInventario(tipo, id) {
    const lista = tipo === 'medicamentos' ? state.medicamentos : state.productos;
    const item = lista.find(entry => (tipo === 'medicamentos' ? entry.idMedicamento : entry.idProducto) === id);
    if (!item) return;
    const selector = tipo === 'medicamentos' ? '#medicamentoForm' : '#productoForm';
    startEditForm(selector, {
        id: id,
        idAdministrador: item.idAdministrador || 1,
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        precio: item.precio || '',
        stock: item.stock || '',
        fechaVencimiento: item.fechaVencimiento || ''
    }, null);
    showPage('inventario');
}

function renderList(selector, items, template) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = items.length ? items.map(item => `<div class="item-card">${template(item)}</div>`).join('') : '<div class="item-card"><p>No hay registros disponibles.</p></div>';
}

function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
}

function setStatus(selector, message) {
    const node = document.querySelector(selector);
    if (node) node.textContent = message;
}

function safe(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

async function borrarEntidad(endpoint, reload) {
    if (!isAdmin()) return;
    await api(endpoint, { method: 'DELETE' });
    await reload();
    await loadDashboard();
}
