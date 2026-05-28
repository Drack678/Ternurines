/* ========== UTILIDADES GENERALES ========== */

// Almacenamiento de datos de sesión
const SessionManager = {
    set: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    get: (key) => {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    remove: (key) => {
        sessionStorage.removeItem(key);
    },
    clear: () => {
        sessionStorage.clear();
    }
};

// API helper
const API = {
    baseUrl: '/api',
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        const token = SessionManager.get('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                if (response.status === 401) {
                    SessionManager.clear();
                    window.location.href = '/index.html';
                }
                throw new Error(`HTTP ${response.status}`);
            }
            if (response.status === 204) {
                return null;
            }

            const contentType = response.headers.get('content-type') || '';
            const text = await response.text();

            if (!text) {
                return null;
            }

            return contentType.includes('application/json') ? JSON.parse(text) : text;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get: function(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post: function(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    put: function(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    patch: function(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    delete: function(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// Notificaciones
const Notify = {
    show: (message, type = 'info', duration = 3000) => {
        const container = document.getElementById('notification-container') || 
                         document.createElement('div');
        
        if (!document.getElementById('notification-container')) {
            container.id = 'notification-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 2000;';
            document.body.appendChild(container);
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = 'margin-bottom: 10px; animation: slideUp 0.25s ease-in-out;';
        alert.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: inherit;">✕</button>
        `;

        container.appendChild(alert);

        if (duration > 0) {
            setTimeout(() => alert.remove(), duration);
        }

        return alert;
    },

    success: (message) => Notify.show(message, 'success'),
    error: (message) => Notify.show(message, 'danger'),
    warning: (message) => Notify.show(message, 'warning'),
    info: (message) => Notify.show(message, 'info')
};

// Modal helper
const Modal = {
    open: (title, content, actions = []) => {
        let modal = document.getElementById('dynamic-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dynamic-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        const footer = actions.length > 0 ? `
            <div class="modal-footer">
                ${actions.map(action => `
                    <button class="btn ${action.class || 'btn-primary'}" onclick="${action.callback}">
                        ${action.label}
                    </button>
                `).join('')}
            </div>
        ` : '';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="card-title">${title}</h2>
                    <button class="modal-close" onclick="Modal.close()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${footer}
            </div>
        `;

        modal.classList.add('show');
        return modal;
    },

    close: () => {
        const modal = document.getElementById('dynamic-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
};

// Tablas dinámicas
class DataTable {
    constructor(containerId, columns, data = []) {
        this.container = document.getElementById(containerId);
        this.columns = columns;
        this.data = data;
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortColumn = null;
        this.sortDirection = 'asc';
    }

    setData(data) {
        this.data = data;
        this.currentPage = 1;
        this.render();
    }

    sort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        this.data.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
        
        this.currentPage = 1;
        this.render();
    }

    render() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const paginatedData = this.data.slice(start, end);
        const totalPages = Math.ceil(this.data.length / this.pageSize);

        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            ${this.columns.map(col => `
                                <th style="cursor: pointer;" onclick="window.dataTableInstance.sort('${col.key}')">
                                    ${col.label}
                                    ${this.sortColumn === col.key ? (this.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedData.map(row => `
                            <tr>
                                ${this.columns.map(col => `
                                    <td>${col.render ? col.render(row[col.key], row) : row[col.key] || '-'}</td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        if (totalPages > 1) {
            html += `
                <div class="pagination">
                    ${this.currentPage > 1 ? `<span class="pagination-item" onclick="window.dataTableInstance.setPage(1)">«</span>` : ''}
                    ${this.currentPage > 1 ? `<span class="pagination-item" onclick="window.dataTableInstance.setPage(${this.currentPage - 1})">‹</span>` : ''}
                    
                    ${Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => Math.abs(page - this.currentPage) <= 2)
                        .map(page => `
                            <span class="pagination-item ${page === this.currentPage ? 'active' : ''}" 
                                  onclick="window.dataTableInstance.setPage(${page})">${page}</span>
                        `).join('')}
                    
                    ${this.currentPage < totalPages ? `<span class="pagination-item" onclick="window.dataTableInstance.setPage(${this.currentPage + 1})">›</span>` : ''}
                    ${this.currentPage < totalPages ? `<span class="pagination-item" onclick="window.dataTableInstance.setPage(${totalPages})">»</span>` : ''}
                </div>
            `;
        }

        this.container.innerHTML = html;
        window.dataTableInstance = this;
    }

    setPage(page) {
        const totalPages = Math.ceil(this.data.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.render();
        }
    }
}

// Formularios
class Form {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.errors = {};
    }

    addField(name, rules = {}) {
        this.fields[name] = {
            element: this.form.querySelector(`[name="${name}"]`),
            rules
        };
    }

    validate() {
        this.errors = {};
        
        Object.entries(this.fields).forEach(([name, field]) => {
            const value = field.element.value.trim();
            
            if (field.rules.required && !value) {
                this.errors[name] = 'Este campo es requerido';
            }
            
            if (field.rules.minLength && value.length < field.rules.minLength) {
                this.errors[name] = `Mínimo ${field.rules.minLength} caracteres`;
            }
            
            if (field.rules.maxLength && value.length > field.rules.maxLength) {
                this.errors[name] = `Máximo ${field.rules.maxLength} caracteres`;
            }
            
            if (field.rules.email && value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                this.errors[name] = 'Email inválido';
            }
            
            if (field.rules.custom) {
                const customError = field.rules.custom(value);
                if (customError) {
                    this.errors[name] = customError;
                }
            }
        });
        
        this.displayErrors();
        return Object.keys(this.errors).length === 0;
    }

    displayErrors() {
        Object.values(this.fields).forEach(field => {
            const errorElement = field.element.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        });

        Object.entries(this.errors).forEach(([name, error]) => {
            const field = this.fields[name];
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error;
            errorDiv.style.cssText = 'color: var(--danger); font-size: 0.85rem; margin-top: 4px;';
            field.element.parentElement.appendChild(errorDiv);
            field.element.style.borderColor = 'var(--danger)';
        });

        Object.entries(this.fields).forEach(([name, field]) => {
            if (!this.errors[name]) {
                field.element.style.borderColor = '';
            }
        });
    }

    getData() {
        const data = {};
        Object.entries(this.fields).forEach(([name, field]) => {
            data[name] = field.element.value;
        });
        return data;
    }

    reset() {
        this.form.reset();
        this.errors = {};
        this.displayErrors();
    }
}

// Formato de fechas
const DateFormatter = {
    format: (date, format = 'DD/MM/YYYY') => {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year)
            .replace('HH', hours)
            .replace('mm', minutes);
    },

    relative: (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Hace poco';
        if (minutes < 60) return `Hace ${minutes}m`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days < 7) return `Hace ${days}d`;
        return DateFormatter.format(date);
    }
};

// Filtros reutilizables para tablas y tarjetas
const FilterUtils = {
    text: (id) => (document.getElementById(id)?.value || '').trim().toLowerCase(),
    value: (id) => document.getElementById(id)?.value || '',
    normalize: (value) => String(value ?? '').toLowerCase(),
    matchesText: (row, query, fields = []) => {
        if (!query) return true;
        return fields.some(field => FilterUtils.normalize(row[field]).includes(query));
    },
    matchesAnyText: (row, query) => {
        if (!query) return true;
        return Object.values(row || {}).some(value => FilterUtils.normalize(value).includes(query));
    },
    stockState: (stock) => {
        const amount = Number(stock || 0);
        if (amount <= 5) return 'bajo';
        if (amount <= 10) return 'medio';
        return 'disponible';
    },
    activeSection: () => {
        const active = document.querySelector('.section.section-active') || document.querySelector('.section-active');
        return active ? active.id.replace('-section', '') : 'dashboard';
    },
    bindInput: (id, callback) => {
        const input = document.getElementById(id);
        if (!input || input.dataset.filterBound === 'true') return;
        input.dataset.filterBound = 'true';
        input.addEventListener('input', callback);
        input.addEventListener('change', callback);
    }
};

// Validación de rol
const RoleManager = {
    current: () => {
        const user = SessionManager.get('user');
        return user ? user.rol : null;
    },

    hasPermission: (requiredRole) => {
        return RoleManager.current() === requiredRole;
    },

    requireRole: (roles) => {
        const current = RoleManager.current();
        if (!roles.includes(current)) {
            window.location.href = '/index.html';
        }
    }
};

// Utilitario de carga
const Loading = {
    show: () => {
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.innerHTML = '<div class="spinner"></div>';
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    },

    hide: () => {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
};

// Exportar a CSV
const Export = {
    toCSV: (data, filename = 'export.csv') => {
        const csv = [
            Object.keys(data[0]).join(','),
            ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }
};

console.log('App utilities loaded');
