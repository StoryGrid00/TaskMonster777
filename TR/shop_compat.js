/*! Task Rock - Rock Shop compatibility tagger (non-destructive) */
(function(){
  function byText(root, regex) {
    const walker = document.createTreeWalker(root||document.body, NodeFilter.SHOW_ELEMENT, null);
    const matches = [];
    let node;
    while ((node = walker.nextNode())) {
      const t = (node.textContent||"").trim();
      if (!t) continue;
      if (regex.test(t)) matches.push(node);
    }
    return matches;
  }
  function closestCard(el){
    return el.closest('[role="button"], .card, .shop-card, .grid > *, [class*="card"], [class*="tile"], [class*="item"]') || el;
  }

  function ensureRockWrapper(){
    // If no known wrapper, try to find a central rock image/container and mark it
    var wrapper = document.querySelector('[data-pet-rock], #petRockWrapper, .creature-container');
    if (wrapper) return;
    var candidates = Array.from(document.querySelectorAll('[id*="rock" i], [class*="rock" i], img[src*="rock" i]'));
    if (candidates.length) {
      var el = candidates[0];
      var host = el.closest('[class], [id]') || el.parentElement || el;
      host.setAttribute('data-pet-rock','');
    }
  }

  function markItems(){
    const map = [
      {rx:/\bBlue\s*Cap\b/i, id:'blue_hat', cost:50, slot:'hat'},
      {rx:/\bBlack\s*Top\s*Hat\b/i, id:'black_top_hat', cost:100, slot:'hat'},
      {rx:/\bMustache?\b/i, id:'mustache', cost:350, slot:'accessory'},
      {rx:/\bReading\s*Glasses\b/i, id:'reading_glasses', cost:300, slot:'accessory'},
      {rx:/\bBuddy\s*Paint\b/i, id:'buddy_paint', cost:200, slot:'paint'},
      {rx:/\bRock\s*Star\b/i, id:'rock_star', cost:400, slot:'paint'}
    ];
    const root = document.body;
    for (const m of map){
      const els = byText(root, m.rx);
      for (const el of els){
        const card = closestCard(el);
        if (!card.hasAttribute('data-item-id')){
          card.setAttribute('data-item-id', m.id);
          card.setAttribute('data-cost', String(m.cost));
          card.setAttribute('data-slot', m.slot);
          // Preserve existing accessibility
          if (!card.getAttribute('role')) card.setAttribute('role','button');
          // Do not change visuals or classes
        }
      }
    }
  }

  function init(){
    ensureRockWrapper();
    markItems();
    const mo = new MutationObserver(()=>markItems());
    mo.observe(document.body, {childList:true, subtree:true});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();