// Theme Manager - Handles background theme purchasing and application

const availableThemes = {
    castle: {
        id: 'castle',
        name: 'Dark Castle',
        emoji: '🏰',
        description: 'Mysterious old castle interior',
        price: 100,
        preview: 'assets/backgrounds/themes/castle.png'
    },
    city: {
        id: 'city',
        name: 'Neon City',
        emoji: '🌃',
        description: 'Futuristic cityscape at night',
        price: 120,
        preview: 'assets/backgrounds/themes/city.png'
    },
    forest: {
        id: 'forest',
        name: 'Misty Forest',
        emoji: '🌲',
        description: 'Enchanted forest with mist',
        price: 80,
        preview: 'assets/backgrounds/themes/forest.png'
    },
    underwater: {
        id: 'underwater',
        name: 'Underwater Fantasy',
        emoji: '🌊',
        description: 'Deep ocean wonderland',
        price: 150,
        preview: 'assets/backgrounds/themes/underwater.png'
    },
    graveyard: {
        id: 'graveyard',
        name: 'Ship Graveyard',
        emoji: '⚓',
        description: 'Abandoned ships in the mist',
        price: 90,
        preview: 'assets/backgrounds/themes/graveyard.png'
    }
};

// Update themes display
function updateThemesDisplay() {
    const grid = document.getElementById('themesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Render each theme
    Object.values(availableThemes).forEach(theme => {
        const isOwned = window.gameState && window.gameState.ownedThemes && window.gameState.ownedThemes.includes(theme.id);
        const isActive = window.gameState && window.gameState.activeTheme === theme.preview;
        const canAfford = window.gameState && (window.gameState.jerryXP || 0) >= theme.price;
        
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        
        let buttonHtml;
        if (isActive) {
            buttonHtml = `
                <button class="buy-now-btn" style="background: #666;" onclick="unapplyThemeFromShop()">
                    ✓ Active - Unapply
                </button>
            `;
        } else if (isOwned) {
            buttonHtml = `
                <button class="buy-now-btn" onclick="applyThemeFromShop('${theme.id}')">
                    Apply Theme
                </button>
            `;
        } else {
            const buttonStyle = canAfford ? '' : 'background: #555; cursor: not-allowed;';
            const buttonText = canAfford ? `Buy Now` : `Not Enough XP`;
            buttonHtml = `
                <div class="shop-item-price">${theme.price} XP</div>
                <button class="buy-now-btn" style="${buttonStyle}" onclick="buyTheme('${theme.id}')">
                    ${buttonText}
                </button>
            `;
        }
        
        const statusBadge = isOwned ? `<div style="font-size: 12px; color: #4CAF50; margin-top: 4px;">✓ Owned</div>` : '';
        
        card.innerHTML = `
            <div class="shop-item-emoji">${theme.emoji}</div>
            <div class="shop-item-name">${theme.name}</div>
            <div class="shop-item-description">${theme.description}</div>
            ${statusBadge}
            ${buttonHtml}
        `;
        grid.appendChild(card);
    });
}

// Buy a theme
function buyTheme(themeId) {
    const theme = availableThemes[themeId];
    if (!theme) return;
    
    // Check if already owned
    if (window.gameState.ownedThemes && window.gameState.ownedThemes.includes(themeId)) {
        alert(`✅ You already own ${theme.name}!`);
        return;
    }
    
    // Check if player has enough XP
    const currentXP = window.gameState.jerryXP || 0;
    if (currentXP < theme.price) {
        alert(`⚠️ Not enough XP! You need ${theme.price} XP but only have ${currentXP} XP.`);
        return;
    }
    
    // Deduct XP
    window.gameState.jerryXP -= theme.price;
    
    // Add to owned themes
    if (!window.gameState.ownedThemes) {
        window.gameState.ownedThemes = [];
    }
    window.gameState.ownedThemes.push(themeId);
    
    // Save and update displays
    if (typeof window.saveGameState === 'function') {
        window.saveGameState();
    }
    if (typeof window.updateUI === 'function') {
        window.updateUI();
    }
    updateThemesDisplay();
    
    // Show success message
    alert(`🎉 ${theme.name} purchased!\n\n✨ -${theme.price} XP\n\nYou can now apply this theme to your monster's background!`);
    
    // Trigger confetti
    if (typeof window.triggerConfetti === 'function') {
        window.triggerConfetti();
    }
}

// Apply a theme
function applyThemeFromShop(themeId) {
    const theme = availableThemes[themeId];
    if (!theme) return;
    
    // Check if owned
    if (!window.gameState.ownedThemes || !window.gameState.ownedThemes.includes(themeId)) {
        alert(`❌ You don't own ${theme.name} yet! Purchase it first.`);
        return;
    }
    
    // Apply theme
    if (typeof window.applyTheme === 'function') {
        window.applyTheme(theme.preview);
        alert(`✅ ${theme.name} applied!\n\nYour monster's background has been updated.`);
        updateThemesDisplay();
    }
}

// Unapply current theme (revert to default day/night cycle)
function unapplyThemeFromShop() {
    if (typeof window.unapplyTheme === 'function') {
        window.unapplyTheme();
        alert(`🔄 Theme removed!\n\nYour monster's background will now use the default day/night cycle.`);
        updateThemesDisplay();
    }
}

// Export to global scope
window.availableThemes = availableThemes;
window.updateThemesDisplay = updateThemesDisplay;
window.buyTheme = buyTheme;
window.applyThemeFromShop = applyThemeFromShop;
window.unapplyThemeFromShop = unapplyThemeFromShop;

