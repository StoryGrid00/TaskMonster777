/**
 * Jerry Dialogue System
 * Manages speech bubble interactions for Jerry the Rock
 */

// Dialogue phrase collections
const DIALOGUE_PHRASES = {
  // 20 greeting messages for app startup
  greetings: [
    "Hey there! Ready to rock today? 🪨",
    "Welcome back, rockstar! Let's get things done! ⭐",
    "Good to see you! I'm pumped to help you succeed! 💪",
    "Hello! Time to turn your goals into achievements! 🎯",
    "Hey! Let's make today absolutely amazing! ✨",
    "Welcome! I'm here to keep you motivated! 🚀",
    "Hi there! Ready to crush those tasks? 💥",
    "Good day! Let's build some momentum together! ⚡",
    "Hello, friend! Time to make progress happen! 📈",
    "Hey! Your success story starts right here! 📖",
    "Welcome back! Let's turn plans into action! 🎬",
    "Hi! Ready to level up your productivity? 📊",
    "Hello! I believe in your ability to succeed! 🌟",
    "Hey there! Let's make every moment count! ⏰",
    "Welcome! Time to transform ideas into reality! 💡",
    "Hi! Your potential is unlimited - let's unlock it! 🔓",
    "Hello! Ready to make today your masterpiece? 🎨",
    "Hey! Let's turn challenges into victories! 🏆",
    "Welcome back! Time to show the world what you can do! 🌍",
    "Hi there! Let's make progress one task at a time! 📝"
  ],

  // 60+ motivational phrases for task completion
  motivational: [
    "Fantastic work! You're on fire! 🔥",
    "Amazing! Keep that momentum going! 🚀",
    "Brilliant! You're crushing it today! 💪",
    "Outstanding! Every step counts! 👏",
    "Excellent! You're making real progress! 📈",
    "Superb! Your dedication is inspiring! ⭐",
    "Wonderful! You're building great habits! 🏗️",
    "Incredible! Success looks good on you! 😎",
    "Awesome! You're unstoppable! 🌟",
    "Perfect! Keep up the excellent work! ✨",
    "Marvelous! You're achieving greatness! 🏆",
    "Spectacular! Your effort is paying off! 💎",
    "Phenomenal! You're making it happen! ⚡",
    "Remarkable! Every task brings you closer! 🎯",
    "Impressive! You're building momentum! 🌊",
    "Stellar! Your consistency is powerful! 💫",
    "Magnificent! You're on the right path! 🛤️",
    "Exceptional! Progress feels amazing! 🎉",
    "Brilliant! You're turning dreams into reality! 💭",
    "Outstanding! Your future self will thank you! 🙏",
    "Fantastic! Small steps lead to big wins! 👣",
    "Amazing! You're proving what's possible! 🌈",
    "Superb! Your determination is unmatched! 🔥",
    "Excellent! You're writing your success story! 📚",
    "Wonderful! Every completion is a victory! 🥇",
    "Incredible! You're building something special! 🏰",
    "Awesome! Your progress is undeniable! 📊",
    "Perfect! You're making the impossible possible! ✨",
    "Marvelous! Your effort creates magic! 🪄",
    "Spectacular! You're exceeding expectations! 📈",
    "Phenomenal! Success is your natural state! 🌟",
    "Remarkable! You're inspiring yourself! 💡",
    "Impressive! Your dedication is beautiful! 🌺",
    "Stellar! You're creating positive change! 🔄",
    "Magnificent! Your journey is extraordinary! 🗺️",
    "Exceptional! You're proof that effort works! 💪",
    "Brilliant! Your consistency compounds! 📈",
    "Outstanding! You're building your empire! 🏛️",
    "Fantastic! Your potential is unlimited! ♾️",
    "Amazing! You're making the ordinary extraordinary! ✨",
    "Superb! Your progress speaks volumes! 📢",
    "Excellent! You're creating your own luck! 🍀",
    "Wonderful! Your momentum is unstoppable! 🚄",
    "Incredible! You're turning vision into reality! 👁️",
    "Awesome! Your effort echoes in eternity! ⏳",
    "Perfect! You're mastering the art of progress! 🎨",
    "Marvelous! Your dedication is your superpower! 🦸",
    "Spectacular! You're building bridges to success! 🌉",
    "Phenomenal! Your journey inspires greatness! 🌄",
    "Remarkable! You're creating ripples of excellence! 🌊",
    "Impressive! Your focus is your fortune! 💰",
    "Stellar! You're painting your masterpiece! 🖼️",
    "Magnificent! Your persistence pays dividends! 💵",
    "Exceptional! You're architecting your future! 🏗️",
    "Brilliant! Your effort is an investment! 📈",
    "Outstanding! You're cultivating success! 🌱",
    "Fantastic! Your progress is poetry in motion! 📝",
    "Amazing! You're conducting a symphony of success! 🎼",
    "Superb! Your determination defies limits! 🚀",
    "Excellent! You're scripting your victory! 📜",
    "Wonderful! Your consistency is your crown! 👑"
  ],

  // Theme switching responses
  themeSwitch: [
    "Nice! I love the new look! 🎨",
    "Ooh, stylish choice! Looking good! ✨",
    "Perfect! This theme suits you! 👌",
    "Great switch! I'm adapting too! 🔄",
    "Awesome! Fresh vibes, fresh energy! 🌟"
  ],

  // Etsy shop sharing responses
  etsyShare: [
    "Thanks for sharing! You're amazing! 🛍️",
    "Awesome! Spreading the rock love! 💕",
    "You're the best! Thanks for the support! 🙌",
    "Fantastic! You're helping others discover us! 🌟",
    "Incredible! Your support means everything! 💎"
  ],

  // Notification enabling responses
  notifications: [
    "Perfect! Now I can remind you to stay awesome! 🔔",
    "Great choice! I'll help keep you on track! ⏰",
    "Excellent! Together we'll never miss a beat! 🎵",
    "Wonderful! I'm here to support your success! 📱",
    "Amazing! Let's make every notification count! ✨"
  ],

  // Quick task completion responses
  quickTask: [
    "Quick and efficient! You're a productivity master! ⚡",
    "Boom! That was lightning fast! ⚡",
    "Speedy! You make it look easy! 🏃‍♂️",
    "Swift action! I'm impressed! 💨",
    "Rapid fire! You're on a roll! 🔥",
    "Quick win! Building momentum! 🚀",
    "Fast and focused! Perfect execution! 🎯",
    "Zippy! You're in the zone! ⚡",
    "Snappy work! Keep it flowing! 🌊",
    "Quick strike! Efficiency at its finest! ⚡"
  ],

  // Random encouraging phrases for variety
  encouragement: [
    "You've got this! I believe in you! 💪",
    "Every step forward is progress! 👣",
    "Your effort today shapes tomorrow! 🌅",
    "Small actions create big changes! 🔄",
    "You're stronger than you think! 💪",
    "Progress, not perfection! 📈",
    "Your journey is uniquely yours! 🛤️",
    "Consistency beats intensity! 🔄",
    "You're building something beautiful! 🏗️",
    "Trust the process! 🌱"
  ]
};

/* === Fun Facts dataset loader === */
window.FUN_FACTS = [];
window.__funFactsUsed = [];

(function loadFunFacts(){
  try {
    fetch('assets/data/fun_facts.json')
      .then(r => r.json())
      .then(arr => { if (Array.isArray(arr)) window.FUN_FACTS = arr; })
      .catch(()=>{});
  } catch(e){ /* no-op */ }
})();

function getRandomFunFact(){
  const facts = Array.isArray(window.FUN_FACTS) ? window.FUN_FACTS : [];
  if (!facts.length) return null;
  // Avoid immediate repeats
  const used = window.__funFactsUsed || [];
  if (used.length >= Math.floor(facts.length * 0.7)) window.__funFactsUsed = [];
  const pool = facts.filter(f => !used.includes(f.id));
  const pick = (pool.length ? pool : facts)[Math.floor(Math.random()* (pool.length ? pool.length : facts.length))];
  window.__funFactsUsed.push(pick.id);
  return (pick.category ? (`${pick.category}: ${pick.fact}`) : pick.fact);
}



// Dialogue state management
let currentDialogueTimeout = null;
let lastUsedPhrases = {
  greetings: [],
  motivational: [],
  themeSwitch: [],
  etsyShare: [],
  notifications: [],
  quickTask: [],
  encouragement: []
};

/**
 * Get a random phrase from a category, avoiding recent repeats
 */
function getRandomPhrase(category) {
  const phrases = DIALOGUE_PHRASES[category];
  if (!phrases || phrases.length === 0) return "Hey there! 👋";
  
  const used = lastUsedPhrases[category] || [];
  
  // If we've used most phrases, reset the used list
  if (used.length >= phrases.length * 0.7) {
    lastUsedPhrases[category] = [];
  }
  
  // Get unused phrases
  const unused = phrases.filter(phrase => !used.includes(phrase));
  const availablePhrases = unused.length > 0 ? unused : phrases;
  
  // Select random phrase
  const randomIndex = Math.floor(Math.random() * availablePhrases.length);
  const selectedPhrase = availablePhrases[randomIndex];
  
  // Track usage
  if (!lastUsedPhrases[category]) lastUsedPhrases[category] = [];
  lastUsedPhrases[category].push(selectedPhrase);
  
  return selectedPhrase;
}

/**
 * Show dialogue bubble with specified message
 */
function showDialogue(message, duration = 13000) {
  const dialogueContainer = document.getElementById('jerryDialogueContainer');
  const dialogueText = document.getElementById('jerryDialogueText');
  
  if (!dialogueContainer || !dialogueText) {
    console.warn('Dialogue elements not found');
    return;
  }
  
  // Clear any existing timeout
  if (currentDialogueTimeout) {
    clearTimeout(currentDialogueTimeout);
  }
  
  // Set the message
  dialogueText.textContent = message;
  
  // Show the dialogue
  dialogueContainer.style.display = 'block';
  dialogueContainer.classList.remove('dialogue-hide');
  dialogueContainer.classList.add('dialogue-show');
  
  // Auto-hide after duration
  currentDialogueTimeout = setTimeout(() => {
    hideDialogue();
  }, duration);
}

/**
 * Hide dialogue bubble
 */
function hideDialogue() {
  const dialogueContainer = document.getElementById('jerryDialogueContainer');
  
  if (!dialogueContainer) return;
  
  dialogueContainer.classList.remove('dialogue-show');
  dialogueContainer.classList.add('dialogue-hide');
  
  // Hide completely after animation
  setTimeout(() => {
    dialogueContainer.style.display = 'none';
    dialogueContainer.classList.remove('dialogue-hide');
  }, 300);
  
  if (currentDialogueTimeout) {
    clearTimeout(currentDialogueTimeout);
    currentDialogueTimeout = null;
  }
}

/**
 * Trigger dialogue based on action type
 */
function triggerDialogue(action, customMessage = null) {
  let message;
  
  if (customMessage) {
    message = customMessage;
  } else {
    switch (action) {
      case 'greeting':
        message = getRandomPhrase('greetings');
        break;
      case 'taskComplete':
        message = getRandomPhrase('motivational');
        break;
      case 'quickTaskComplete':
        message = getRandomPhrase('quickTask');
        break;
      case 'themeSwitch':
        message = getRandomPhrase('themeSwitch');
        break;
      case 'etsyShare':
        message = getRandomPhrase('etsyShare');
        break;
      case 'notifications':
        message = getRandomPhrase('notifications');
        break;
      case 'encouragement':
        message = getRandomPhrase('encouragement');
        break;
      default:
        message = getRandomPhrase('encouragement');
    }
  }
  
  showDialogue(message);
}

// Export functions for global use
window.JerryDialogue = {
  show: showDialogue,
  hide: hideDialogue,
  trigger: triggerDialogue,
  getRandomPhrase: getRandomPhrase
};


// Test function for speech bubbles - can be called from browser console
window.testSpeechBubbles = function() {
  console.log('Testing speech bubbles...');
  
  // Test short message
  setTimeout(() => {
    triggerDialogue('greeting');
  }, 500);
  
  // Test medium message
  setTimeout(() => {
    triggerDialogue('taskComplete');
  }, 4000);
  
  // Test long message
  setTimeout(() => {
    showDialogue('This is a very long message to test how the speech bubble handles extensive text content. It should wrap properly and show scrollbars if needed. The bubble should expand to accommodate the text while maintaining its modern appearance and responsive design. 🚀✨💪', 8000);
  }, 8000);
  
  // Test short message again
  setTimeout(() => {
    showDialogue('Quick test! 👋', 3000);
  }, 17000);
  
  console.log('Speech bubble test sequence started. Watch Jerry!');
};

// Auto-trigger greeting on page load for testing
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    if (window.JerryDialogue) {
      window.JerryDialogue.trigger('greeting');
    }
  }, 2000);
});

/* === Periodic Dialogue (every 5 minutes) === */
(function setupPeriodicDialogue(){
  const FIVE_MINUTES = 5 * 60 * 1000;

  function isBubbleActive(){
    const c = document.getElementById('jerryDialogueContainer');
    return !!(c && c.style.display !== 'none' && c.classList.contains('dialogue-show'));
  }

  function tick(){
    if (!window.JerryDialogue) return;
    // Don't interrupt an active bubble
    if (isBubbleActive()) return;
    const pool = ['motivational', 'encouragement'];
    const cat = pool[Math.floor(Math.random() * pool.length)];
    try {
      const msg = window.JerryDialogue.getRandomPhrase(cat);
      window.JerryDialogue.show(msg, 13000);
    } catch (e) {
      // no-op
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    setInterval(tick, FIVE_MINUTES);
  });
})();
