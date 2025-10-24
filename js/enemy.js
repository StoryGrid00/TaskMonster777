// Enemy System for Task Monsters Battle Mode

class Enemy {
    constructor(name, baseHP, baseAttack, baseDefense, sprites) {
        this.name = name;
        this.baseHP = baseHP;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
        this.sprites = sprites;

        // Current battle stats (will be scaled)
        this.maxHP = baseHP;
        this.hp = baseHP;
        this.attack = baseAttack;
        this.defense = baseDefense;

        this.currentSprite = sprites.idle;
    }

    // Scale stats based on player level
    scaleToLevel(playerLevel) {
        this.attack = this.baseAttack + playerLevel * 2;
        this.defense = this.baseDefense + playerLevel * 1.5;
        this.maxHP = this.baseHP + playerLevel * 5;
        this.hp = this.maxHP;
    }

    // Take damage
    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.hp <= 0;
    }

    // Update sprite
    setSprite(spriteKey) {
        if (this.sprites[spriteKey]) {
            this.currentSprite = this.sprites[spriteKey];
        }
    }
}

// Lazy Bat enemy data
const LAZY_BAT_DATA = {
    name: 'Lazy Bat',
    baseHP: 50,
    baseAttack: 15,
    baseDefense: 10,
    minLevel: 1,
    sprites: {
        idle: 'assets/enemies/Bat-IdleFly.png',
        attack1: 'assets/enemies/Bat-Attack1.png',
        attack2: 'assets/enemies/Bat-Attack2.png',
        hurt: 'assets/enemies/Bat-Hurt.png',
        die: 'assets/enemies/Bat-Die.png',
        run: 'assets/enemies/Bat-Run.png',
        sleep: 'assets/enemies/Bat-Sleep.png',
        wakeup: 'assets/enemies/Bat-WakeUp.png'
    }
};

// Lazy Eye enemy data (appears at level 12+)
const LAZY_EYE_DATA = {
    name: 'Lazy Eye',
    baseHP: 75,
    baseAttack: 20,
    baseDefense: 15,
    minLevel: 12,
    canSleep: true,
    sprites: {
        idle: 'assets/enemies/Eye-Idle.png',
        attack1: 'assets/enemies/Eye-Idle.png',
        attack2: 'assets/enemies/Eye-Idle.png',
        hurt: 'assets/enemies/Eye-Idle.png',
        die: 'assets/enemies/Eye-Idle.png',
        run: 'assets/enemies/Eye-Idle.png',
        sleep: 'assets/enemies/Eye-Idle.png',
        wakeup: 'assets/enemies/Eye-Idle.png'
    }
};

const ENEMY_TYPES = [LAZY_BAT_DATA, LAZY_EYE_DATA];

// Create a scaled enemy for battle
function createRandomEnemy(playerLevel) {
    // Filter enemies available at current level
    const availableEnemies = ENEMY_TYPES.filter(e => playerLevel >= e.minLevel);
    
    // Pick random enemy from available ones
    const enemyData = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
    
    const enemy = new Enemy(
        enemyData.name,
        enemyData.baseHP,
        enemyData.baseAttack,
        enemyData.baseDefense,
        enemyData.sprites
    );
    
    // Add special abilities
    if (enemyData.canSleep) {
        enemy.canSleep = true;
    }

    enemy.scaleToLevel(playerLevel);
    return enemy;
}

// Play enemy animation sequence
function playEnemyAnimation(enemy, animationKey, duration = 500) {
    return new Promise((resolve) => {
        const spriteElement = document.getElementById('enemySprite');
        
        // Update sprite sheet source
        enemy.setSprite(animationKey);
        spriteElement.style.backgroundImage = `url('${enemy.currentSprite}')`;
        
        // Remove all animation classes
        spriteElement.classList.remove('idle', 'attack', 'hurt');
        
        // Add appropriate animation class
        if (animationKey === 'attack1' || animationKey === 'attack2') {
            spriteElement.classList.add('attack');
        } else if (animationKey === 'hurt') {
            spriteElement.classList.add('hurt');
        } else {
            spriteElement.classList.add('idle');
        }

        setTimeout(() => {
            enemy.setSprite('idle');
            spriteElement.style.backgroundImage = `url('${enemy.currentSprite}')`;
            spriteElement.classList.remove('attack', 'hurt');
            spriteElement.classList.add('idle');
            resolve();
        }, duration);
    });
}

// Wake up animation sequence (battle start)
async function playWakeUpSequence(enemy) {
    const spriteElement = document.getElementById('enemySprite');

    // Start with sleep
    enemy.setSprite('sleep');
    spriteElement.style.backgroundImage = `url('${enemy.currentSprite}')`;
    spriteElement.classList.remove('idle', 'attack', 'hurt');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Wake up
    enemy.setSprite('wakeup');
    spriteElement.style.backgroundImage = `url('${enemy.currentSprite}')`;
    await new Promise(resolve => setTimeout(resolve, 800));

    // Transition to idle
    enemy.setSprite('idle');
    spriteElement.style.backgroundImage = `url('${enemy.currentSprite}')`;
    spriteElement.classList.add('idle');
}


// Export to global scope
window.Enemy = Enemy;
window.createRandomEnemy = createRandomEnemy;
window.playEnemyAnimation = playEnemyAnimation;
window.playWakeUpSequence = playWakeUpSequence;

