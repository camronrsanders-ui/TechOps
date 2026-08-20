(() => {
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  const missions = [
    {
      id: 'INC-001', title: 'No Internet, No Mercy', caller: 'Maya Chen', dept: 'Accounting', avatar: 'MC', risk: 42,
      report: 'My laptop says it is connected to Wi-Fi, but every site says there is no internet. Payroll closes in 20 minutes.',
      core: '220-1201 • Core 1', domain: 'Networking + Network Troubleshooting', concepts: ['APIPA', 'DHCP', 'IPv4', 'Verification'],
      objectives: ['Inspect the client configuration', 'Identify the addressing failure', 'Restore a valid network lease', 'Verify end-to-end connectivity', 'Document and close the ticket'],
      hint: 'Start by gathering evidence from the workstation. A valid-looking Wi-Fi icon does not prove valid IP configuration.',
      solutionSteps: ['inspect_ip','renew_dhcp','verify_web'],
      rootCause: 'DHCP lease failure caused an APIPA address (169.254.x.x).',
      apps: {
        network: { title:'Network Status', body:'Wi-Fi: Connected\nSSID: Northstar-Staff\nIPv4: 169.254.44.18\nSubnet: 255.255.0.0\nGateway: —\nDNS: —' },
        browser: { title:'Browser', body:'ERR_INTERNET_DISCONNECTED\n\nThe browser cannot reach the internet.' }
      },
      commands: {
        'ipconfig': 'Windows IP Configuration\n\nWireless LAN adapter Wi-Fi:\n   IPv4 Address. . . . . . . . : 169.254.44.18\n   Subnet Mask . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . :',
        'ipconfig /all': 'DHCP Enabled. . . . . . . . . : Yes\nAutoconfiguration IPv4 Address : 169.254.44.18\nDHCP Server . . . . . . . . . : Unavailable\nDNS Servers . . . . . . . . . :',
        'ipconfig /renew': 'Windows IP Configuration\n\nLease renewed.\nIPv4 Address. . . . . . . . : 10.20.14.87\nSubnet Mask . . . . . . . . : 255.255.255.0\nDefault Gateway . . . . . . : 10.20.14.1',
        'nslookup comptia.org': 'Server: 10.20.1.10\nAddress: 10.20.1.10\n\nName: comptia.org\nAddress: 104.18.33.222'
      }
    },
    {
      id: 'INC-002', title: 'Heat Death', caller: 'Andre Lewis', dept: 'Design', avatar: 'AL', risk: 58,
      report: 'This desktop is fine until I render a video. Then the fans scream and the whole thing shuts off. I already lost one export.',
      core: '220-1201 • Core 1', domain: 'Hardware + Hardware Troubleshooting', concepts: ['Cooling', 'Thermal shutdown', 'Inspection', 'Verification'],
      objectives: ['Observe performance symptoms', 'Inspect CPU cooling', 'Correct the cooling problem', 'Stress-test the system', 'Document and close the ticket'],
      hint: 'The failure only occurs under load. Hardware that becomes unstable as heat rises should move cooling high on your suspect list.',
      solutionSteps: ['inspect_temp','select_cpu','clean_cooling','stress_test'],
      rootCause: 'CPU overheating from a dust-blocked heatsink and restricted airflow.',
      apps: {
        taskmgr: { title:'Task Manager', body:'CPU: 94%\nMemory: 63%\nDisk: 11%\nGPU: 74%\n\nThermal warning: CPU package 98°C during render.' },
        device: { title:'Device Manager', body:'No devices are reporting errors.' }
      }, commands: {}
    },
    {
      id: 'INC-003', title: 'Pop-Up Plague', caller: 'Sofia Rivera', dept: 'Sales', avatar: 'SR', risk: 71,
      report: 'My browser keeps opening weird pages and my homepage changed after I installed a free converter. Now the computer is crawling.',
      core: '220-1202 • Core 2', domain: 'Security + Software Troubleshooting', concepts: ['Malware symptoms', 'Containment', 'Removal', 'Verification'],
      objectives: ['Identify suspicious behavior', 'Contain the endpoint', 'Find the suspicious process', 'Run approved remediation', 'Verify the system is clean', 'Document and close the ticket'],
      hint: 'Treat unexpected redirects plus a recent unknown install as a security incident, not just a slow-browser complaint.',
      solutionSteps: ['inspect_process','isolate','scan','reboot_rescan'],
      rootCause: 'Potentially unwanted/malicious software installed with an untrusted converter.',
      apps: {
        browser: { title:'Browser', body:'Homepage: quick-search-now.example\nPop-ups blocked: 37\nRedirect detected when opening known sites.' },
        taskmgr: { title:'Task Manager', body:'PROCESS                 CPU     MEMORY\nchrome.exe              22%     1.4 GB\nQuickConvertHelper.exe  31%     612 MB  ⚠\nUpdateHost32.exe        14%     288 MB  ⚠\nexplorer.exe             4%     190 MB' },
        defender: { title:'Windows Security', body:'Virus & threat protection\nDefinitions: Current\nLast scan: 18 days ago\nPotential threats: Scan required' }
      }, commands: {}
    },
    {
      id: 'INC-004', title: 'POST Mortem', caller: 'Devon King', dept: 'Engineering', avatar: 'DK', risk: 66,
      report: 'I upgraded the RAM this morning. The PC powers on, but there is no normal display and it keeps beeping.',
      core: '220-1201 • Core 1', domain: 'Hardware Troubleshooting', concepts: ['POST', 'RAM seating', 'Compatibility', 'ESD'],
      objectives: ['Use safe hardware procedure', 'Inspect the recently changed component', 'Correct the installation', 'Verify POST succeeds', 'Document and close the ticket'],
      hint: 'When a problem starts immediately after a hardware change, begin with the thing that changed.',
      solutionSteps: ['bench_poweroff','bench_esd','select_ram','reseat_ram','verify_post'],
      rootCause: 'A RAM module was not fully seated after the upgrade.',
      apps: {}, commands: {}
    },
    {
      id: 'INC-005', title: 'Printer From Hell', caller: 'Nina Patel', dept: 'Front Office', avatar: 'NP', risk: 49,
      report: 'The front printer is online, but my jobs just sit there. Everyone is waiting on visitor badges.',
      core: '220-1201 + 220-1202', domain: 'Printers + Operating Systems + Troubleshooting', concepts: ['Print queue', 'Spooler', 'Connectivity', 'Verification'],
      objectives: ['Inspect the print queue', 'Identify the stalled service/job', 'Restore printing', 'Verify with a test page', 'Document and close the ticket'],
      hint: 'If the printer is online but jobs never leave the workstation, inspect the local queue and print service before replacing hardware.',
      solutionSteps: ['inspect_printer','clear_queue','restart_spooler','test_print'],
      rootCause: 'A stuck print job blocked the queue until the queue was cleared and Print Spooler restarted.',
      apps: {
        printer: { title:'Printers & scanners', body:'Front-Office-Laser\nStatus: Online\nQueue: 7 jobs\nOldest job: Visitor_Badges.pdf — Error' }
      }, commands: {
        'net stop spooler': 'The Print Spooler service was stopped successfully.',
        'net start spooler': 'The Print Spooler service was started successfully.'
      }
    }
  ];

  const state = {
    started:false, activeMission:0, unlocked:1, completed:new Set(), steps:new Set(), xp:0, rep:100, credits:250,
    selectedPart:null, poweredDown:false, esd:false, isolated:false, hints:0,
    mastery:{'Mobile Devices':0,'Networking':0,'Hardware':0,'Virtualization & Cloud':0,'Hardware/Network Troubleshooting':0,'Operating Systems':0,'Security':0,'Software Troubleshooting':0,'Operational Procedures':0}
  };

  function save(){
    try { localStorage.setItem('techops-v01', JSON.stringify({...state, completed:[...state.completed], steps:[...state.steps]})); } catch(_){}
  }
  function load(){
    try {
      const raw = localStorage.getItem('techops-v01'); if(!raw) return;
      const s = JSON.parse(raw); Object.assign(state,s); state.completed=new Set(s.completed||[]); state.steps=new Set();
    } catch(_){}
  }

  function log(msg,type=''){
    const el=$('actionFeed'); el.textContent=msg; el.className='action-feed '+type;
  }
  function level(){ return 1+Math.floor(state.xp/900); }
  function updateHUD(){ $('level').textContent=level();$('xp').textContent=state.xp;$('rep').textContent=state.rep;$('credits').textContent=state.credits; }

  function renderMissionList(){
    const box=$('missionList'); box.innerHTML='';
    missions.forEach((m,i)=>{
      const b=document.createElement('button'); b.className='mission-btn';
      if(i===state.activeMission) b.classList.add('active');
      if(state.completed.has(m.id)) b.classList.add('done');
      if(i>=state.unlocked && !state.completed.has(m.id)){b.classList.add('locked');b.disabled=true;}
      b.innerHTML=`<strong>${state.completed.has(m.id)?'✓ ':''}${m.id}</strong><small>${m.title}</small>`;
      b.addEventListener('click',()=>activateMission(i)); box.appendChild(b);
    });
  }

  function activateMission(index){
    if(index>=state.unlocked && !state.completed.has(missions[index].id)) return;
    state.activeMission=index; state.steps=new Set(); state.selectedPart=null;state.poweredDown=false;state.esd=false;state.isolated=false;
    const m=missions[index];
    $('missionCode').textContent=m.id;$('missionTitle').textContent=m.title;$('callerName').textContent=m.caller;$('callerDept').textContent=m.dept;$('callerText').textContent=m.report;$('avatar').textContent=m.avatar;
    $('riskBar').style.width=m.risk+'%';$('riskLabel').textContent=m.risk+'%';$('assistText').textContent='Tech Assist ready. Use it only if you are actually stuck.';$('examTag').textContent=`${m.core}\n${m.domain}\n${m.concepts.join(' • ')}`;
    $('objectiveList').innerHTML=m.objectives.map((o,i)=>`<div class="objective" data-objective="${i}"><span class="check"></span><span>${o}</span></div>`).join('');
    $('noteSummary').value='';$('noteCause').value='';$('noteFix').value='';$('noteVerify').value='';
    $('benchReadout').textContent='Select a component to inspect it.';$('networkReadout').textContent='Rack online. No investigation performed.';
    closeApp(); switchView('desktop'); renderMissionList(); updateObjectives(); log('Ticket accepted. Gather evidence before changing things.'); save();
  }

  function mark(step,msg,xp=70){
    if(state.steps.has(step)) { log('You already completed that action.'); return false; }
    state.steps.add(step); state.xp += xp; log(msg,'success'); updateHUD(); updateObjectives(); save(); return true;
  }

  function wrong(msg){ state.rep=Math.max(0,state.rep-4); log('BAD MOVE: '+msg,'danger'); updateHUD(); save(); }

  function updateObjectives(){
    const m=missions[state.activeMission];
    const progress=m.solutionSteps.filter(s=>state.steps.has(s)).length;
    const objs=$$('.objective');
    objs.forEach((o,i)=>{
      const threshold=Math.min(i+1,m.solutionSteps.length);
      if(progress>=threshold){o.classList.add('done');o.querySelector('.check').textContent='✓';}
    });
    const percent=Math.round((progress/m.solutionSteps.length)*100);
    const currentRisk=Math.max(5,m.risk-Math.round(percent*.5)); $('riskBar').style.width=currentRisk+'%'; $('riskLabel').textContent=currentRisk+'%';
  }

  function switchView(view){
    $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===view));
    ['desktop','bench','network','ticket'].forEach(v=>$(v+'View').classList.toggle('hidden',v!==view));
  }

  function openApp(name){
    const m=missions[state.activeMission]; const win=$('appWindow'); const body=$('windowBody');
    win.classList.remove('hidden');
    if(name==='terminal'){ $('windowTitle').textContent='Windows Terminal'; body.innerHTML=`<div id="terminalOut" class="terminal">Microsoft Windows [Version 10.0.26100]\n(c) Microsoft Corporation.\n\nC:\\Users\\Tech&gt;</div><div class="command-row"><input id="terminalInput" autocomplete="off" placeholder="Type a command"><button id="terminalRun">RUN</button></div>`; $('terminalRun').addEventListener('click',runCommand);$('terminalInput').addEventListener('keydown',e=>{if(e.key==='Enter')runCommand();}); return; }
    $('windowTitle').textContent=(m.apps[name]?.title)||appTitle(name);
    if(name==='taskmgr' && m.id==='INC-003') mark('inspect_process','You found two suspicious processes tied to the unwanted converter.',60);
    if(name==='taskmgr' && m.id==='INC-002') mark('inspect_temp','Task Manager/performance data shows the CPU hitting 98°C under load.',60);
    if(name==='printer' && m.id==='INC-005') mark('inspect_printer','The printer itself is online, but one errored job is blocking the local queue.',60);
    if(name==='network' && m.id==='INC-001') mark('inspect_ip','The workstation has 169.254.44.18 with no gateway. That is APIPA.',60);
    body.innerHTML=formatAppBody(m.apps[name]?.body || genericApp(name,m));
    injectAppActions(name,m,body);
  }

  function appTitle(name){return ({network:'Network Status',taskmgr:'Task Manager',device:'Device Manager',defender:'Windows Security',browser:'Browser',printer:'Printers & scanners'})[name]||name;}
  function formatAppBody(text){ return `<div class="readout" style="min-height:230px;white-space:pre-wrap">${escapeHTML(text)}</div>`; }
  function escapeHTML(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
  function genericApp(name,m){
    if(name==='network') return 'Wi-Fi: Connected\nIPv4: 10.20.14.55\nGateway: 10.20.14.1\nDNS: 10.20.1.10';
    if(name==='taskmgr') return 'CPU: 18%\nMemory: 42%\nDisk: 4%\nNo obvious abnormal process activity.';
    if(name==='device') return 'Device Manager\nAll detected devices are functioning normally.';
    if(name==='defender') return 'Windows Security\nNo current actions required.';
    if(name==='browser') return 'Northstar Portal\nConnection successful.';
    if(name==='printer') return 'No configured printer issue is visible for this mission.';
    return 'No useful data.';
  }

  function injectAppActions(name,m,body){
    const wrap=document.createElement('div');wrap.style.marginTop='10px';wrap.style.display='grid';wrap.style.gap='7px';
    const add=(label,fn)=>{const b=document.createElement('button');b.className='btn';b.textContent=label;b.addEventListener('click',fn);wrap.appendChild(b);};
    if(m.id==='INC-001' && name==='network') add('Renew DHCP lease',()=>{mark('renew_dhcp','DHCP renewal succeeded. New address: 10.20.14.87 /24, gateway 10.20.14.1.',100);body.querySelector('.readout').textContent='Wi-Fi: Connected\nSSID: Northstar-Staff\nIPv4: 10.20.14.87\nSubnet: 255.255.255.0\nGateway: 10.20.14.1\nDNS: 10.20.1.10';});
    if(m.id==='INC-001' && name==='browser') add('Reload known site',()=>{if(!state.steps.has('renew_dhcp')) wrong('The site still fails because you have not fixed the invalid addressing.'); else mark('verify_web','Known sites load and DNS resolution works. Connectivity is verified.',100);});
    if(m.id==='INC-002' && name==='taskmgr') add('Run CPU stress test',()=>{if(!state.steps.has('clean_cooling')) wrong('You stress the CPU before correcting the cooling problem. The workstation thermal-shuts down again.'); else mark('stress_test','Stress test completes at 74°C with no shutdown. Cooling is stable.',100);});
    if(m.id==='INC-003' && name==='network') add('Disconnect Wi-Fi',()=>{state.isolated=true;mark('isolate','Endpoint isolated from the network before remediation.',90);});
    if(m.id==='INC-003' && name==='defender') {add('Run full malware scan',()=>{if(!state.isolated) wrong('You started remediation before containing the suspicious endpoint.'); else mark('scan','Approved full scan removes the malicious/unwanted software and related startup entry.',110);}); add('Reboot and rescan',()=>{if(!state.steps.has('scan')) wrong('Rebooting does not replace remediation. The threat is still present.'); else mark('reboot_rescan','Reboot and second scan are clean. Browser behavior is normal.',100);});}
    if(m.id==='INC-004' && name==='device') add('Keep troubleshooting Windows',()=>wrong('The machine is failing during POST, before Windows/device drivers are relevant.'));
    if(m.id==='INC-005' && name==='printer'){add('Cancel all queued jobs',()=>mark('clear_queue','You removed the blocking errored job and cleared the queue.',80));add('Print test page',()=>{if(!state.steps.has('restart_spooler')) wrong('The queue is clear, but the spooler has not been reset.'); else mark('test_print','Test page prints successfully. Printing is verified.',100);});}
    body.appendChild(wrap);
  }

  function runCommand(){
    const input=$('terminalInput');const out=$('terminalOut');if(!input||!out)return;const raw=input.value.trim();if(!raw)return;const cmd=raw.toLowerCase();const m=missions[state.activeMission];
    out.textContent += `\nC:\\Users\\Tech>${raw}\n`;
    if(m.id==='INC-001' && ['ipconfig','ipconfig /all'].includes(cmd)) { mark('inspect_ip','Command output confirms an APIPA address and missing gateway.',60); out.textContent += m.commands[cmd]; }
    else if(m.id==='INC-001' && cmd==='ipconfig /renew') { mark('renew_dhcp','The DHCP lease renews successfully and the workstation receives 10.20.14.87.',100);out.textContent += m.commands[cmd]; }
    else if(m.id==='INC-001' && (cmd==='ping 8.8.8.8'||cmd==='nslookup comptia.org')) { if(!state.steps.has('renew_dhcp')) out.textContent += 'Request failed. No valid route is available.'; else {mark('verify_web','Network and name-resolution tests succeed. Connectivity is verified.',100);out.textContent += cmd.startsWith('ping')?'Reply from 8.8.8.8: bytes=32 time=18ms TTL=117':m.commands['nslookup comptia.org'];} }
    else if(m.id==='INC-005' && cmd==='net stop spooler') {out.textContent+=m.commands[cmd];}
    else if(m.id==='INC-005' && cmd==='net start spooler') { if(!state.steps.has('clear_queue')) wrong('Restarting the service while the blocking job remains may not fix the queue.'); mark('restart_spooler','Print Spooler restarts successfully.',90);out.textContent+=m.commands[cmd]; }
    else if(cmd==='whoami') out.textContent+='northstar\\tech.level1';
    else if(cmd==='hostname') out.textContent+='WS-014';
    else if(cmd==='help') out.textContent+='Try commands such as ipconfig, ping, nslookup, hostname, whoami, or service commands relevant to the ticket.';
    else out.textContent+=`'${raw}' completed with no useful result for this simulation.`;
    input.value='';out.scrollTop=out.scrollHeight;updateHUD();
  }

  function closeApp(){ $('appWindow').classList.add('hidden'); }

  function selectPart(part){ state.selectedPart=part; $$('.part').forEach(p=>p.classList.toggle('selected',p.dataset.part===part)); const m=missions[state.activeMission]; let text=`Selected: ${part.toUpperCase()}. `;
    if(m.id==='INC-002'&&part==='cpu'){text+='Heatsink fins are heavily packed with dust. Fan is spinning but airflow is poor.'; mark('select_cpu','Physical inspection finds a dust-blocked CPU heatsink.',70);}
    else if(m.id==='INC-004'&&part==='ram'){text+='One DIMM retaining clip is not fully locked.'; mark('select_ram','The recently installed RAM is visibly not fully seated.',70);} else text+='No obvious visible defect.';
    $('benchReadout').textContent=text;
  }

  function benchTool(tool){const m=missions[state.activeMission];
    if(tool==='poweroff'){state.poweredDown=true;mark('bench_poweroff','System powered down before hardware work.',40);return;}
    if(tool==='esd'){state.esd=true;mark('bench_esd','ESD protection applied.',40);return;}
    if(tool==='reseat'){
      if(!state.poweredDown||!state.esd){wrong('Do not reseat internal components while powered or without ESD protection.');return;}
      if(m.id==='INC-004'&&state.selectedPart==='ram'){mark('reseat_ram','You reseat both DIMMs until the retaining clips fully lock.',100);$('benchReadout').textContent='RAM reseated correctly. Both retaining clips are locked.'; mark('verify_post','POST succeeds after the RAM is correctly seated.',90);} else wrong('Nothing indicates that this component needs reseating.');return;
    }
    if(tool==='clean'){
      if(m.id==='INC-002'&&state.selectedPart==='cpu'){mark('clean_cooling','You remove the dust obstruction and restore airflow through the heatsink.',100);$('benchReadout').textContent='Cooling path cleaned. Airflow restored.';} else wrong('Cleaning that component does not address the evidence you have.');return;
    }
    if(tool==='replace'){wrong('Replacing parts before confirming failure costs credits and can create new problems.');state.credits=Math.max(0,state.credits-35);updateHUD();}
  }

  function networkTool(tool){const m=missions[state.activeMission];
    if(m.id==='INC-001'&&tool==='checkdhcp'){mark('inspect_ip','DHCP scope is healthy, but WS-014 has no active lease. Client-side renewal is appropriate.',50);$('networkReadout').textContent='DHCP scope 10.20.14.0/24: HEALTHY\nAvailable leases: 83\nWS-014 lease: none';}
    else if(m.id==='INC-003'&&tool==='rebootap') wrong('The incident affects one endpoint and shows malware symptoms. Restarting shared Wi-Fi is unrelated.');
    else {$('networkReadout').textContent='Tool result: no fault relevant to this active incident.'; wrong('You spent time checking infrastructure with no evidence pointing there.');}
  }

  function submitTicket(){const m=missions[state.activeMission];const complete=m.solutionSteps.every(s=>state.steps.has(s)); if(!complete){$('ticketHint').textContent='Technical work is not complete yet. Finish the mission objectives first.'; wrong('Closing an unresolved ticket hurts your reputation.');return;}
    if(!$('noteCause').value.trim()||!$('noteFix').value.trim()||!$('noteVerify').value.trim()){$('ticketHint').textContent='Document root cause, resolution, and verification before closure.';return;}
    state.completed.add(m.id);state.xp+=220;state.credits+=120;state.rep=Math.min(100,state.rep+4);state.unlocked=Math.max(state.unlocked,state.activeMission+2);
    addMasteryForMission(m); updateHUD();renderMissionList(); save(); showDebrief(m);
  }

  function addMasteryForMission(m){const d=m.domain; if(d.includes('Networking')) state.mastery['Networking']=Math.min(100,state.mastery['Networking']+18); if(d.includes('Hardware')) state.mastery['Hardware']=Math.min(100,state.mastery['Hardware']+18); if(d.includes('Troubleshooting')) state.mastery['Hardware/Network Troubleshooting']=Math.min(100,state.mastery['Hardware/Network Troubleshooting']+14); if(d.includes('Security')) state.mastery['Security']=Math.min(100,state.mastery['Security']+20); if(d.includes('Software')) state.mastery['Software Troubleshooting']=Math.min(100,state.mastery['Software Troubleshooting']+18); if(d.includes('Operating')) state.mastery['Operating Systems']=Math.min(100,state.mastery['Operating Systems']+16); state.mastery['Operational Procedures']=Math.min(100,state.mastery['Operational Procedures']+10);}

  function showDebrief(m){$('modalBody').innerHTML=`<div class="eyebrow">INCIDENT RESOLVED</div><h2>${m.title}</h2><p><strong>Root cause:</strong> ${m.rootCause}</p><p><strong>What you practiced:</strong> ${m.concepts.join(', ')}</p><p><strong>CompTIA mapping:</strong> ${m.core} — ${m.domain}</p><div class="divider"></div><p>+220 XP • +120 credits • reputation restored</p>${state.completed.size===missions.length?'<h3>FIRST SHIFT COMPLETE</h3><p>You cleared every incident in the starter campaign. The next build can expand this into larger offices, randomized cases, deeper simulated tools, bosses, and exam-readiness tracking.</p>':''}`;$('modal').classList.remove('hidden');}

  function showMastery(){const rows=Object.entries(state.mastery).map(([k,v])=>`<div class="mastery-row"><span>${k}</span><div class="mastery-bar"><div class="mastery-fill" style="width:${v}%"></div></div><strong>${v}%</strong></div>`).join('');$('modalBody').innerHTML=`<div class="eyebrow">A+ SKILL MATRIX</div><h2>Your TechOps mastery</h2><p class="tiny">This tracks what you actually practiced in missions. Later builds can weight mission frequency toward weak exam domains.</p><div class="mastery-grid">${rows}</div>`;$('modal').classList.remove('hidden');}
  function showMap(){$('modalBody').innerHTML=`<div class="eyebrow">NORTHSTAR SYSTEMS</div><h2>Office Map</h2><div class="office-map"><div class="room"><strong>Help Desk</strong><span>Your home base. Ticket queue, remote sessions, inventory.</span></div><div class="room"><strong>Accounting</strong><span>Network and productivity incidents.</span></div><div class="room"><strong>Design Lab</strong><span>High-performance hardware and thermal incidents.</span></div><div class="room"><strong>Sales</strong><span>Security, mobile, email, and browser incidents.</span></div><div class="room"><strong>Server / Network</strong><span>Switches, access points, DHCP, VLANs, cabling.</span></div><div class="room"><strong>Hardware Bench</strong><span>PC repair, upgrades, POST, storage, power, cooling.</span></div></div>`;$('modal').classList.remove('hidden');}

  function hint(){const m=missions[state.activeMission]; if(state.xp>=15)state.xp-=15;state.hints++;$('assistText').textContent=m.hint;updateHUD();save();}

  function initEvents(){
    $('startGame').addEventListener('click',()=>{$('titleScreen').classList.add('hidden');$('gameScreen').classList.remove('hidden');state.started=true;activateMission(Math.min(state.activeMission,state.unlocked-1));});
    $$('.tab').forEach(t=>t.addEventListener('click',()=>switchView(t.dataset.view)));
    $$('.desktop-icon').forEach(i=>i.addEventListener('click',()=>openApp(i.dataset.app)));
    $('closeWindow').addEventListener('click',closeApp);
    $$('.part').forEach(p=>p.addEventListener('click',()=>selectPart(p.dataset.part)));
    $$('.tool-btn[data-tool]').forEach(b=>b.addEventListener('click',()=>benchTool(b.dataset.tool)));
    $$('[data-nettool]').forEach(b=>b.addEventListener('click',()=>networkTool(b.dataset.nettool)));
    $('submitTicket').addEventListener('click',submitTicket);$('askAssist').addEventListener('click',hint);$('openMastery').addEventListener('click',showMastery);$('openMap').addEventListener('click',showMap);
    $('closeModal').addEventListener('click',()=>$('modal').classList.add('hidden'));$('modal').addEventListener('click',e=>{if(e.target===$('modal'))$('modal').classList.add('hidden');});
  }

  function clock(){const d=new Date();$('clock').textContent=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});}
  load();initEvents();updateHUD();renderMissionList();clock();setInterval(clock,30000);
})();
