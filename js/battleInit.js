// Battle System Initialization

// Hero Sprite Animation System
let heroAnimationInterval = null;
let heroCurrentFrame = 0;
let heroTotalFrames = 4;
let heroFrameWidth = 32;

function startHeroAnimation(animationType = 'idle') {
    const heroSprite = document.getElementById('heroSprite');
    if (!heroSprite) return;
    
    // Stop any existing animation
    if (heroAnimationInterval) {
        clearInterval(heroAnimationInterval);
    }
    
    // Get current monster sprite prefix
    const spritePrefix = localStorage.getItem('heroSpritePrefix') || 'Pink_Monster';
    
    // Set animation parameters based on type
    const animations = {
        idle: { frames: 4, width: 128, sprite: `${spritePrefix}_Idle_4.png`, speed: 200 },
        attack1: { frames: 4, width: 128, sprite: `${spritePrefix}_Attack1_4.png`, speed: 150 },
        'walk-attack': { frames: 6, width: 192, sprite: `${spritePrefix}_Walk+Attack_6.png`, speed: 150 },
        throw: { frames: 4, width: 128, sprite: `${spritePrefix}_Throw_4.png`, speed: 150 },
        jump: { frames: 8, width: 256, sprite: `${spritePrefix}_Jump_8.png`, speed: 100 },
        hurt: { frames: 4, width: 128, sprite: `${spritePrefix}_Hurt_4.png`, speed: 150 },
        death: { frames: 8, width: 256, sprite: `${spritePrefix}_Death_8.png`, speed: 150 }
    };
    
    const anim = animations[animationType] || animations.idle;
    heroTotalFrames = anim.frames;
    heroFrameWidth = anim.width / anim.frames;
    heroCurrentFrame = 0;
    
    // Set sprite image and size
    heroSprite.style.backgroundImage = `url('assets/heroes/${anim.sprite}')`;
    heroSprite.style.backgroundSize = `${anim.width}px 32px`;
    heroSprite.style.width = '32px';
    heroSprite.style.height = '32px';
    heroSprite.style.transform = 'scale(4)';
    heroSprite.style.imageRendering = 'pixelated';
    
    // Animate frames
    heroAnimationInterval = setInterval(() => {
        heroCurrentFrame = (heroCurrentFrame + 1) % heroTotalFrames;
        const xPos = -(heroCurrentFrame * heroFrameWidth);
        heroSprite.style.backgroundPosition = `${xPos}px 0`;
    }, anim.speed);
}

function stopHeroAnimation() {
    if (heroAnimationInterval) {
        clearInterval(heroAnimationInterval);
        heroAnimationInterval = null;
    }
}

// Export to global scope for use in battleManager
window.startHeroAnimation = startHeroAnimation;
window.stopHeroAnimation = stopHeroAnimation;

// Start idle animation when battle starts
function initializeHeroSprite() {
    const heroSprite = document.getElementById('heroSprite');
    if (heroSprite) {
        startHeroAnimation('idle');
    }
}

// Battle system initialization is handled in battleManager.js

// Test function to start a battle (for development)
function startTestBattle() {
    if (!window.battleManager) {
        console.error('Battle Manager not initialized');
        return;
    }

    // Create hero data from gameState
    const heroData = {
        hp: gameState.health || 100,
        maxHP: 100,
        attack: 10 + (gameState.jerryLevel || 1) * 2,
        defense: 5 + (gameState.jerryLevel || 1),
        attackGauge: gameState.battleInventory?.attackGauge || 100,
        defenseGauge: gameState.battleInventory?.defenseGauge || 100
    };

    // Create enemy
    const enemyData = createRandomEnemy(gameState.jerryLevel || 1);

    // Start battle
    battleManager.startBattle(heroData, enemyData);
    
    // Initialize hero sprite animation
    setTimeout(() => {
        initializeHeroSprite();
    }, 100);
}

// Expose globally for testing
window.startTestBattle = startTestBattle;

// Add event listener to battle button when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachBattleButton);
} else {
    attachBattleButton();
}

function attachBattleButton() {
    // Wait a bit for the button to be rendered
    setTimeout(() => {
        const btn = document.getElementById('startBattleBtn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Battle button clicked via event listener!');
                startTestBattle();
            });
            console.log('Battle button event listener attached successfully');
        } else {
            console.error('Start Battle button not found');
        }
    }, 1000);
}

