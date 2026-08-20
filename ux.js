(() => {
  'use strict';

  const PREF_KEY = 'techops-learning-mode-v1';
  const ONBOARD_KEY = 'techops-onboarding-complete-v1';
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const glossary = {
    'Ticket': 'A record of a user’s problem, the evidence you gathered, what you changed, and how you verified the result. Real help desks use tickets so work can be tracked and handed off safely.',
    'Troubleshooting': 'A structured way to find the cause of a problem instead of guessing. Gather evidence, form a likely explanation, test it, make the safest fix, verify the result, and document what happened.',
    'Remote Desktop': 'A tool that lets an IT technician see and control another computer over the network. You are still working on the user’s real system, so changes should be deliberate.',
    'Terminal': 'A text-based way to interact with Windows by typing commands. It is useful because commands can show detailed system information and perform precise administrative tasks.',
    'Command': 'An instruction typed into a terminal. For example, ipconfig asks Windows to show its IP networking information.',
    'IP address': 'A numeric address that identifies a device on a network. Think of it like the device’s street address so network traffic knows where to go.',
    'DHCP': 'Dynamic Host Configuration Protocol. A network service that automatically gives a device an IP address and usually a subnet mask, default gateway, and DNS servers.',
    'APIPA': 'Automatic Private IP Addressing. Windows may give itself a 169.254.x.x address when it cannot get a normal address from DHCP. It is a clue that DHCP or network connectivity may be failing.',
    'Default gateway': 'The router address a computer sends traffic to when the destination is outside its local network. If there is no valid gateway, internet access normally will not work.',
    'DNS': 'Domain Name System. DNS translates names such as example.com into IP addresses that computers can use.',
    'Ping': 'A basic network test that checks whether another IP address or hostname can be reached. A successful ping is evidence of connectivity, not proof that every application is working.',
    'CPU': 'Central Processing Unit. The main processor that executes instructions. High temperature under load can cause throttling or shutdowns.',
    'Heatsink': 'A metal cooling component that pulls heat away from a processor. Dust or poor airflow can make it ineffective.',
    'Stress test': 'A controlled test that puts a system under heavy load so you can verify a repair remains stable when the computer is working hard.',
    'RAM': 'Random Access Memory. Fast temporary memory used by running programs and the operating system. A poorly seated RAM module can prevent a computer from completing startup checks.',
    'POST': 'Power-On Self-Test. Hardware checks a computer performs immediately after power-on, before Windows loads.',
    'ESD': 'Electrostatic discharge. Static electricity can damage electronic components. An ESD strap helps keep you and the computer at the same electrical potential while you work.',
    'Malware': 'Software designed to harm, spy on, disrupt, or take unauthorized actions on a computer.',
    'Isolation': 'Disconnecting a potentially compromised device from the network to reduce the chance that a security problem spreads or communicates outward.',
    'Quarantine': 'A security tool action that isolates a suspicious file so it cannot run normally while preserving it for review or removal.',
    'Print Spooler': 'The Windows service that manages print jobs before they are sent to a printer. A stuck job or unhealthy spooler can block printing even when the printer itself is online.',
    'Bluetooth': 'A short-range wireless technology used by headsets, phones, keyboards, mice, and other devices.',
    'Pairing mode': 'A temporary discoverable state that lets a Bluetooth accessory accept a connection from a new device.',
    'Public AI': 'An AI service operated outside the organization’s controlled environment. Sensitive company information may not be appropriate to paste into it.',
    'Hallucination': 'When an AI system produces an answer that sounds confident but is unsupported, inaccurate, or invented. IT technicians still need to verify recommendations against trustworthy evidence.'
  };

  const missionTerms = {
    'Payday Panic': ['Ticket','Troubleshooting','Remote Desktop','Terminal','IP address','DHCP','APIPA','Default gateway','Ping'],
    'Heat Death': ['Troubleshooting','CPU','Heatsink','Stress test'],
    'Pop-Up Plague': ['Malware','Isolation','Quarantine','Troubleshooting'],
    'POST Mortem': ['RAM','POST','ESD','Troubleshooting'],
    'Printer From Hell': ['Print Spooler','Ticket','Troubleshooting'],
    'The Name Game': ['DNS','IP address','Ping','Terminal'],
    'Pairing Panic': ['Bluetooth','Pairing mode','Troubleshooting'],
    'Ghost in the Copilot': ['Public AI','Hallucination','Ticket','Troubleshooting']
  };

  const missionGuides = {
    'Payday Panic': {
      title: 'Mission 1 is your guided tutorial',
      text: 'Start by talking to Maya. When you remote into her PC, do not change anything yet. First gather evidence. Open <strong>Network & internet</strong> or <strong>Windows Terminal</strong>. In Terminal, try <code>ipconfig</code> and read the IPv4 address, default gateway, and DHCP information.'
    },
    'Heat Death': {
      title: 'Now use the symptom pattern',
      text: 'The PC fails only during heavy work. Before replacing hardware, gather temperature evidence. Ask yourself: <em>what changes when the workload increases?</em>'
    },
    'Pop-Up Plague': {
      title: 'Security changes the order of operations',
      text: 'Unexpected redirects after an untrusted install are a security clue. Identify suspicious behavior, then think about containing the affected device before cleanup.'
    },
    'POST Mortem': {
      title: 'Follow the evidence and work safely',
      text: 'The failure began immediately after a RAM upgrade. Focus on what changed, but power down and use ESD protection before touching internal hardware.'
    },
    'Printer From Hell': {
      title: 'Separate the printer from Windows',
      text: 'The printer itself says Ready. That tells you to inspect the Windows print queue and service before replacing physical printer parts.'
    },
    'The Name Game': {
      title: 'Compare what works with what fails',
      text: 'An IP address works but a hostname does not. Use that contrast to separate basic network connectivity from DNS name resolution.'
    },
    'Pairing Panic': {
      title: 'Bluetooth is a sequence',
      text: 'Both devices must participate: Bluetooth enabled, accessory discoverable, correct device selected, authentication completed, then actual audio tested.'
    },
    'Ghost in the Copilot': {
      title: 'AI output is not authority',
      text: 'Treat an AI recommendation like unverified input. Protect sensitive information and independently confirm technical claims before changing a system.'
    }
  };

  const onboarding = [
    {
      title: 'Welcome to your first IT shift',
      body: '<p>TechOps assumes you are <strong>new to IT</strong>. You are not expected to already know the vocabulary.</p><div class="coach-callout"><strong>Your job is not to know everything.</strong><br>Your job is to gather evidence, think carefully, use the right tool, and verify what happened.</div><p>A <strong>ticket</strong> is the record of a user’s problem and the work you perform. A <strong>technician</strong> is the person responsible for diagnosing and resolving that problem.</p>'
    },
    {
      title: 'How technicians troubleshoot',
      body: '<p>Do not start by replacing parts or changing settings. Use a repeatable process:</p><ol><li>Understand the problem and gather evidence.</li><li>Think of the most likely cause.</li><li>Test that idea with the safest useful tool.</li><li>Make a plan and correct the cause.</li><li>Verify the user’s real problem is gone.</li><li>Document what you found and what you changed.</li></ol><div class="coach-callout"><strong>Evidence before action.</strong> TechOps will reward that habit and may penalize reckless changes.</div>'
    },
    {
      title: 'The simulated Windows computer behaves like a computer',
      body: '<p>When you start a <strong>Remote Desktop</strong> session, you are controlling the user’s Windows PC.</p><ul><li>Open apps from desktop icons or the Start menu.</li><li>Drag app windows by the title bar.</li><li>Use <strong>—</strong> to minimize, <strong>□</strong> to maximize, and <strong>×</strong> to close an app.</li><li>Click the app on the taskbar to restore a minimized window.</li><li>The large <strong>×</strong> at the top of the Remote Support panel exits the remote session.</li></ul><p>Keyboard shortcut: <strong>Alt + F4</strong> closes the active Windows app, just like Windows.</p>'
    },
    {
      title: 'Terminal is a tool, not a test',
      body: '<p>The <strong>Windows Terminal</strong> lets you type commands. A command is simply a typed instruction to Windows.</p><div class="coach-callout"><strong>First command to learn:</strong> <code>ipconfig</code><br>It displays the computer’s IP networking information. Type <code>help</code> in the TechOps terminal whenever you want to see supported training commands.</div><p>You do not need to memorize every command now. TechOps will explain what important output means while Learning Mode is on.</p>'
    },
    {
      title: 'Your first ticket: Payday Panic',
      body: '<p>Maya says Wi-Fi shows connected, but the internet does not work. “Connected to Wi-Fi” does <strong>not</strong> automatically mean the computer has a usable network configuration.</p><p>Start by finding Maya, opening a remote session, and gathering her IP information. Look for:</p><ul><li><strong>IP address</strong> — the computer’s network address.</li><li><strong>Default gateway</strong> — usually the router used to reach other networks.</li><li><strong>DHCP</strong> — the service that normally assigns those settings automatically.</li></ul><div class="coach-callout"><strong>You are ready.</strong> Walk to Maya and investigate. The coach will explain important terms as you encounter them.</div>'
    }
  ];

  let learningMode = localStorage.getItem(PREF_KEY) !== 'off';
  let onboardingIndex = 0;
  let terminalHistory = [];
  let terminalHistoryIndex = 0;
  let drag = null;
  let terminalObserver = null;
  const explained = new Set();

  function savePreference(){ localStorage.setItem(PREF_KEY, learningMode ? 'on' : 'off'); }
  function onboardingComplete(){ return localStorage.getItem(ONBOARD_KEY) === 'yes'; }

  function injectUI(){
    if (!$('coachModalBackdrop')) {
      const modal = document.createElement('div');
      modal.id = 'coachModalBackdrop';
      modal.className = 'coach-modal-backdrop hidden';
      modal.innerHTML = '<section class="coach-modal" role="dialog" aria-modal="true" aria-labelledby="coachModalTitle"><div class="coach-modal-head"><div><small>TECHOPS LEARNING CENTER</small><h2 id="coachModalTitle">First-day orientation</h2></div><button id="coachModalClose" class="icon-btn" aria-label="Close learning center">×</button></div><div id="coachModalBody" class="coach-modal-body"></div></section>';
      document.body.appendChild(modal);
    }
    if (!$('coachCard')) {
      const card = document.createElement('aside');
      card.id = 'coachCard';
      card.className = 'coach-card hidden';
      card.setAttribute('aria-live','polite');
      document.body.appendChild(card);
    }
    if (!$('termPopover')) {
      const pop = document.createElement('div');
      pop.id = 'termPopover';
      pop.className = 'term-popover hidden';
      pop.innerHTML = '<button aria-label="Close definition">×</button><strong></strong><p></p>';
      document.body.appendChild(pop);
      pop.querySelector('button').addEventListener('click',()=>pop.classList.add('hidden'));
    }
    ensureTermsPanel();
  }

  function ensureTermsPanel(){
    const hud = $('objectiveHud');
    if (!hud || $('termsPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'termsPanel';
    panel.className = 'terms-panel';
    panel.innerHTML = '<small>TERMS FOR THIS TICKET</small><div id="termChips" class="term-chips"></div>';
    const foot = hud.querySelector('.objective-foot');
    hud.insertBefore(panel, foot || null);
    updateTerms();
  }

  function renderOnboarding(){
    injectUI();
    const item = onboarding[onboardingIndex];
    $('coachModalTitle').textContent = 'First-day orientation';
    $('coachModalBody').innerHTML = `<div class="coach-progress">${onboarding.map((_,i)=>`<span class="${i<onboardingIndex?'done':i===onboardingIndex?'active':''}"></span>`).join('')}</div><div class="coach-copy"><div class="eyebrow">STEP ${onboardingIndex+1} OF ${onboarding.length}</div><h3>${item.title}</h3>${item.body}</div><div class="learning-toggle"><div><strong>Learning Mode</strong><small>Explains terminology and gives beginner guidance while you work.</small></div><button id="learningToggle" class="learning-switch ${learningMode?'on':''}" aria-pressed="${learningMode}"></button></div><div class="coach-actions"><button id="coachSkip" class="coach-skip">Skip orientation</button><div class="right"><button id="coachBack" class="btn ghost" ${onboardingIndex===0?'disabled':''}>Back</button><button id="coachNext" class="btn primary">${onboardingIndex===onboarding.length-1?'START WORKING':'Next'}</button></div></div>`;
    $('coachModalBackdrop').classList.remove('hidden');
    $('learningToggle').addEventListener('click',toggleLearningMode);
    $('coachBack').addEventListener('click',()=>{if(onboardingIndex>0){onboardingIndex--;renderOnboarding();}});
    $('coachNext').addEventListener('click',()=>{if(onboardingIndex<onboarding.length-1){onboardingIndex++;renderOnboarding();}else finishOnboarding();});
    $('coachSkip').addEventListener('click',finishOnboarding);
  }

  function finishOnboarding(){
    localStorage.setItem(ONBOARD_KEY,'yes');
    $('coachModalBackdrop')?.classList.add('hidden');
    if (learningMode) showMissionCoach();
  }

  function toggleLearningMode(){
    learningMode = !learningMode;
    savePreference();
    const btn = $('learningToggle');
    if (btn) { btn.classList.toggle('on',learningMode); btn.setAttribute('aria-pressed',String(learningMode)); }
    if (!learningMode) hideCoach(); else showMissionCoach();
  }

  function openLearningCenter(){
    injectUI();
    $('coachModalTitle').textContent = 'Learning Center';
    const items = Object.entries(glossary).map(([term,desc])=>`<div class="glossary-item"><strong>${term}</strong><p>${desc}</p></div>`).join('');
    $('coachModalBody').innerHTML = `<div class="coach-copy"><h3>IT vocabulary & guidance</h3><p>Learning Mode is designed for someone starting IT from the beginning. Turn it off whenever you want TechOps to become less guided.</p></div><div class="learning-toggle"><div><strong>Learning Mode</strong><small>Context explanations, first-ticket coaching, and terminology help.</small></div><button id="learningToggle" class="learning-switch ${learningMode?'on':''}" aria-pressed="${learningMode}"></button></div><div class="glossary-grid">${items}</div>`;
    $('coachModalBackdrop').classList.remove('hidden');
    $('learningToggle').addEventListener('click',toggleLearningMode);
  }

  function showCoach(title, html, actions=[]){
    if (!learningMode) return;
    injectUI();
    const card = $('coachCard');
    card.innerHTML = `<div class="coach-card-head"><strong>🎓 ${title}</strong><button aria-label="Hide coach">×</button></div><p>${html}</p><div class="coach-card-actions">${actions.map(([label,term])=>`<button data-coach-term="${term}">${label}</button>`).join('')}<button data-open-learning="1">Open Learning Center</button></div>`;
    card.classList.remove('hidden');
    card.querySelector('.coach-card-head button').addEventListener('click',hideCoach);
  }
  function hideCoach(){ $('coachCard')?.classList.add('hidden'); }

  function activeMissionTitle(){ return $('activeTitle')?.textContent?.trim() || ''; }
  function showMissionCoach(){
    const title = activeMissionTitle();
    const guide = missionGuides[title];
    if (!guide || !learningMode) return;
    showCoach(guide.title,guide.text,(missionTerms[title]||[]).slice(0,3).map(t=>['Define '+t,t]));
  }

  function updateTerms(){
    const chips = $('termChips'); if (!chips) return;
    const terms = missionTerms[activeMissionTitle()] || ['Ticket','Troubleshooting'];
    chips.innerHTML = terms.map(t=>`<button class="term-chip" data-term="${t}">${t}</button>`).join('');
  }

  function showDefinition(term, anchor){
    const desc = glossary[term]; if (!desc) return;
    const pop = $('termPopover');
    pop.querySelector('strong').textContent = term;
    pop.querySelector('p').textContent = desc;
    pop.classList.remove('hidden');
    const r = anchor?.getBoundingClientRect();
    const width = Math.min(410,window.innerWidth-30);
    let left = r ? Math.min(window.innerWidth-width-12,Math.max(12,r.left)) : Math.max(12,(window.innerWidth-width)/2);
    let top = r ? Math.min(window.innerHeight-180,Math.max(12,r.bottom+8)) : 100;
    pop.style.left = left+'px'; pop.style.top = top+'px';
  }

  function afterDesktopOpened(){
    const shell = document.querySelector('.os-shell'); if (!shell) return;
    ensureStartMenu(shell);
    if (learningMode && !$('desktopCoachStrip')) {
      const strip = document.createElement('div');
      strip.id='desktopCoachStrip'; strip.className='desktop-coach-strip';
      strip.innerHTML='<strong>You are controlling the user’s Windows PC.</strong><br>Gather evidence before changing settings. App windows can be dragged, minimized, maximized, closed, and restored from the taskbar.';
      shell.querySelector('.os-desktop').appendChild(strip);
      setTimeout(()=>strip.remove(),9000);
    }
    if (activeMissionTitle()==='Payday Panic' && learningMode) {
      showCoach('Remote Desktop', 'This is Maya’s computer. Start by <strong>looking</strong>, not fixing. Open <strong>Network & internet</strong> or <strong>Windows Terminal</strong>. If you choose Terminal, type <code>ipconfig</code>.', [['Remote Desktop','Remote Desktop'],['IP address','IP address'],['Terminal','Terminal']]);
    }
  }

  function ensureStartMenu(shell){
    const desktop = shell.querySelector('.os-desktop');
    if (!$('osStartMenu')) {
      const menu = document.createElement('div');
      menu.id='osStartMenu'; menu.className='os-start-menu hidden';
      menu.innerHTML='<h3>Start</h3><input id="osStartSearch" class="os-start-search" placeholder="Search apps" aria-label="Search apps"><div class="os-start-grid"></div><div class="os-start-foot"><span>Northstar Systems</span><span>Windows 11 Pro</span></div>';
      desktop.appendChild(menu);
      fillStartApps();
    }
  }

  function fillStartApps(filter=''){
    const grid = document.querySelector('.os-start-grid'); if (!grid) return;
    const apps = $$('.os-icon').map(b=>({id:b.dataset.app,name:b.querySelector('span:last-child')?.textContent||b.dataset.app})).filter(a=>a.name.toLowerCase().includes(filter.toLowerCase()));
    grid.innerHTML = apps.map(a=>`<button data-start-app="${a.id}">${a.name}</button>`).join('') || '<span style="font-size:.72rem;color:#60717d">No apps found.</span>';
  }

  function afterAppOpen(app){
    const win = $('osWindow'); if (!win) return;
    win.classList.remove('minimized');
    win.classList.toggle('terminal-app',app==='terminal');
    win.dataset.app = app;
    const task = $('osTaskApp');
    if (task) { task.textContent = $('osWindowTitle')?.textContent || app; task.classList.remove('hidden'); }
    $('osStartMenu')?.classList.add('hidden');
    $('osStart')?.classList.remove('active');
    if (app==='terminal') {
      terminalHistoryIndex = terminalHistory.length;
      attachTerminalObserver();
      if (activeMissionTitle()==='Payday Panic' && learningMode && !explained.has('terminal-intro')) {
        explained.add('terminal-intro');
        showCoach('Windows Terminal', 'The line ending in <code>&gt;</code> is the <strong>prompt</strong>—Windows is waiting for a command. Type <code>ipconfig</code> and press Enter. It will show Maya’s network settings.', [['What is Terminal?','Terminal'],['What is a command?','Command']]);
      }
    } else if (terminalObserver) { terminalObserver.disconnect(); terminalObserver=null; }
  }

  function closeOSWindow(){
    const win=$('osWindow'); if (win) win.classList.add('hidden');
    const task=$('osTaskApp'); if(task) task.classList.add('hidden');
  }
  function minimizeOSWindow(){
    const win=$('osWindow'); if(!win||win.classList.contains('hidden'))return;
    win.classList.add('minimized');
  }
  function restoreOSWindow(){
    const win=$('osWindow'); if(!win)return;
    if(win.classList.contains('hidden'))return;
    win.classList.toggle('minimized');
  }
  function maximizeOSWindow(){
    const win=$('osWindow'); if(!win)return;
    win.classList.toggle('maximized');
    const btn=$('osWindowMax'); if(btn) btn.textContent=win.classList.contains('maximized')?'❐':'□';
  }

  function attachTerminalObserver(){
    terminalObserver?.disconnect();
    const out=$('terminalOut'); if(!out)return;
    terminalObserver = new MutationObserver(explainTerminalOutput);
    terminalObserver.observe(out,{childList:true,subtree:true,characterData:true});
    explainTerminalOutput();
  }

  function explainTerminalOutput(){
    if(!learningMode)return;
    const text=$('terminalOut')?.textContent||'';
    if(text.includes('169.254.44.18')&&!explained.has('apipa')){
      explained.add('apipa');
      showCoach('You found an important clue', '<code>169.254.44.18</code> is an <strong>APIPA</strong> address. Windows often gives itself a 169.254.x.x address when it cannot receive a normal address from <strong>DHCP</strong>. Notice that the <strong>default gateway</strong> is also missing. That explains why Wi-Fi can look connected while internet traffic still fails.', [['Define APIPA','APIPA'],['Define DHCP','DHCP'],['Default gateway','Default gateway']]);
    }
    if(text.includes('10.20.14.87')&&!explained.has('dhcp-fixed')){
      explained.add('dhcp-fixed');
      showCoach('The configuration changed', 'Maya now has a normal corporate IP address and a default gateway. Do not stop just because the command succeeded—<strong>verify connectivity</strong>. Try <code>ping 8.8.8.8</code>, then test the browser.', [['What does Ping test?','Ping'],['IP address','IP address']]);
    }
    if(text.includes('Lost = 0')&&!explained.has('ping-ok')){
      explained.add('ping-ok');
      showCoach('Connectivity test passed', 'The ping received replies with <strong>0 packets lost</strong>. That is evidence the network path is working. Now verify the user’s actual problem by opening the browser. A technician verifies the real service, not just one diagnostic command.', [['Ping','Ping'],['Troubleshooting','Troubleshooting']]);
    }
  }

  function startDrag(e){
    if(e.button!==0 || e.target.closest('button') || window.innerWidth<=760)return;
    const bar=e.target.closest('.os-window-bar'); if(!bar)return;
    const win=bar.closest('.os-window'); if(!win||win.classList.contains('maximized'))return;
    const desk=win.parentElement; const wr=win.getBoundingClientRect(), dr=desk.getBoundingClientRect();
    win.style.left=(wr.left-dr.left)+'px'; win.style.top=(wr.top-dr.top)+'px'; win.style.right='auto';
    drag={win,desk,startX:e.clientX,startY:e.clientY,left:wr.left-dr.left,top:wr.top-dr.top};
    e.preventDefault();
  }
  function moveDrag(e){
    if(!drag)return;
    const dr=drag.desk.getBoundingClientRect(), wr=drag.win.getBoundingClientRect();
    const maxX=Math.max(0,dr.width-wr.width), maxY=Math.max(0,dr.height-wr.height);
    drag.win.style.left=Math.min(maxX,Math.max(0,drag.left+e.clientX-drag.startX))+'px';
    drag.win.style.top=Math.min(maxY,Math.max(0,drag.top+e.clientY-drag.startY))+'px';
  }
  function endDrag(){drag=null;}

  function installEvents(){
    $('learnBtn')?.addEventListener('click',openLearningCenter);
    $('coachModalClose')?.addEventListener('click',()=> $('coachModalBackdrop').classList.add('hidden'));
    $('coachModalBackdrop')?.addEventListener('mousedown',e=>{if(e.target===$('coachModalBackdrop'))e.currentTarget.classList.add('hidden');});

    ['newGameBtn','continueBtn'].forEach(id=>$(id)?.addEventListener('click',()=>setTimeout(()=>{
      if(!onboardingComplete()) renderOnboarding(); else if(learningMode) showMissionCoach();
    },120)));

    document.addEventListener('click',e=>{
      const term=e.target.closest('[data-term],[data-coach-term]');
      if(term){showDefinition(term.dataset.term||term.dataset.coachTerm,term);return;}
      if(e.target.closest('[data-open-learning]')){openLearningCenter();return;}

      const app=e.target.closest('.os-icon');
      if(app) setTimeout(()=>afterAppOpen(app.dataset.app),0);

      const startApp=e.target.closest('[data-start-app]');
      if(startApp){document.querySelector(`.os-icon[data-app="${startApp.dataset.startApp}"]`)?.click();return;}

      if(e.target.closest('#osStart')){
        const menu=$('osStartMenu'); if(menu){menu.classList.toggle('hidden');$('osStart')?.classList.toggle('active',!menu.classList.contains('hidden'));if(!menu.classList.contains('hidden'))setTimeout(()=>$('osStartSearch')?.focus(),0);}return;
      }
      if(e.target.closest('#osSearch')){
        const menu=$('osStartMenu'); if(menu){menu.classList.remove('hidden');$('osStart')?.classList.add('active');setTimeout(()=>$('osStartSearch')?.focus(),0);}return;
      }
      if(e.target.closest('#osWindowMin')){minimizeOSWindow();return;}
      if(e.target.closest('#osWindowMax')){maximizeOSWindow();return;}
      if(e.target.closest('#osWindowClose')){setTimeout(closeOSWindow,0);return;}
      if(e.target.closest('#osTaskApp')){restoreOSWindow();return;}

      if(e.target.closest('[data-app]')===null && $('osStartMenu') && !e.target.closest('#osStartMenu') && !e.target.closest('#osStart') && !e.target.closest('#osSearch')){
        $('osStartMenu').classList.add('hidden'); $('osStart')?.classList.remove('active');
      }
    });

    document.addEventListener('input',e=>{if(e.target.id==='osStartSearch')fillStartApps(e.target.value);});

    document.addEventListener('keydown',e=>{
      const input=e.target.closest?.('#terminalInput');
      if(input){
        if(e.key==='Enter'&&input.value.trim()){
          terminalHistory.push(input.value.trim()); if(terminalHistory.length>30)terminalHistory.shift(); terminalHistoryIndex=terminalHistory.length;
        } else if(e.key==='ArrowUp'){
          e.preventDefault(); if(terminalHistory.length){terminalHistoryIndex=Math.max(0,terminalHistoryIndex-1);input.value=terminalHistory[terminalHistoryIndex]||'';queueMicrotask(()=>input.setSelectionRange(input.value.length,input.value.length));}
        } else if(e.key==='ArrowDown'){
          e.preventDefault(); if(terminalHistory.length){terminalHistoryIndex=Math.min(terminalHistory.length,terminalHistoryIndex+1);input.value=terminalHistoryIndex===terminalHistory.length?'':terminalHistory[terminalHistoryIndex]||'';}
        }
      }
      if(e.altKey&&e.key==='F4'&&$('osWindow')&&!$('osWindow').classList.contains('hidden')){e.preventDefault();$('osWindowClose')?.click();}
      if(e.key==='Escape'&&!$('osStartMenu')?.classList.contains('hidden')){$('osStartMenu').classList.add('hidden');$('osStart')?.classList.remove('active');}
    },true);

    document.addEventListener('pointerdown',startDrag);
    document.addEventListener('pointermove',moveDrag);
    document.addEventListener('pointerup',endDrag);

    const title=$('activeTitle');
    if(title){new MutationObserver(()=>{updateTerms();if(learningMode&&onboardingComplete())setTimeout(showMissionCoach,350);}).observe(title,{childList:true,subtree:true,characterData:true});}

    const overlayBody=$('overlayBody');
    if(overlayBody){new MutationObserver(()=>{if(document.querySelector('.os-shell'))setTimeout(afterDesktopOpened,0);}).observe(overlayBody,{childList:true,subtree:false});}
  }

  function boot(){
    injectUI();
    installEvents();
    updateTerms();
    window.__TECHOPS_UX__={glossary,showDefinition,showMissionCoach,openLearningCenter,get learningMode(){return learningMode;},setLearningMode(v){learningMode=!!v;savePreference();}};
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();