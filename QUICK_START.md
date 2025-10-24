# Battle System Quick Start Guide

## Installation

Extract the `TaskMonsters_Rebuilt.zip` file to your web server or local development environment.

## File Structure

The battle system consists of the following key files:

### HTML
- `index.html` - Contains the battle arena markup (lines 2169-2257)

### CSS
- `css/battle.css` - All battle system styles and animations

### JavaScript
- `js/enemy.js` - Enemy class and enemy generation
- `js/battleUI.js` - UI updates and visual effects
- `js/battleManager.js` - Core battle logic and state machine
- `js/battleInit.js` - Initialization and test functions

### Assets
- `assets/heroes/Pink_Monster_*.png` - Hero animations (Idle, Attack, Hurt)
- `assets/enemies/` - Enemy sprites and data
- `assets/battle-items/` - Fireball and explosion sprites

## Running the Application

### Option 1: Local Web Server (Recommended)

```bash
cd TaskMonsters_Rebuilt
python3 -m http.server 8080
```

Then open your browser to `http://localhost:8080`

### Option 2: Direct File Access

Open `index.html` directly in your browser. Note: Some features may not work due to CORS restrictions.

## Testing the Battle System

Once the application loads:

1. Wait for the loading screen to complete (3 seconds)
2. Look for the red **"⚔️ Start Battle (Test)"** button in the hero section
3. Click the button to start a test battle
4. The battle arena will appear as a full-screen overlay

## Battle Controls

During battle, you have the following actions:

- **⚔️ Attack (10)** - Basic attack, fills attack gauge
- **🛡️ Defend (20)** - Reduce damage, fills defense gauge  
- **🔥 Fireball (0)** - Special attack with projectile animation
- **💚 Potion (0)** - Heal 30 HP
- **🏃 Flee** - Attempt to escape the battle

Numbers in parentheses show remaining uses.

## Customizing the Battle System

### Adding New Enemies

Edit `assets/enemies/enemy-data.json`:

```json
{
  "newEnemy": {
    "name": "New Enemy",
    "hp": 50,
    "attack": 10,
    "defense": 5,
    "xpReward": 25,
    "sprites": {
      "idle": "assets/enemies/NewEnemy-Idle.png",
      "attack": "assets/enemies/NewEnemy-Attack.png",
      "hurt": "assets/enemies/NewEnemy-Hurt.png",
      "death": "assets/enemies/NewEnemy-Death.png"
    }
  }
}
```

### Adjusting Battle Difficulty

In `js/battleManager.js`, modify the damage calculations:

```javascript
// Line ~80: Player attack damage
const baseDamage = this.hero.attack + Math.floor(Math.random() * 5);

// Line ~140: Enemy attack damage  
const damage = this.enemy.attack + Math.floor(Math.random() * 3);
```

### Changing Gauge Fill Rates

In `js/battleManager.js`:

```javascript
// Line ~85: Attack gauge fill rate
this.hero.attackGauge = Math.min(100, this.hero.attackGauge + 10);

// Line ~108: Defense gauge fill rate
this.hero.defenseGauge = Math.min(100, this.hero.defenseGauge + 20);
```

### Modifying Item Costs

In the main `index.html` gameState initialization (around line 2751):

```javascript
battleInventory: {
    fireball: 0,    // Starting fireballs
    health_potion: 0 // Starting potions
}
```

## Integrating with Task Completion

To trigger battles when tasks are completed, add this to your task completion function:

```javascript
function completeTask(taskIndex) {
    // ... existing task completion code ...
    
    // Random battle encounter (10% chance)
    if (Math.random() < 0.1) {
        const heroData = {
            hp: gameState.health,
            maxHP: 100,
            attack: 10 + gameState.jerryLevel * 2,
            defense: 5 + gameState.jerryLevel,
            attackGauge: 0,
            defenseGauge: 0
        };
        
        const enemyData = createRandomEnemy(gameState.jerryLevel);
        battleManager.startBattle(heroData, enemyData);
    }
}
```

## Troubleshooting

### Battle Button Not Working

Check the browser console (F12) for errors. Ensure:
- All JavaScript files are loaded
- `battleManager` is initialized
- No 404 errors for asset files

### Sprites Not Displaying

Verify:
- Image files exist in correct directories
- File names match exactly (case-sensitive)
- Image paths in CSS are correct

### Animations Not Smooth

Ensure:
- Browser supports CSS animations
- Hardware acceleration is enabled
- No other heavy processes running

## Browser Console Commands

For debugging, use these console commands:

```javascript
// Check if battle manager exists
console.log(window.battleManager);

// Start a test battle manually
startTestBattle();

// Check game state
console.log(gameState);

// Add battle items for testing
gameState.battleInventory.fireball = 5;
gameState.battleInventory.health_potion = 3;
```

## Performance Tips

For better performance:

1. **Preload Assets**: Ensure all images are loaded before starting battle
2. **Limit Animations**: Reduce simultaneous animations on low-end devices
3. **Optimize Sprites**: Use compressed PNG files for faster loading
4. **Cache Assets**: Enable browser caching for sprite sheets

## Next Steps

After verifying the battle system works:

1. **Add More Enemies**: Create diverse enemy types with unique abilities
2. **Implement Shop**: Allow players to purchase battle items
3. **Add Rewards**: Give XP and items for winning battles
4. **Create Boss Battles**: Design special encounters with unique mechanics
5. **Add Sound Effects**: Enhance the experience with audio

## Support

For issues or questions:

1. Check the `BATTLE_SYSTEM_README.md` for detailed documentation
2. Review the browser console for error messages
3. Verify all files are properly extracted and paths are correct
4. Test in a different browser to rule out compatibility issues

## Key Features Summary

✅ **Pink Monster Hero Animations** - 4-frame sprite animations  
✅ **Gauge System** - Attack and Defense gauges with visual feedback  
✅ **Multiple Actions** - Attack, Defend, Fireball, Potion, Flee  
✅ **Enemy System** - Extensible enemy types with custom stats  
✅ **Projectile Animations** - Fireball with explosion effects  
✅ **Battle Log** - Real-time battle event tracking  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **State Machine** - Robust battle flow management  

Enjoy your rebuilt battle system! 🎮⚔️

