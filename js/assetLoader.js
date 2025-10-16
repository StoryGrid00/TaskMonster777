// assetLoader.js - Preload all images before game start
export async function preloadImages(paths) {
  const promises = paths.map(src => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      resolve(src); // Continue even if one image fails
    };
    img.src = src;
  }));
  
  await Promise.all(promises);
}

export async function preloadAllAssets() {
  const assetPaths = [
    // Hero sprites
    'assets/heroes/hero-idle.png',
    'assets/heroes/hero-attack.png',
    'assets/heroes/hero-hurt.png',
    'assets/heroes/hero-celebrate.png',
    
    // Enemy sprites
    'assets/enemies/ghost-idle.png',
    'assets/enemies/ghost-attack.png',
    'assets/enemies/bat-idle.png',
    'assets/enemies/bat-attack.png',
    
    // Background
    'assets/backgrounds/default-bg.png',
    'assets/backgrounds/mountain-dusk.png',
    
    // Logo
    'assets/logo/new-logo.png'
  ];
  
  try {
    await preloadImages(assetPaths);
    console.log('All assets loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading assets:', error);
    return false;
  }
}

