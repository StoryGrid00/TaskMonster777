# ⚠️ IMPORTANT SETUP INSTRUCTIONS

## Why You Need a Web Server

**DO NOT open `index.html` directly by double-clicking!** This causes:
- ❌ CORS errors (Cross-Origin Resource Sharing)
- ❌ LocalStorage timing issues
- ❌ Onboarding not displaying
- ❌ JavaScript features breaking

## ✅ Correct Way to Run

### Option 1: Python (Easiest)
```bash
cd task-monsters-enhanced
python3 -m http.server 8000
```
Then open: **http://localhost:8000**

### Option 2: Node.js
```bash
cd task-monsters-enhanced
npx http-server -p 8000
```
Then open: **http://localhost:8000**

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🧪 Testing Onboarding

To test the "Choose Your Monster" screen:

1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Refresh the page
4. You should see:
   - Loading screen (3 seconds)
   - "Choose Your Monster" page

## 📊 Console Logs

The app logs helpful debug information:
```
Checking onboarding status. hasChosenMonster: null
Onboarding needed. Waiting for page load...
Attempting to show onboarding...
Onboarding overlay displayed!
```

If you don't see these logs, the script might not be running correctly.

## 🐛 Troubleshooting

### "Onboarding still not showing!"
1. Confirm you're using a web server (URL should be `http://localhost:8000`)
2. Clear localStorage: `localStorage.clear()`
3. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
4. Check console for errors

### "Wrong monster in battle!"
- This is now fixed! The battle sprite uses your selected monster.
- If still wrong, try resetting the app in Settings.

### "CORS errors in console"
- You're opening from `file:///` - use a web server instead!

## ✅ What's Fixed

1. ✅ Battle sprites now use selected monster (not always Pink)
2. ✅ Onboarding has better logging and timing
3. ✅ Daily challenges validate correctly
4. ✅ All sprites throughout app use selected monster

## 🎮 Enjoy!

Once you're running through a web server, everything should work perfectly!

