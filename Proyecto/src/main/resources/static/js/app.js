import { renderDashboardSection } from './pages/dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    renderDashboardSection();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = '/logout';
        });
    }
});
