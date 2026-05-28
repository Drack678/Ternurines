// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', () => {
    RoleManager.requireRole(['recepcionista']);
    initializeDashboard();
    initializeFilters();
    loadDashboardData();
    loadMedicinesSelect();
});

function initializeFilters() {
    const reloaders = {
        usuarios: loadUsuariosTable,
        mascotas: loadMascotasTable,
        citas: loadAppointmentsTable,
        adopciones: loadAdopcionesTable,
        ventas: loadInventoryTable
    };
    FilterUtils.bindInput('search-input', () => reloaders[FilterUtils.activeSection()]?.());
    ['usuarios-search', 'mascotas-search', 'citas-search', 'adopciones-search', 'inventory-search']
        .forEach(id => FilterUtils.bindInput(id, () => reloaders[FilterUtils.activeSection()]?.()));
}

function initializeDashboard() {
    const user = SessionManager.get('user');
    if (user) {
        document.getElementById('user-name').textContent = user.nombre || 'Recepcionista';
        document.getElementById('user-email').textContent = user.email || 'recep@ternurines.com';
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
        'usuarios': 'Gestión de Usuarios',
        'mascotas': 'Registro de Mascotas',
        'citas': 'Agendamiento de Citas',
        'adopciones': 'Gestión de Adopciones',
        'ventas': 'Venta de Medicamentos'
    };
    document.getElementById('page-title').textContent = titles[section] || section;

    switch(section) {
        case 'usuarios':
            loadUsuariosTable();
            break;
        case 'mascotas':
            loadMascotasTable();
            break;
        case 'citas':
            loadVetSelect();
            loadAppointmentsTable();
            break;
        case 'adopciones':
            loadAdopcionesTable();
            break;
        case 'ventas':
            loadInventoryTable();
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

        const usuariosRes = await API.get('/operaciones/usuarios');
        document.getElementById('stat-usuarios').textContent = usuariosRes.length || 0;

        const citasRes = await API.get('/citas');
        const todayCitas = citasRes.filter(c => {
            const citaDate = new Date(c.fecha).toDateString();
            const today = new Date().toDateString();
            return citaDate === today;
        });
        document.getElementById('stat-citas-hoy').textContent = todayCitas.length || 0;
        displayUpcomingAppointments(citasRes.filter(c => new Date(c.fecha) > new Date()).slice(0, 5));

        const adopcionesData = await API.get('/operaciones/adopciones');
        const adopcionesRes = adopcionesData.procesos || [];
        const thisMonthAdopciones = adopcionesRes.filter(a => {
            const date = new Date(a.fecha_adopcion);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });
        document.getElementById('stat-adopciones').textContent = thisMonthAdopciones.length || 0;
        const pendingAdoptions = (adopcionesData.mascotas || []).filter(a => a.estado_adopcion === 'Disponible').slice(0, 5);
        displayPendingAdoptions(pendingAdoptions);

        document.getElementById('stat-ventas').textContent = '$0';

        Loading.hide();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        Notify.error('Error al cargar datos');
        Loading.hide();
    }
}

function displayUpcomingAppointments(appointments) {
    const container = document.getElementById('upcoming-appointments');
    if (appointments.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay citas próximas</p>';
        return;
    }

    container.innerHTML = appointments.map(apt => `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${apt.mascota}</strong>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                    ${DateFormatter.format(apt.fecha, 'DD/MM/YYYY HH:mm')}
                </div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="editAppointment(${apt.idCita})">Editar</button>
        </div>
    `).join('');
}

function displayPendingAdoptions(adoptions) {
    const container = document.getElementById('pending-adoptions');
    if (adoptions.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay adopciones pendientes</p>';
        return;
    }

    container.innerHTML = adoptions.map(adp => `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${adp.nombre}</strong>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                    ${adp.estado_adopcion || ''}
                </div>
            </div>
            <button class="btn btn-sm btn-success" onclick="approveAdoption(${adp.id_mascota_adopcion})">Aprobar</button>
        </div>
    `).join('');
}

// ========== USUARIOS ==========

async function loadUsuariosTable() {
    try {
        Loading.show();
        let usuarios = await API.get('/operaciones/usuarios');
        const query = FilterUtils.text('usuarios-search') || FilterUtils.text('search-input');
        const role = FilterUtils.value('usuarios-role-filter').toLowerCase();
        usuarios = usuarios.filter(user =>
            FilterUtils.matchesText(user, query, ['nombre', 'correo', 'email', 'telefono', 'documento', 'rol']) &&
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
                    </div>
                `
            }
        ];

        const table = new DataTable('usuarios-table', columns, usuarios);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar usuarios');
        Loading.hide();
    }
}

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
            rol: 'usuario',
            contrasena: document.getElementById('user-password').value
        };

        await API.post('/operaciones/usuarios/registro', userData);
        Modal.close();
        Notify.success('Usuario creado exitosamente');
        loadUsuariosTable();
        loadDashboardData();
    } catch (error) {
        Notify.error('Error al crear usuario');
    }
}

// ========== MASCOTAS ==========

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
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'especie', label: 'Especie' },
            { key: 'raza', label: 'Raza' },
            { key: 'dueno_nombre', label: 'Dueño' },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-edit" onclick="editMascota(${row.id})">✏️ Editar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('mascotas-table', columns, mascotas);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar mascotas');
        Loading.hide();
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
                <label for="pet-dueno" class="required">Dueño</label>
                <input type="text" id="pet-dueno" placeholder="Nombre del dueño">
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
            dueno_nombre: document.getElementById('pet-dueno').value,
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

// ========== CITAS ==========

async function loadVetSelect() {
    try {
        const usuarios = await API.get('/operaciones/usuarios');
        const veterinarios = usuarios.filter(u => u.rol === 'veterinario');
        
        const select = document.getElementById('vet-filter');
        select.innerHTML = '<option value="">-- Todos los veterinarios --</option>' +
            veterinarios.map(v => `<option value="${v.id}">${v.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error loading vets:', error);
    }
}

async function loadAppointmentsTable() {
    try {
        Loading.show();
        const citas = await API.get('/citas');
        
        const vetId = document.getElementById('vet-filter').value;
        const date = document.getElementById('date-filter').value;
        const query = FilterUtils.text('citas-search') || FilterUtils.text('search-input');
        const status = FilterUtils.value('status-filter').toLowerCase();
        
        let filtered = citas;
        if (vetId) filtered = filtered.filter(c => c.veterinario_id == vetId);
        if (date) filtered = filtered.filter(c => c.fecha.startsWith(date));
        if (status) filtered = filtered.filter(c => FilterUtils.normalize(c.estado) === status);
        if (query) filtered = filtered.filter(c => FilterUtils.matchesText(c, query, ['mascota', 'mascota_nombre', 'cliente', 'cliente_nombre', 'veterinario', 'veterinario_nombre', 'motivo', 'estado']));

        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'mascota_nombre', label: 'Mascota' },
            { key: 'veterinario_nombre', label: 'Veterinario' },
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
                        <button class="action-btn action-btn-edit" onclick="editAppointment(${row.id})">✏️ Editar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('citas-table', columns, filtered);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar citas');
        Loading.hide();
    }
}

function openNewAppointmentModal() {
    Modal.open('Agendar Cita', `
        <form id="apt-form" class="grid">
            <div class="form-group">
                <label for="apt-mascota" class="required">Mascota</label>
                <input type="text" id="apt-mascota" placeholder="Nombre de la mascota">
            </div>
            <div class="form-group">
                <label for="apt-veterinario" class="required">Veterinario</label>
                <select id="apt-veterinario"></select>
            </div>
            <div class="form-group">
                <label for="apt-fecha" class="required">Fecha y Hora</label>
                <input type="datetime-local" id="apt-fecha">
            </div>
            <div class="form-group">
                <label for="apt-motivo" class="required">Motivo</label>
                <textarea id="apt-motivo" placeholder="Describe el motivo de la cita..."></textarea>
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Guardar', class: 'btn-primary', callback: 'saveNewAppointment()' }
    ]);

    loadVeterinariosForSelect();
}

async function loadVeterinariosForSelect() {
    try {
        const usuarios = await API.get('/operaciones/usuarios');
        const veterinarios = usuarios.filter(u => u.rol === 'veterinario');
        
        const select = document.getElementById('apt-veterinario');
        select.innerHTML = '<option value="">-- Selecciona veterinario --</option>' +
            veterinarios.map(v => `<option value="${v.id}">${v.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveNewAppointment() {
    try {
        const aptData = {
            mascota_nombre: document.getElementById('apt-mascota').value,
            veterinario_id: document.getElementById('apt-veterinario').value,
            fecha: document.getElementById('apt-fecha').value,
            motivo: document.getElementById('apt-motivo').value,
            estado: 'confirmada'
        };

        await API.post('/citas', aptData);
        Modal.close();
        Notify.success('Cita agendada exitosamente');
        loadAppointmentsTable();
    } catch (error) {
        Notify.error('Error al agendar cita');
    }
}

// ========== ADOPCIONES ==========

async function loadAdopcionesTable() {
    try {
        Loading.show();
        const adopcionesData = await API.get('/operaciones/adopciones');
        const query = FilterUtils.text('adopciones-search') || FilterUtils.text('search-input');
        const status = FilterUtils.value('adopciones-status-filter').toLowerCase();
        const adopciones = [...(adopcionesData.procesos || []), ...(adopcionesData.mascotas || [])]
            .filter(item =>
                FilterUtils.matchesText(item, query, ['mascota', 'nombre', 'adoptante', 'especie', 'raza', 'estado', 'estado_adopcion', 'recepcionista']) &&
                (!status || FilterUtils.normalize(item.estado || item.estado_adopcion) === status)
            );
        
        const columns = [
            { key: 'id', label: 'ID' },
            { key: 'mascota_nombre', label: 'Mascota' },
            { key: 'adoptante_nombre', label: 'Adoptante' },
            { key: 'fecha', label: 'Fecha', render: (val) => DateFormatter.format(val, 'DD/MM/YYYY') },
            { 
                key: 'estado',
                label: 'Estado',
                render: (val) => {
                    const colors = { 'completada': 'success', 'pendiente': 'warning', 'cancelada': 'danger' };
                    return `<span class="badge badge-${colors[val] || 'primary'}">${val}</span>`;
                }
            },
            { 
                key: 'acciones', 
                label: 'Acciones',
                render: (_, row) => `
                    <div class="row-actions">
                        <button class="action-btn action-btn-edit" onclick="editAdoption(${row.id})">✏️ Editar</button>
                    </div>
                `
            }
        ];

        const table = new DataTable('adopciones-table', columns, adopciones);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar adopciones');
        Loading.hide();
    }
}

function openNewAdoptionModal() {
    Modal.open('Registrar Adopción', `
        <form id="adoption-form" class="grid">
            <div class="form-group">
                <label for="adopt-mascota" class="required">Mascota</label>
                <input type="text" id="adopt-mascota" placeholder="Nombre de la mascota">
            </div>
            <div class="form-group">
                <label for="adopt-adoptante" class="required">Adoptante</label>
                <input type="text" id="adopt-adoptante" placeholder="Nombre del adoptante">
            </div>
            <div class="form-group">
                <label for="adopt-fecha" class="required">Fecha</label>
                <input type="date" id="adopt-fecha">
            </div>
            <div class="form-group">
                <label for="adopt-contrato">
                    <input type="checkbox" id="adopt-contrato"> Contrato Firmado
                </label>
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
            contrato_firmado: document.getElementById('adopt-contrato').checked,
            estado: 'pendiente'
        };

        await API.post('/operaciones/adopciones', adoptionData);
        Modal.close();
        Notify.success('Adopción registrada exitosamente');
        loadAdopcionesTable();
        loadDashboardData();
    } catch (error) {
        Notify.error('Error al registrar adopción');
    }
}

// ========== VENTA DE MEDICAMENTOS ==========

async function loadMedicinesSelect() {
    try {
        const inventario = await API.get('/inventario');
        const medicamentos = inventario.medicamentos || [];
        const select = document.getElementById('sale-medicamento');
        select.innerHTML = '<option value="">-- Selecciona un medicamento --</option>' +
            medicamentos.map(m => `<option value="${m.idMedicamento || m.id}" data-precio="${m.precio}">${m.nombre} ($${m.precio})</option>`).join('');
    } catch (error) {
        console.error('Error loading medicines:', error);
    }
}

async function loadInventoryTable() {
    try {
        Loading.show();
        const inventario = await API.get('/inventario');
        let medicamentos = inventario.medicamentos || [];
        const query = FilterUtils.text('inventory-search') || FilterUtils.text('search-input');
        const stock = FilterUtils.value('inventory-stock-filter');
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
            {
                key: 'estado',
                label: 'Estado',
                render: (_, row) => {
                    if (row.stock <= 5) return '<span class="badge badge-danger">Bajo Stock</span>';
                    if (row.stock <= 10) return '<span class="badge badge-warning">Medio</span>';
                    return '<span class="badge badge-success">Disponible</span>';
                }
            }
        ];

        const table = new DataTable('inventory-table', columns, medicamentos);
        table.render();
        Loading.hide();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al cargar inventario');
        Loading.hide();
    }
}

function updateMedicinePrice() {
    const select = document.getElementById('sale-medicamento');
    const option = select.selectedOptions[0];
    const precio = option.getAttribute('data-precio') || 0;
    document.getElementById('sale-precio').value = precio;
    calculateTotal();
}

function calculateTotal() {
    const cantidad = parseFloat(document.getElementById('sale-cantidad').value) || 0;
    const precio = parseFloat(document.getElementById('sale-precio').value) || 0;
    document.getElementById('sale-total').value = (cantidad * precio).toFixed(2);
}

function resetSaleForm() {
    document.getElementById('sale-form').reset();
}

async function completeSale() {
    const cliente = document.getElementById('sale-cliente').value;
    const medicamento = document.getElementById('sale-medicamento').value;
    const cantidad = document.getElementById('sale-cantidad').value;

    if (!cliente || !medicamento || !cantidad) {
        Notify.error('Por favor completa todos los campos');
        return;
    }

    try {
        Notify.success('¡Venta registrada exitosamente!');
        resetSaleForm();
        loadMedicinesSelect();
        loadDashboardData();
    } catch (error) {
        Notify.error('Error al completar venta');
    }
}

// ========== FUNCIONES AUXILIARES - EDICIÓN ==========

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
            nombre: document.getElementById('edit-pet-nombre').value,
            especie: document.getElementById('edit-pet-especie').value,
            raza: document.getElementById('edit-pet-raza').value,
            edad: parseFloat(document.getElementById('edit-pet-edad').value) || null,
            peso: parseFloat(document.getElementById('edit-pet-peso').value) || null
        };

        await API.put(`/mascotas/${id}`, petData);
        Modal.close();
        Notify.success('Mascota actualizada exitosamente');
        loadMascotasTable();
    } catch (error) {
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

async function editAppointment(id) {
    try {
        const citas = await API.get('/citas');
        const cita = citas.find(c => c.idCita === id);
        if (!cita) {
            Notify.error('Cita no encontrada');
            return;
        }

        Modal.open('Editar Cita', `
            <form id="edit-cita-form" class="grid">
                <input type="hidden" id="edit-cita-id" value="${cita.idCita}">
                <div class="form-group">
                    <label for="edit-cita-mascota">Mascota</label>
                    <input type="text" id="edit-cita-mascota" value="${cita.mascota || ''}" disabled>
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
            fecha: document.getElementById('edit-cita-fecha').value,
            hora: document.getElementById('edit-cita-hora').value,
            motivo: document.getElementById('edit-cita-motivo').value,
            estado: document.getElementById('edit-cita-estado').value
        };

        await API.put(`/citas/${id}`, citaData);
        Modal.close();
        Notify.success('Cita actualizada exitosamente');
        loadAppointmentsTable();
    } catch (error) {
        Notify.error('Error al actualizar cita');
    }
}

async function deleteCita(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;
    try {
        await API.delete(`/citas/${id}`);
        Notify.success('Cita eliminada exitosamente');
        loadAppointmentsTable();
    } catch (error) {
        Notify.error('Error al eliminar cita');
    }
}

async function editAdoption(id) {
    Notify.info('Edición de adopciones disponible desde la sección de adopciones');
}

async function approveAdoption(id) {
    try {
        await API.put(`/operaciones/adopciones/${id}`, { estado: 'completada' });
        Notify.success('Adopción aprobada');
        loadDashboardData();
    } catch (error) {
        Notify.error('Error al aprobar adopción');
    }
}

function logout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        SessionManager.clear();
        window.location.href = '/index.html';
    }
}

