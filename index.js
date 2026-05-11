// Game State
let gameState = {
    score: 0,
    perClick: 1,
    perSecond: 0,
    upgrades: {
        fish: { count: 0, cost: 10, baseIncome: 1, name: '🐟 Fish', emoji: '🐟' },
        penguin: { count: 0, cost: 100, baseIncome: 10, name: '🐧 Extra Penguin', emoji: '🐧' },
        snowball: { count: 0, cost: 500, baseIncome: 50, name: '⛄ Snowball', emoji: '⛄' },
        iceberg: { count: 0, cost: 2500, baseIncome: 250, name: '🧊 Iceberg', emoji: '🧊' },
        arctic: { count: 0, cost: 10000, baseIncome: 1000, name: '🌍 Arctic Base', emoji: '🌍' },
        santa: { count: 0, cost: 50000, baseIncome: 5000, name: '🎅 Santa Helper', emoji: '🎅' }
    }
};

// Load game state from localStorage
function loadGame() {
    const saved = localStorage.getItem('penguinClickerState');
    if (saved) {
        gameState = JSON.parse(saved);
        updateDisplay();
        calculatePerSecond();
    }
}

// Save game state to localStorage
function saveGame() {
    localStorage.setItem('penguinClickerState', JSON.stringify(gameState));
}

// Initialize the game
function initGame() {
    loadGame();
    createUpgrades();
    setupEventListeners();
    startAutoIncome();
}

// Create upgrade buttons
function createUpgrades() {
    const grid = document.getElementById('upgradesGrid');
    grid.innerHTML = '';
    
    for (const [key, upgrade] of Object.entries(gameState.upgrades)) {
        const button = document.createElement('button');
        button.className = 'upgrade-btn';
        button.id = `upgrade-${key}`;
        button.innerHTML = `
            <div class="upgrade-emoji">${upgrade.emoji}</div>
            <div class="upgrade-name">${upgrade.name}</div>
            <div class="upgrade-cost">Cost: ${formatNumber(upgrade.cost)}</div>
            <div class="upgrade-count">Own: ${upgrade.count}</div>
            <div class="upgrade-income">+${formatNumber(upgrade.baseIncome)}/s</div>
        `;
        button.onclick = () => buyUpgrade(key);
        grid.appendChild(button);
    }
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return Math.floor(num).toString();
}

// Buy an upgrade
function buyUpgrade(upgradeKey) {
    const upgrade = gameState.upgrades[upgradeKey];
    if (gameState.score >= upgrade.cost) {
        gameState.score -= upgrade.cost;
        upgrade.count++;
        
        // Increase cost for next purchase (exponential growth)
        upgrade.cost = Math.floor(upgrade.cost * 1.15);
        
        // Recalculate per second income
        calculatePerSecond();
        updateDisplay();
        createUpgrades();
        saveGame();
        
        // Visual feedback
        showPulse(document.getElementById(`upgrade-${upgradeKey}`));
    }
}

// Calculate total income per second
function calculatePerSecond() {
    gameState.perSecond = 0;
    for (const upgrade of Object.values(gameState.upgrades)) {
        gameState.perSecond += upgrade.baseIncome * upgrade.count;
    }
}

// Update all display elements
function updateDisplay() {
    document.getElementById('score').textContent = formatNumber(gameState.score);
    document.getElementById('perClick').textContent = formatNumber(gameState.perClick);
    document.getElementById('perSecond').textContent = formatNumber(gameState.perSecond);
}

// Handle penguin click
function clickPenguin() {
    gameState.score += gameState.perClick;
    updateDisplay();
    saveGame();
    showClickEffect();
    showPulse(document.getElementById('penguinBtn'));
}

// Show click effect animation
function showClickEffect() {
    const btn = document.getElementById('penguinBtn');
    btn.classList.remove('clicked');
    void btn.offsetWidth; // Trigger reflow
    btn.classList.add('clicked');
}

// Show pulse effect on upgrade button
function showPulse(element) {
    element.classList.add('pulse');
    setTimeout(() => element.classList.remove('pulse'), 300);
}

// Auto income from upgrades
function startAutoIncome() {
    setInterval(() => {
        if (gameState.perSecond > 0) {
            gameState.score += gameState.perSecond / 10; // Update 10 times per second for smooth animation
            updateDisplay();
            saveGame();
        }
    }, 100);
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset the game? This cannot be undone!')) {
        gameState = {
            score: 0,
            perClick: 1,
            perSecond: 0,
            upgrades: {
                fish: { count: 0, cost: 10, baseIncome: 1, name: '🐟 Fish', emoji: '🐟' },
                penguin: { count: 0, cost: 100, baseIncome: 10, name: '🐧 Extra Penguin', emoji: '🐧' },
                snowball: { count: 0, cost: 500, baseIncome: 50, name: '⛄ Snowball', emoji: '⛄' },
                iceberg: { count: 0, cost: 2500, baseIncome: 250, name: '🧊 Iceberg', emoji: '🧊' },
                arctic: { count: 0, cost: 10000, baseIncome: 1000, name: '🌍 Arctic Base', emoji: '🌍' },
                santa: { count: 0, cost: 50000, baseIncome: 5000, name: '🎅 Santa Helper', emoji: '🎅' }
            }
        };
        localStorage.removeItem('penguinClickerState');
        updateDisplay();
        createUpgrades();
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('penguinBtn').onclick = clickPenguin;
    document.getElementById('resetBtn').onclick = resetGame;
}

// Start the game when page loads
window.addEventListener('load', initGame);
