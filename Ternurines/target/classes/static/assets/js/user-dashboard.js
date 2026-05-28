// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', () => {
    RoleManager.requireRole(['usuario']);
    initializeDashboard();
    initializeFilters();
    loadUserData();
    populatePetSelect();
});

function initializeFilters() {
    const reloaders = {
        mascotas: loadUserPets,
        adopciones: loadUserAdoptions,
        recetas: loadUserRecipes
    };
    ['mascotas-search', 'adopciones-search', 'recetas-search']
        .forEach(id => FilterUtils.bindInput(id, () => reloaders[FilterUtils.activeSection()]?.()));
}

function initializeDashboard() {
    const user = SessionManager.get('user');
    if (user) {
        document.getElementById('user-name').textContent = user.nombre || 'Usuario';
        document.getElementById('user-email').textContent = user.email || 'usuario@email.com';
    }
}

// ========== NAVEGACIÓN ==========

function navigateTo(section, event) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('section-active');
    });
    document.getElementById('inicio-section').style.display = 'none';

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
        'inicio': 'Bienvenido',
        'mascotas': 'Mis Mascotas',
        'adopciones': 'Mis Adopciones',
        'recetas': 'Recetas Médicas',
        'historial': 'Historial Clínico'
    };
    document.getElementById('page-title').textContent = titles[section] || section;

    // Cargar datos según sección
    switch(section) {
        case 'mascotas':
            loadUserPets();
            break;
        case 'adopciones':
            loadUserAdoptions();
            break;
        case 'recetas':
            loadUserRecipes();
            break;
        case 'historial':
            populatePetSelect();
            break;
    }

    scrollToTop();
}

function scrollToTop() {
    document.querySelector('.content').scrollTop = 0;
}

// ========== CARGA DE DATOS ==========

async function loadUserData() {
    try {
        const user = SessionManager.get('user');
        
        // Cargar mascotas del usuario
        const mascotas = await API.get(`/mascotas`);
        let userMascotas = mascotas.filter(m => m.idCliente === user.id);
        const query = FilterUtils.text('mascotas-search');
        const species = FilterUtils.value('mascotas-species-filter').toLowerCase();
        userMascotas = userMascotas.filter(mascota =>
            FilterUtils.matchesText(mascota, query, ['nombre', 'especie', 'raza']) &&
            (!species || FilterUtils.normalize(mascota.especie) === species)
        );
        document.getElementById('stat-mascotas').textContent = userMascotas.length;
        displayRecentMascotas(userMascotas.slice(0, 3));

        // Cargar adopciones
        const adopcionesData = await API.get(`/operaciones/adopciones`);
        const adopciones = adopcionesData.procesos || [];
        const userAdopciones = adopciones.filter(a => a.adoptante_id === user.id || a.adoptante === user.nombre);
        document.getElementById('stat-adopciones').textContent = userAdopciones.length;

        // Cargar citas
        const citas = await API.get(`/citas`);
        const userCitas = citas.filter(c => c.cliente === user.nombre && new Date(c.fecha) > new Date());
        document.getElementById('stat-citas').textContent = userCitas.length;
        displayUpcomingCitas(userCitas.slice(0, 3));

        // Cargar recetas
        const recetas = await API.get(`/historial`);
        document.getElementById('stat-recetas').textContent = recetas.length;

    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function displayRecentMascotas(mascotas) {
    const container = document.getElementById('recent-mascotas');
    if (mascotas.length === 0) {
        container.innerHTML = '<p class="text-muted">No tienes mascotas registradas aún</p>';
        return;
    }

    container.innerHTML = mascotas.map(mascota => `
        <div style="padding: 12px; border-radius: 8px; background: var(--bg-secondary); margin-bottom: 8px;">
            <strong>${mascota.nombre}</strong>
            <div style="font-size: 0.9rem; color: var(--text-muted);">
                ${mascota.especie} • ${mascota.raza} • ${mascota.edad} años
            </div>
        </div>
    `).join('');
}

function displayUpcomingCitas(citas) {
    const container = document.getElementById('upcoming-citas');
    if (citas.length === 0) {
        container.innerHTML = '<p class="text-muted">No tienes citas próximas</p>';
        return;
    }

    container.innerHTML = citas.map(cita => `
        <div style="padding: 12px; border-radius: 8px; background: var(--bg-secondary); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${cita.mascota}</strong>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                    ${DateFormatter.format(cita.fecha, 'DD/MM/YYYY HH:mm')}
                </div>
            </div>
            <span class="badge badge-primary">${cita.estado}</span>
        </div>
    `).join('');
}

// ========== MIS MASCOTAS ==========

async function loadUserPets() {
    try {
        Loading.show();
        const mascotas = await API.get(`/mascotas`);
        const user = SessionManager.get('user');
        const userMascotas = mascotas.filter(m => m.idCliente === user.id);

        const grid = document.getElementById('mascotas-grid');
        grid.innerHTML = userMascotas.map(mascota => `
            <div class="card" style="cursor: pointer;" onclick="viewPetDetails(${mascota.idMascota})">
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
                    <div style="margin-bottom: 6px;"><strong>Especie:</strong> ${mascota.especie}</div>
                </div>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-light);">
                    <button class="btn btn-sm btn-primary btn-block" onclick="event.stopPropagation(); viewMedicalHistory(${mascota.idMascota})">
                        Ver Historial
                    </button>
                </div>
            </div>
        `).join('');

        Loading.hide();
    } catch (error) {
        console.error('Error loading pets:', error);
        Notify.error('Error al cargar mascotas');
        Loading.hide();
    }
}

async function viewPetDetails(petId) {
    try {
        const mascotas = await API.get(`/mascotas`);
        const mascota = mascotas.find(m => m.idMascota === petId);

        if (!mascota) return;

        Modal.open(`${mascota.nombre} - Detalles`, `
            <div style="display: grid; gap: 16px;">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 16px;">
                        ${mascota.especie === 'perro' ? '🐕' : mascota.especie === 'gato' ? '🐈' : mascota.especie === 'conejo' ? '🐰' : '🐦'}
                    </div>
                    <h2>${mascota.nombre}</h2>
                </div>
                
                <div class="grid grid-cols-2">
                    <div>
                        <strong>Especie</strong>
                        <p>${mascota.especie}</p>
                    </div>
                    <div>
                        <strong>Raza</strong>
                        <p>${mascota.raza}</p>
                    </div>
                    <div>
                        <strong>Edad</strong>
                        <p>${mascota.edad} años</p>
                    </div>
                    <div>
                        <strong>Peso</strong>
                        <p>${mascota.peso} kg</p>
                    </div>
                </div>

                ${mascota.notas ? `
                    <div>
                        <strong>Notas Adicionales</strong>
                        <p>${mascota.notas}</p>
                    </div>
                ` : ''}
            </div>
        `, [
            { label: 'Ver Historial Médico', class: 'btn-primary', callback: `viewMedicalHistory(${petId})` },
            { label: 'Cerrar', class: 'btn-outline', callback: 'Modal.close()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar detalles de la mascota');
    }
}

function openRegisterPetModal() {
    Modal.open('Registrar Nueva Mascota', `
        <form id="pet-form" class="grid">
            <div class="form-group">
                <label for="pet-nombre" class="required">Nombre</label>
                <input type="text" id="pet-nombre" placeholder="Ej: Firulais">
            </div>
            <div class="form-group">
                <label for="pet-especie" class="required">Especie</label>
                <select id="pet-especie">
                    <option value="">-- Selecciona una especie --</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="conejo">Conejo</option>
                    <option value="pajaro">Pájaro</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="form-group">
                <label for="pet-raza" class="required">Raza</label>
                <input type="text" id="pet-raza" placeholder="Ej: Labrador">
            </div>
            <div class="form-group">
                <label for="pet-edad" class="required">Edad (años)</label>
                <input type="number" id="pet-edad" placeholder="3" min="0">
            </div>
            <div class="form-group">
                <label for="pet-peso" class="required">Peso (kg)</label>
                <input type="number" id="pet-peso" placeholder="25" min="0" step="0.1">
            </div>
            <div class="form-group form-row-full">
                <label for="pet-notas">Notas Adicionales</label>
                <textarea id="pet-notas" placeholder="Información adicional sobre tu mascota..."></textarea>
            </div>
        </form>
    `, [
        { label: 'Cancelar', class: 'btn-outline', callback: 'Modal.close()' },
        { label: 'Registrar', class: 'btn-primary', callback: 'saveNewPet()' }
    ]);
}

async function saveNewPet() {
    try {
        const user = SessionManager.get('user');
        const petData = {
            nombre: document.getElementById('pet-nombre').value,
            especie: document.getElementById('pet-especie').value,
            raza: document.getElementById('pet-raza').value,
            edad: parseFloat(document.getElementById('pet-edad').value),
            peso: parseFloat(document.getElementById('pet-peso').value),
            notas: document.getElementById('pet-notas').value,
            idCliente: user.id
        };

        if (!petData.nombre || !petData.especie || !petData.raza) {
            Notify.error('Por favor completa todos los campos requeridos');
            return;
        }

        await API.post('/mascotas', petData);
        Modal.close();
        Notify.success('¡Mascota registrada exitosamente!');
        loadUserPets();
        loadUserData();
    } catch (error) {
        console.error('Error:', error);
        Notify.error('Error al registrar la mascota');
    }
}

// ========== MIS ADOPCIONES ==========

async function loadUserAdoptions() {
    try {
        Loading.show();
        const adopcionesData = await API.get(`/operaciones/adopciones`);
        const adopciones = adopcionesData.procesos || [];
        const user = SessionManager.get('user');
        const query = FilterUtils.text('adopciones-search');
        const status = FilterUtils.value('adopciones-status-filter').toLowerCase();
        const userAdopciones = adopciones
            .filter(a => a.adoptante_id === user.id || a.adoptante === user.nombre)
            .filter(a =>
                FilterUtils.matchesText(a, query, ['mascota', 'adoptante', 'estado_adopcion']) &&
                (!status || FilterUtils.normalize(a.estado_adopcion) === status)
            )
            .map((item, index) => ({ ...item, id: index }));

        const columns = [
            { key: 'id', label: 'ID de Adopción' },
            { key: 'mascota', label: 'Mascota' },
            { key: 'fecha_adopcion', label: 'Fecha', render: (val) => DateFormatter.format(val, 'DD/MM/YYYY') },
            {
                key: 'estado_adopcion',
                label: 'Estado',
                render: (val) => {
                    const colors = {
                        'completada': 'success',
                        'pendiente': 'warning',
                        'cancelada': 'danger'
                    };
                    return `<span class="badge badge-${colors[val] || 'primary'}">${val}</span>`;
                }
            },
            {
                key: 'ver',
                label: 'Acción',
                render: (_, row) => `<button class="btn btn-sm btn-primary" onclick="viewAdoptionDetails(${row.id})">Ver Detalles</button>`
            }
        ];

        if (userAdopciones.length === 0) {
            document.getElementById('adopciones-table').innerHTML = '<p class="text-muted" style="padding: 20px; text-align: center;">No tienes adopciones registradas</p>';
        } else {
            const table = new DataTable('adopciones-table', columns, userAdopciones);
            table.render();
        }

        Loading.hide();
    } catch (error) {
        console.error('Error loading adoptions:', error);
        Notify.error('Error al cargar adopciones');
        Loading.hide();
    }
}

async function viewAdoptionDetails(adoptionId) {
    try {
        const adopcionesData = await API.get(`/operaciones/adopciones`);
        const user = SessionManager.get('user');
        const adopciones = (adopcionesData.procesos || [])
            .filter(a => a.adoptante_id === user.id || a.adoptante === user.nombre)
            .map((item, index) => ({ ...item, id: index }));
        const adopcion = adopciones.find(a => a.id === adoptionId);

        if (!adopcion) return;

        Modal.open('Detalles de Adopción', `
            <div style="display: grid; gap: 16px;">
                <div>
                    <strong>ID de Adopción:</strong>
                    <p>${adopcion.id}</p>
                </div>
                <div>
                    <strong>Mascota:</strong>
                    <p>${adopcion.mascota}</p>
                </div>
                <div>
                    <strong>Fecha de Adopción:</strong>
                    <p>${DateFormatter.format(adopcion.fecha_adopcion, 'DD/MM/YYYY')}</p>
                </div>
                <div>
                    <strong>Estado:</strong>
                    <p><span class="badge badge-${adopcion.estado_adopcion === 'Adoptada' ? 'success' : adopcion.estado_adopcion === 'Disponible' ? 'warning' : 'secondary'}">${adopcion.estado_adopcion}</span></p>
                </div>
                ${adopcion.contrato_url ? `
                    <div>
                        <strong>Contrato:</strong>
                        <p><a href="${adopcion.contrato_url}" target="_blank">Descargar contrato de adopción</a></p>
                    </div>
                ` : ''}
            </div>
        `, [
            { label: 'Cerrar', class: 'btn-primary', callback: 'Modal.close()' }
        ]);
    } catch (error) {
        Notify.error('Error al cargar detalles de adopción');
    }
}

// ========== RECETAS MÉDICAS ==========

async function loadUserRecipes() {
    try {
        Loading.show();
        const userMascotas = await getCurrentUserPets();
        const mascotaIds = userMascotas.map(m => m.idMascota);
        const petFilter = FilterUtils.value('recetas-pet-filter');
        const query = FilterUtils.text('recetas-search');
        const historial = (await API.get(`/historial`)).filter(h => mascotaIds.includes(h.mascota_id));

        const container = document.getElementById('recetas-container');
        const recipes = historial
            .filter(h => h.medicamentos && h.medicamentos.length > 0)
            .filter(h => (!petFilter || h.mascota_id == petFilter) &&
                FilterUtils.matchesText(h, query, ['mascota_nombre', 'veterinario_nombre', 'diagnostico', 'tratamiento', 'notas']));

        if (recipes.length === 0) {
            container.innerHTML = '<p class="text-muted">No tienes recetas médicas registradas</p>';
        } else {
            container.innerHTML = recipes.map(recipe => `
                <div class="content-card">
                    <div class="content-card-header">
                        <h3 class="content-card-title">${recipe.mascota_nombre}</h3>
                        <p class="card-subtitle">${DateFormatter.format(recipe.fecha, 'DD/MM/YYYY')}</p>
                    </div>
                    <div class="content-card-body">
                        <strong>Veterinario:</strong>
                        <p>${recipe.veterinario_nombre}</p>
                        <strong>Diagnóstico:</strong>
                        <p>${recipe.diagnostico || 'N/A'}</p>
                        <strong>Medicamentos Prescritos:</strong>
                        <ul style="margin-top: 8px;">
                            ${recipe.medicamentos.map(med => `
                                <li style="margin-bottom: 8px;">
                                    <strong>${med.nombre}</strong> - ${med.dosis}<br>
                                    <small style="color: var(--text-muted);">${med.instrucciones}</small>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        }

        Loading.hide();
    } catch (error) {
        console.error('Error loading recipes:', error);
        Notify.error('Error al cargar recetas');
        Loading.hide();
    }
}

// ========== HISTORIAL CLÍNICO ==========

async function populatePetSelect() {
    try {
        const mascotas = await API.get(`/mascotas`);
        const user = SessionManager.get('user');
        const userMascotas = mascotas.filter(m => m.idCliente === user.id);

        const select = document.getElementById('historial-mascota');
        select.innerHTML = '<option value="">-- Selecciona una mascota --</option>' +
            userMascotas.map(m => `<option value="${m.idMascota}">${m.nombre}</option>`).join('');
        const recetaSelect = document.getElementById('recetas-pet-filter');
        if (recetaSelect) {
            recetaSelect.innerHTML = '<option value="">Todas las mascotas</option>' +
                userMascotas.map(m => `<option value="${m.idMascota}">${m.nombre}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading pets for select:', error);
    }
}

async function loadPetHistory(petId) {
    if (!petId) {
        document.getElementById('historial-timeline').innerHTML = '';
        return;
    }

    try {
        Loading.show();
        const historial = await API.get(`/historial`);
        const petHistory = historial.filter(h => h.mascota_id === parseInt(petId));

        const timeline = document.getElementById('historial-timeline');

        if (petHistory.length === 0) {
            timeline.innerHTML = '<p class="text-muted" style="text-align: center; padding: 20px;">No hay registros en el historial clínico</p>';
        } else {
            timeline.innerHTML = '<div class="timeline">' +
                petHistory.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(record => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-time">${DateFormatter.format(record.fecha, 'DD/MM/YYYY')}</div>
                            <div class="content-card">
                                <div class="content-card-header">
                                    <h4 class="content-card-title">${record.tipo || 'Consulta'}</h4>
                                </div>
                                <div class="content-card-body">
                                    <div style="margin-bottom: 12px;">
                                        <strong>Veterinario:</strong> ${record.veterinario_nombre}
                                    </div>
                                    ${record.diagnostico ? `
                                        <div style="margin-bottom: 12px;">
                                            <strong>Diagnóstico:</strong> ${record.diagnostico}
                                        </div>
                                    ` : ''}
                                    ${record.tratamiento ? `
                                        <div style="margin-bottom: 12px;">
                                            <strong>Tratamiento:</strong> ${record.tratamiento}
                                        </div>
                                    ` : ''}
                                    ${record.notas ? `
                                        <div>
                                            <strong>Notas:</strong> ${record.notas}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('') + '</div>';
        }

        Loading.hide();
    } catch (error) {
        console.error('Error loading pet history:', error);
        Notify.error('Error al cargar historial clínico');
        Loading.hide();
    }
}

function viewMedicalHistory(petId) {
    Modal.close();
    navigateTo('historial');
    setTimeout(() => {
        document.getElementById('historial-mascota').value = petId;
        loadPetHistory(petId);
    }, 100);
}

async function getCurrentUserPets() {
    const mascotas = await API.get(`/mascotas`);
    const user = SessionManager.get('user');
    return mascotas.filter(m => m.idCliente === user.id);
}

// ========== LOGOUT ==========

function logout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        SessionManager.clear();
        window.location.href = '/index.html';
    }
}

