# Task Monsters - Battle System Rebuild Documentation

## Overview

This document describes the complete rebuild of the Task Monsters battle system according to the provided specifications. The battle system has been redesigned with new animations, improved UI, gauge mechanics, and a comprehensive battle management system.

## Key Features Implemented

### 1. New Hero Animations

The battle system now uses the **Pink Monster** sprite sheets with 4-frame animations:

- **Idle Animation**: `Pink_Monster_Idle_4.png` - Continuous looping idle state
- **Attack Animation**: `Pink_Monster_Attack1_4.png` - Attack action animation
- **Hurt Animation**: `Pink_Monster_Hurt_4.png` - Damage taken animation
- **Death Animation**: `Pink_Monster_Death_8.png` - Defeat animation (if available)

All animations are rendered at 4x scale with pixelated rendering for retro aesthetic.

### 2. Battle Arena UI

The battle arena features a full-screen overlay with the following components:

- **Hero and Enemy Sprites**: Displayed side-by-side with "VS" text between them
- **HP Bars**: Visual health indicators for both combatants showing current/max HP
- **Gauge System**: Attack and Defense gauges that fill up during battle
- **Action Buttons**: Attack, Defend, Fireball, Potion, and Flee options
- **Battle Log**: Scrollable text log showing all battle events
- **Projectile System**: Animated fireball projectiles and explosion effects

### 3. Battle Mechanics

#### Gauge System

The battle system implements two gauges that fill during combat:

- **Attack Gauge**: Fills by 10 points per attack action (max 100)
  - At 100 points, unlocks special attacks
  - Displayed with orange/yellow gradient
  
- **Defense Gauge**: Fills by 20 points per defend action (max 100)
  - At 100 points, provides damage reduction
  - Displayed with purple gradient

#### Combat Actions

**Attack**: Standard attack dealing base damage plus attack stat. Fills attack gauge by 10 points. Costs 1 attack charge (starts with 10).

**Defend**: Reduces incoming damage and fills defense gauge by 20 points. Costs 1 defense charge (starts with 20).

**Fireball**: Special ranged attack with animated projectile and explosion. Requires fireball items from inventory. Deals 30 base damage.

**Potion**: Heals the hero for 30 HP. Requires health potion items from inventory.

**Flee**: Attempt to escape from battle. Success rate depends on hero level vs enemy level.

### 4. Enemy System

The enemy system supports multiple enemy types with different stats and behaviors:

- **Bat**: Flying enemy with moderate HP and attack
- **Ghost**: Ethereal enemy with special abilities
- **Custom Enemies**: Extensible system for adding new enemy types

Enemy data is loaded from `assets/enemies/enemy-data.json` with sprite animations for idle, attack, hurt, and death states.

### 5. Battle State Machine

The battle manager implements a state machine with the following states:

- **IDLE**: No battle in progress
- **PLAYER_TURN**: Waiting for player action
- **ENEMY_TURN**: Enemy is taking their turn
- **BATTLE_END**: Battle has concluded (victory or defeat)

### 6. Inventory Integration

The battle system integrates with the game's inventory system:

- **Battle Inventory**: Separate inventory for battle items (fireballs, potions)
- **Item Counts**: Displayed on action buttons showing available uses
- **Item Management**: Items are consumed when used in battle
- **Shop System**: Framework for purchasing battle items with task points

### 7. Animations and Visual Effects

#### Sprite Animations

All sprite animations use CSS keyframe animations with step timing:

- **Idle**: 0.8s loop with 4 frames
- **Attack**: 0.5s single play with 4 frames
- **Hurt**: 0.4s single play with 4 frames
- **Death**: 1.0s single play with 8 frames

#### Projectile System

The fireball projectile system includes:

- **Launch Animation**: Fireball travels from hero to enemy position
- **Explosion Effect**: Multi-frame explosion animation on impact
- **Timing**: Coordinated with damage application

### 8. Responsive Design

The battle arena is fully responsive with mobile-friendly layouts:

- **Desktop**: Side-by-side sprite layout with horizontal gauges
- **Mobile**: Vertical stack layout with full-width action buttons
- **Touch-Friendly**: Large button targets for mobile devices

## File Structure

```
TaskMonsters_Rebuilt/
├── index.html                          # Main HTML with battle arena markup
├── css/
│   └── battle.css                      # Battle system styles
├── js/
│   ├── enemy.js                        # Enemy class and data management
│   ├── battleUI.js                     # UI update and animation functions
│   ├── battleManager.js                # Core battle logic and state machine
│   └── battleInit.js                   # Initialization and test functions
└── assets/
    ├── heroes/
    │   ├── Pink_Monster_Idle_4.png     # Hero idle animation
    │   ├── Pink_Monster_Attack1_4.png  # Hero attack animation
    │   └── Pink_Monster_Hurt_4.png     # Hero hurt animation
    ├── enemies/
    │   ├── Bat-IdleFly.png             # Enemy sprites
    │   ├── Bat-Attack1.png
    │   └── enemy-data.json             # Enemy configuration
    └── battle-items/
        ├── fireball1.png               # Fireball projectile frames
        ├── fireball2.png
        ├── fireball3.png
        └── bomb-explosion*.png         # Explosion effect frames
```

## Integration with Main Game

### Starting a Battle

To start a battle from the main game, call the `startTestBattle()` function or use the battle manager directly:

```javascript
// Create hero data from game state
const heroData = {
    hp: gameState.health,
    maxHP: 100,
    attack: 10 + gameState.jerryLevel * 2,
    defense: 5 + gameState.jerryLevel,
    attackGauge: 0,
    defenseGauge: 0
};

// Create or select an enemy
const enemyData = createRandomEnemy(gameState.jerryLevel);

// Start the battle
battleManager.startBattle(heroData, enemyData);
```

### Battle Rewards

When a battle is won, the system provides:

- **XP Gain**: Based on enemy level and difficulty
- **Item Drops**: Random chance for battle items
- **Task Points**: Currency for purchasing items

### Battle Penalties

When a battle is lost:

- **Health Loss**: Hero health is reduced
- **Gauge Reset**: Attack and defense gauges are reset
- **Return to Main**: Player returns to main game interface

## Testing the Battle System

A test button has been added to the main interface labeled "⚔️ Start Battle (Test)". This button:

1. Creates a test hero with current game stats
2. Generates a random enemy appropriate for the hero's level
3. Starts the battle sequence
4. Allows full testing of all battle mechanics

## Future Enhancements

The battle system is designed to be extensible for future features:

- **Multiple Enemy Encounters**: Battle against multiple enemies
- **Boss Battles**: Special encounters with unique mechanics
- **Battle Shop**: In-battle item purchasing system
- **Status Effects**: Buffs, debuffs, and special conditions
- **Combo System**: Chain attacks for bonus damage
- **Achievement Integration**: Battle-specific achievements
- **Leaderboards**: Battle statistics and rankings

## Technical Notes

### Performance Considerations

- Sprite animations use CSS transforms for hardware acceleration
- Battle state updates are throttled to prevent excessive DOM manipulation
- Asset preloading ensures smooth animation playback

### Browser Compatibility

The battle system is compatible with:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Known Limitations

- Enemy sprite sheets must follow the naming convention: `[Name]-[Action].png`
- Animation frame counts are fixed (4 frames for most, 8 for death)
- Projectile animations are limited to 3 frames
- Battle arena requires JavaScript enabled

## Troubleshooting

### Battle Won't Start

- Check browser console for error messages
- Verify battleManager is initialized: `console.log(window.battleManager)`
- Ensure all asset files are properly loaded

### Animations Not Playing

- Verify sprite sheet file paths in CSS
- Check that images are in correct format (PNG)
- Confirm image-rendering: pixelated is supported by browser

### Gauges Not Filling

- Check that action buttons are properly triggering battle actions
- Verify gauge update functions are being called
- Inspect gauge fill width calculations in battleUI.js

## Credits

**Battle System Design**: Based on provided prompt specifications

**Hero Sprites**: Pink Monster sprite sheets (provided)

**Enemy Sprites**: Bat and Ghost sprites from original TaskMonsters assets

**Battle Items**: Fireball and explosion sprites from original assets

## Version History

**v1.0.0** (October 2025)
- Initial battle system rebuild
- Pink Monster hero animations integrated
- Full gauge system implementation
- Projectile and explosion effects
- Mobile-responsive battle arena
- State machine battle management

