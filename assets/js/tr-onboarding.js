/**
 * assets/js/tr-onboarding.js
 * Onboarding modal for Task Rock — theme-aware, a11y, legacy migration, local-only.
 */
(function () {
  const STORAGE_KEY = "trUserProfile";
  const LEGACY_NAME = "tr_user_name";
  const LEGACY_DOB  = "tr_user_dob";

  function nowISO(){ try{return new Date().toISOString();}catch(_){return "";} }
  function parseISO(d){ const date=new Date(d); return isNaN(date.getTime())?null:date; }
  function validateName(name){
    if(!name) return {ok:false,msg:"First name is required."};
    const t=name.trim();
    if(t.length<2||t.length>30) return {ok:false,msg:"Name must be 2–30 characters."};
    const re=/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s\-\.\' ]{1,29}$/u;
    if(!re.test(t)) return {ok:false,msg:"Use letters and - . ' only."};
    return {ok:true,value:t};
  }
  function validateDOB(dobStr){
    if(!dobStr) return {ok:false,msg:"Date of birth is required."};
    const date=parseISO(dobStr); if(!date) return {ok:false,msg:"Enter a valid date."};
    const today=new Date();
    if(date.setHours(0,0,0,0)>today.setHours(0,0,0,0)) return {ok:false,msg:"DOB cannot be in the future."};
    const year=new Date(dobStr).getFullYear(); if(year<1900) return {ok:false,msg:"Enter a realistic year."};
    return {ok:true,value:dobStr};
  }
  function isTodayBirthday(dobISO){
    const d=parseISO(dobISO); if(!d) return false;
    const t=new Date(); return d.getDate()===t.getDate()&&d.getMonth()===t.getMonth();
  }
  function readProfile(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      const data=JSON.parse(raw)||{};
      const n=validateName(data.firstName||"");
      const d=validateDOB(data.dob||"");
      return (n.ok&&d.ok)?data:null;
    }catch(_){return null;}
  }
  function migrateLegacyIfAny(){
    const existing=readProfile(); if(existing) return existing;
    try{
      const legacyName=localStorage.getItem(LEGACY_NAME);
      const legacyDob =localStorage.getItem(LEGACY_DOB);
      if(!legacyName&&!legacyDob) return null;
      const n=validateName(legacyName||"");
      const d=validateDOB(legacyDob||"");
      if(n.ok&&d.ok){
        const profile={firstName:n.value,dob:d.value,createdAt:nowISO(),consentLocal:true};
        localStorage.setItem(STORAGE_KEY,JSON.stringify(profile));
        return profile;
      }
    }catch(_){}
    return null;
  }
  function saveProfile(profile){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent('tr:userProfileUpdated',{detail:profile}));
    }catch(err){console.error("Failed to save profile:",err);}
  }
  function getUserProfile(){ return readProfile()||migrateLegacyIfAny(); }

  // expose helpers
  window.TaskRockOnboarding = { isTodayBirthday, getUserProfile };

  function createModal(){
    const backdrop=document.createElement("div");
    backdrop.className="tr-onboarding__backdrop"; backdrop.setAttribute("data-open","false");
    const container=document.createElement("div");
    container.className="tr-onboarding__container";
    container.setAttribute("role","dialog"); container.setAttribute("aria-modal","true"); container.setAttribute("aria-hidden","true");
    const dialog=document.createElement("div"); dialog.className="tr-onboarding__dialog"; dialog.setAttribute("tabindex","-1");
    const titleId="tr-onboarding-title"; const descId="tr-onboarding-desc";
    container.setAttribute("aria-labelledby",titleId); container.setAttribute("aria-describedby",descId);
    dialog.innerHTML=`
      <h2 id="${titleId}" class="tr-onboarding__title">Let’s personalize your pet rock</h2>
      <p id="${descId}" class="tr-onboarding__intro">Tell us a bit about you.</p>
      <ul class="tr-onboarding__bullets">
        <li>We’ll greet you by name 😊</li>
        <li>We’ll wish you a happy birthday on your day 🎉</li>
      </ul>
      <p class="tr-onboarding__privacy">Your info stays on this device and is used only to personalize your pet rock.</p>
      <div class="tr-onboarding__field">
        <label class="tr-onboarding__label" for="tr-onb-first">First name</label>
        <input id="tr-onb-first" class="tr-onboarding__input" type="text" autocomplete="given-name" inputmode="text" required />
        <div id="tr-onb-first-error" class="tr-onboarding__error" aria-live="polite"></div>
      </div>
      <div class="tr-onboarding__field">
        <label class="tr-onboarding__label" for="tr-onb-dob">Date of birth</label>
        <input id="tr-onb-dob" class="tr-onboarding__input" type="date" required />
        <div id="tr-onb-dob-error" class="tr-onboarding__error" aria-live="polite"></div>
      </div>
      <div class="tr-onboarding__actions">
        <button type="button" class="btn btn-secondary" id="tr-onb-skip">Skip for now</button>
        <button type="button" class="btn btn-primary" id="tr-onb-save" disabled>Save &amp; Continue</button>
      </div>`;
    container.appendChild(dialog);
    return {backdrop,container,dialog};
  }

  let activeTrap=null;
  function trapFocus(container){
    const f=container.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
    const first=f[0], last=f[f.length-1];
    function onKey(e){
      if(e.key!=="Tab") return;
      if(e.shiftKey){
        if(document.activeElement===first){e.preventDefault(); last.focus();}
      }else{
        if(document.activeElement===last){e.preventDefault(); first.focus();}
      }
    }
    container.addEventListener("keydown", onKey);
    activeTrap=()=>container.removeEventListener("keydown", onKey);
  }
  function untrapFocus(){ if(activeTrap) activeTrap(); activeTrap=null; }

  function mountModal(root=document.body){
    const {backdrop,container,dialog}=createModal();
    root.appendChild(backdrop); root.appendChild(container);
    const firstInput=dialog.querySelector("#tr-onb-first");
    const dobInput  =dialog.querySelector("#tr-onb-dob");
    const firstErr  =dialog.querySelector("#tr-onb-first-error");
    const dobErr    =dialog.querySelector("#tr-onb-dob-error");
    const btnSave   =dialog.querySelector("#tr-onb-save");
    const btnSkip   =dialog.querySelector("#tr-onb-skip");

    function validateAll(){
      const n=validateName(firstInput.value);
      const d=validateDOB(dobInput.value);
      firstErr.textContent=n.ok?"":n.msg;
      dobErr.textContent  =d.ok?"":d.msg;
      btnSave.disabled=!(n.ok&&d.ok);
    }
    firstInput.addEventListener("input", validateAll);
    dobInput.addEventListener("input", validateAll);

    function open(){
      backdrop.setAttribute("data-open","true");
      container.setAttribute("aria-hidden","false");
      setTimeout(()=>firstInput.focus(),0);
      trapFocus(container);
    }
    function close(didSkip=false){
      backdrop.setAttribute("data-open","false");
      container.setAttribute("aria-hidden","true");
      untrapFocus();
      setTimeout(()=>{backdrop.remove();container.remove();},60);
    }

    btnSave.addEventListener("click",()=>{
      const n=validateName(firstInput.value);
      const d=validateDOB(dobInput.value);
      if(!(n.ok&&d.ok)){ validateAll(); return; }
      const profile={ firstName:n.value, dob:d.value, createdAt:nowISO(), consentLocal:true };
      saveProfile(profile);
      close(false);
    });
    btnSkip.addEventListener("click",()=> close(true));
    container.addEventListener("keydown",(e)=>{
      if(e.key==="Escape"){ e.preventDefault(); btnSkip.click(); }
    });

    // Theme changes repaint (variables handle real styling)
    const observer=new MutationObserver(()=>{
      const el=dialog; el.style.transform="translateZ(0)"; requestAnimationFrame(()=> el.style.transform="");
    });
    observer.observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","class"]});
    window.addEventListener("tr:themeChanged",()=>{
      const el=dialog; el.style.transform="translateZ(0)"; requestAnimationFrame(()=> el.style.transform="");
    });

    return {open,close,elements:{backdrop,container,dialog}};
  }

  function initOnboardingModal(){
    try{
      const profile = getUserProfile();
      if(profile && profile.firstName && profile.dob){ return; }
      const modal=mountModal(); modal.open();
    }catch(err){ console.error("Onboarding modal failed to initialize:",err); }
  }
  window.initOnboardingModal = initOnboardingModal;

  function subscribeToAppReady(){
    const openIfNeeded=()=>{
      const p=getUserProfile();
      if(!p || !p.firstName || !p.dob){ initOnboardingModal(); }
    };
    window.addEventListener("taskrock:app:ready", openIfNeeded, {once:true});
    window.addEventListener("taskrock:load:done", openIfNeeded, {once:true});
    if(document.readyState==="loading"){
      document.addEventListener("DOMContentLoaded", ()=> setTimeout(openIfNeeded,400));
    } else {
      setTimeout(openIfNeeded,400);
    }
  }
  subscribeToAppReady();
})();