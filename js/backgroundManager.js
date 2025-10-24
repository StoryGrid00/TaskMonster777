// backgroundManager.js - Manages time-based background switching

(function() {
  'use strict';
  
  const backgrounds = {
    day: 'assets/backgrounds/default-bg.png',
    night: 'assets/backgrounds/mountain-dusk.png'
  };
  
  function isNightTime() {
    const hour = new Date().getHours();
    // Consider night time as 6 PM (18:00) to 6 AM (6:00)
    return hour >= 18 || hour < 6;
  }
  
  function updateBackground() {
    const isNight = isNightTime();
    const backgroundUrl = isNight ? backgrounds.night : backgrounds.day;
    
    // Update pet-rock-header background
    const petRockHeader = document.querySelector('.pet-rock-header');
    if (petRockHeader) {
      // Use setProperty with !important to override inline styles
      petRockHeader.style.setProperty('background-image', `url('${backgroundUrl}')`, 'important');
      petRockHeader.style.setProperty('background-size', 'cover', 'important');
      petRockHeader.style.setProperty('background-position', 'center', 'important');
      
      // Add or remove dimming overlay for night mode
      let overlay = petRockHeader.querySelector('.night-overlay');
      if (isNight) {
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'night-overlay';
          overlay.style.cssText = 'position: absolute; inset: 0; background: rgba(0, 0, 0, 0.3); border-radius: 16px; pointer-events: none; z-index: 1;';
          petRockHeader.insertBefore(overlay, petRockHeader.firstChild);
        }
      } else {
        if (overlay) {
          overlay.remove();
        }
      }
      
      console.log(`[BackgroundManager] Pet rock background updated to ${isNight ? 'night' : 'day'} mode (${backgroundUrl})`);
    } else {
      console.warn('[BackgroundManager] Pet rock header not found, retrying...');
      // Retry after a short delay if element not found yet
      setTimeout(updateBackground, 100);
    }
  }
  
  function init() {
    console.log('[BackgroundManager] Initializing...');
    
    // Wait for DOM to be fully loaded, then set initial background
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateBackground, 500);
      });
    } else {
      // Use a longer delay to ensure inline styles are applied first
      setTimeout(updateBackground, 500);
    }
    
    // Update background every minute to catch time changes
    setInterval(updateBackground, 60000);
  }
  
  // Initialize immediately
  init();
})();

