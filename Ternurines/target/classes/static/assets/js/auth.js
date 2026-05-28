// ========== AUTENTICACIÓN Y LOGIN ==========

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay sesión activa
    const token = SessionManager.get('token');
    const onLoginPage = ['/', '/index.html'].includes(window.location.pathname);
    if (token && onLoginPage) {
        redirectToDashboard();
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorDiv = document.getElementById('loginError');

    if (!correo || !contrasena) {
        showLoginError('Por favor completa todos los campos');
        return;
    }

    try {
        Loading.show();

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        });

        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }

        const data = await response.json();
        const roleMap = {
            administrador: 'administrador',
            recepcionista: 'recepcionista',
            veterinario: 'veterinario',
            cliente: 'usuario',
            usuario: 'usuario'
        };

        const normalizedRole = roleMap[String(data.rol || '').toLowerCase().trim()] || 'usuario';

        const user = {
            id: data.id,
            nombre: data.usuario || data.nombre || 'Usuario',
            correo: data.correo,
            rol: normalizedRole
        };

        SessionManager.set('token', data.token || '');
        SessionManager.set('user', user);

        Notify.success('¡Bienvenido!');
        
        setTimeout(() => {
            Loading.hide();
            redirectToDashboard();
        }, 500);

    } catch (error) {
        Loading.hide();
        showLoginError(error.message || 'Error en el login. Intenta de nuevo.');
        console.error('Login error:', error);
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function redirectToDashboard() {
    const user = SessionManager.get('user');
    
    if (!user || !user.rol) {
        window.location.href = '/index.html';
        return;
    }

    const dashboardMap = {
        'administrador': '/admin-dashboard.html',
        'usuario': '/user-dashboard.html',
        'recepcionista': '/receptionist-dashboard.html',
        'veterinario': '/veterinary-dashboard.html'
    };

    const dashboard = dashboardMap[user.rol];
    
    if (dashboard) {
        window.location.href = dashboard;
    } else {
        window.location.href = '/index.html';
    }
}

// ========== MANEJO DE LOGOUT ==========

function handleLogout() {
    SessionManager.clear();
    window.location.href = '/index.html';
}

console.log('App authentication script loaded');
