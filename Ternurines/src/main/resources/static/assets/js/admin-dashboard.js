// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', () => {
    RoleManager.requireRole(['administrador']);
    initializeDashboard();
    initializeFilters();
});

function initializeDashboard() {
    loadDashboardData();
    loadReportesCharts();
}

function initializeFilters() {
    const reloaders = {
        usuarios: loadUsuariosTable,
        mascotas: loadMascotasTable,
        citas: loadCitasTable,
        adopciones: loadAdopcionesTable,
        medicamentos: loadMedicamentosTable
    };
    // Registrar handler para que el botón llame directamente al reloader correspondiente
    FilterUtils.onSearch(() => reloaders[FilterUtils.activeSection()]?.());
    FilterUtils.bindInput('search-input', () => reloaders[FilterUtils.activeSection()]?.());
    ['usuarios-search', 'mascotas-search', 'citas-search', 'adopciones-search', 'medicamentos-search']
        .forEach(id => FilterUtils.bindInput(id, () => reloaders[FilterUtils.activeSection()]?.()));
}

// ========== NAVEGACIÓN ==========

function navigateTo(section, event) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('section-active');
    });
    document.getElementById('dashboard-section').style.display = 'none';

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('section-active');
    }

    // Actualizar nav activo
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    let activeLink = event?.target?.closest('.nav-link');
    if (!activeLink) {
        activeLink = Array.from(document.querySelectorAll('.nav-link')).find(link => {
            const onclick = link.getAttribute('onclick') || '';
            return onclick.includes(`navigateTo('${section}')`);
        }) || document.querySelector(`.nav-link[data-target="${section}"]`);
    }
    if (activeLink) activeLink.classList.add('active');

    // Actualizar título
    const titles = {
        'dashboard': 'Dashboard',
        'usuarios': 'Gestión de Usuarios',
        'mascotas': 'Gestión de Mascotas',
        'citas': 'Gestión de Citas',
        'adopciones': 'Gestión de Adopciones',
        'medicamentos': 'Inventario de Medicamentos',
        'reportes': 'Reportes y Análisis'
    };
    document.getElementById('page-title').textContent = titles[section] || section;

    // Cargar datos según sección
    switch(section) {
        case 'usuarios':
            loadUsuariosTable();
            break;
        case 'mascotas':
            loadMascotasTable();
            break;
        case 'citas':
            loadCitasTable();
            break;
        case 'adopciones':
            loadAdopcionesTable();
            break;
        case 'medicamentos':
            loadMedicamentosTable();
            break;
        case 'reportes':
            loadReportesCharts();
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
        // Intentar cargar resumen agregado desde el endpoint /api/dashboard/summary
        try {
            const summary = await API.get('/dashboard/summary');
            if (summary) {
                const usuariosEl = document.getElementById('stat-usuarios');
                if (usuariosEl) usuariosEl.textContent = summary.totalUsuarios ?? 0;

                const mascotasEl = document.getElementById('stat-mascotas');
                if (mascotasEl) mascotasEl.textContent = summary.mascotasRegistradas ?? 0;

                const citasEl = document.getElementById('stat-citas');
                if (citasEl) citasEl.textContent = summary.citasProgramadas ?? 0;

                const medicEl = document.getElementById('stat-medicamentos');
                if (medicEl) medicEl.textContent = summary.medicamentosEnStock ?? 0;

                // Citas recientes desde el resumen
                const recentCitas = Array.isArray(summary.proximasCitas) ? summary.proximasCitas : [];
                displayRecentCitas(recentCitas.slice(0, 5));

                // Adopciones pendientes
                const adopcionesData = await API.get('/operaciones/adopciones');
                const pendingAdopciones = (adopcionesData.mascotas || []).filter(a => a.estado_adopcion === 'Disponible').slice(0, 5);
                displayPendingAdopciones(pendingAdopciones);

                Loading.hide();
                return;
            }
        } catch (e) {
            console.warn('No se pudo cargar /dashboard/summary, usando endpoints individuales', e);
        }

        // Fallback: cargar datos desde endpoints individuales (compatibilidad)

        // Cargar estadísticas
        const usuariosRes = await API.get('/operaciones/usuarios');
        const usuariosCount = Array.isArray(usuariosRes) ? usuariosRes.length : (usuariosRes?.length || 0);
        const usuariosEl2 = document.getElementById('stat-usuarios');
        if (usuariosEl2) usuariosEl2.textContent = usuariosCount;
        console.log('Usuarios cargados:', usuariosCount, usuariosRes);

        const mascotasRes = await API.get('/mascotas');
        const mascotasCount = Array.isArray(mascotasRes) ? mascotasRes.length : (mascotasRes?.length || 0);
        const mascotasEl2 = document.getElementById('stat-mascotas');
        if (mascotasEl2) mascotasEl2.textContent = mascotasCount;
        console.log('Mascotas cargadas:', mascotasCount, mascotasRes);

        const citasRes = await API.get('/citas');
        const citasCount = Array.isArray(citasRes) ? citasRes.length : (citasRes?.length || 0);
        const citasEl2 = document.getElementById('stat-citas');
        if (citasEl2) citasEl2.textContent = citasCount;
        console.log('Citas cargadas:', citasCount, citasRes);

        const inventarioRes2 = await API.get('/inventario');
        const medicamentosArray2 = Array.isArray(inventarioRes2?.medicamentos) ? inventarioRes2.medicamentos : [];
        const productosArray2 = Array.isArray(inventarioRes2?.productos) ? inventarioRes2.productos : [];
        const totalInventario2 = medicamentosArray2.length + productosArray2.length;
        const medicEl2 = document.getElementById('stat-medicamentos');
        if (medicEl2) medicEl2.textContent = totalInventario2;
        console.log('Medicamentos cargados:', totalInventario2, inventarioRes2);

        // Cargar citas recientes
        const recentCitas = (citasRes || []).slice(0, 5);
        displayRecentCitas(recentCitas);

        // Cargar adopciones pendientes
        const adopcionesData2 = await API.get('/operaciones/adopciones');
        const pendingAdopciones2 = (adopcionesData2.mascotas || []).filter(a => a.estado_adopcion === 'Disponible').slice(0, 5);
        displayPendingAdopciones(pendingAdopciones2);

        Loading.hide();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        Notify.error('Error al cargar datos del dashboard');
        Loading.hide();
    }
}

function displayRecentCitas(citas) {
    const container = document.getElementById('recent-citas');
    if (citas.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay citas registradas</p>';
        return;
    }

    container.innerHTML = citas.map(cita => `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong style="display: block;">Cita #${cita.idCita}</strong>
                <small class="text-muted">${DateFormatter.format(cita.fecha, 'DD/MM/YYYY HH:mm')}</small>
            </div>
            <span class="badge badge-primary">${cita.estado || 'Pendiente'}</span>
        </div>
    `).join('');
}

function displayPendingAdopciones(adopciones) {
    const container = document.getElementById('pending-adoptions');
    if (adopciones.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay adopciones pendientes</p>';
        return;
    }

    container.innerHTML = adopciones.map(adopcion => `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong style="display: block;">${adopcion.nombre}</strong>
                <small class="text-muted">${adopcion.estado_adopcion || 'Disponible'}</small>
            </div>
            ${adopcion.estado_adopcion === 'Disponible' ? `<button class="btn btn-sm btn-primary" onclick="approveAdoption(${adopcion.id_mascota_adopcion})">Aprobar</button>` : ''}
        </div>
    `).join('');
}

async function loadReportesCharts() {
    try {
        const [usuarios, inventario, adopcionesData, finanzas] = await Promise.all([
            API.get('/operaciones/usuarios'),
            API.get('/inventario'),
            API.get('/operaciones/adopciones'),
            API.get('/operaciones/reportes/finanzas')
        ]);

        const roles = usuarios.reduce((acc, user) => {
            const role = user.rol || 'DESCONOCIDO';
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        const adopcionStatus = (adopcionesData.mascotas || []).reduce((acc, item) => {
            const status = item.estado_adopcion || 'Desconocido';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const medicamentos = inventario.medicamentos || [];
        const topStocks = [...medicamentos].sort((a, b) => b.stock - a.stock).slice(0, 6);

        const ingresosMes = finanzas.ingresosMes || [];
        const ingresoLabels = ingresosMes.map(row => row.mes);
        const ingresoValues = ingresosMes.map(row => Number(row.ingresos || 0));

        const summary = document.querySelector('#adminReportSummary');
        if (summary) {
            summary.innerHTML = `
                <div class="report-summary-card">
                    <h4>Usuarios</h4>
                    <p>${usuarios.length}</p>
                </div>
                <div class="report-summary-card">
                    <h4>Medicamentos</h4>
                    <p>${medicamentos.length}</p>
                </div>
                <div class="report-summary-card">
                    <h4>Ingresos</h4>
                    <p>$${(finanzas.totalIngresos || 0).toFixed(2)}</p>
                </div>
            `;
        }

        const renderChart = (ctx, type, labels, data, label, colors, title) => {
            if (!ctx || !window.Chart) return;
            if (ctx._chartInstance) ctx._chartInstance.destroy();
            ctx._chartInstance = new Chart(ctx.getContext('2d'), {
                type,
                data: {
                    labels,
                    datasets: [{
                        label,
                        data,
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        borderWidth: 2,
                        fill: type === 'line'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: title, font: { size: 14 } }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        };

        const usuariosCtx = document.querySelector('#usuariosChart');
        renderChart(usuariosCtx, 'doughnut', Object.keys(roles), Object.values(roles), 'Usuarios por rol', {
            background: ['rgba(54,162,235,0.6)', 'rgba(75,192,192,0.6)', 'rgba(255,205,86,0.6)', 'rgba(201,203,207,0.6)'],
            border: ['rgba(54,162,235,1)', 'rgba(75,192,192,1)', 'rgba(255,205,86,1)', 'rgba(201,203,207,1)']
        }, 'Usuarios por rol');

        const adopcionesCtx = document.querySelector('#adopcionesChart');
        renderChart(adopcionesCtx, 'pie', Object.keys(adopcionStatus), Object.values(adopcionStatus), 'Estado de adopciones', {
            background: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)', 'rgba(255,159,64,0.6)', 'rgba(201,203,207,0.6)'],
            border: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)', 'rgba(255,159,64,1)', 'rgba(201,203,207,1)']
        }, 'Estado adopciones');

        const stockCtx = document.querySelector('#stockChart');
        renderChart(stockCtx, 'bar', topStocks.map(item => item.nombre), topStocks.map(item => item.stock), 'Stock de medicamentos', {
            background: topStocks.map(() => 'rgba(153,102,255,0.6)'),
            border: topStocks.map(() => 'rgba(153,102,255,1)')
        }, 'Stock de medicamentos');

        const ingresosCtx = document.querySelector('#ingresosChartAdmin');
        renderChart(ingresosCtx, 'line', ingresoLabels, ingresoValues, 'Ingresos mensuales', {
            background: 'rgba(54,162,235,0.4)',
            border: 'rgba(54,162,235,1)'
        }, 'Ingresos mensuales');
    } catch (error) {
        console.error('Error al cargar gráficos de reportes:', error);
    }
}

// ========== TABLAS ==========

async function loadUsuariosTable() {
    try {
        Loading.show();
        let usuarios = await API.get('/operaciones/usuarios');
        const query = FilterUtils.text('usuarios-search') || FilterUtils.text('search-input');
        const role = FilterUtils.value('usuarios-role-filter').toLowerCase();
        usuarios = usuarios.filter(user =>
            FilterUtils.matchesText(user, query, ['nombre', 'correo', 'email', 'telefono', 'rol']) &&
            (!role || FilterUtils.normalize(user.rol) === role)
        );
        
        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'email', label: 'Email' },
            { key: 'rol', label: 'Rol', render: (val) => `<span class="badge badge-primary">${val}</span>` },
            { key: 'telefono', label: 'Teléfono' },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-edit" onclick="editUsuario(${row.id})">✏️ Editar</button>
                        <button class="action-btn action-btn-delete" onclick="deleteUsuario(${row.id})">🗑️ Eliminar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('usuarios-table', columns, usuarios);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error loading usuarios:', error);
        Notify.error('Error al cargar usuarios');
        Loading.hide();
    }
}

async function loadMascotasTable() {
    try {
        Loading.show();
        let mascotas = await API.get('/mascotas');
        const query = FilterUtils.text('mascotas-search') || FilterUtils.text('search-input');
        const species = FilterUtils.value('mascotas-species-filter').toLowerCase();
        mascotas = mascotas.filter(mascota =>
            FilterUtils.matchesText(mascota, query, ['nombre', 'especie', 'raza', 'dueno_nombre', 'nombreCliente']) &&
            (!species || FilterUtils.normalize(mascota.especie) === species)
        );
        
        const columns = [
            { key: 'idMascota', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'especie', label: 'Especie' },
            { key: 'raza', label: 'Raza' },
            { key: 'dueno_nombre', label: 'Dueño' },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-view" onclick="viewPet(${row.idMascota || row.id})">👁️ Ver</button>
                        <button class="action-btn action-btn-edit" onclick="editMascota(${row.idMascota || row.id})">✏️ Editar</button>
                        <button class="action-btn action-btn-delete" onclick="deleteMascota(${row.idMascota || row.id})">🗑️ Eliminar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('mascotas-table', columns, mascotas);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error loading mascotas:', error);
        Notify.error('Error al cargar mascotas');
        Loading.hide();
    }
}

async function loadCitasTable() {
    try {
        Loading.show();
        let citas = await API.get('/citas');
        const query = FilterUtils.text('citas-search') || FilterUtils.text('search-input');
        const status = FilterUtils.value('citas-status-filter').toLowerCase();
        const date = FilterUtils.value('citas-date-filter');
        citas = citas.filter(cita =>
            FilterUtils.matchesText(cita, query, ['mascota', 'mascota_nombre', 'cliente', 'cliente_nombre', 'veterinario', 'veterinario_nombre', 'motivo', 'estado']) &&
            (!status || FilterUtils.normalize(cita.estado) === status) &&
            (!date || String(cita.fecha || '').startsWith(date))
        );
        
        const columns = [
            { key: 'idCita', label: 'ID' },
            { key: 'mascota_nombre', label: 'Mascota' },
            { key: 'veterinario_nombre', label: 'Veterinario' },
            { key: 'fecha', label: 'Fecha', render: (val) => DateFormatter.format(val, 'DD/MM/YYYY HH:mm') },
            { key: 'motivo', label: 'Motivo' },
            { 
                key: 'estado',
                label: 'Estado',
                render: (val) => {
                    const colors = {
                        'confirmada': 'success',
                        'pendiente': 'warning',
                        'cancelada': 'danger'
                    };
                    return `<span class="badge badge-${colors[val] || 'primary'}">${val}</span>`;
                }
            },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-edit" onclick="editCita(${row.idCita || row.id})">✏️ Editar</button>
                        <button class="action-btn action-btn-delete" onclick="deleteCita(${row.idCita || row.id})">🗑️ Eliminar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('citas-table', columns, citas);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error loading citas:', error);
        Notify.error('Error al cargar citas');
        Loading.hide();
    }
}

async function loadAdopcionesTable() {
    try {
        Loading.show();
        const data = await API.get('/operaciones/adopciones');
        let adopciones = data.mascotas || [];
        const query = FilterUtils.text('adopciones-search') || FilterUtils.text('search-input');
        const status = FilterUtils.value('adopciones-status-filter').toLowerCase();
        adopciones = adopciones.filter(adopcion =>
            FilterUtils.matchesText(adopcion, query, ['nombre', 'especie', 'raza', 'estado_adopcion', 'estado_salud', 'recepcionista']) &&
            (!status || FilterUtils.normalize(adopcion.estado_adopcion) === status)
        );
        
        const columns = [
            { key: 'id_mascota_adopcion', label: 'ID' },
            { key: 'nombre', label: 'Mascota' },
            { key: 'especie', label: 'Especie' },
            { key: 'estado_adopcion', label: 'Estado' },
            { key: 'fecha_ingreso', label: 'Ingreso', render: (val) => DateFormatter.format(val, 'DD/MM/YYYY') },
            { key: 'recepcionista', label: 'Recepcionista' }
        ];

        const table = new DataTable('adopciones-table', columns, adopciones);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error loading adopciones:', error);
        Notify.error('Error al cargar adopciones');
        Loading.hide();
    }
}

async function loadMedicamentosTable() {
    try {
        Loading.show();
        const inventario = await API.get('/inventario');
        let medicamentos = inventario.medicamentos || [];
        const query = FilterUtils.text('medicamentos-search') || FilterUtils.text('search-input');
        const stock = FilterUtils.value('medicamentos-stock-filter');
        medicamentos = medicamentos.filter(med =>
            FilterUtils.matchesText(med, query, ['nombre', 'descripcion']) &&
            (!stock || FilterUtils.stockState(med.stock) === stock)
        );
        
        const columns = [
            { key: 'idMedicamento', label: 'ID' },
            { key: 'nombre', label: 'Medicamento' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'stock', label: 'Stock' },
            { key: 'precio', label: 'Precio', render: (val) => `$${val}` },
            { key: 'fechaVencimiento', label: 'Vence', render: (val) => val ? DateFormatter.format(val, 'DD/MM/YYYY') : 'N/A' },
            { 
                key: 'estado',
                label: 'Estado',
                render: (_, row) => {
                    if (row.stock <= 5) return '<span class="badge badge-danger">Bajo Stock</span>';
                    if (row.stock <= 10) return '<span class="badge badge-warning">Medio Stock</span>';
                    return '<span class="badge badge-success">En Stock</span>';
                }
            },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-edit" onclick="editMedicamento(${row.idMedicamento})">✏️ Editar</button>
                        <button class="action-btn action-btn-delete" onclick="deleteMedicamento(${row.idMedicamento})">🗑️ Eliminar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('medicamentos-table', columns, medicamentos);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error loading medicamentos:', error);
        Notify.error('Error al cargar medicamentos');
        Loading.hide();
    }
}

// ========== MODALES Y FORMULARIOS ==========

function openNewUserModal() {
    Modal.open('Nuevo Usuario', `
        <form id="user-form" class="grid">
            <div class="form-group">
                <label for="user-nombre" class="required">Nombre Completo</label>
                <input type="text" id="user-nombre" placeholder="Juan Pérez">
            </div>
            <div class="form-group">
                <label for="user-email" class="required">Email</label>
                <input type="email" id="user-email" placeholder="juan@example.com">
            </div>
            <div class="form-group">
                <label for="user-telefono" class="required">Teléfono</label>
                <input type="text" id="user-telefono" placeholder="+1234567890">
            </div>
            <div class="form-group">
                <label for="user-rol" class="required">Rol</label>
                <select id="user-rol">
                    <option value="usuario">Usuario</option>
                    <option value="recepcionista">Recepcionista</option>
                    <option value="veterinario">Veterinario</option>
                </select>
            </div>
            <div class="form-group">
                <label for="user-password" class="required">Contraseña</label>
                <input type="password" id="user-password" placeholder="••••••••">
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar', class: 'btn-primary', callback: 'saveNewUser()' }
    ]);
}

async function saveNewUser() {
    try {
        const userData = {
            nombre: document.getElementById('user-nombre').value,
            email: document.getElementById('user-email').value,
            telefono: document.getElementById('user-telefono').value,
            rol: document.getElementById('user-rol').value,
            contrasena: document.getElementById('user-password').value
        };

        await API.post('/operaciones/usuarios/registro', userData);
        Modal.close();
        Notify.success('Usuario creado exitosamente');
        loadUsuariosTable();
    } catch (error) {
        Notify.error('Error al crear usuario');
    }
}

function openNewPetModal() {
    Modal.open('Registrar Mascota', `
        <form id="pet-form" class="grid">
            <div class="form-group">
                <label for="pet-nombre" class="required">Nombre</label>
                <input type="text" id="pet-nombre" placeholder="Firulais">
            </div>
            <div class="form-group">
                <label for="pet-especie" class="required">Especie</label>
                <select id="pet-especie">
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="conejo">Conejo</option>
                    <option value="pajaro">Pájaro</option>
                </select>
            </div>
            <div class="form-group">
                <label for="pet-raza" class="required">Raza</label>
                <input type="text" id="pet-raza" placeholder="Labrador">
            </div>
            <div class="form-group">
                <label for="pet-edad" class="required">Edad (años)</label>
                <input type="number" id="pet-edad" placeholder="3">
            </div>
            <div class="form-group">
                <label for="pet-peso" class="required">Peso (kg)</label>
                <input type="number" id="pet-peso" placeholder="25">
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar', class: 'btn-primary', callback: 'saveNewPet()' }
    ]);
}

async function saveNewPet() {
    try {
        const petData = {
            nombre: document.getElementById('pet-nombre').value,
            especie: document.getElementById('pet-especie').value,
            raza: document.getElementById('pet-raza').value,
            edad: parseFloat(document.getElementById('pet-edad').value),
            peso: parseFloat(document.getElementById('pet-peso').value)
        };

        await API.post('/mascotas', petData);
        Modal.close();
        Notify.success('Mascota registrada exitosamente');
        loadMascotasTable();
    } catch (error) {
        Notify.error('Error al registrar mascota');
    }
}

function openNewCitaModal() {
    Modal.open('Agendar Cita', `
        <form id="cita-form" class="grid">
            <div class="form-group">
                <label for="cita-mascota" class="required">Mascota</label>
                <input type="text" id="cita-mascota" placeholder="Seleccionar mascota">
            </div>
            <div class="form-group">
                <label for="cita-veterinario" class="required">Veterinario</label>
                <input type="text" id="cita-veterinario" placeholder="Seleccionar veterinario">
            </div>
            <div class="form-group">
                <label for="cita-fecha" class="required">Fecha y Hora</label>
                <input type="datetime-local" id="cita-fecha">
            </div>
            <div class="form-group">
                <label for="cita-motivo" class="required">Motivo</label>
                <textarea id="cita-motivo" placeholder="Describe el motivo de la cita..."></textarea>
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar', class: 'btn-primary', callback: 'saveNewCita()' }
    ]);
}

async function saveNewCita() {
    try {
        const citaData = {
            mascota_nombre: document.getElementById('cita-mascota').value,
            veterinario_nombre: document.getElementById('cita-veterinario').value,
            fecha: document.getElementById('cita-fecha').value,
            motivo: document.getElementById('cita-motivo').value
        };

        await API.post('/citas', citaData);
        Modal.close();
        Notify.success('Cita agendada exitosamente');
        loadCitasTable();
    } catch (error) {
        Notify.error('Error al agendar cita');
    }
}

function openNewAdoptionModal() {
    Modal.open('Registrar Adopción', `
        <form id="adoption-form" class="grid">
            <div class="form-group">
                <label for="adopt-mascota" class="required">Mascota</label>
                <input type="text" id="adopt-mascota" placeholder="Seleccionar mascota">
            </div>
            <div class="form-group">
                <label for="adopt-adoptante" class="required">Adoptante</label>
                <input type="text" id="adopt-adoptante" placeholder="Nombre completo">
            </div>
            <div class="form-group">
                <label for="adopt-fecha" class="required">Fecha</label>
                <input type="date" id="adopt-fecha">
            </div>
            <div class="form-group">
                <label for="adopt-contrato" class="required">Contrato Firmado</label>
                <input type="checkbox" id="adopt-contrato">
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar', class: 'btn-primary', callback: 'saveNewAdoption()' }
    ]);
}

async function saveNewAdoption() {
    try {
        const adoptionData = {
            mascota_nombre: document.getElementById('adopt-mascota').value,
            adoptante_nombre: document.getElementById('adopt-adoptante').value,
            fecha: document.getElementById('adopt-fecha').value,
            contrato_firmado: document.getElementById('adopt-contrato').checked
        };

        await API.post('/operaciones/adopciones', adoptionData);
        Modal.close();
        Notify.success('Adopción registrada exitosamente');
        loadAdopcionesTable();
    } catch (error) {
        Notify.error('Error al registrar adopción');
    }
}

function openNewMedicineModal() {
    Modal.open('Agregar Medicamento', `
        <form id="medicine-form" class="grid">
            <div class="form-group">
                <label for="med-nombre" class="required">Nombre</label>
                <input type="text" id="med-nombre" placeholder="Amoxicilina">
            </div>
            <div class="form-group">
                <label for="med-concentracion" class="required">Concentración</label>
                <input type="text" id="med-concentracion" placeholder="500mg">
            </div>
            <div class="form-group">
                <label for="med-cantidad" class="required">Cantidad en Stock</label>
                <input type="number" id="med-cantidad" placeholder="100">
            </div>
            <div class="form-group">
                <label for="med-precio" class="required">Precio Unitario</label>
                <input type="number" id="med-precio" placeholder="25.50" step="0.01">
            </div>
            <div class="form-group">
                <label for="med-vencimiento" class="required">Fecha de Vencimiento</label>
                <input type="date" id="med-vencimiento">
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar', class: 'btn-primary', callback: 'saveNewMedicine()' }
    ]);
}

async function saveNewMedicine() {
    try {
        const medicineData = {
            nombre: document.getElementById('med-nombre').value,
            concentracion: document.getElementById('med-concentracion').value,
            cantidad: parseInt(document.getElementById('med-cantidad').value),
            precio: parseFloat(document.getElementById('med-precio').value),
            vencimiento: document.getElementById('med-vencimiento').value
        };

        await API.post('/inventario', medicineData);
        Modal.close();
        Notify.success('Medicamento agregado exitosamente');
        loadMedicamentosTable();
    } catch (error) {
        Notify.error('Error al agregar medicamento');
    }
}

// ========== ACCIONES ==========

async function deleteUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        try {
            await API.delete(`/operaciones/usuarios/administrador/${id}`);
            Notify.success('Usuario eliminado exitosamente');
            loadUsuariosTable();
        } catch (error) {
            Notify.error('Error al eliminar usuario');
        }
    }
}

async function deleteMascota(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
        try {
            await API.delete(`/mascotas/${id}`);
            Notify.success('Mascota eliminada exitosamente');
            loadMascotasTable();
        } catch (error) {
            Notify.error('Error al eliminar mascota');
        }
    }
}

async function deleteCita(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
        try {
            await API.delete(`/citas/${id}`);
            Notify.success('Cita eliminada exitosamente');
            loadCitasTable();
        } catch (error) {
            Notify.error('Error al eliminar cita');
        }
    }
}

async function deleteAdopcion(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta adopción?')) {
        try {
            await API.delete(`/operaciones/adopciones/${id}`);
            Notify.success('Adopción eliminada exitosamente');
            loadAdopcionesTable();
        } catch (error) {
            Notify.error('Error al eliminar adopción');
        }
    }
}

async function deleteMedicamento(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este medicamento?')) {
        try {
            await API.delete(`/inventario/medicamentos/${id}`);
            Notify.success('Medicamento eliminado exitosamente');
            loadMedicamentosTable();
        } catch (error) {
            Notify.error('Error al eliminar medicamento');
        }
    }
}

async function approveAdoption(id) {
    try {
        await API.patch(`/operaciones/adopciones/mascotas/${id}/estado/Adoptada`);
        Notify.success('Adopción aprobada');
        loadDashboardData();
        loadAdopcionesTable();
        loadReportesCharts();
    } catch (error) {
        Notify.error('Error al aprobar adopción');
    }
}

// ========== REPORTES ==========

function generateUserReport() {
    Notify.info('Generando reporte de usuarios...');
}

function generateUserReportCSV() {
    Notify.info('Generando reporte CSV de usuarios...');
}

function generateFinancialReport() {
    Notify.info('Generando reporte financiero...');
}

function generateFinancialReportCSV() {
    Notify.info('Generando reporte CSV financiero...');
}

function generateAdoptionReport() {
    Notify.info('Generando reporte de adopciones...');
}

function generateAdoptionReportCSV() {
    Notify.info('Generando reporte CSV de adopciones...');
}

function generatePetReport() {
    Notify.info('Generando reporte de mascotas...');
}

function generatePetReportCSV() {
    Notify.info('Generando reporte CSV de mascotas...');
}

// ========== UTILIDADES - EDICIÓN Y ELIMINACIÓN ==========

async function editUsuario(id) {
    try {
        const usuarios = await API.get('/operaciones/usuarios');
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) {
            Notify.error('Usuario no encontrado');
            return;
        }

        Modal.open('Editar Usuario', `
            <form id="edit-user-form" class="grid">
                <input type="hidden" id="edit-user-id" value="${usuario.id}">
                <input type="hidden" id="edit-user-rol" value="${usuario.rol}">
                <div class="form-group">
                    <label for="edit-user-nombre" class="required">Nombre Completo</label>
                    <input type="text" id="edit-user-nombre" value="${usuario.nombre}">
                </div>
                <div class="form-group">
                    <label for="edit-user-email" class="required">Email</label>
                    <input type="email" id="edit-user-email" value="${usuario.correo || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-user-telefono">Teléfono</label>
                    <input type="text" id="edit-user-telefono" value="${usuario.telefono || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-user-password">Nueva Contraseña (dejar vacío para no cambiar)</label>
                    <input type="password" id="edit-user-password" placeholder="••••••••">
                </div>
            </form>
        `, [
            { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
            { label: 'Guardar', class: 'btn-primary', callback: 'saveEditedUsuario()' }
        ]);
    } catch (error) {
        console.error('Error al editar usuario:', error);
        Notify.error('Error al cargar datos del usuario');
    }
}

async function saveEditedUsuario() {
    try {
        const id = document.getElementById('edit-user-id').value;
        const rol = document.getElementById('edit-user-rol').value;
        const userData = {
            nombre: document.getElementById('edit-user-nombre').value,
            correo: document.getElementById('edit-user-email').value,
            telefono: document.getElementById('edit-user-telefono').value,
            contrasena: document.getElementById('edit-user-password').value || undefined
        };

        await API.put(`/operaciones/usuarios/${rol}/${id}`, userData);
        Modal.close();
        Notify.success('Usuario actualizado exitosamente');
        loadUsuariosTable();
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        Notify.error('Error al actualizar usuario');
    }
}

async function deleteUsuario(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
        const usuarios = await API.get('/operaciones/usuarios');
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) return;
        
        await API.delete(`/operaciones/usuarios/${usuario.rol}/${id}`);
        Notify.success('Usuario eliminado exitosamente');
        loadUsuariosTable();
    } catch (error) {
        Notify.error('Error al eliminar usuario');
    }
}

async function viewPet(id) {
    try {
        const mascotas = await API.get('/mascotas');
        const mascota = mascotas.find(m => m.id === id || m.idMascota === id);
        if (!mascota) return;
        
        Modal.open('Detalles de Mascota', `
            <div class="grid">
                <p><strong>Nombre:</strong> ${mascota.nombre}</p>
                <p><strong>Especie:</strong> ${mascota.especie}</p>
                <p><strong>Raza:</strong> ${mascota.raza}</p>
                <p><strong>Edad:</strong> ${mascota.edad} años</p>
                <p><strong>Peso:</strong> ${mascota.peso} kg</p>
                <p><strong>Dueño:</strong> ${mascota.dueno_nombre || 'N/A'}</p>
            </div>
        `, [
            { label: 'Editar', class: 'btn-primary', callback: `editMascota(${id})` },
            { label: 'Cerrar', class: 'btn-outline', callback: 'Modal.close()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar detalles de mascota');
    }
}

async function editMascota(id) {
    try {
        const mascotas = await API.get('/mascotas');
        const mascota = mascotas.find(m => m.id === id || m.idMascota === id);
        if (!mascota) {
            Notify.error('Mascota no encontrada');
            return;
        }

        Modal.open('Editar Mascota', `
            <form id="edit-pet-form" class="grid">
                <input type="hidden" id="edit-pet-id" value="${mascota.id || mascota.idMascota}">
                <input type="hidden" id="edit-pet-id-cliente" value="${mascota.idCliente || ''}">
                <input type="hidden" id="edit-pet-sexo" value="${mascota.sexo || ''}">
                <div class="form-group">
                    <label for="edit-pet-nombre" class="required">Nombre</label>
                    <input type="text" id="edit-pet-nombre" value="${mascota.nombre}">
                </div>
                <div class="form-group">
                    <label for="edit-pet-especie">Especie</label>
                    <input type="text" id="edit-pet-especie" value="${mascota.especie || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-pet-raza">Raza</label>
                    <input type="text" id="edit-pet-raza" value="${mascota.raza || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-pet-edad">Edad (años)</label>
                    <input type="number" id="edit-pet-edad" value="${mascota.edad || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-pet-peso">Peso (kg)</label>
                    <input type="number" step="0.1" id="edit-pet-peso" value="${mascota.peso || ''}">
                </div>
            </form>
        `, [
            { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
            { label: 'Guardar', class: 'btn-primary', callback: 'saveEditedMascota()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar datos de mascota');
    }
}

async function saveEditedMascota() {
    try {
        const id = document.getElementById('edit-pet-id').value;
        const petData = {
            idCliente: parseInt(document.getElementById('edit-pet-id-cliente').value) || null,
            sexo: document.getElementById('edit-pet-sexo').value || null,
            nombre: document.getElementById('edit-pet-nombre').value,
            especie: document.getElementById('edit-pet-especie').value,
            raza: document.getElementById('edit-pet-raza').value,
            edad: parseInt(document.getElementById('edit-pet-edad').value) || null,
            peso: parseFloat(document.getElementById('edit-pet-peso').value) || null
        };

        await API.put(`/mascotas/${id}`, petData);
        Modal.close();
        Notify.success('Mascota actualizada exitosamente');
        loadMascotasTable();
    } catch (error) {
        console.error('Error al actualizar mascota:', error);
        Notify.error('Error al actualizar mascota');
    }
}

async function deleteMascota(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta mascota?')) return;
    try {
        await API.delete(`/mascotas/${id}`);
        Notify.success('Mascota eliminada exitosamente');
        loadMascotasTable();
    } catch (error) {
        Notify.error('Error al eliminar mascota');
    }
}

async function editCita(id) {
    try {
        const citas = await API.get('/citas');
        const cita = citas.find(c => c.idCita === id || c.id === id);
        if (!cita) {
            Notify.error('Cita no encontrada');
            return;
        }

        Modal.open('Editar Cita', `
            <form id="edit-cita-form" class="grid">
                <input type="hidden" id="edit-cita-id" value="${cita.idCita || cita.id}">
                <input type="hidden" id="edit-cita-id-mascota" value="${cita.idMascota || cita.id_mascota || ''}">
                <input type="hidden" id="edit-cita-id-veterinario" value="${cita.idVeterinario || cita.id_veterinario || ''}">
                <input type="hidden" id="edit-cita-id-recepcionista" value="${cita.idRecepcionista || cita.id_recepcionista || ''}">
                <div class="form-group">
                    <label for="edit-cita-mascota">Mascota</label>
                    <input type="text" id="edit-cita-mascota" value="${cita.mascota || cita.mascota_nombre || ''}" disabled>
                </div>
                <div class="form-group">
                    <label for="edit-cita-fecha" class="required">Fecha</label>
                    <input type="date" id="edit-cita-fecha" value="${cita.fecha || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-cita-hora">Hora</label>
                    <input type="time" id="edit-cita-hora" value="${cita.hora || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-cita-motivo">Motivo</label>
                    <input type="text" id="edit-cita-motivo" value="${cita.motivo || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-cita-estado">Estado</label>
                    <select id="edit-cita-estado">
                        <option value="Pendiente" ${cita.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Completada" ${cita.estado === 'Completada' ? 'selected' : ''}>Completada</option>
                        <option value="Cancelada" ${cita.estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                    </select>
                </div>
            </form>
        `, [
            { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
            { label: 'Guardar', class: 'btn-primary', callback: 'saveEditedCita()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar datos de cita');
    }
}

async function saveEditedCita() {
    try {
        const id = document.getElementById('edit-cita-id').value;
        const citaData = {
            idMascota: parseInt(document.getElementById('edit-cita-id-mascota').value) || null,
            idVeterinario: parseInt(document.getElementById('edit-cita-id-veterinario').value) || null,
            idRecepcionista: parseInt(document.getElementById('edit-cita-id-recepcionista').value) || null,
            fecha: document.getElementById('edit-cita-fecha').value,
            hora: document.getElementById('edit-cita-hora').value,
            motivo: document.getElementById('edit-cita-motivo').value,
            estado: document.getElementById('edit-cita-estado').value
        };

        await API.put(`/citas/${id}`, citaData);
        Modal.close();
        Notify.success('Cita actualizada exitosamente');
        loadCitasTable();
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        Notify.error('Error al actualizar cita');
    }
}

async function deleteCita(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;
    try {
        await API.delete(`/citas/${id}`);
        Notify.success('Cita eliminada exitosamente');
        loadCitasTable();
    } catch (error) {
        Notify.error('Error al eliminar cita');
    }
}

async function editAdopcion(id) {
    Notify.info('Edición de adopciones disponible desde la sección de adopciones');
}

async function editMedicamento(id) {
    try {
        const data = await API.get('/inventario');
        const medicamento = data.medicamentos.find(m => m.idMedicamento === id);
        if (!medicamento) {
            Notify.error('Medicamento no encontrado');
            return;
        }

        Modal.open('Editar Medicamento', `
            <form id="edit-med-form" class="grid">
                <input type="hidden" id="edit-med-id" value="${medicamento.idMedicamento}">
                <input type="hidden" id="edit-med-id-administrador" value="${medicamento.idAdministrador || ''}">
                <div class="form-group">
                    <label for="edit-med-nombre" class="required">Nombre</label>
                    <input type="text" id="edit-med-nombre" value="${medicamento.nombre}">
                </div>
                <div class="form-group">
                    <label for="edit-med-descripcion">Descripción</label>
                    <input type="text" id="edit-med-descripcion" value="${medicamento.descripcion || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-med-precio" class="required">Precio</label>
                    <input type="number" step="0.01" id="edit-med-precio" value="${medicamento.precio || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-med-stock" class="required">Stock</label>
                    <input type="number" id="edit-med-stock" value="${medicamento.stock || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-med-vencimiento">Fecha de Vencimiento</label>
                    <input type="date" id="edit-med-vencimiento" value="${medicamento.fechaVencimiento || ''}">
                </div>
            </form>
        `, [
            { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
            { label: 'Guardar', class: 'btn-primary', callback: 'saveEditedMedicamento()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar datos de medicamento');
    }
}

async function saveEditedMedicamento() {
    try {
        const id = document.getElementById('edit-med-id').value;
        const medData = {
            idAdministrador: parseInt(document.getElementById('edit-med-id-administrador').value) || null,
            nombre: document.getElementById('edit-med-nombre').value,
            descripcion: document.getElementById('edit-med-descripcion').value,
            precio: parseFloat(document.getElementById('edit-med-precio').value),
            stock: parseInt(document.getElementById('edit-med-stock').value),
            fechaVencimiento: document.getElementById('edit-med-vencimiento').value
        };

        await API.put(`/inventario/medicamentos/${id}`, medData);
        Modal.close();
        Notify.success('Medicamento actualizado exitosamente');
        loadMedicamentosTable();
    } catch (error) {
        console.error('Error al actualizar medicamento:', error);
        Notify.error('Error al actualizar medicamento');
    }
}

async function deleteMedicamento(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este medicamento?')) return;
    try {
        await API.delete(`/inventario/medicamentos/${id}`);
        Notify.success('Medicamento eliminado exitosamente');
        loadMedicamentosTable();
    } catch (error) {
        Notify.error('Error al eliminar medicamento');
    }
}

function logout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        SessionManager.clear();
        window.location.href = '/index.html';
    }
}

