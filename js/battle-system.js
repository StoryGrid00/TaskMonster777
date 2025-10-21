// Task Monsters Battle System
// Integrated into creature display area

const BattleSystem = {
    state: {
        active: false,
        turn: 'player',
        hero: {
            energy: 103,
            maxEnergy: 103,
            attack: 7,
            defense: 5
        },
        enemy: {
            hp: 35,
            maxHp: 35,
            attack: 7,
            defense: 3,
            name: 'Lazy Bat'
        },
        inventory: {
            fireball: 3,
            shield: 2,
            heal: 1
        }
    },

    init() {
        this.createBattleUI();
        this.attachEventListeners();
    },

    createBattleUI() {
        // Add battle overlay to pet-rock-header
        const petRockHeader = document.querySelector('.pet-rock-header');
        if (!petRockHeader) return;

        // Battle overlay
        const overlay = document.createElement('div');
        overlay.id = 'battleOverlay';
        overlay.className = 'battle-overlay';
        petRockHeader.insertBefore(overlay, petRockHeader.firstChild);

        // Add enemy sprite wrapper next to hero
        const creatureContainer = document.querySelector('.creature-container');
        const heroSpriteDiv = creatureContainer.querySelector('div[style*="width: 140px"]');
        
        // Create battle arena wrapper
        const battleArena = document.createElement('div');
        battleArena.id = 'battleArena';
        battleArena.className = 'battle-arena';
        battleArena.style.cssText = 'display: none; width: 100%; justify-content: space-between; align-items: center; padding: 0 40px; margin: 50px 0 20px;';
        
        // Clone hero for battle arena (keep original in normal view)
        const heroWrapper = document.createElement('div');
        heroWrapper.className = 'sprite-wrapper';
        heroWrapper.style.cssText = 'position: relative; width: 128px; height: 128px; display: flex; align-items: center; justify-content: flex-start;';
        const heroClone = heroSpriteDiv.cloneNode(true);
        heroWrapper.appendChild(heroClone);
        
        // Create enemy wrapper
        const enemyWrapper = document.createElement('div');
        enemyWrapper.id = 'enemyWrapper';
        enemyWrapper.className = 'sprite-wrapper';
        enemyWrapper.style.cssText = 'position: relative; width: 128px; height: 128px; display: flex; align-items: center; justify-content: flex-end;';
        
        // Enemy stats (EverQuest style)
        const enemyStats = document.createElement('div');
        enemyStats.id = 'enemyStats';
        enemyStats.className = 'enemy-stats';
        enemyStats.innerHTML = `
            <div class="enemy-stat-bar enemy-hp-bar">
                <div style="display: flex; justify-content: space-between; color: #fff; font-weight: 600; font-size: 10px;">
                    <span>HP</span>
                    <span id="enemyHPText">35/35</span>
                </div>
                <div class="enemy-stat-bar-fill" id="enemyHPFill" style="width: 100%;"></div>
            </div>
            <div class="enemy-stat-bar enemy-def-bar">
                <div style="display: flex; justify-content: space-between; color: #fff; font-weight: 600; font-size: 10px;">
                    <span>DEF</span>
                    <span id="enemyDEFText">3</span>
                </div>
                <div class="enemy-stat-bar-fill" id="enemyDEFFill" style="width: 100%;"></div>
            </div>
        `;
        
        // Enemy sprite
        const enemySprite = document.createElement('img');
        enemySprite.id = 'enemySprite';
        enemySprite.className = 'sprite enemy-idle';
        enemySprite.src = 'assets/enemies/bat-idle.png';
        enemySprite.alt = 'Enemy';
        enemySprite.style.cssText = 'width: 32px; height: 32px; image-rendering: pixelated; object-fit: none; transform: scale(4); transform-origin: center center;';
        
        enemyWrapper.appendChild(enemyStats);
        enemyWrapper.appendChild(enemySprite);
        
        battleArena.appendChild(heroWrapper);
        battleArena.appendChild(enemyWrapper);
        
        // Insert battle arena before stat gauges
        const statGauges = creatureContainer.querySelector('div[style*="display: grid"]');
        creatureContainer.insertBefore(battleArena, statGauges);

        // Battle message
        const battleMessage = document.createElement('div');
        battleMessage.id = 'battleMessage';
        battleMessage.className = 'battle-message';
        creatureContainer.appendChild(battleMessage);

        // Battle items panel
        const battleItems = document.createElement('div');
        battleItems.id = 'battleItems';
        battleItems.className = 'battle-items';
        battleItems.innerHTML = `
            <div class="battle-item" onclick="BattleSystem.handleAction('attack')">
                <div class="item-emoji">⚔️</div>
                <div class="item-count">Attack</div>
            </div>
            <div class="battle-item" onclick="BattleSystem.handleAction('fireball')">
                <div class="item-emoji">🔥</div>
                <div class="item-count" id="fireballCount">3</div>
            </div>
            <div class="battle-item" onclick="BattleSystem.handleAction('shield')">
                <div class="item-emoji">🛡️</div>
                <div class="item-count" id="shieldCount">2</div>
            </div>
            <div class="battle-item" onclick="BattleSystem.handleAction('heal')">
                <div class="item-emoji">💚</div>
                <div class="item-count" id="healCount">1</div>
            </div>
            <div class="battle-item" onclick="BattleSystem.handleAction('run')">
                <div class="item-emoji">🏃</div>
                <div class="item-count">Run</div>
            </div>
        `;
        document.body.appendChild(battleItems);

        // Add CSS
        this.injectStyles();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .battle-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                border-radius: 16px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                z-index: 1;
            }
            .battle-overlay.active {
                opacity: 1;
                pointer-events: auto;
            }
            .battle-arena {
                position: relative;
                z-index: 10;
            }
            .enemy-stats {
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                width: 120px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .enemy-stat-bar {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                padding: 2px 4px;
            }
            .enemy-stat-bar-fill {
                height: 6px;
                border-radius: 2px;
                transition: width 0.3s ease;
                margin-top: 2px;
            }
            .enemy-hp-bar .enemy-stat-bar-fill {
                background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
            }
            .enemy-def-bar .enemy-stat-bar-fill {
                background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
            }
            .sprite.enemy-idle {
                animation: enemy-idle 1.08s steps(9) infinite;
            }
            @keyframes enemy-idle {
                0% { object-position: 0 0; }
                11.11% { object-position: -32px 0; }
                22.22% { object-position: -64px 0; }
                33.33% { object-position: -96px 0; }
                44.44% { object-position: -128px 0; }
                55.55% { object-position: -160px 0; }
                66.66% { object-position: -192px 0; }
                77.77% { object-position: -224px 0; }
                88.88% { object-position: -256px 0; }
            }
            .sprite.enemy-attack {
                animation: enemy-attack 0.8s steps(8) forwards;
            }
            @keyframes enemy-attack {
                0% { object-position: 0 0; }
                12.5% { object-position: -32px 0; }
                25% { object-position: -64px 0; }
                37.5% { object-position: -96px 0; }
                50% { object-position: -128px 0; }
                62.5% { object-position: -160px 0; }
                75% { object-position: -192px 0; }
                87.5% { object-position: -224px 0; }
            }
            .battle-items {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                padding: 12px 16px;
                display: none;
                gap: 12px;
                z-index: 100;
                max-width: 380px;
                flex-wrap: wrap;
                justify-content: center;
            }
            .battle-items.visible {
                display: flex;
            }
            .battle-item {
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .battle-item:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.5);
                transform: scale(1.1);
            }
            .battle-item:active {
                transform: scale(0.95);
            }
            .battle-item.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            .item-emoji {
                font-size: 28px;
                margin-bottom: 2px;
            }
            .item-count {
                font-size: 10px;
                font-weight: 700;
                color: #fff;
            }
            .battle-message {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: #fff;
                padding: 12px 20px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                text-align: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 50;
                max-width: 80%;
            }
            .battle-message.visible {
                opacity: 1;
            }
            .fireball {
                position: absolute;
                width: 32px;
                height: 32px;
                background: url('assets/fire-ball.png') no-repeat center;
                background-size: contain;
                transform: scale(2);
                z-index: 20;
                pointer-events: none;
            }
            .explosion {
                position: absolute;
                width: 64px;
                height: 64px;
                background: url('assets/fireball-explosion3.png') no-repeat center;
                background-size: contain;
                z-index: 20;
                pointer-events: none;
                animation: explode 0.42s steps(6) forwards;
            }
            @keyframes explode {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-4px); }
                75% { transform: translateX(4px); }
            }
            .shake {
                animation: shake 0.5s ease-in-out;
            }
            @keyframes retreat {
                0% { transform: translateY(0) scale(4); opacity: 1; }
                100% { transform: translateY(-150px) scale(4); opacity: 0; }
            }
            .retreating {
                animation: retreat 1.2s ease-in-out forwards;
            }
        `;
        document.head.appendChild(style);
    },

    attachEventListeners() {
        // Listen for task completion to trigger random battles
        window.addEventListener('taskCompleted', () => {
            if (Math.random() < 0.2) { // 20% chance
                setTimeout(() => this.startBattle(), 500);
            }
        });
    },

    startBattle() {
        this.state.active = true;
        this.state.turn = 'player';

        // Show battle UI
        document.getElementById('battleOverlay').classList.add('active');
        document.querySelector('.pet-rock-header').style.background = '#000000';
        
        const battleArena = document.getElementById('battleArena');
        const heroSpriteDiv = document.querySelector('.creature-container div[style*="width: 140px"]');
        if (heroSpriteDiv) heroSpriteDiv.style.display = 'none';
        battleArena.style.display = 'flex';
        
        document.getElementById('battleItems').classList.add('visible');

        this.showMessage(`🦇 ${this.state.enemy.name} flutters in to steal your focus!`);
    },

    handleAction(action) {
        if (!this.state.active || this.state.turn !== 'player') return;

        switch(action) {
            case 'attack':
                this.playerAttack(false);
                break;
            case 'fireball':
                if (this.state.inventory.fireball > 0) {
                    this.state.inventory.fireball--;
                    this.updateInventoryUI();
                    this.playerAttack(true);
                } else {
                    this.showMessage('❌ No Fireballs left!');
                }
                break;
            case 'shield':
                if (this.state.inventory.shield > 0) {
                    this.state.inventory.shield--;
                    this.state.hero.defense += 5;
                    this.updateInventoryUI();
                    this.updateStats();
                    this.showMessage('🛡️ Defense increased!');
                    setTimeout(() => this.enemyTurn(), 1500);
                }
                break;
            case 'heal':
                if (this.state.inventory.heal > 0) {
                    this.state.inventory.heal--;
                    this.state.hero.energy = Math.min(this.state.hero.maxEnergy, this.state.hero.energy + 30);
                    this.updateInventoryUI();
                    this.updateStats();
                    this.showMessage('💚 Healed 30 energy!');
                    setTimeout(() => this.enemyTurn(), 1500);
                }
                break;
            case 'run':
                this.endBattle('retreat');
                break;
        }
    },

    playerAttack(isFireball) {
        this.state.turn = 'animating';

        const heroSprite = document.getElementById('heroSprite');
        heroSprite.src = 'assets/heroes/hero-attack.png';

        if (isFireball) {
            setTimeout(() => this.animateFireball(), 300);
        }

        setTimeout(() => {
            const bonus = isFireball ? 2 : 1;
            const damage = Math.max(3, Math.floor((this.state.hero.attack - this.state.enemy.defense / 2) * bonus));
            this.state.enemy.hp = Math.max(0, this.state.enemy.hp - damage);
            
            this.updateEnemyStats();
            this.shakeScreen();
            this.showMessage(`💥 You dealt ${damage} damage!`);

            setTimeout(() => {
                heroSprite.src = 'assets/heroes/hero-idle.png';
            }, 640);

            if (this.state.enemy.hp <= 0) {
                setTimeout(() => this.endBattle('victory'), 1000);
            } else {
                setTimeout(() => this.enemyTurn(), 1500);
            }
        }, isFireball ? 900 : 640);
    },

    enemyTurn() {
        this.state.turn = 'enemy';

        const enemySprite = document.getElementById('enemySprite');
        enemySprite.className = 'sprite enemy-attack';
        enemySprite.src = 'assets/enemies/bat-attack.png';

        setTimeout(() => {
            const damage = Math.max(3, Math.floor(this.state.enemy.attack - this.state.hero.defense / 2));
            this.state.hero.energy = Math.max(0, this.state.hero.energy - damage);
            
            this.updateStats();
            this.shakeScreen();
            this.showMessage(`💢 ${this.state.enemy.name} dealt ${damage} damage!`);

            setTimeout(() => {
                enemySprite.className = 'sprite enemy-idle';
                enemySprite.src = 'assets/enemies/bat-idle.png';
            }, 720);

            if (this.state.hero.energy <= 0) {
                setTimeout(() => this.endBattle('defeat'), 1000);
            } else {
                this.state.turn = 'player';
                setTimeout(() => this.showMessage('Your turn!'), 1500);
            }
        }, 720);
    },

    animateFireball() {
        const fireball = document.createElement('div');
        fireball.className = 'fireball';
        fireball.style.left = '30%';
        fireball.style.top = '50%';
        document.getElementById('battleArena').appendChild(fireball);

        setTimeout(() => {
            fireball.style.transition = 'all 0.6s ease-out';
            fireball.style.left = '70%';
        }, 50);

        setTimeout(() => {
            const explosion = document.createElement('div');
            explosion.className = 'explosion';
            explosion.style.left = '70%';
            explosion.style.top = '50%';
            explosion.style.transform = 'translate(-50%, -50%)';
            document.getElementById('battleArena').appendChild(explosion);

            setTimeout(() => explosion.remove(), 420);
            fireball.remove();
        }, 650);
    },

    endBattle(result) {
        this.state.active = false;

        if (result === 'victory') {
            this.showMessage(`✨ ${this.state.enemy.name} retreats to nap elsewhere!`);
            const enemySprite = document.getElementById('enemySprite');
            enemySprite.classList.add('retreating');
        } else if (result === 'retreat') {
            this.showMessage('🏃 You retreat to fight another day...');
        } else {
            this.showMessage('💫 You need to rest and recover...');
        }

        setTimeout(() => {
            document.getElementById('battleOverlay').classList.remove('active');
            document.querySelector('.pet-rock-header').style.backgroundImage = 'url("assets/backgrounds/default-bg.png")';
            
            const battleArena = document.getElementById('battleArena');
            const heroSpriteDiv = document.querySelector('.creature-container div[style*="width: 140px"]');
            if (heroSpriteDiv) heroSpriteDiv.style.display = 'flex';
            battleArena.style.display = 'none';
            
            document.getElementById('battleItems').classList.remove('visible');
            
            // Reset
            this.state.hero.energy = this.state.hero.maxEnergy;
            this.state.enemy.hp = this.state.enemy.maxHp;
            this.updateStats();
            this.updateEnemyStats();

            const enemySprite = document.getElementById('enemySprite');
            enemySprite.classList.remove('retreating');
        }, 2000);
    },

    updateStats() {
        const energyPercent = (this.state.hero.energy / this.state.hero.maxEnergy) * 100;
        document.getElementById('energyFill').style.width = energyPercent + '%';
        document.getElementById('energyText').textContent = `${this.state.hero.energy}/${this.state.hero.maxEnergy}`;
    },

    updateEnemyStats() {
        const hpPercent = (this.state.enemy.hp / this.state.enemy.maxHp) * 100;
        document.getElementById('enemyHPFill').style.width = hpPercent + '%';
        document.getElementById('enemyHPText').textContent = `${this.state.enemy.hp}/${this.state.enemy.maxHp}`;
        document.getElementById('enemyDEFText').textContent = this.state.enemy.defense;
    },

    updateInventoryUI() {
        document.getElementById('fireballCount').textContent = this.state.inventory.fireball;
        document.getElementById('shieldCount').textContent = this.state.inventory.shield;
        document.getElementById('healCount').textContent = this.state.inventory.heal;
    },

    showMessage(text) {
        const msg = document.getElementById('battleMessage');
        msg.textContent = text;
        msg.classList.add('visible');

        setTimeout(() => {
            msg.classList.remove('visible');
        }, 2000);
    },

    shakeScreen() {
        document.querySelector('.pet-rock-header').classList.add('shake');
        setTimeout(() => {
            document.querySelector('.pet-rock-header').classList.remove('shake');
        }, 500);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BattleSystem.init());
} else {
    BattleSystem.init();
}

// Expose for testing
window.BattleSystem = BattleSystem;

