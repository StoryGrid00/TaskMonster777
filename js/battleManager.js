// Battle Manager - State Machine and Combat Logic

const BattleState = {
    INITIALIZING: 'initializing',
    PLAYER_TURN: 'player_turn',
    ENEMY_TURN: 'enemy_turn',
    ANIMATING: 'animating',
    VICTORY: 'victory',
    DEFEAT: 'defeat',
    FLED: 'fled'
};

class BattleManager {
    constructor() {
        this.state = BattleState.INITIALIZING;
        this.hero = null;
        this.enemy = null;
        this.attackGauge = 0;
        this.defenseGauge = 0;
        this.battleLog = [];
    }

    // Initialize battle with hero and enemy
    async startBattle(heroData, enemyData) {
        this.state = BattleState.INITIALIZING;
        this.hero = heroData;
        this.enemy = enemyData;
        this.attackGauge = 100;  // Start with full attack gauge
        this.defenseGauge = 100; // Start with full defense gauge
        this.battleLog = [];
        this.attackCount = 0;    // Track attack count for walk+attack animation

        // Set battle background based on level
        const battleContainer = document.querySelector('.battle-container');
        battleContainer.classList.remove('bg-forest', 'bg-night-town', 'bg-city');
        if (this.hero.level >= 12) {
            battleContainer.classList.add('bg-night-town');
        } else {
            battleContainer.classList.add('bg-city'); // Use city background instead of forest
        }
        
        // Show battle arena
        showBattle(this.hero, this.enemy);

        // Play wake up sequence
        addBattleLog(`💤 A ${this.enemy.name} appears!`);
        await playWakeUpSequence(this.enemy);
        addBattleLog('⚔️ Battle Start!');

        // Enemy attacks first
        await this.enemyTurn();
    }

    // Player attacks
    async playerAttack() {
        if (this.state !== BattleState.PLAYER_TURN) return;
        if (this.attackGauge < 10) {
            addBattleLog('❌ Not enough attack gauge!');
            return;
        }

        this.state = BattleState.ANIMATING;
        this.attackGauge -= 10;
        this.attackCount++;
        updateBattleUI(this.hero, this.enemy);

        // Play hero attack animation
        // Every 3rd attack uses walk+attack animation with movement
        if (this.attackCount % 3 === 0 && this.attackCount > 0) {
            const heroSprite = document.getElementById('heroSprite');
            const originalLeft = heroSprite.style.left || '0px';
            
            // Start walk+attack animation
            startHeroAnimation('walk-attack');
            
            // Move hero forward toward enemy (150px to the right)
            heroSprite.style.transition = 'left 0.45s ease-out';
            heroSprite.style.left = '150px';
            
            // Wait for walk and attack to complete
            await new Promise(resolve => setTimeout(resolve, 450));
            
            // Move back to original position
            heroSprite.style.transition = 'left 0.45s ease-in';
            heroSprite.style.left = originalLeft;
            
            await new Promise(resolve => setTimeout(resolve, 450));
            heroSprite.style.transition = '';
        } else {
            startHeroAnimation('attack1');
            await new Promise(resolve => setTimeout(resolve, 600)); // 4 frames * 150ms
        }

        // Calculate damage
        const damage = Math.max(3, Math.floor(this.hero.attack - this.enemy.defense / 2));
        const isDead = this.enemy.takeDamage(damage);

        // Play enemy hurt animation
        await playEnemyAnimation(this.enemy, 'hurt', 300);
        
        addBattleLog(`💥 You dealt ${damage} damage!`);
        updateBattleUI(this.hero, this.enemy);

        // Reset hero sprite to idle
        startHeroAnimation('idle');

        if (isDead) {
            this.state = BattleState.VICTORY;
            await this.endBattle('victory');
        } else {
            await new Promise(resolve => setTimeout(resolve, 800));
            await this.enemyTurn();
        }
    }

    // Player defends - activates defense mode
    async playerDefend() {
        if (this.state !== BattleState.PLAYER_TURN) return;

        this.state = BattleState.ANIMATING;
        this.defendActive = true; // Flag to use defense gauge on next hit
        
        addBattleLog('🛡️ Defense stance activated!');
        updateBattleUI(this.hero, this.enemy);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.enemyTurn();
    }

    // Player uses fireball
    async playerFireball() {
        if (this.state !== BattleState.PLAYER_TURN) return;
        if (this.attackGauge < 30) {
            addBattleLog('❌ Need 30 attack gauge for fireball!');
            return;
        }

        const fireballCount = gameState.battleInventory?.fireball || 0;
        if (fireballCount <= 0) {
            addBattleLog('❌ No fireballs left!');
            return;
        }

        this.state = BattleState.ANIMATING;
        this.attackGauge -= 30;  // Fireball costs 30 attack gauge
        gameState.battleInventory.fireball--;
        updateBattleUI(this.hero, this.enemy);
        updateActionButtons(this.hero);

        // Play hero throw animation for fireball
        startHeroAnimation('throw');
        await new Promise(resolve => setTimeout(resolve, 600)); // 4 frames * 150ms

        // Play fireball animation
        await playFireballAnimation(
            document.getElementById('heroSprite'),
            document.getElementById('enemySprite')
        );

        // Calculate damage (2x multiplier)
        const damage = Math.max(5, Math.floor((this.hero.attack - this.enemy.defense / 2) * 2));
        const isDead = this.enemy.takeDamage(damage);

        // Play enemy hurt animation
        await playEnemyAnimation(this.enemy, 'hurt', 300);
        
        addBattleLog(`🔥 Fireball dealt ${damage} damage!`);
        updateBattleUI(this.hero, this.enemy);

        // Reset hero sprite to idle
        startHeroAnimation('idle');

        // Save game state
        saveGameState();

        if (isDead) {
            this.state = BattleState.VICTORY;
            await this.endBattle('victory');
        } else {
            await new Promise(resolve => setTimeout(resolve, 800));
            await this.enemyTurn();
        }
    }

    // Player uses potion
    async playerPotion() {
        if (this.state !== BattleState.PLAYER_TURN) return;

        const potionCount = gameState.battleInventory?.health_potion || 0;
        if (potionCount <= 0) {
            addBattleLog('❌ No potions left!');
            return;
        }

        this.state = BattleState.ANIMATING;
        gameState.battleInventory.health_potion--;
        
        // Play hero jump animation
        startHeroAnimation('jump');
        
        const healAmount = 30;
        this.hero.hp = Math.min(this.hero.maxHP, this.hero.hp + healAmount);
        
        addBattleLog(`💚 Healed ${healAmount} HP!`);
        updateBattleUI(this.hero, this.enemy);
        updateActionButtons(this.hero);

        // Save game state
        saveGameState();

        await new Promise(resolve => setTimeout(resolve, 800)); // 8 frames * 100ms
        
        // Reset to idle
        startHeroAnimation('idle');
        
        await new Promise(resolve => setTimeout(resolve, 200));
        await this.enemyTurn();
    }

    // Player flees
    async playerFlee() {
        if (this.state !== BattleState.PLAYER_TURN) return;

        this.state = BattleState.FLED;
        addBattleLog('🏃 You fled from battle!');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        await this.endBattle('fled');
    }

    // Player uses attack refill
    async playerAttackRefill() {
        if (this.state !== BattleState.PLAYER_TURN) return;

        const refillCount = gameState.battleInventory?.attack_refill || 0;
        if (refillCount <= 0) {
            addBattleLog('❌ No attack refills left!');
            return;
        }

        this.state = BattleState.ANIMATING;
        gameState.battleInventory.attack_refill--;
        
        const refillAmount = 50;
        this.attackGauge = Math.min(100, this.attackGauge + refillAmount);
        
        addBattleLog(`⚡ Restored ${refillAmount} attack gauge!`);
        updateBattleUI(this.hero, this.enemy);
        updateActionButtons(this.hero);

        // Save game state
        saveGameState();

        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.enemyTurn();
    }

    // Player uses defense refill
    async playerDefenseRefill() {
        if (this.state !== BattleState.PLAYER_TURN) return;

        const refillCount = gameState.battleInventory?.defense_refill || 0;
        if (refillCount <= 0) {
            addBattleLog('❌ No defense refills left!');
            return;
        }

        this.state = BattleState.ANIMATING;
        gameState.battleInventory.defense_refill--;
        
        const refillAmount = 50;
        this.defenseGauge = Math.min(100, this.defenseGauge + refillAmount);
        
        addBattleLog(`🛡️ Restored ${refillAmount} defense gauge!`);
        updateBattleUI(this.hero, this.enemy);
        updateActionButtons(this.hero);

        // Save game state
        saveGameState();

        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.enemyTurn();
    }

    // Enemy turn
    async enemyTurn() {
        this.state = BattleState.ENEMY_TURN;

        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if enemy can cast sleep (Lazy Eye)
        const canCastSleep = this.enemy.canSleep && Math.random() < 0.3; // 30% chance
        
        if (canCastSleep) {
            // Sleep attack
            await playEnemyAnimation(this.enemy, 'attack1', 600);
            addBattleLog(`😴 ${this.enemy.name} cast Sleep! You skip your next turn!`);
            
            // Show Z emojis on hero
            const heroSprite = document.getElementById('heroSprite');
            const sleepEmojis = document.createElement('div');
            sleepEmojis.style.position = 'absolute';
            sleepEmojis.style.fontSize = '2rem';
            sleepEmojis.style.animation = 'float 2s ease-in-out';
            sleepEmojis.textContent = '💤 💤 💤';
            heroSprite.parentElement.appendChild(sleepEmojis);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            sleepEmojis.remove();
            
            // Enemy gets another turn
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.enemyTurn();
            return;
        }
        
        // Normal attack
        await playEnemyAnimation(this.enemy, 'attack1', 600);

        // Calculate damage
        const damage = Math.max(3, Math.floor(this.enemy.attack - this.hero.defense / 2));
        
        // Check if defend was active - use defense gauge instead of HP
        if (this.defendActive && this.defenseGauge > 0) {
            const gaugeUsed = Math.min(damage, this.defenseGauge);
            this.defenseGauge -= gaugeUsed;
            const remainingDamage = damage - gaugeUsed;
            if (remainingDamage > 0) {
                this.hero.hp = Math.max(0, this.hero.hp - remainingDamage);
                addBattleLog(`🛡️ Blocked ${gaugeUsed} damage! Took ${remainingDamage} damage!`);
            } else {
                addBattleLog(`🛡️ Blocked all ${damage} damage!`);
            }
            this.defendActive = false;
        } else {
            this.hero.hp = Math.max(0, this.hero.hp - damage);
        }

        // Play hero hurt animation if took damage
        if (damage > 0 || this.hero.hp < 30) {
            startHeroAnimation('hurt');
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds as requested
        } else {
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        addBattleLog(`💢 ${this.enemy.name} dealt ${damage} damage!`);
        updateBattleUI(this.hero, this.enemy);

        // Reset hero sprite to idle
        startHeroAnimation('idle');

        if (this.hero.hp <= 0) {
            this.state = BattleState.DEFEAT;
            await this.endBattle('defeat');
        } else {
            this.state = BattleState.PLAYER_TURN;
            await new Promise(resolve => setTimeout(resolve, 500));
            addBattleLog('⚔️ Your turn!');
        }
    }

    // End battle
    async endBattle(result) {
        if (result === 'victory') {
            addBattleLog(`🎉 VICTORY! You defeated the ${this.enemy.name}!`);
            
            // Play enemy die animation
            await playEnemyAnimation(this.enemy, 'die', 1000);
        } else if (result === 'defeat') {
            addBattleLog('💫 DEFEAT! You were defeated...');
            
            // Play hero death animation
            startHeroAnimation('death');
            await new Promise(resolve => setTimeout(resolve, 1200)); // 8 frames * 150ms
        } else if (result === 'fled') {
            addBattleLog('🏃 You fled from battle!');
        }

        // Refill gauges after battle
        if (result === 'victory' || result === 'fled') {
            this.hero.attackGauge = 100;
            this.hero.defenseGauge = 100;
            updateBattleUI(this.hero, this.enemy);
            saveGameState();
        }

        // Fade out after 2 seconds
        setTimeout(() => {
            document.getElementById('battleLog').innerHTML = '';
            const arena = document.getElementById('battleArena');
            arena.classList.add('hidden');
        }, 2000);
    }
}

// Global battle manager instance
let battleManager = null;

// Initialize battle manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        battleManager = new BattleManager();
        window.battleManager = battleManager;
        console.log('Battle Manager initialized');
    });
} else {
    battleManager = new BattleManager();
    window.battleManager = battleManager;
    console.log('Battle Manager initialized');
}

