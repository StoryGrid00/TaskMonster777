// hero.js - Hero class with animation, stats, and XP management
export class Hero {
  constructor(name, sprites) {
    this.name = name;
    this.maxHp = 100;
    this.hp = 100;
    this.atk = 15;
    this.xp = 0;
    this.level = 1;
    this.state = 'idle';
    this.sprites = sprites;
  }

  setState(state) {
    this.state = state;
    this.updateSprite();
  }

  updateSprite() {
    const heroSprite = document.getElementById('heroSprite');
    const heroSpriteHome = document.getElementById('heroSpriteHome');
    const heroBattleSprite = document.getElementById('heroBattleSprite');
    const creatureImage = document.getElementById('creatureImage');
    
    // Remove all animation classes
    const sprites = [heroSprite, heroSpriteHome, heroBattleSprite, creatureImage].filter(el => el);
    sprites.forEach(sprite => {
      sprite.classList.remove('attacking', 'hurt', 'celebrating');
    });
    
    // Set the correct sprite sheet
    if (heroSprite && this.sprites[this.state]) {
      heroSprite.src = this.sprites[this.state];
    }
    if (heroSpriteHome && this.sprites[this.state]) {
      heroSpriteHome.src = this.sprites[this.state];
    }
    if (heroBattleSprite && this.sprites[this.state]) {
      heroBattleSprite.src = this.sprites[this.state];
    }
    if (creatureImage && this.sprites[this.state]) {
      creatureImage.src = this.sprites[this.state];
    }
    
    // Add animation class based on state
    if (this.state === 'attack') {
      sprites.forEach(sprite => sprite.classList.add('attacking'));
    } else if (this.state === 'hurt') {
      sprites.forEach(sprite => sprite.classList.add('hurt'));
    } else if (this.state === 'celebrate') {
      sprites.forEach(sprite => sprite.classList.add('celebrating'));
    }
    // idle state uses default animation from CSS
  }

  gainXP(amount) {
    this.xp += amount;
    const xpNeeded = this.level * 100;
    if (this.xp >= xpNeeded) {
      this.level++;
      this.xp = 0;
      this.maxHp += 20;
      this.hp = this.maxHp;
      this.atk += 5;
      return true; // Level up occurred
    }
    return false;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.setState('hurt');
    setTimeout(() => {
      if (this.hp > 0) {
        this.setState('idle');
      }
    }, 500);
  }

  attack() {
    this.setState('attack');
    setTimeout(() => {
      this.setState('idle');
    }, 600);
    return this.atk;
  }

  celebrate() {
    this.setState('celebrate');
    setTimeout(() => {
      this.setState('idle');
    }, 1000);
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  reset() {
    this.hp = this.maxHp;
    this.setState('idle');
  }
}

