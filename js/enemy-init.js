// Enemy Sprite Initialization for Battle
// Determines correct sprite class based on enemy type

function initEnemySprite(enemyData) {
    const spriteElement = document.getElementById('enemySprite');
    if (!spriteElement) return;
    
    // Remove old classes
    spriteElement.className = 'sprite';
    
    // Determine enemy type and apply appropriate class
    if (enemyData.name === 'Lazy Bat') {
        // Bat sprites: 64×64 frames
        spriteElement.classList.add('enemy-sprite-large');
        spriteElement.style.backgroundImage = `url('${enemyData.sprites.idle}')`;
        spriteElement.style.backgroundSize = '576px 64px'; // 9 frames × 64px = 576px
        spriteElement.classList.add('bat-idle');
    } else if (enemyData.name === 'Ghost Task Stopper') {
        // Ghost sprites: 32×32 frames, 6 frames
        spriteElement.classList.add('enemy-sprite-small');
        spriteElement.style.backgroundImage = `url('${enemyData.sprites.idle}')`;
        spriteElement.style.backgroundSize = '192px 32px'; // 6 frames × 32px = 192px
        spriteElement.classList.add('ghost-idle');
    } else if (enemyData.name === 'Flying Eye Demon' || enemyData.name === 'Lazy Eye') {
        // Flying Eye sprites: 48×48 frames
        spriteElement.classList.add('enemy-sprite-medium');
        spriteElement.style.backgroundImage = `url('assets/enemies/flying-eye-idle-sheet.png')`;
        spriteElement.style.backgroundSize = '384px 48px'; // 8 frames × 48px = 384px
        spriteElement.classList.add('eye-idle');
    } else {
        // Default fallback
        spriteElement.classList.add('enemy-sprite-large');
        spriteElement.style.backgroundImage = `url('${enemyData.sprites.idle}')`;
        spriteElement.classList.add('bat-idle');
    }
}

// Export to global scope
window.initEnemySprite = initEnemySprite;

