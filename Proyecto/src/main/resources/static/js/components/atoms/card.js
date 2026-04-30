export function createStatCard(title, value, description) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <div>
                <p>${title}</p>
            </div>
        </div>
        <div class="card-value">${value}</div>
        <p class="muted-text">${description}</p>
    `;
    return card;
}
