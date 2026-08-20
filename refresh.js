(() => {
  'use strict';

  const SAVE_KEY = 'techops-technician-refresh-v1';
  const $ = (id) => document.getElementById(id);
  const DOMAINS = ['Mobile Devices','Networking','Hardware','Virtualization & Cloud','Troubleshooting'];
  const LAB_MAP = {
    'Mobile Devices':'mobile-clinic',
    'Networking':'network-rack',
    'Hardware':'pc-build-bay',
    'Virtualization & Cloud':'vm-cloud-sandbox',
    'Troubleshooting':'troubleshooting-arena'
  };

  const SCAN_CASES = [
    {domain:'Mobile Devices',objective:'1.1',q:'A Chromebook-style laptop only charges when the USB-C plug is held at an angle. A known-good charger behaves the same way. What is the strongest next conclusion?',choices:['The physical charging port is likely damaged','DNS is failing','The SSD needs RAID','The display refresh rate is too high'],answer:0,why:'A known-good charger removes the charger from suspicion. Position-dependent charging strongly points to the physical port or its connection.'},
    {domain:'Mobile Devices',objective:'1.2',q:'A user wants one dock connection for power, external displays, networking, and peripherals. Which modern connector is the best fit when the device supports it?',choices:['USB-C/Thunderbolt-class dock','RJ11','SATA data','F-type coax'],answer:0,why:'A capable USB-C/Thunderbolt dock can combine charging, display, data, networking, and peripherals.'},
    {domain:'Mobile Devices',objective:'1.3',q:'A managed phone has working Wi-Fi but corporate mail will not configure because the organization requires device enrollment. What should you verify?',choices:['MDM enrollment/profile status','CPU socket','Printer fuser','RAID stripe size'],answer:0,why:'Mobile device management can enforce account, certificate, and application policies that must be satisfied before corporate services work.'},

    {domain:'Networking',objective:'2.1',q:'A firewall change must allow secure web traffic to an internal application. Which destination service is expected?',choices:['TCP 443','UDP 67','TCP 25','TCP 3389'],answer:0,why:'HTTPS normally uses TCP port 443.'},
    {domain:'Networking',objective:'2.4',q:'A workstation has 169.254.33.18 and no default gateway. Other devices on the switch are healthy. What service should you investigate first?',choices:['DHCP path or lease process','DNS MX records','NTP only','Printer spooler'],answer:0,why:'An APIPA address is a strong clue that the client failed to receive normal IPv4 configuration from DHCP.'},
    {domain:'Networking',objective:'2.8',q:'You need to identify which unlabeled office wall jack terminates on a crowded patch panel. What tool combination is most useful?',choices:['Tone generator and probe','Power supply tester','Loopback plug only','Thermal camera'],answer:0,why:'A toner/probe pair traces a copper cable through walls and bundles.'},

    {domain:'Hardware',objective:'3.3',q:'A motherboard supports DDR5 only. Which memory upgrade is valid?',choices:['Compatible DDR5 DIMMs','DDR4 DIMMs forced into the slots','SODIMMs with an adapter','Any RAM if capacity matches'],answer:0,why:'Memory generation and form factor must match the motherboard. DDR generations are physically and electrically different.'},
    {domain:'Hardware',objective:'3.5',q:'A PC fails POST immediately after a CPU replacement. What compatibility detail has the highest value to verify first?',choices:['CPU socket/chipset support and installation','Browser cache','Printer driver','DNS suffix'],answer:0,why:'A CPU must be electrically and physically supported by the motherboard, and a recent hardware change is high-value evidence.'},
    {domain:'Hardware',objective:'3.6',q:'A creator workstation uses a high-power GPU and crashes only under heavy GPU load. Which hardware check is especially relevant?',choices:['PSU capacity and GPU power connectors','DHCP reservation','Display wallpaper','Bluetooth pairing'],answer:0,why:'Load-dependent crashes after adding a power-hungry GPU can indicate insufficient PSU capacity or missing/incorrect GPU power.'},

    {domain:'Virtualization & Cloud',objective:'4.1',q:'A technician wants an isolated Windows test environment on a normal host OS without dedicating a physical machine. What is a practical choice?',choices:['A VM on a Type 2 hypervisor','A print server','RAID 1 only','A wireless bridge'],answer:0,why:'A Type 2 hypervisor runs on an existing host OS and is common for workstation labs.'},
    {domain:'Virtualization & Cloud',objective:'4.1',q:'A server hypervisor runs directly on physical hardware and hosts multiple guest operating systems. What type is it?',choices:['Type 1 hypervisor','Type 2 only','SaaS','PAN'],answer:0,why:'A Type 1 hypervisor runs directly on the hardware.'},
    {domain:'Virtualization & Cloud',objective:'4.2',q:'A company rents virtual machines, storage, and virtual networks but manages its own operating systems. Which service model fits?',choices:['IaaS','SaaS','PaaS only','VDI'],answer:0,why:'IaaS provides infrastructure resources while the customer manages more of the OS/application stack.'},

    {domain:'Troubleshooting',objective:'5.1',q:'A desktop begins repeatedly shutting down only during demanding workloads. CPU temperature reaches 99°C. What should you investigate?',choices:['Cooling, airflow, heatsink, and fan operation','DNS records','Print queue','SIM card'],answer:0,why:'High temperature plus load-related shutdowns strongly supports a thermal problem.'},
    {domain:'Troubleshooting',objective:'5.5',q:'Users in one room experience Wi-Fi drops while nearby rooms are stable. A Wi-Fi analyzer shows heavy co-channel interference. What is the best corrective direction?',choices:['Choose a cleaner channel/band after site analysis','Replace all SSDs','Change printer toner','Reinstall every operating system'],answer:0,why:'The measured radio interference directly supports channel/band planning as the relevant fix.'},
    {domain:'Troubleshooting',objective:'5.6',q:'A network printer says Ready, but every Windows print job stays pending. What should you inspect before replacing printer hardware?',choices:['Queue and Print Spooler path','CPU thermal paste','RAID status','Bluetooth PIN'],answer:0,why:'Printer-ready plus pending Windows jobs points toward the software print path and queue.'}
  ];

  const REPAIR_QUEUE = [
    {id:'cb-charge',icon:'💻',title:'Chromebook Bench — No Charge',objective:'1.1 / 5.4',domain:'Mobile Devices',symptom:'A student Chromebook does not charge. The LED flickers only when the USB-C plug is moved.',steps:[
      {q:'First action?',choices:['Inspect the charger, cable, and USB-C port; test a known-good charger','Replace the motherboard immediately','Powerwash it first'],answer:0,why:'Start with physical evidence and a known-good power source before replacing internal hardware.'},
      {q:'Known-good charger has the same angle-dependent behavior. Next conclusion?',choices:['The device-side USB-C port/connection is suspect','The Wi-Fi card is bad','The display panel caused it'],answer:0,why:'A known-good charger isolates the symptom toward the device port or internal power connection.'},
      {q:'After repair, what verifies success?',choices:['Charge normally from a known-good adapter without pressure and confirm battery status rises','Only boot to login screen','Ping a router'],answer:0,why:'Verify the exact user-facing charging function and battery response.'}
    ]},
    {id:'ram-post',icon:'🧠',title:'Desktop Bench — No POST',objective:'3.3 / 5.1',domain:'Hardware',symptom:'A desktop powers on and beeps repeatedly after memory was upgraded.',steps:[
      {q:'Best first direction?',choices:['Focus on the recent RAM change and work safely','Replace the SSD','Flush DNS'],answer:0,why:'The failure began immediately after a RAM change.'},
      {q:'One DIMM is not latched. What should you do?',choices:['Power down, use ESD precautions, reseat compatible memory','Push it in while powered','Format the drive'],answer:0,why:'Internal hardware service should be performed powered down with ESD precautions.'},
      {q:'Verification?',choices:['Confirm normal POST, display, and detected memory','Assume no beeps means fixed','Open a website only'],answer:0,why:'Successful POST and correct memory detection verify the hardware repair.'}
    ]},
    {id:'wifi-room',icon:'📶',title:'Wireless Queue — One Room Drops',objective:'2.2 / 5.5',domain:'Networking',symptom:'Only one classroom has intermittent Wi-Fi; adjacent rooms are stable.',steps:[
      {q:'What evidence tool helps?',choices:['Wi-Fi analyzer','Crimper only','PSU tester'],answer:0,why:'A Wi-Fi analyzer can reveal signal levels, congestion, and interference.'},
      {q:'Analyzer shows a crowded channel. Corrective direction?',choices:['Move to a cleaner appropriate channel/band after checking the environment','Replace laptops','Rebuild RAID'],answer:0,why:'Measured interference should drive wireless channel/band planning.'},
      {q:'Verification?',choices:['Observe stable connectivity, latency, and throughput in the affected room','Only reboot the AP','Check toner'],answer:0,why:'Verify service quality where the symptom occurred.'}
    ]},
    {id:'printer',icon:'🖨️',title:'Print Room — Queue Frozen',objective:'3.7 / 5.6',domain:'Troubleshooting',symptom:'Printer panel says Ready. Workstations show seven pending jobs.',steps:[
      {q:'First inspection?',choices:['Windows print queue and spooler/service path','Printer motherboard replacement','DNS MX record'],answer:0,why:'The printer is ready; pending client jobs point to the software print path first.'},
      {q:'One corrupted job blocks all following jobs. Fix?',choices:['Remove the stuck job and restore spooler operation','Replace toner','Change Wi-Fi SSID'],answer:0,why:'Clear the blockage and restore normal queue processing.'},
      {q:'Verification?',choices:['Send a test page and confirm the queue completes','Only check printer power','Run memory POST'],answer:0,why:'A test print verifies the complete user-facing workflow.'}
    ]},
    {id:'display',icon:'🖥️',title:'Classroom Display — No Signal',objective:'3.1 / 5.3',domain:'Hardware',symptom:'A projector is powered on but says No Signal after a laptop is connected.',steps:[
      {q:'First checks?',choices:['Input source and physical video connection','RAID health','DHCP reservation'],answer:0,why:'Input selection and cabling are simple, high-probability display causes.'},
      {q:'Projector is set to HDMI 2 while cable is on HDMI 1. Fix?',choices:['Select HDMI 1','Replace GPU','Change DNS'],answer:0,why:'The selected source must match the connected input.'},
      {q:'Verification?',choices:['Confirm stable image at the intended resolution and content','Only inspect the cable','Print a test page'],answer:0,why:'Verify the actual display output, not just the setting change.'}
    ]},
    {id:'drive',icon:'💾',title:'Repair Bench — Clicking Drive',objective:'3.4 / 5.2',domain:'Troubleshooting',symptom:'A workstation is extremely slow and its HDD clicks repeatedly.',steps:[
      {q:'High-value evidence?',choices:['Drive health/S.M.A.R.T. and backup status','Color gamut','Bluetooth name'],answer:0,why:'Noise and slow I/O make storage health and data protection priorities.'},
      {q:'S.M.A.R.T. reports imminent failure. Action?',choices:['Protect data and replace the failing drive','Defragment repeatedly','Increase CPU voltage'],answer:0,why:'Protect the data and replace hardware that is clearly failing.'},
      {q:'Verification?',choices:['Healthy replacement drive, accessible data, normal I/O','Only boot once','Check printer queue'],answer:0,why:'Verify health, data access, and performance.'}
    ]}
  ];

  let state = load();
  let scan = null;
  let queue = null;
  let timer = null;

  function defaults(){return {scanRuns:0,bestScore:0,lastScan:null,queueRuns:0,bestQueue:null,instructor:false,notes:''};}
  function load(){try{return {...defaults(),...JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')};}catch(_){return defaults();}}
  function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch(_){}}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function shuffle(a){return [...a].sort(()=>Math.random()-.5);}
  function pct(a,b){return b?Math.round(a/b*100):0;}

  function ensure(){
    if($('refreshOverlay')) return;
    const el=document.createElement('div');
    el.id='refreshOverlay'; el.className='refresh-overlay hidden';
    el.innerHTML=`<header class="refresh-topbar"><div class="refresh-brand"><span class="refresh-mark">R/T</span><div><strong>TechOps Technician Refresh</strong><small>EXPERIENCED / RETURNING TECH PATH</small></div></div><span class="refresh-pill">A+ CORE 1 • FAST REFRESH</span><span class="refresh-spacer"></span><div class="refresh-stat"><small>BEST SCAN</small><strong id="refreshBest">${state.bestScore}%</strong></div><div class="refresh-stat"><small>RUNS</small><strong id="refreshRuns">${state.scanRuns+state.queueRuns}</strong></div><button id="refreshClose" class="refresh-close" aria-label="Exit Technician Refresh">×</button></header><div class="refresh-shell"><aside id="refreshNav" class="refresh-nav"><h3>TECHNICIAN MENU</h3></aside><main id="refreshStage" class="refresh-stage"></main></div>`;
    document.body.appendChild(el);
    const toast=document.createElement('div');toast.id='refreshToast';toast.className='refresh-toast hidden';document.body.appendChild(toast);
    $('refreshClose').addEventListener('click',close);
    renderNav();
  }

  function renderNav(){
    const nav=$('refreshNav'); if(!nav)return;
    const items=[['home','Refresh Dashboard','Choose a fast path'],['scan','10-Minute Skills Scan','Benchmark Core 1 recall'],['queue','Repair Room Challenge','Timed field-tech queue'],['review','Reviewer / Instructor','Capture professional feedback']];
    nav.innerHTML='<h3>TECHNICIAN MENU</h3>'+items.map(([id,name,sub])=>`<button data-refresh-view="${id}"><strong>${name}</strong><span>${sub}</span></button>`).join('')+`<button data-refresh-lab="matrix"><strong>Core 1 Lab Matrix</strong><span>Open the 27-objective lab</span></button>`;
    nav.querySelectorAll('[data-refresh-view]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.refreshView)));
    nav.querySelector('[data-refresh-lab]')?.addEventListener('click',()=>openLab('matrix'));
  }

  function open(){ensure();$('refreshOverlay').classList.remove('hidden');render('home');}
  function close(){clearInterval(timer);timer=null;$('refreshOverlay')?.classList.add('hidden');}
  function render(view){
    clearInterval(timer);timer=null;
    document.querySelectorAll('#refreshNav button').forEach(b=>b.classList.toggle('active',b.dataset.refreshView===view));
    if(view==='home')renderHome();
    if(view==='scan')renderScanIntro();
    if(view==='queue')renderQueueIntro();
    if(view==='review')renderReview();
  }

  function renderHome(){
    const last=state.lastScan;
    $('refreshStage').innerHTML=`<div class="refresh-hero"><div class="refresh-kicker">NO ONBOARDING • NO TRAINING WHEELS REQUIRED</div><h2>Come back sharp, not bored.</h2><p>Technician Refresh is for working technicians, instructors, former techs, and anyone who already knows the basics. It skips beginner coaching and focuses on quick diagnostics, timed repair decisions, objective weak spots, and targeted lab practice.</p><div class="refresh-summary"><div><small>BEST SKILLS SCAN</small><strong>${state.bestScore}%</strong></div><div><small>SCAN RUNS</small><strong>${state.scanRuns}</strong></div><div><small>REPAIR QUEUES</small><strong>${state.queueRuns}</strong></div><div><small>LAB COVERAGE</small><strong>${window.__TECHOPS_LAB__?.coverage?.()||0}%</strong></div></div><div class="refresh-grid"><section class="refresh-card"><div class="icon">⚡</div><h3>10-Minute Skills Scan</h3><p>Fifteen current Core 1 scenarios across all five domains. One answer per ticket. No hints. Get a domain heat map and targeted refresh plan.</p><div class="actions"><button class="primary" data-go="scan">START SCAN</button></div></section><section class="refresh-card"><div class="icon">🧰</div><h3>Repair Room Challenge</h3><p>Six devices hit the bench at once. Work each through evidence, fix, and verification under an eight-minute service window.</p><div class="actions"><button class="primary" data-go="queue">OPEN QUEUE</button></div></section><section class="refresh-card"><div class="icon">🎯</div><h3>Targeted Core 1 Drill</h3><p>Jump straight into the Computer Lab station that matches the skill you want to refresh—hardware, networking, mobile, cloud, or troubleshooting.</p><div class="actions"><button data-domain="Hardware">HARDWARE</button><button data-domain="Networking">NETWORK</button><button data-domain="Troubleshooting">FAULTS</button></div></section><section class="refresh-card"><div class="icon">🧑‍🏫</div><h3>Instructor Lens</h3><p>Turn on objective references and short teaching rationales while you test the content. Useful when an experienced technician is reviewing TechOps for accuracy.</p><div class="instructor-toggle"><div><strong>Instructor Lens</strong><small>${state.instructor?'Objective detail visible':'Fast tech feedback only'}</small></div><button id="homeInstructor" class="${state.instructor?'on':''}" aria-pressed="${state.instructor}"></button></div></section><section class="refresh-card"><div class="icon">📝</div><h3>Field Reviewer Report</h3><p>Capture professional observations, browser/session stats, recent scores, and weak areas into a copyable review packet for the TechOps developer.</p><div class="actions"><button data-go="review">OPEN REVIEWER</button></div></section><section class="refresh-card"><div class="icon">🖥️</div><h3>Unlimited Lab</h3><p>The refresh path never replaces hands-on practice. Open any Core 1 lab station and work it as long as needed.</p><div class="actions"><button data-open-lab="hub">ENTER LAB</button></div></section></div>${last?`<div class="mode-note"><strong>Last scan:</strong> ${last.score}% overall • weakest area: ${esc(last.weakest||'—')} • ${new Date(last.when).toLocaleDateString()}</div>`:''}</div>`;
    $('refreshStage').querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.go)));
    $('refreshStage').querySelectorAll('[data-domain]').forEach(b=>b.addEventListener('click',()=>openDomain(b.dataset.domain)));
    $('refreshStage').querySelectorAll('[data-open-lab]').forEach(b=>b.addEventListener('click',()=>openLab(b.dataset.openLab)));
    $('homeInstructor')?.addEventListener('click',()=>{state.instructor=!state.instructor;save();renderHome();});
  }

  function renderScanIntro(){
    $('refreshStage').innerHTML=`<div class="refresh-hero"><div class="refresh-kicker">TECHNICIAN BENCHMARK</div><h2>10-Minute Core 1 Skills Scan</h2><p>This is not beginner teaching mode. You get one attempt per scenario, then TechOps moves on. The goal is to expose stale knowledge quickly and send you straight to the right practice station.</p><div class="refresh-summary"><div><small>SCENARIOS</small><strong>15</strong></div><div><small>DOMAINS</small><strong>5</strong></div><div><small>TIME</small><strong>10:00</strong></div><div><small>HINTS</small><strong>OFF</strong></div></div><div class="mode-note"><strong>Instructor Lens ${state.instructor?'ON':'OFF'}.</strong> ${state.instructor?'Objective references and rationale appear after each decision so you can evaluate the teaching quality.':'Only compact correctness feedback is shown during the run.'}</div><div style="margin-top:16px"><button id="startScan" class="refresh-btn primary">START SKILLS SCAN</button></div></div>`;
    $('startScan').addEventListener('click',startScan);
  }

  function startScan(){
    scan={cases:shuffle(SCAN_CASES),index:0,correct:0,answers:[],seconds:600,locked:false};
    renderScanCase();
    timer=setInterval(()=>{if(!scan)return;scan.seconds--;updateScanTimer();if(scan.seconds<=0)finishScan(true);},1000);
  }
  function updateScanTimer(){const el=$('scanTimer');if(el&&scan){const m=Math.floor(scan.seconds/60),s=scan.seconds%60;el.textContent=`${m}:${String(s).padStart(2,'0')}`;}}
  function renderScanCase(){
    const c=scan.cases[scan.index],progress=Math.round(scan.index/scan.cases.length*100);
    $('refreshStage').innerHTML=`<div class="scan-shell"><div class="scan-head"><span class="refresh-kicker">SKILLS SCAN • ${scan.index+1}/${scan.cases.length}</span><div class="scan-progress"><span style="width:${progress}%"></span></div><strong id="scanTimer" class="scan-timer"></strong></div><section class="scan-case"><small>${esc(c.domain)} • OBJECTIVE ${c.objective}</small><h3>Field Scenario</h3><p>${esc(c.q)}</p><div class="scan-choices">${c.choices.map((x,i)=>`<button class="scan-choice" data-scan-choice="${i}">${esc(x)}</button>`).join('')}</div><div id="scanFeedback"></div></section></div>`;
    updateScanTimer();
    $('refreshStage').querySelectorAll('[data-scan-choice]').forEach(b=>b.addEventListener('click',()=>answerScan(Number(b.dataset.scanChoice),b)));
  }
  function answerScan(choice,button){
    if(scan.locked)return;scan.locked=true;const c=scan.cases[scan.index],good=choice===c.answer;
    if(good)scan.correct++;
    scan.answers.push({domain:c.domain,objective:c.objective,good,q:c.q,why:c.why});
    button.classList.add(good?'correct':'wrong');
    $('refreshStage').querySelectorAll('[data-scan-choice]').forEach(b=>b.disabled=true);
    if(!good){const right=$('refreshStage').querySelector(`[data-scan-choice="${c.answer}"]`);right?.classList.add('correct');}
    $('scanFeedback').innerHTML=`<div class="scan-feedback"><strong>${good?'✓ Good call':'✕ Missed'}</strong>${state.instructor?`<br>Objective ${c.objective} • ${esc(c.why)}`:''}</div>`;
    setTimeout(()=>{if(!scan)return;scan.index++;scan.locked=false;if(scan.index>=scan.cases.length)finishScan(false);else renderScanCase();},state.instructor?900:520);
  }
  function finishScan(timedOut){
    if(!scan)return;clearInterval(timer);timer=null;
    const total=scan.answers.length||1,score=pct(scan.correct,total),byDomain={};
    DOMAINS.forEach(d=>byDomain[d]={correct:0,total:0});
    scan.answers.forEach(a=>{byDomain[a.domain].total++;if(a.good)byDomain[a.domain].correct++;});
    const results=DOMAINS.map(d=>({domain:d,...byDomain[d],score:pct(byDomain[d].correct,byDomain[d].total)})).sort((a,b)=>a.score-b.score);
    const weakest=results[0]?.domain||'—';
    state.scanRuns++;state.bestScore=Math.max(state.bestScore,score);state.lastScan={score,weakest,when:Date.now(),results,missed:scan.answers.filter(a=>!a.good)};save();
    $('refreshBest').textContent=state.bestScore+'%';$('refreshRuns').textContent=state.scanRuns+state.queueRuns;
    scan=null;
    $('refreshStage').innerHTML=`<div class="refresh-hero"><div class="refresh-kicker">SCAN COMPLETE</div><h2>${score>=87?'Skills are sharp.':score>=73?'Solid base—refresh the weak edges.':'Good reason to refresh before relying on memory.'}</h2><p>${timedOut?'Time expired, so unanswered scenarios count as unassessed rather than wrong. ':''}This score is a TechOps refresh benchmark, not a CompTIA exam prediction.</p><div class="refresh-summary"><div><small>SCORE</small><strong>${score}%</strong></div><div><small>CORRECT</small><strong>${state.lastScan.results.reduce((n,r)=>n+r.correct,0)}/${total}</strong></div><div><small>WEAKEST</small><strong style="font-size:.84rem">${esc(weakest)}</strong></div><div><small>BEST RUN</small><strong>${state.bestScore}%</strong></div></div><div class="domain-bars">${results.map(r=>`<div class="domain-result"><div class="head"><strong>${esc(r.domain)}</strong><span>${r.score}% • ${r.correct}/${r.total}</span></div><div class="track"><span style="width:${r.score}%"></span></div><div style="margin-top:8px"><button class="refresh-btn" data-domain="${esc(r.domain)}">DRILL THIS DOMAIN</button></div></div>`).join('')}</div>${state.lastScan.missed.length?`<div class="weak-callout"><strong>${state.lastScan.missed.length} refresh targets found.</strong><div style="margin-top:7px">${state.lastScan.missed.map(m=>`<span class="refresh-badge">${m.objective} ${esc(m.domain)}</span>`).join('')}</div></div>`:'<div class="mode-note">No misses in this run. Use Repair Room Challenge for a more applied check.</div>'}<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="refresh-btn primary" id="scanAgain">RUN AGAIN</button><button class="refresh-btn" id="scanReview">OPEN REVIEWER REPORT</button></div></div>`;
    $('refreshStage').querySelectorAll('[data-domain]').forEach(b=>b.addEventListener('click',()=>openDomain(b.dataset.domain)));
    $('scanAgain').addEventListener('click',startScan);$('scanReview').addEventListener('click',()=>render('review'));
  }

  function renderQueueIntro(){
    $('refreshStage').innerHTML=`<div class="refresh-hero"><div class="refresh-kicker">FIELD TECH / REPAIR ROOM MODE</div><h2>Eight-minute Repair Room Challenge</h2><p>Six devices arrive at once: a Chromebook-style laptop, desktop, wireless room, printer, classroom display, and failing storage device. Each ticket must move through safe evidence, corrective action, and verification.</p><div class="refresh-summary"><div><small>DEVICES</small><strong>6</strong></div><div><small>DECISIONS</small><strong>18</strong></div><div><small>WINDOW</small><strong>8:00</strong></div><div><small>RETRIES</small><strong>ALLOWED</strong></div></div><div class="mode-note">The Chromebook repair ticket is a <strong>real-world bonus scenario</strong>. It reinforces Core 1 mobile hardware and troubleshooting concepts, but TechOps still keeps official exam coverage vendor-neutral.</div><div style="margin-top:16px"><button id="startQueue" class="refresh-btn primary">OPEN REPAIR QUEUE</button></div></div>`;
    $('startQueue').addEventListener('click',startQueue);
  }
  function startQueue(){
    queue={cases:REPAIR_QUEUE.map(c=>({...c,step:0,done:false,wrong:0})),seconds:480,active:0,completed:0,wrong:0,start:Date.now()};
    renderQueue();timer=setInterval(()=>{if(!queue)return;queue.seconds--;const e=$('queueTimer');if(e){const m=Math.floor(queue.seconds/60),s=queue.seconds%60;e.textContent=`${m}:${String(s).padStart(2,'0')}`;}if(queue.seconds<=0)finishQueue(true);},1000);
  }
  function renderQueue(){
    const c=queue.cases[queue.active];
    $('refreshStage').innerHTML=`<div class="refresh-hero"><div class="refresh-kicker">REPAIR ROOM • <span id="queueTimer">${Math.floor(queue.seconds/60)}:${String(queue.seconds%60).padStart(2,'0')}</span></div><h2>Service queue: ${queue.completed}/6 resolved</h2><div class="repair-queue">${queue.cases.map((x,i)=>`<button class="repair-device ${x.done?'done':''} ${i===queue.active?'active':''}" data-device="${i}" ${x.done?'disabled':''}><span class="status">${x.done?'RESOLVED':i===queue.active?'ON BENCH':'WAITING'}</span><div style="font-size:1.6rem">${x.icon}</div><strong>${esc(x.title)}</strong><small>${esc(x.objective)} • ${esc(x.domain)}</small></button>`).join('')}</div><div id="repairWork" class="repair-work"></div></div>`;
    $('refreshStage').querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',()=>{queue.active=Number(b.dataset.device);renderQueue();}));
    renderRepairStep(c);
  }
  function renderRepairStep(c){
    const s=c.steps[c.step],work=$('repairWork');if(!work)return;
    work.innerHTML=`<div class="refresh-kicker">ACTIVE DEVICE • ${esc(c.objective)}</div><h3>${esc(c.title)}</h3><p style="color:#9bb3c2">${esc(c.symptom)}</p><div style="margin:12px 0">${c.steps.map((x,i)=>`<div class="repair-step ${i<c.step?'done':''}"><span>${i<c.step?'✓':i+1}</span><strong>${esc(x.q)}</strong></div>`).join('')}</div><div class="scan-choices">${s.choices.map((x,i)=>`<button class="scan-choice" data-repair-choice="${i}">${esc(x)}</button>`).join('')}</div><div id="repairFeedback"></div>`;
    work.querySelectorAll('[data-repair-choice]').forEach(b=>b.addEventListener('click',()=>answerRepair(c,s,Number(b.dataset.repairChoice),b)));
  }
  function answerRepair(c,s,choice,button){
    const good=choice===s.answer;
    if(!good){queue.wrong++;c.wrong++;button.classList.add('wrong');button.disabled=true;$('repairFeedback').innerHTML=`<div class="scan-feedback"><strong>Not the best field move.</strong>${state.instructor?'<br>'+esc(s.why):' Reassess the evidence and try another action.'}</div>`;return;}
    button.classList.add('correct');$('repairWork').querySelectorAll('[data-repair-choice]').forEach(b=>b.disabled=true);$('repairFeedback').innerHTML=`<div class="scan-feedback"><strong>✓ Step cleared.</strong>${state.instructor?'<br>'+esc(s.why):''}</div>`;
    setTimeout(()=>{c.step++;if(c.step>=c.steps.length){c.done=true;queue.completed++;const next=queue.cases.findIndex(x=>!x.done);if(next===-1){finishQueue(false);return;}queue.active=next;renderQueue();}else renderRepairStep(c);},state.instructor?800:450);
  }
  function finishQueue(timedOut){
    if(!queue)return;clearInterval(timer);timer=null;const completed=queue.completed,wrong=queue.wrong,elapsed=Math.round((Date.now()-queue.start)/1000);const score=Math.max(0,Math.round((completed/6)*100)-Math.min(30,wrong*3));
    state.queueRuns++;if(!state.bestQueue||score>state.bestQueue.score)state.bestQueue={score,completed,wrong,elapsed,when:Date.now()};save();$('refreshRuns').textContent=state.scanRuns+state.queueRuns;queue=null;
    $('refreshStage').innerHTML=`<div class="refresh-hero"><div class="refresh-kicker">REPAIR ROOM COMPLETE</div><h2>${completed===6?'Queue cleared.':'Shift window closed.'}</h2><p>${timedOut?'The service timer expired. ':''}This mode measures prioritization and repair reasoning, not just vocabulary recall.</p><div class="refresh-summary"><div><small>RESOLVED</small><strong>${completed}/6</strong></div><div><small>FIELD SCORE</small><strong>${score}%</strong></div><div><small>BAD MOVES</small><strong>${wrong}</strong></div><div><small>ELAPSED</small><strong>${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}</strong></div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="refresh-btn primary" id="queueAgain">RUN QUEUE AGAIN</button><button class="refresh-btn" id="queueFaults">OPEN TROUBLESHOOTING ARENA</button><button class="refresh-btn" id="queueReview">REVIEWER REPORT</button></div></div>`;
    $('queueAgain').addEventListener('click',startQueue);$('queueFaults').addEventListener('click',()=>openDomain('Troubleshooting'));$('queueReview').addEventListener('click',()=>render('review'));
  }

  function renderReview(){
    const report=buildReport();
    $('refreshStage').innerHTML=`<div class="refresh-hero"><div class="refresh-kicker">PROFESSIONAL PLAYTEST / INSTRUCTOR TOOLS</div><h2>Field Reviewer Report</h2><p>An experienced technician can use this panel to review accuracy, difficulty, realism, and whether TechOps teaches the right habits. Notes stay on this browser until cleared.</p><div class="instructor-toggle"><div><strong>Instructor Lens</strong><small>Show objective references and teaching rationale during refresh challenges.</small></div><button id="reviewInstructor" class="${state.instructor?'on':''}" aria-pressed="${state.instructor}"></button></div><div class="review-grid" style="margin-top:14px"><section class="review-panel"><strong>Reviewer notes</strong><textarea id="reviewNotes" placeholder="Example: The Chromebook charge-port workflow feels realistic, but add a USB-C power meter and battery health check...">${esc(state.notes||'')}</textarea><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:9px"><button id="saveReview" class="refresh-btn primary">SAVE NOTES</button><button id="clearReview" class="refresh-btn danger">CLEAR</button></div></section><section class="review-panel"><strong>Copyable TechOps review packet</strong><div id="reviewLog" class="review-log">${esc(report)}</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:9px"><button id="copyReview" class="refresh-btn primary">COPY REVIEW PACKET</button><button id="openLabMatrix" class="refresh-btn">OPEN CORE 1 MATRIX</button></div></section></div></div>`;
    $('reviewInstructor').addEventListener('click',()=>{state.instructor=!state.instructor;save();renderReview();});
    $('saveReview').addEventListener('click',()=>{state.notes=$('reviewNotes').value;save();$('reviewLog').textContent=buildReport();toast('Reviewer notes saved locally.');});
    $('clearReview').addEventListener('click',()=>{state.notes='';save();renderReview();});
    $('copyReview').addEventListener('click',copyReport);$('openLabMatrix').addEventListener('click',()=>openLab('matrix'));
  }
  function buildReport(){
    const last=state.lastScan;const lab=window.__TECHOPS_LAB__;
    const lines=['TECHOPS FIELD REVIEW PACKET','Build: Core 1 Playtest 0.3 + Technician Refresh','Generated: '+new Date().toLocaleString(),'Browser: '+navigator.userAgent,'','REFRESH RESULTS','Skills scan runs: '+state.scanRuns,'Best skills scan: '+state.bestScore+'%','Repair queue runs: '+state.queueRuns,'Best repair queue: '+(state.bestQueue?state.bestQueue.score+'% ('+state.bestQueue.completed+'/6 devices, '+state.bestQueue.wrong+' bad moves)':'not run'),'Core 1 lab coverage: '+(lab?.coverage?.()||0)+'%'];
    if(last){lines.push('Last scan: '+last.score+'%','Weakest domain: '+last.weakest);last.results.forEach(r=>lines.push('  - '+r.domain+': '+r.score+'% ('+r.correct+'/'+r.total+')'));if(last.missed?.length)lines.push('Refresh targets: '+last.missed.map(m=>m.objective+' '+m.domain).join(', '));}
    lines.push('','REVIEWER NOTES',state.notes||'(none yet)','', 'Suggested review prompts:','- Did the tool behave like a real support environment?','- Were any explanations technically misleading?','- Which repairs felt too easy or too game-like?','- What would you add for a real school/repair-room technician?','- Would you trust this activity to teach a beginner the right habit?');
    return lines.join('\n');
  }
  async function copyReport(){state.notes=$('reviewNotes')?.value||state.notes;save();const text=buildReport();try{await navigator.clipboard.writeText(text);toast('Review packet copied.');}catch(_){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('Review packet copied.');}$('reviewLog').textContent=text;}

  function openDomain(domain){const view=LAB_MAP[domain]||'hub';openLab(view);}
  function openLab(view){close();window.__TECHOPS_LAB__?.open?.();setTimeout(()=>window.__TECHOPS_LAB__?.renderView?.(view),80);}
  function toast(text){const t=$('refreshToast');if(!t)return;t.textContent=text;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),1800);}

  function install(){
    ['refreshBtn','titleRefreshBtn','menuRefreshBtn','railRefreshBtn'].forEach(id=>$(id)?.addEventListener('click',()=>{if(id==='menuRefreshBtn')$('menuPanel')?.classList.add('hidden');open();}));
    window.addEventListener('keydown',e=>{if(!$('refreshOverlay')?.classList.contains('hidden')&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}},true);
  }
  function boot(){ensure();install();window.__TECHOPS_REFRESH__={open,close,state,startScan,startQueue,render,buildReport};}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
