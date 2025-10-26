# Task Monsters - RPG Productivity Game

## 🎮 About

Task Monsters is an engaging RPG-style productivity game featuring a task monster as your virtual companion. Complete tasks, earn XP, unlock achievements, and watch your monster grow stronger!

## ✨ Features

### Core Functionality
- ✅ **30 Tiered Achievements** (Starter 💚, Intermediate 💙, Advanced 💛)
- ✅ **Modern Date Picker** with calendar interface and time selection
- ✅ **Dynamic Energy System** - Energy decreases based on pending/overdue tasks
- ✅ **Fixed Stats** - Attack and Defense remain at 100
- ✅ **Random Completion Messages** - 35+ unique success messages
- ✅ **No-Repeat Dialogue** - 75+ unique creature messages that never repeat consecutively
- ✅ **Task Management** - Regular tasks and quick tasks
- ✅ **Daily Challenges** - Complete challenges for bonus rewards
- ✅ **Inventory System** - Collect and equip items
- ✅ **Character Customization** - Customize your monster's appearance
- ✅ **XP & Leveling** - Gain experience and level up
- ✅ **Streak Tracking** - Build streaks for bonus multipliers

### UI/UX
- ✅ Beautiful mountain dusk background
- ✅ Animated pixel art character
- ✅ RPG-style stat gauges (Energy, Attack, Defense)
- ✅ Collapsible sections for clean organization
- ✅ Modern glassmorphism design
- ✅ Responsive layout for mobile and desktop
- ✅ 3-second loading screen with Task Monsters logo
- ✅ PWA support for mobile installation

## 📁 File Structure

```
taskmonsters_source/
├── index.html              # Main application file (all-in-one)
├── manifest.json           # PWA manifest
├── assets/
│   ├── backgrounds/        # Background images
│   │   ├── default-bg.png
│   │   └── mountain-dusk.png
│   ├── heroes/             # Character sprites
│   │   ├── hero-idle.png
│   │   ├── hero-attack.png
│   │   ├── hero-celebrate.png
│   │   └── ... (more sprites)
│   ├── enemies/            # Enemy sprites
│   │   ├── bat-idle.png
│   │   ├── ghost-idle.png
│   │   └── ...
│   ├── logo/               # Branding assets
│   │   ├── favicon.png     # Browser tab icon & PWA icon
│   │   └── loading-screen.png  # Loading screen logo
│   └── css/                # Additional stylesheets
│       ├── speech-bubble.css
│       └── tr-onboarding.css
├── css/
│   └── dark-theme.css      # Dark theme styles
├── js/
│   ├── main.js             # Main JavaScript logic
│   ├── uiManager.js        # UI management
│   ├── hero.js             # Character logic
│   ├── backgroundManager.js # Background handling
│   └── assetLoader.js      # Asset loading
└── TR/                     # Shop module files
    ├── shop.js
    ├── shop.css
    └── ...
```

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local Server (Recommended)
For best experience, run a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then open: http://localhost:8000
```

### Option 3: Deploy to Web
Upload the entire `taskmonsters_source` folder to your web hosting service.

## 📱 PWA Installation

Task Monsters can be installed as a Progressive Web App:

1. Open the app in a supported browser
2. Look for the "Install" or "Add to Home Screen" option
3. Follow the prompts to install
4. Launch from your home screen like a native app!

## 🎯 How to Use

### Creating Tasks
1. Click the **+ Add** button in the "Your Tasks" section
2. Fill in task details:
   - Title (required)
   - Description (optional)
   - Category (Work, Learning, Home, etc.)
   - Difficulty (Easy, Medium, Hard)
   - Priority (Low, Medium, High)
   - Due Date (optional) - Use the modern date picker
3. Click **Create Task**

### Quick Tasks
1. Click **+ Add** in the "Quick Tasks" section
2. Select from pre-defined quick tasks
3. Complete them quickly for instant rewards!

### Completing Tasks
- Click the ✓ button on any task to mark it complete
- Earn points, XP, and watch your creature celebrate!
- Build streaks for bonus multipliers

### Achievements
- Click the **Achievements** tab to view all 30 achievements
- Achievements unlock automatically as you progress
- Watch for the celebration sequence when unlocking!

### Energy System
- Energy decreases when you have pending/overdue tasks
- The more overdue a task, the more energy drains
- Complete tasks to restore energy
- Energy is checked every 60 seconds automatically

## 🎨 Customization

### Backgrounds
- Default: Mountain dusk scene
- More backgrounds can be added to `assets/backgrounds/`

### Character Sprites
- Current: Pink monster with various animations
- Sprites located in `assets/heroes/`
- Supports: idle, attack, celebrate, hurt animations

### Themes
- Dark theme (default)
- Modify `css/dark-theme.css` for custom colors

## 🔧 Technical Details

### Technologies
- **HTML5** - Structure
- **CSS3** - Styling with modern features (glassmorphism, gradients)
- **Vanilla JavaScript** - No frameworks required
- **LocalStorage** - Data persistence
- **Canvas API** - Confetti effects
- **PWA** - Offline support and installability

### Browser Support
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Data Storage
All game data is stored locally in your browser using LocalStorage:
- Tasks and completion history
- Character level and XP
- Achievement progress
- Inventory and equipped items
- Streak data

## 📊 Achievement System

### Starter Tier (💚)
10 beginner-friendly achievements to get you started

### Intermediate Tier (💙)
10 moderate challenges for consistent users

### Advanced Tier (💛)
10 epic long-term goals for dedicated users

## 💬 Dialogue System

The creature has 150+ unique dialogue messages:
- **Idle dialogue** - Periodic messages based on your level
- **Task completion** - Context-aware messages based on category and time
- **Level up** - Special messages when you level up
- **Fun facts** - Random interesting facts
- **No repeats** - Intelligent system prevents consecutive duplicates

## 🎉 Celebration Effects

When you complete tasks or unlock achievements:
- ✨ Confetti animation
- 💬 Creature speech bubble
- 🏆 Achievement popup (for unlocks)
- 📊 XP and points display
- 🔥 Streak multiplier indicator

## 📝 Updates & Changelog

### Latest Version Features
- 30 tiered achievements system
- Modern date picker with calendar UI
- Dynamic energy system based on task due dates
- 75+ unique no-repeat dialogue messages
- 35+ random completion messages
- Fixed Attack & Defense stats at 100
- New Task Monsters branding and logos
- 3-second loading screen
- Improved UI/UX

## 🐛 Known Issues

None currently! If you encounter any issues, please report them.

## 📄 License

This project is for personal use. All rights reserved.

## 🙏 Credits

- **Game Design & Development**: Task Monsters Team
- **Character Art**: Pixel art sprites
- **Background Art**: Mountain dusk scene
- **Logo Design**: Task Monsters branding

---

**Enjoy your productivity journey with Task Monsters!** 🐭✨

Start completing tasks and watch your monster grow stronger! 💪

