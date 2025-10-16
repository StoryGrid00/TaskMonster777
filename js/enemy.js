// enemy.js - Enemy class with AI and health management
export class Enemy {
  constructor(name, type, sprites, hp, atk, xpReward) {
    this.name = name;
    this.type = type;
    this.maxHp = hp;
    this.hp = hp;
    this.atk = atk;
    this.xpReward = xpReward;
    this.state = 'idle';
    this.sprites = sprites;
  }

  setState(state) {
    this.state = state;
    this.updateSprite();
  }

  updateSprite() {
    const enemySprite = document.getElementById('enemySprite');
    if (!enemySprite) return;
    
    // Remove animation classes
    enemySprite.classList.remove('attacking');
    
    // Set the correct sprite sheet
    if (this.sprites[this.state]) {
      enemySprite.src = this.sprites[this.state];
    }
    
    // Add animation class
    if (this.state === 'attack') {
      enemySprite.classList.add('attacking');
    }
    // idle state uses default animation from CSS
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp <= 0;
  }

  attack() {
    this.setState('attack');
    setTimeout(() => {
      if (this.hp > 0) {
        this.setState('idle');
      }
    }, 600);
    return this.atk;
  }
}

// Enemy factory function
export function createRandomEnemy() {
  const enemies = [
    {
      name: 'Ghost',
      type: 'ghost',
      sprites: {
        idle: 'assets/enemies/ghost-idle.png',
        attack: 'assets/enemies/ghost-attack.png'
      },
      hp: 30,
      atk: 8,
      xpReward: 15
    },
    {
      name: 'Bat',
      type: 'bat',
      sprites: {
        idle: 'assets/enemies/bat-idle.png',
        attack: 'assets/enemies/bat-attack.png'
      },
      hp: 25,
      atk: 6,
      xpReward: 10
    }
  ];

  const enemyData = enemies[Math.floor(Math.random() * enemies.length)];
  return new Enemy(
    enemyData.name,
    enemyData.type,
    enemyData.sprites,
    enemyData.hp,
    enemyData.atk,
    enemyData.xpReward
  );
}

