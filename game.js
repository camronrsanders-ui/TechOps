(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const SAVE_KEY = 'techops-first-shift-v02';

  const DOMAIN_WEIGHTS = {
    'Core 1 • Mobile Devices': 13,
    'Core 1 • Networking': 23,
    'Core 1 • Hardware': 25,
    'Core 1 • Virtualization & Cloud': 11,
    'Core 1 • Hardware/Network Troubleshooting': 28,
    'Core 2 • Operating Systems': 28,
    'Core 2 • Security': 28,
    'Core 2 • Software Troubleshooting': 23,
    'Core 2 • Operational Procedures': 21
  };

  const missions = [
    {
      id:'INC-001', title:'Payday Panic', target:'maya', risk:54, caller:'Maya Chen', dept:'Accounting', avatar:'MC',
      report:'Payroll closes in twenty minutes. My laptop says Wi-Fi is connected, but every site says there is no internet.',
      exam:'220-1201 • Core 1', domain:'Networking + Network Troubleshooting', refs:'2.4 • 2.6 • 5.5 • Core 2 1.4',
      skills:{'Core 1 • Networking':16,'Core 1 • Hardware/Network Troubleshooting':16,'Core 2 • Operating Systems':8},
      steps:[
        ['inspect_ip','Gather IP configuration evidence'],['renew_dhcp','Restore a valid DHCP lease'],['verify_ping','Verify IP connectivity'],['verify_web','Verify application connectivity'],['document','Document and close the ticket']
      ],
      hint:'A Wi-Fi icon only proves association with an access point. Find the workstation’s IPv4 address, gateway, and DHCP state first.',
      root:'DHCP failed to provide a valid lease, so Windows self-assigned an APIPA 169.254.x.x address.',
      lesson:'APIPA is a clue, not the fix. Confirm addressing, restore DHCP, then verify from lower-layer connectivity up to the user’s actual application.',
      reward:360
    },
    {
      id:'INC-002', title:'Heat Death', target:'andre', risk:63, caller:'Andre Lewis', dept:'Design', avatar:'AL',
      report:'My workstation is normal until I render. Then the fans scream and the PC shuts itself off.',
      exam:'220-1201 • Core 1', domain:'Hardware + Hardware Troubleshooting', refs:'3.4 • 5.1',
      skills:{'Core 1 • Hardware':18,'Core 1 • Hardware/Network Troubleshooting':18},
      steps:[
        ['inspect_temp','Observe performance and temperature data'],['poweroff','Power the workstation down safely'],['select_cpu','Inspect the CPU cooling assembly'],['clean_cooling','Restore airflow and cooling'],['stress_test','Stress-test and verify stability'],['document','Document and close the ticket']
      ],
      hint:'The failure appears under heavy load. Gather temperature data, then inspect the cooling path before replacing expensive parts.',
      root:'A dust-blocked heatsink restricted airflow and pushed the CPU to thermal shutdown temperature.',
      lesson:'Symptoms that appear under load often point to heat or power. Measure first, power down safely, fix the physical cause, and stress-test afterward.',
      reward:390
    },
    {
      id:'INC-003', title:'Pop-Up Plague', target:'sofia', risk:78, caller:'Sofia Rivera', dept:'Sales', avatar:'SR',
      report:'My homepage changed after I installed a free converter. Now ads open by themselves and the computer is crawling.',
      exam:'220-1202 • Core 2', domain:'Security + Software Troubleshooting', refs:'2.0 Security • 3.3',
      skills:{'Core 2 • Security':20,'Core 2 • Software Troubleshooting':18,'Core 2 • Operating Systems':6},
      steps:[
        ['inspect_symptoms','Confirm suspicious browser behavior'],['inspect_process','Identify suspicious processes'],['isolate','Isolate the endpoint from the network'],['scan','Run approved anti-malware remediation'],['quarantine','Quarantine detected threats'],['verify_clean','Reboot and verify a clean rescan'],['document','Document and close the ticket']
      ],
      hint:'Treat unexpected redirects plus a recent untrusted install as a security incident. Contain the endpoint before focusing on cleanup.',
      root:'Potentially unwanted and malicious software arrived with an untrusted converter and installed persistence components.',
      lesson:'Containment protects the environment. Then identify, remediate, update or rescan, reboot if needed, and verify the threat does not return.',
      reward:470
    },
    {
      id:'INC-004', title:'POST Mortem', target:'devon', risk:70, caller:'Devon King', dept:'Engineering', avatar:'DK',
      report:'I upgraded the RAM before stand-up. The PC powers on, beeps, and never reaches the normal display.',
      exam:'220-1201 • Core 1', domain:'Hardware Troubleshooting', refs:'5.1 • Core 2 4.4 safety',
      skills:{'Core 1 • Hardware':16,'Core 1 • Hardware/Network Troubleshooting':22,'Core 2 • Operational Procedures':8},
      steps:[
        ['poweroff','Power down before internal service'],['esd','Use ESD protection'],['select_ram','Inspect the recently changed RAM'],['reseat_ram','Reseat the DIMM correctly'],['post_test','Verify POST completes normally'],['document','Document and close the ticket']
      ],
      hint:'The failure started immediately after a hardware change. Start with what changed and work safely.',
      root:'One DIMM was not fully seated, causing POST beeps and a blank display.',
      lesson:'POST failures happen before the operating system. Recent hardware changes, beep behavior, power state, seating, and compatibility are strong early clues.',
      reward:420
    },
    {
      id:'INC-005', title:'Printer From Hell', target:'nina', risk:58, caller:'Nina Patel', dept:'Front Office', avatar:'NP',
      report:'The front printer says Online, but seven badge jobs are frozen and nobody can print.',
      exam:'220-1201 + 220-1202', domain:'Printers + Windows Troubleshooting', refs:'3.7 • 5.6 • Core 2 3.1',
      skills:{'Core 1 • Hardware':12,'Core 1 • Hardware/Network Troubleshooting':15,'Core 2 • Operating Systems':10,'Core 2 • Software Troubleshooting':12},
      steps:[
        ['inspect_queue','Inspect the print queue'],['clear_queue','Clear the stuck print job'],['restart_spooler','Restart the Print Spooler service'],['test_print','Print and verify a test page'],['document','Document and close the ticket']
      ],
      hint:'The device is online. Before touching toner, cables, or drivers, inspect what Windows is doing with the jobs.',
      root:'A corrupted job froze the local queue. Clearing it and restarting Print Spooler restored printing.',
      lesson:'Separate printer hardware state from the workstation’s print subsystem. A frozen queue and service can block a perfectly reachable printer.',
      reward:380
    },
    {
      id:'INC-006', title:'The Name Game', target:'eli', risk:65, caller:'Eli Brooks', dept:'Operations', avatar:'EB',
      report:'I can reach a server by IP address, but every internal site fails by name. Other desks are fine.',
      exam:'220-1201 + 220-1202', domain:'DNS + Command-line Troubleshooting', refs:'2.1 • 2.4 • 5.5 • Core 2 1.4',
      skills:{'Core 1 • Networking':20,'Core 1 • Hardware/Network Troubleshooting':14,'Core 2 • Operating Systems':12},
      steps:[
        ['prove_ip','Prove basic IP connectivity'],['prove_dns','Test name resolution'],['fix_dns','Correct the client DNS configuration'],['verify_dns','Verify name resolution'],['verify_web','Verify the internal site'],['document','Document and close the ticket']
      ],
      hint:'If an IP address works but the hostname fails, use that contrast. Prove each layer instead of changing everything at once.',
      root:'The client had an incorrect static DNS server while its IP address, gateway, and network path were healthy.',
      lesson:'Ping-by-IP and name resolution test different things. Preserve evidence: first prove the network path, then isolate DNS and verify the repaired name lookup.',
      reward:450
    },
    {
      id:'INC-007', title:'Pairing Panic', target:'jordan', risk:45, caller:'Jordan Price', dept:'Executive Support', avatar:'JP',
      report:'The executive headset worked yesterday. The replacement phone cannot find it and the meeting starts soon.',
      exam:'220-1201 • Core 1', domain:'Mobile Devices', refs:'1.2 • 1.3 • 5.4',
      skills:{'Core 1 • Mobile Devices':24,'Core 1 • Hardware/Network Troubleshooting':8},
      steps:[
        ['enable_bt','Enable Bluetooth on the phone'],['pair_mode','Put the accessory in pairing mode'],['select_headset','Discover and select the correct headset'],['confirm_pin','Complete pairing authentication'],['test_audio','Test connectivity and audio'],['document','Document and close the ticket']
      ],
      hint:'Both sides have to participate in discovery. Check the phone radio, then make the accessory discoverable before chasing hardware failure.',
      root:'Bluetooth was disabled on the replacement phone and the headset was not in pairing mode.',
      lesson:'Bluetooth troubleshooting is procedural: radio on, accessory discoverable, select the right device, complete authentication, then test the actual function.',
      reward:350
    },
    {
      id:'INC-008', title:'Ghost in the Copilot', target:'alex', risk:88, caller:'Alex Morgan', dept:'IT Director', avatar:'AM',
      report:'An employee pasted internal support data into a public AI assistant. Its answer confidently recommends a destructive system action that does not fit the evidence.',
      exam:'220-1202 • Core 2', domain:'Operational Procedures + AI', refs:'4.1 • 4.7 • 4.10',
      skills:{'Core 2 • Operational Procedures':24,'Core 2 • Security':12,'Core 2 • Software Troubleshooting':8},
      steps:[
        ['review_policy','Review the organization AI-use policy'],['classify_ai','Identify public vs. private AI risk'],['flag_hallucination','Flag the unsupported AI recommendation'],['verify_source','Verify against trusted system evidence'],['sanitize_data','Protect sensitive data and choose an approved workflow'],['document','Document the incident and safe outcome']
      ],
      hint:'AI output is evidence to evaluate, not authority. Check data handling rules and independently verify any recommendation before acting.',
      root:'The employee used a public AI service with internal data and treated an unverified hallucinated recommendation as authoritative.',
      lesson:'Current A+ includes AI fundamentals: public vs. private systems, privacy, policy, hallucinations, bias and accuracy. A technician remains responsible for verification.',
      reward:520
    }
  ];

  const entities = [
    {id:'dispatch',kind:'station',name:'Dispatch',x:145,y:120,color:'#2ee7ff'},
    {id:'maya',kind:'npc',name:'Maya',dept:'Accounting',x:380,y:120,color:'#54d4ff'},
    {id:'andre',kind:'npc',name:'Andre',dept:'Design',x:690,y:120,color:'#f7ba68'},
    {id:'sofia',kind:'npc',name:'Sofia',dept:'Sales',x:380,y:315,color:'#f58bc6'},
    {id:'devon',kind:'npc',name:'Devon',dept:'Engineering',x:690,y:315,color:'#a48bff'},
    {id:'nina',kind:'npc',name:'Nina',dept:'Front Office',x:145,y:315,color:'#73f0b0'},
    {id:'eli',kind:'npc',name:'Eli',dept:'Operations',x:930,y:120,color:'#79e2c2'},
    {id:'jordan',kind:'npc',name:'Jordan',dept:'Executive Support',x:930,y:315,color:'#ffd86b'},
    {id:'bench',kind:'station',name:'Repair Bench',x:175,y:535,color:'#ff9d5c'},
    {id:'closet',kind:'station',name:'Network Closet',x:520,y:535,color:'#66d6ff'},
    {id:'mobile',kind:'station',name:'Mobile Lab',x:750,y:535,color:'#70f7a8'},
    {id:'alex',kind:'npc',name:'Alex',dept:'IT Director',x:965,y:530,color:'#ff6477'}
  ];

  const zones = [
    ['HELP DESK',30,35,210,165],['ACCOUNTING',250,35,525,165],['DESIGN',545,35,820,165],['OPERATIONS',840,35,1070,165],
    ['FRONT OFFICE',30,215,210,405],['SALES',250,215,525,405],['ENGINEERING',545,215,820,405],['EXEC SUPPORT',840,215,1070,405],
    ['REPAIR LAB',30,445,340,630],['NETWORK CLOSET',365,445,650,630],['MOBILE LAB',675,445,830,630],['IT DIRECTOR',855,445,1070,630]
  ];

  const state = {
    started:false, active:0, unlocked:1, completed:new Set(), steps:new Set(), xp:0, rep:100, sound:true,
    player:{x:125,y:175}, flags:{}, mastery:{}, shiftMinutes:0, wrongMoves:0
  };

  let audioCtx = null;
  let canvas, ctx, keys = new Set(), nearest = null, animationId = 0, lastTime = 0, toastTimer = 0;

  function mission(){ return missions[state.active]; }
  function requiredSteps(m=mission()){ return m.steps.map(s=>s[0]); }
  function technicalDone(m=mission()){ return requiredSteps(m).filter(id=>id!=='document').every(id=>state.steps.has(id)); }
  function isDone(id){ return state.steps.has(id); }
  function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function serialize(){
    return JSON.stringify({...state,completed:[...state.completed],steps:[...state.steps]});
  }
  function save(){ try{localStorage.setItem(SAVE_KEY,serialize());}catch(_){} }
  function load(){
    try{
      const raw=localStorage.getItem(SAVE_KEY); if(!raw)return false;
      const s=JSON.parse(raw); Object.assign(state,s); state.completed=new Set(s.completed||[]); state.steps=new Set(s.steps||[]); state.flags=s.flags||{}; state.mastery=s.mastery||{};
      return true;
    }catch(_){return false;}
  }
  function resetSave(){ localStorage.removeItem(SAVE_KEY); location.reload(); }

  function beep(type='ok'){
    if(!state.sound) return;
    try{
      audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
      const o=audioCtx.createOscillator(), g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);
      const map={ok:[640,.045],bad:[180,.075],mission:[420,.12],click:[310,.025],complete:[760,.16]};
      const [freq,dur]=map[type]||map.ok;o.frequency.value=freq;o.type=type==='bad'?'sawtooth':'sine';
      g.gain.setValueAtTime(.05,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.start();o.stop(audioCtx.currentTime+dur);
    }catch(_){}
  }

  function level(){ return 1+Math.floor(state.xp/1200); }
  function readiness(){
    const totals=missions.reduce((acc,m)=>{Object.entries(m.skills).forEach(([k,v])=>acc[k]=(acc[k]||0)+v);return acc;},{});
    const max=Object.values(totals).reduce((a,b)=>a+b,0)||1;
    const got=Object.entries(state.mastery).reduce((n,[k,v])=>n+Math.min(v,totals[k]||v),0);
    return Math.min(100,Math.round(got/max*100));
  }
  function updateHUD(){
    $('levelValue').textContent=level();$('xpValue').textContent=state.xp;$('repValue').textContent=state.rep;$('readyValue').textContent=readiness()+'%';
    $('shiftClock').textContent=timeText(9*60+state.shiftMinutes);
  }
  function timeText(total){ const h=Math.floor(total/60)%24,m=total%60; return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'); }

  function startNew(){
    Object.assign(state,{started:true,active:0,unlocked:1,completed:new Set(),steps:new Set(),xp:0,rep:100,player:{x:125,y:175},flags:{},mastery:{},shiftMinutes:0,wrongMoves:0});
    save(); enterGame(); showMissionBanner('FIRST SHIFT','Find Maya in Accounting');
  }
  function enterGame(){
    state.started=true;$('titleScreen').classList.add('hidden');$('gameScreen').classList.remove('hidden');$('continueBtn').classList.add('hidden');
    renderMissionUI();updateHUD();startLoop();
  }

  function activateMission(index, preserve=false){
    if(index>=state.unlocked && !state.completed.has(missions[index].id)) return;
    state.active=index;
    if(!preserve){state.steps=new Set();state.flags={};}
    renderMissionUI();save();
  }

  function mark(step,msg,xp=55){
    if(isDone(step)){toast('Already completed: '+labelForStep(step));return false;}
    state.steps.add(step);state.xp+=xp;state.shiftMinutes+=2;beep('ok');toast(msg,'success');renderMissionUI();save();return true;
  }
  function wrong(msg,cost=4){
    state.rep=Math.max(0,state.rep-cost);state.wrongMoves++;state.shiftMinutes+=2;beep('bad');toast('BAD MOVE • '+msg,'danger');updateHUD();save();
  }
  function labelForStep(id){ return mission().steps.find(s=>s[0]===id)?.[1]||id; }

  function renderMissionUI(){
    const m=mission();
    $('activeTitle').textContent=m.title;$('activeSummary').textContent=m.report;
    const doneCount=m.steps.filter(([id])=>isDone(id)).length;
    const pct=Math.round(doneCount/m.steps.length*100);const risk=Math.max(7,m.risk-Math.round(pct*.55));
    $('riskValue').textContent=risk+'%';$('riskBar').style.width=risk+'%';$('missionProgress').style.width=pct+'%';
    $('examDomain').textContent=m.exam+'\n'+m.domain+'\nObjectives: '+m.refs;
    $('objectiveSteps').innerHTML=m.steps.map(([id,label])=>`<div class="objective-step ${isDone(id)?'done':''}"><span class="check">${isDone(id)?'✓':''}</span><span>${esc(label)}</span></div>`).join('');
    $('missionQueue').innerHTML=missions.map((q,i)=>{
      const locked=i>=state.unlocked&&!state.completed.has(q.id),done=state.completed.has(q.id),active=i===state.active;
      return `<button class="mission-chip ${locked?'locked':''} ${done?'done':''} ${active?'active':''}" data-index="${i}" ${locked?'disabled':''}><span class="num">${done?'✓':i+1}</span><span><strong>${esc(q.id)} • ${esc(q.title)}</strong><small>${esc(q.domain)}</small></span></button>`;
    }).join('');
    $$('.mission-chip').forEach(b=>b.addEventListener('click',()=>activateMission(Number(b.dataset.index),true)));
    updateHUD();
  }

  function showMissionBanner(kicker,title){
    const el=$('missionBanner');el.innerHTML=`<strong>${esc(kicker)}</strong><span>${esc(title)}</span>`;el.classList.remove('hidden');beep('mission');setTimeout(()=>el.classList.add('hidden'),1800);
  }
  function toast(msg,type=''){
    const el=$('toast');el.textContent=msg;el.className='toast '+type;el.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add('hidden'),2800);
  }

  function talkTo(id){
    const m=mission(), e=entities.find(x=>x.id===id);
    if(!e)return;
    if(id==='dispatch'){
      showDialogue('Dispatch','IT Operations','Tickets are routed to the glowing user. Move with WASD or the arrow keys, walk close, and press E. You are expected to investigate before you change things.','DS',[
        ['Got it',closeDialogue]
      ]);return;
    }
    if(id!==m.target){
      showDialogue(e.name,e.dept||'Northstar Systems','I do not have an active ticket for you right now. Check your shift queue.',initials(e.name),[['Back to work',closeDialogue]]);return;
    }
    const actions=[];
    if(m.id==='INC-004') actions.push(['Take PC to repair bench',()=>{closeDialogue();toast('Devon moved the workstation to the Repair Lab. Go to the orange repair bench.','success');}]);
    else if(m.id==='INC-007') actions.push(['Take phone to Mobile Lab',()=>{closeDialogue();toast('Jordan handed you the phone. Go to the green Mobile Lab.','success');}]);
    else if(m.id==='INC-008') actions.push(['Open AI incident console',()=>{closeDialogue();openAIConsole();}]);
    else actions.push(['Start remote session',()=>{closeDialogue();openDesktop();}]);
    actions.push(['Ask one question',()=>{toast(extraClue(m.id));beep('click');}]);
    showDialogue(m.caller,m.dept,m.report,m.avatar,actions);
  }
  function extraClue(id){
    return ({
      'INC-001':'Maya: “It worked earlier today. I moved between conference rooms before it stopped.”',
      'INC-002':'Andre: “It only shuts down during long renders. Normal email and browsing are fine.”',
      'INC-003':'Sofia: “It began right after that free converter installer.”',
      'INC-004':'Devon: “The only thing I touched was the new memory.”',
      'INC-005':'Nina: “The printer display itself says Ready.”',
      'INC-006':'Eli: “10.20.50.20 answers when I use the IP, but ops.northstar.local does not.”',
      'INC-007':'Jordan: “The headset still powers on. This is a replacement phone.”',
      'INC-008':'Alex: “The public AI response is confident. Confidence is not evidence.”'
    })[id];
  }
  function initials(name){return name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();}
  function showDialogue(name,dept,text,avatar,actions){
    $('dialogueName').textContent=name;$('dialogueDept').textContent=dept;$('dialogueText').textContent=text;$('dialogueAvatar').textContent=avatar;
    $('dialogueActions').innerHTML='';actions.forEach(([label,fn])=>{const b=document.createElement('button');b.className='btn';b.textContent=label;b.addEventListener('click',fn);$('dialogueActions').appendChild(b);});$('dialogue').classList.remove('hidden');beep('click');
  }
  function closeDialogue(){$('dialogue').classList.add('hidden');}

  function openOverlay(title,kicker='TECHOPS TOOL'){
    $('overlayTitle').textContent=title;$('overlayKicker').textContent=kicker;$('overlayBody').innerHTML='';$('overlay').classList.remove('hidden');keys.clear();beep('click');
  }
  function closeOverlay(){$('overlay').classList.add('hidden');$('overlayBody').innerHTML='';}

  function openDesktop(){
    openOverlay(mission().caller+' • Remote Desktop','REMOTE SUPPORT');
    const frag=$('desktopTemplate').content.cloneNode(true);$('overlayBody').appendChild(frag);
    const icons=[['terminal','›_','Terminal'],['network','↔','Network'],['taskmgr','▥','Task Manager'],['browser','◎','Browser'],['security','◆','Security'],['printer','▣','Printers'],['services','⚙','Services']];
    $('osIcons').innerHTML=icons.map(([id,g,n])=>`<button class="os-icon" data-app="${id}"><span class="glyph">${g}</span><span>${n}</span></button>`).join('');
    $$('.os-icon',$('overlayBody')).forEach(b=>b.addEventListener('click',()=>openOSApp(b.dataset.app)));
    $('osWindowClose').addEventListener('click',()=>$('osWindow').classList.add('hidden'));
  }

  function openOSApp(name){
    const win=$('osWindow'),body=$('osWindowBody');win.classList.remove('hidden');$('osWindowTitle').textContent=appTitle(name);body.innerHTML='';
    if(name==='terminal'){renderTerminal(body);return;}
    const m=mission();
    if(name==='network') renderNetworkApp(body,m);
    else if(name==='taskmgr') renderTaskManager(body,m);
    else if(name==='browser') renderBrowser(body,m);
    else if(name==='security') renderSecurity(body,m);
    else if(name==='printer') renderPrinter(body,m);
    else if(name==='services') renderServices(body,m);
  }
  function appTitle(n){return ({terminal:'Windows Terminal',network:'Network & internet',taskmgr:'Task Manager',browser:'Northstar Browser',security:'Windows Security',printer:'Printers & scanners',services:'Services'})[n]||n;}
  function readout(text){return `<div class="app-readout">${esc(text)}</div>`;}
  function appButtons(actions){return `<div class="app-actions">${actions.map(([id,label])=>`<button data-action="${id}">${esc(label)}</button>`).join('')}</div>`;}
  function bindActions(root,map){$$('[data-action]',root).forEach(b=>b.addEventListener('click',()=>map[b.dataset.action]?.(b)));}

  function renderTerminal(body){
    body.innerHTML=`<div id="terminalOut" class="terminal">Microsoft Windows [Version 11.0.26100]\nNorthstar Systems Remote Support\n\nC:\\Users\\${esc(mission().caller.split(' ')[0])}&gt;</div><div class="command-row"><input id="terminalInput" autocomplete="off" spellcheck="false" placeholder="Try: ipconfig"><button id="terminalRun">RUN</button></div><p style="font-size:.72rem;color:#536672">Tip: <strong>help</strong> shows the safe command set supported by this simulation.</p>`;
    $('terminalRun').addEventListener('click',runCommand);$('terminalInput').addEventListener('keydown',e=>{if(e.key==='Enter')runCommand();});$('terminalInput').focus();
  }
  function termAppend(cmd,out){const el=$('terminalOut');el.textContent+=`\n\nC:\\Users\\Tech>${cmd}\n${out}`;el.scrollTop=el.scrollHeight;}
  function runCommand(){
    const input=$('terminalInput');if(!input)return;const raw=input.value.trim(),cmd=raw.toLowerCase().replace(/\s+/g,' ');if(!cmd)return;input.value='';
    if(cmd==='clear'||cmd==='cls'){$('terminalOut').textContent='C:\\Users\\Tech>';return;}
    if(cmd==='help'){termAppend(raw,'Supported lab commands:\nipconfig\nipconfig /all\nipconfig /release\nipconfig /renew\nping <host>\nnslookup <host>\ntracert <host>\nnet stop spooler\nnet start spooler');return;}
    const m=mission();let out="The command completed, but it did not produce useful evidence for this incident.";
    if(cmd==='ipconfig'||cmd==='ipconfig /all'){
      if(m.id==='INC-001'){
        const renewed=state.flags.dhcpRenewed;out=renewed?'Wireless LAN adapter Wi-Fi:\n IPv4 Address: 10.20.14.87\n Subnet Mask: 255.255.255.0\n Default Gateway: 10.20.14.1\n DHCP Enabled: Yes':'Wireless LAN adapter Wi-Fi:\n IPv4 Address: 169.254.44.18\n Subnet Mask: 255.255.0.0\n Default Gateway: —\n DHCP Enabled: Yes\n DHCP Server: Unavailable';mark('inspect_ip','You found an APIPA address with no default gateway.',55);
      } else if(m.id==='INC-006') out='Ethernet adapter:\n IPv4 Address: 10.20.33.41\n Subnet Mask: 255.255.255.0\n Default Gateway: 10.20.33.1\n DNS Servers: 198.51.100.53';
      else out='IPv4 Address: 10.20.14.55\nSubnet Mask: 255.255.255.0\nDefault Gateway: 10.20.14.1\nDNS Servers: 10.20.1.10';
    } else if(cmd==='ipconfig /release'){
      if(m.id==='INC-001'){state.flags.dhcpRenewed=false;out='DHCP lease released. IPv4 address removed.';toast('Lease released. You still need to renew it.');save();} else out='DHCP lease released.';
    } else if(cmd==='ipconfig /renew'){
      if(m.id==='INC-001'){
        if(!isDone('inspect_ip')){out='Lease renewed, but you changed state before collecting the original evidence.';wrong('You fixed before documenting the original network state.');}
        state.flags.dhcpRenewed=true;out='DHCP lease renewed successfully.\nIPv4 Address: 10.20.14.87\nDefault Gateway: 10.20.14.1';mark('renew_dhcp','DHCP issued a valid corporate address and gateway.',80);
      } else out='DHCP lease renewed.';
    } else if(cmd.startsWith('ping ')){
      const host=cmd.slice(5).trim();
      if(m.id==='INC-001'){
        if(state.flags.dhcpRenewed){out=`Reply from ${host}: bytes=32 time=9ms TTL=117\nReply from ${host}: bytes=32 time=8ms TTL=117\nPackets: Sent = 2, Received = 2, Lost = 0`;mark('verify_ping','Ping succeeds after the DHCP repair.',65);} else out='PING: transmit failed. General failure.';
      } else if(m.id==='INC-006'){
        if(/^\d+\.\d+\.\d+\.\d+$/.test(host)||host==='8.8.8.8'||host==='10.20.50.20'){out=`Reply from ${host}: bytes=32 time=4ms TTL=126\nPackets: Sent = 2, Received = 2, Lost = 0`;mark('prove_ip','IP connectivity works, so the network path is alive.',70);} else out=state.flags.dnsFixed?`Reply from 10.20.50.20: bytes=32 time=3ms TTL=126`:'Ping request could not find host '+host+'.';
      } else out=`Reply from ${host}: bytes=32 time=7ms TTL=118`;
    } else if(cmd.startsWith('nslookup ')){
      const host=cmd.slice(9).trim();
      if(m.id==='INC-006'){
        if(state.flags.dnsFixed){out=`Server: ns1.northstar.local\nAddress: 10.20.1.10\n\nName: ${host}\nAddress: 10.20.50.20`;mark('verify_dns','The hostname now resolves through Northstar DNS.',70);} else {out='Server: 198.51.100.53\n*** Request to unknown DNS server timed-out.';mark('prove_dns','Name resolution fails against the incorrect DNS server.',70);}
      } else out=`Server: 10.20.1.10\nName: ${host}\nAddress: 10.20.50.20`;
    } else if(cmd.startsWith('tracert ')) out='1  2 ms  10.20.14.1\n2  4 ms  10.20.1.1\n3  8 ms  destination reached';
    else if(cmd==='net stop spooler'){
      if(m.id==='INC-005'){state.flags.spoolerStopped=true;out='The Print Spooler service was stopped successfully.';save();} else out='The Print Spooler service was stopped successfully.';
    } else if(cmd==='net start spooler'){
      if(m.id==='INC-005'&&state.flags.spoolerStopped){state.flags.spoolerStopped=false;out='The Print Spooler service was started successfully.';mark('restart_spooler','Print Spooler restarted cleanly.',75);}
      else out='The Print Spooler service is already running.';
    } else out=`'${raw}' is not recognized by this TechOps lab.`;
    termAppend(raw,out);save();
  }

  function renderNetworkApp(body,m){
    let text='Wi-Fi: Connected\nIPv4: 10.20.14.55\nGateway: 10.20.14.1\nDNS: 10.20.1.10';let actions=[];
    if(m.id==='INC-001'){
      text=state.flags.dhcpRenewed?'Wi-Fi: Connected\nIPv4: 10.20.14.87\nSubnet: 255.255.255.0\nGateway: 10.20.14.1\nDHCP: Enabled':'Wi-Fi: Connected\nIPv4: 169.254.44.18\nSubnet: 255.255.0.0\nGateway: —\nDHCP: Enabled';actions=[['inspect','Inspect details'],['renew','Renew DHCP']];
    } else if(m.id==='INC-003'){
      text=`Ethernet: ${state.flags.isolated?'Disconnected':'Connected'}\nIPv4: 10.20.22.93\nNetwork profile: Domain`;actions=[['isolate',state.flags.isolated?'Endpoint isolated':'Disconnect network adapter']];
    } else if(m.id==='INC-006'){
      text=`Ethernet: Connected\nIPv4: 10.20.33.41\nGateway: 10.20.33.1\nDNS: ${state.flags.dnsFixed?'10.20.1.10':'198.51.100.53 (manual)'}`;actions=[['dns','Edit DNS settings']];
    }
    body.innerHTML=readout(text)+appButtons(actions);bindActions(body,{
      inspect:()=>mark('inspect_ip','Network details show APIPA 169.254.44.18 and no gateway.',55),
      renew:()=>{if(!isDone('inspect_ip'))wrong('You changed the network state before collecting the original configuration.');state.flags.dhcpRenewed=true;mark('renew_dhcp','Windows received 10.20.14.87 from DHCP.',80);renderNetworkApp(body,m);},
      isolate:()=>{state.flags.isolated=true;mark('isolate','You disconnected the affected endpoint from the network.',75);renderNetworkApp(body,m);},
      dns:()=>renderDNSEditor(body,m)
    });
  }
  function renderDNSEditor(body,m){
    body.innerHTML=`<h3>DNS server assignment</h3>${readout('Current: 198.51.100.53 (Manual)\nNorthstar standard: 10.20.1.10 / 10.20.1.11')}<div class="app-actions"><button data-action="corp">Use Northstar DNS</button><button data-action="random">Use 8.8.8.8 without approval</button></div>`;
    bindActions(body,{corp:()=>{state.flags.dnsFixed=true;mark('fix_dns','You restored the approved Northstar DNS configuration.',85);renderNetworkApp(body,m);},random:()=>wrong('A public resolver is not the documented corporate configuration for this managed client.')});
  }

  function renderTaskManager(body,m){
    if(m.id==='INC-002'){
      body.innerHTML=readout('Processes\nRenderStudio.exe      CPU 92%   Memory 2.8 GB\nexplorer.exe           CPU 3%   Memory 210 MB\n\nPerformance\nCPU: 98°C  ⚠ THERMAL\nFan: 100%\nSystem uptime: 00:18:42')+appButtons([['inspect','Record thermal evidence'],['kill','End RenderStudio']]);
      bindActions(body,{inspect:()=>mark('inspect_temp','CPU package reaches 98°C under render load.',65),kill:()=>wrong('Ending the workload hides the symptom but does not fix the overheating cause.')});
    } else if(m.id==='INC-003'){
      body.innerHTML=readout('PROCESS                   CPU     MEMORY\nchrome.exe                18%     1.2 GB\nQuickConvertHelper.exe    28%     644 MB  ⚠\nUpdateHost32.exe          12%     311 MB  ⚠\nexplorer.exe               3%     184 MB')+appButtons([['record','Inspect suspicious processes'],['delete','Delete random system processes']]);
      bindActions(body,{record:()=>mark('inspect_process','QuickConvertHelper and UpdateHost32 match the recent unwanted install.',65),delete:()=>wrong('Killing random processes is not controlled malware remediation.')});
    } else body.innerHTML=readout('CPU: 17%\nMemory: 46%\nDisk: 3%\nNo unusual process activity detected.');
  }

  function renderBrowser(body,m){
    if(m.id==='INC-001'){
      const ok=state.flags.dhcpRenewed&&isDone('verify_ping');body.innerHTML=readout(ok?'Northstar Payroll Portal\nSTATUS: Connected\nSession established successfully.':'This site can’t be reached\nNo internet connection.');
      if(ok)mark('verify_web','The payroll portal loads normally after the network repair.',70);
    } else if(m.id==='INC-003'){
      body.innerHTML=readout('Homepage: quick-search-now.example\nPop-up windows blocked: 37\nUnexpected redirects: detected\nInstalled extension: QuickConvert Search');mark('inspect_symptoms','Browser hijacking and redirects confirm suspicious behavior.',55);
    } else if(m.id==='INC-006'){
      const ok=state.flags.dnsFixed&&isDone('verify_dns');body.innerHTML=readout(ok?'Northstar Operations Portal\nhttps://ops.northstar.local\nSTATUS: Connected':'DNS_PROBE_FINISHED_NXDOMAIN\nops.northstar.local could not be resolved.');if(ok)mark('verify_web','The internal operations site loads by hostname.',70);
    } else body.innerHTML=readout('Northstar Portal\nConnection OK.');
  }

  function renderSecurity(body,m){
    if(m.id!=='INC-003'){body.innerHTML=readout('Virus & threat protection\nNo current actions required.');return;}
    const scanned=state.flags.scanned,quarantined=state.flags.quarantined;
    body.innerHTML=readout(scanned?`Scan complete\nThreats found: ${quarantined?'0 active / 2 quarantined':'2'}\nPUA:Win32/QuickConvert\nTrojan:Win32/UpdateHostDemo`:'Virus & threat protection\nDefinitions: Current\nLast full scan: 18 days ago\nAction recommended: Full scan')+appButtons(scanned&&!quarantined?[['quarantine','Quarantine detected threats']]:quarantined?[['rescan','Reboot and rescan']]:[['scan','Run approved full scan']]);
    bindActions(body,{
      scan:()=>{if(!state.flags.isolated)wrong('Run containment first so the suspicious endpoint cannot continue communicating.');state.flags.scanned=true;mark('scan','The approved scan detected two unwanted/malicious components.',85);renderSecurity(body,m);},
      quarantine:()=>{state.flags.quarantined=true;mark('quarantine','Detected threats moved to quarantine.',75);renderSecurity(body,m);},
      rescan:()=>{if(!state.flags.quarantined)return;state.flags.clean=true;mark('verify_clean','After reboot, the follow-up scan is clean and redirects do not return.',90);renderSecurity(body,m);}
    });
  }

  function renderPrinter(body,m){
    if(m.id!=='INC-005'){body.innerHTML=readout('No printer incident is active.');return;}
    const cleared=state.flags.queueCleared,ready=isDone('restart_spooler');
    body.innerHTML=readout(`Front-Office-Laser\nStatus: Online\nQueue: ${cleared?'0':'7 jobs'}\n${cleared?'No stuck jobs':'Oldest: Visitor_Badges.pdf — Error'}`)+appButtons(cleared?(ready?[['test','Print test page']]:[]):[['inspect','Open print queue'],['clear','Clear stuck queue']]);
    bindActions(body,{
      inspect:()=>mark('inspect_queue','The device is online; an errored job is freezing the Windows queue.',55),
      clear:()=>{if(!isDone('inspect_queue'))wrong('You cleared the evidence before inspecting the queue.');state.flags.queueCleared=true;mark('clear_queue','The stuck badge job was removed from the queue.',70);renderPrinter(body,m);},
      test:()=>{if(!isDone('restart_spooler')){wrong('The spooler repair is not complete yet.');return;}mark('test_print','The test page prints correctly from the front-office PC.',75);renderPrinter(body,m);}
    });
  }

  function renderServices(body,m){
    const relevant=m.id==='INC-005';body.innerHTML=readout(relevant?`Name: Print Spooler\nStatus: ${state.flags.spoolerStopped?'Stopped':'Running'}\nStartup type: Automatic`:'Services console\nNo service issue relevant to this ticket.')+(relevant?appButtons(state.flags.spoolerStopped?[['start','Start Print Spooler']]:[['restart','Restart Print Spooler']]):'');
    bindActions(body,{restart:()=>{if(!state.flags.queueCleared)wrong('Restarting the service before clearing the corrupt queue may leave the blocker in place.');state.flags.spoolerStopped=true;setTimeout(()=>{state.flags.spoolerStopped=false;mark('restart_spooler','Print Spooler restarted successfully.',75);renderServices(body,m);},280);},start:()=>{state.flags.spoolerStopped=false;mark('restart_spooler','Print Spooler started successfully.',75);renderServices(body,m);}});
  }

  function openBench(){
    openOverlay('Repair Bench','HARDWARE LAB');const m=mission();
    const body=$('overlayBody');body.innerHTML=`<div class="bench"><div class="pc-case"><button class="component cpu" data-part="cpu">CPU / COOLER<br><small>Click to inspect</small></button><button class="component psu" data-part="psu">POWER SUPPLY</button><button class="component gpu" data-part="gpu">GPU / EXPANSION</button><button class="component ram" data-part="ram">RAM<br><small>DIMM slots</small></button></div><div class="bench-tools"><div class="panel-label">BENCH PROCEDURE</div><div class="tool-grid"><button data-tool="power">⏻ Power Down</button><button data-tool="esd">⏚ ESD Strap</button><button data-tool="clean">✦ Clean Cooling</button><button data-tool="reseat">↕ Reseat Part</button><button data-tool="post">▶ POST Test</button><button data-tool="stress">▥ Stress Test</button></div><div id="benchOutput" class="readout-dark">Workstation received. Select a component to inspect.</div></div></div>`;
    $$('[data-part]',body).forEach(b=>b.addEventListener('click',()=>selectPart(b.dataset.part,b)));
    bindToolButtons(body,m);
  }
  function selectPart(part,button){
    state.flags.selectedPart=part;$$('.component',$('overlayBody')).forEach(b=>b.classList.toggle('selected',b===button));
    const out=$('benchOutput');if(part==='cpu'){if(mission().id==='INC-002'&&!state.flags.poweredDown){out.textContent='Power is still connected. Power down the workstation before opening and inspecting the cooling assembly.';wrong('Physical internal inspection should wait until the workstation is powered down.');return;}out.textContent='CPU cooler: airflow restricted by a heavy dust mat.\nHeatsink fins: obstructed.\nThermal paste: serviceable.';if(mission().id==='INC-002')mark('select_cpu','The heatsink and fan path are visibly packed with dust.',60);} else if(part==='ram'){if(mission().id==='INC-004'&&(!state.flags.poweredDown||!state.flags.esd)){out.textContent='Stop: the workstation must be powered down and ESD protection connected before touching the DIMM.';wrong('Use safe hardware procedure before handling RAM.');return;}out.textContent='Memory: two DIMMs installed.\nDIMM B retaining clip is not fully locked.\nRecent service: RAM upgrade.';if(mission().id==='INC-004')mark('select_ram','One RAM module is visibly not fully seated.',60);} else out.textContent=part.toUpperCase()+': no obvious fault found.';save();
  }
  function bindToolButtons(body,m){
    $$('[data-tool]',body).forEach(b=>b.addEventListener('click',()=>{
      const tool=b.dataset.tool,out=$('benchOutput');
      if(tool==='power'){state.flags.poweredDown=true;b.classList.add('active');if(['INC-002','INC-004'].includes(m.id))mark('poweroff','Workstation is powered down before internal service.',60);else toast('Power removed.');}
      if(tool==='esd'){state.flags.esd=true;b.classList.add('active');if(m.id==='INC-004')mark('esd','ESD protection is connected before touching memory.',60);else toast('ESD strap connected.');}
      if(tool==='clean'){
        if(m.id!=='INC-002'){wrong('Cleaning is not supported by the evidence for this ticket.');return;}
        if(!state.flags.poweredDown){wrong('Do not service internal cooling while the PC is powered.');return;}
        if(state.flags.selectedPart!=='cpu'){wrong('Inspect and select the affected cooling assembly first.');return;}
        state.flags.coolingClean=true;out.textContent='Compressed air service complete.\nHeatsink fins: clear.\nFan path: clear.\nAirflow restored.';mark('clean_cooling','Dust is removed and airflow is restored.',85);
      }
      if(tool==='reseat'){
        if(m.id!=='INC-004'){wrong('Reseating parts without evidence introduces new variables.');return;}
        if(!state.flags.poweredDown||!state.flags.esd){wrong('Power down and use ESD protection before touching RAM.');return;}
        if(state.flags.selectedPart!=='ram'){wrong('The recent change was RAM. Inspect it before touching other components.');return;}
        state.flags.ramSeated=true;out.textContent='DIMM removed and reinstalled.\nBoth retaining clips locked.\nModule seated evenly in slot.';mark('reseat_ram','The DIMM is now fully seated with both clips locked.',90);
      }
      if(tool==='post'){
        if(m.id==='INC-004'&&state.flags.ramSeated){out.textContent='Power on...\nPOST: PASS\nMemory detected: 32 GB\nDisplay initialized.\nNo beep error.';mark('post_test','POST completes normally and all memory is detected.',85);} else if(m.id==='INC-004'){out.textContent='POST: FAIL\nMemory beep code continues.';wrong('The memory fault is still present.');} else toast('POST completed.');
      }
      if(tool==='stress'){
        if(m.id==='INC-002'&&state.flags.coolingClean){out.textContent='10-minute simulated render stress test\nCPU max: 74°C\nFan: Normal curve\nShutdowns: 0\nRESULT: PASS';mark('stress_test','The repaired PC survives the load test at a safe temperature.',90);} else if(m.id==='INC-002'){out.textContent='CPU climbs to 98°C. Thermal shutdown imminent.';wrong('Stress-testing before correcting the cooling fault risks another shutdown.');} else toast('Stress test is not needed for this ticket.');
      }
      save();
    }));
  }

  function openNetworkCloset(){
    openOverlay('Network Closet','NETWORK LAB');const m=mission(),body=$('overlayBody');
    body.innerHTML=`<div class="rack-room"><div class="rack"><div class="rack-unit"><span>EDGE ROUTER</span><span class="lights">● ● ● ●</span></div><div class="rack-unit"><span>CORE SWITCH</span><span class="lights">●●●●●●●●</span></div><div class="rack-unit"><span>DHCP-01</span><span class="lights">● READY</span></div><div class="rack-unit"><span>DNS-01</span><span class="lights">● READY</span></div><div class="rack-unit"><span>PATCH PANEL</span><span>01–24</span></div></div><div class="network-tools"><div class="panel-label">NETWORK TOOLS</div><div class="tool-grid"><button data-net="dhcp">Check DHCP</button><button data-net="dns">Check DNS</button><button data-net="cable">Cable tester</button><button data-net="reboot">Reboot core switch</button></div><div id="netOutput" class="readout-dark">Infrastructure monitoring shows no site-wide outage.</div></div></div>`;
    $$('[data-net]',body).forEach(b=>b.addEventListener('click',()=>{
      const a=b.dataset.net;
      if(a==='dhcp'){$('netOutput').textContent='DHCP-01: Healthy\nScope 10.20.14.0/24: 41% utilized\nLeases issuing normally.';toast('The server is healthy; keep the investigation scoped to the client.');}
      if(a==='dns'){$('netOutput').textContent='DNS-01: Healthy\n10.20.1.10 / 10.20.1.11\nQueries from other clients normal.';toast(m.id==='INC-006'?'Corporate DNS is healthy. Check the affected client configuration.':'DNS service is healthy.');}
      if(a==='cable'){$('netOutput').textContent='Cable test: PASS\nPairs 1–8: continuity OK.';}
      if(a==='reboot')wrong('Rebooting shared infrastructure with no evidence of a site-wide failure can create an outage.',8);
    }));
  }

  function openMobileLab(){
    if(mission().id!=='INC-007'){toast('No active mobile-device lab task.');return;}
    openOverlay('Mobile Device Lab','MOBILE SUPPORT');const body=$('overlayBody');
    body.innerHTML=`<div class="mobile-panel"><div class="mobile-sim"><div class="phone-notch"></div><h3>Bluetooth</h3><div class="setting-row"><span>Bluetooth</span><button id="btSwitch" class="switch ${state.flags.bt?'on':''}" aria-label="Bluetooth toggle"></button></div><div id="phoneDevices"></div></div></div>`;
    const renderPhone=()=>{
      const list=$('phoneDevices');if(!state.flags.bt){list.innerHTML='<p style="color:#66737d">Bluetooth is off.</p>';return;}
      const pairText=state.flags.pairMode?'Headset is discoverable.':'No devices found yet.';
      list.innerHTML=`<div class="device-card"><strong>Northstar Exec Headset</strong><p>${state.flags.paired?'Connected':pairText}</p>${state.flags.paired?'<button class="btn" data-phone="test">Test audio</button>':state.flags.pairMode?'<button class="btn" data-phone="select">Pair device</button>':'<button class="btn" data-phone="pairmode">Put headset in pairing mode</button>'}</div>`;
      $$('[data-phone]',list).forEach(b=>b.addEventListener('click',()=>phoneAction(b.dataset.phone,renderPhone)));
    };
    $('btSwitch').addEventListener('click',()=>{state.flags.bt=!state.flags.bt;$('btSwitch').classList.toggle('on',state.flags.bt);if(state.flags.bt)mark('enable_bt','Bluetooth is enabled on the replacement phone.',60);renderPhone();save();});renderPhone();
  }
  function phoneAction(action,render){
    if(action==='pairmode'){state.flags.pairMode=true;mark('pair_mode','The headset is now discoverable.',65);render();}
    if(action==='select'){
      mark('select_headset','The phone discovers the correct Northstar headset.',60);
      const list=$('phoneDevices');list.innerHTML=`<div class="device-card"><strong>Pairing request</strong><p>Confirm PIN: <strong>4826</strong></p><button class="btn" data-confirm>Confirm pairing</button></div>`;
      list.querySelector('[data-confirm]').addEventListener('click',()=>{state.flags.paired=true;mark('confirm_pin','Pairing authentication completes successfully.',65);render();});
    }
    if(action==='test'){if(state.flags.paired)mark('test_audio','Test call plays clearly through the headset microphone and speakers.',75);render();}
    save();
  }

  function openAIConsole(){
    if(mission().id!=='INC-008')return;
    openOverlay('AI Incident Console','BOSS INCIDENT');const body=$('overlayBody');
    const status=()=>`<div class="ai-panel"><div class="panel-label">PUBLIC AI TRANSCRIPT</div><div class="ai-response"><p><strong>User:</strong> “Here is our internal ticket export and workstation log. What should I do?”</p><p><strong>Public AI:</strong> “I am certain the operating system is corrupt. Delete critical Windows system files and reinstall immediately.”</p><p class="danger-text">⚠ The recommendation is destructive and unsupported by the supplied evidence.</p></div><div class="evidence-grid"><button class="evidence-card" data-ai="policy"><strong>AI Use Policy</strong><small>Approved data handling and public/private AI rules</small></button><button class="evidence-card" data-ai="classify"><strong>Classify Service</strong><small>Determine public vs. private handling risk</small></button><button class="evidence-card" data-ai="hallucination"><strong>Challenge Recommendation</strong><small>Check accuracy and hallucination risk</small></button><button class="evidence-card" data-ai="verify"><strong>Verify System Evidence</strong><small>Compare against trusted endpoint telemetry</small></button><button class="evidence-card" data-ai="sanitize"><strong>Protect the Data</strong><small>Use an approved sanitized/private workflow</small></button></div><div id="aiOutput" class="readout-dark">Incident awaiting your review. Do not execute the AI recommendation.</div></div>`;
    body.innerHTML=status();bindAIActions();
  }
  function bindAIActions(){
    const output=$('aiOutput');$$('[data-ai]',$('overlayBody')).forEach(b=>b.addEventListener('click',()=>{
      const a=b.dataset.ai;
      if(a==='policy'){output.textContent='Policy TO-AI-04:\n• Internal ticket/customer data must not be submitted to unapproved public AI systems.\n• AI output must be independently verified before operational use.';mark('review_policy','You reviewed the approved-use and data-handling policy.',70);}
      if(a==='classify'){output.textContent='Service classification: PUBLIC AI\nData retention/training controls are not managed by Northstar.\nInternal support export = sensitive organizational data.';mark('classify_ai','You identified the privacy risk of a public AI service.',70);}
      if(a==='hallucination'){output.textContent='Recommendation confidence: high\nEvidence supporting OS corruption: NONE\nConclusion: unsupported/hallucinated remediation. Do not execute.';mark('flag_hallucination','You flagged an unsupported, destructive AI hallucination.',80);}
      if(a==='verify'){output.textContent='Trusted endpoint telemetry:\nSFC status: healthy\nDisk SMART: healthy\nEvent logs: no corruption indicators\nNetwork issue isolated to a bad DNS setting.\nAI diagnosis contradicted by evidence.';mark('verify_source','Trusted system evidence disproves the AI recommendation.',80);}
      if(a==='sanitize'){
        if(!isDone('review_policy')||!isDone('classify_ai')||!isDone('flag_hallucination')||!isDone('verify_source')){wrong('Complete the risk and accuracy review before closing the AI handling issue.');return;}
        output.textContent='Safe workflow selected:\n• Remove customer identifiers and secrets\n• Use approved private enterprise AI only when policy allows\n• Retain technician verification\n• Report the public-data exposure through incident procedure';mark('sanitize_data','You selected a policy-compliant AI workflow and protected sensitive data.',90);
      }
      save();
    }));
  }

  function openTicket(){
    openOverlay('Ticket '+mission().id,'SERVICE DESK');const frag=$('ticketTemplate').content.cloneNode(true);$('overlayBody').appendChild(frag);
    $('ticketMeta').textContent=`${mission().caller} • ${mission().dept}\n${mission().report}\n${mission().exam} • ${mission().domain}`;
    $('closeTicketBtn').addEventListener('click',submitTicket);
  }
  function submitTicket(){
    const vals=[$('ticketSummary').value,$('ticketCause').value,$('ticketFix').value,$('ticketVerify').value].map(v=>v.trim());
    if(!technicalDone()){$('ticketValidation').textContent='Technical work is not complete. Finish the unresolved mission objectives first.';beep('bad');return;}
    if(vals.some(v=>v.length<12)){$('ticketValidation').textContent='Write a useful note in every field (at least a short sentence). Real support work must be documentable.';beep('bad');return;}
    mark('document','Ticket documentation is complete.',70);completeMission();
  }

  function completeMission(){
    const m=mission();if(state.completed.has(m.id))return;
    state.completed.add(m.id);state.xp+=m.reward;state.rep=Math.min(100,state.rep+4);state.shiftMinutes+=8;
    Object.entries(m.skills).forEach(([k,v])=>state.mastery[k]=(state.mastery[k]||0)+v);
    if(state.active===state.unlocked-1 && state.unlocked<missions.length)state.unlocked++;
    save();renderMissionUI();beep('complete');
    openOverlay('INCIDENT RESOLVED','MISSION COMPLETE');
    $('overlayBody').innerHTML=`<div class="debrief"><div class="debrief-hero"><div class="eyebrow">${esc(m.id)} COMPLETE</div><h3>${esc(m.title)} resolved.</h3><p>${esc(m.root)}</p></div><div class="reward-row"><div><small>MISSION XP</small><strong>+${m.reward}</strong></div><div><small>REPUTATION</small><strong>${state.rep}</strong></div><div><small>A+ READINESS</small><strong>${readiness()}%</strong></div></div><div class="lesson-card"><strong>WHY THIS MATTERS ON A+</strong><p>${esc(m.lesson)}</p><small>${esc(m.exam)} • ${esc(m.domain)} • Objectives ${esc(m.refs)}</small></div><button id="nextMissionBtn" class="btn primary wide">${state.active===missions.length-1?'VIEW SHIFT RESULTS':'ACCEPT NEXT INCIDENT'}</button></div>`;
    $('nextMissionBtn').addEventListener('click',()=>{
      if(state.active===missions.length-1){showFinalResults();return;}
      closeOverlay();activateMission(state.active+1);showMissionBanner('NEW INCIDENT',mission().title+' • Find '+mission().caller.split(' ')[0]);
    });
  }

  function showFinalResults(){
    const perfect=state.wrongMoves===0;openOverlay('First Shift Complete','TECHOPS PLAYTEST');
    $('overlayBody').innerHTML=`<div class="debrief"><div class="debrief-hero"><div class="eyebrow">SHIFT COMPLETE</div><h3>${perfect?'Clean shift.':'You survived the shift.'}</h3><p>You completed all eight incidents by diagnosing systems, using support tools, working hardware, documenting outcomes, and evaluating AI safely.</p></div><div class="reward-row"><div><small>TOTAL XP</small><strong>${state.xp}</strong></div><div><small>BAD MOVES</small><strong>${state.wrongMoves}</strong></div><div><small>READINESS</small><strong>${readiness()}%</strong></div></div><div class="lesson-card"><strong>PLAYTEST NOTE</strong><p>This build is a training slice, not a claim of complete exam coverage. The skill matrix shows what this campaign has practiced; later campaigns can expand until every current objective has multiple scenarios.</p></div><button class="btn primary wide" id="matrixFinal">OPEN A+ SKILL MATRIX</button></div>`;
    $('matrixFinal').addEventListener('click',openMatrix);
  }

  function openMatrix(){
    openOverlay('A+ Skill Matrix','EXAM READINESS');
    const totals=missions.reduce((acc,m)=>{Object.entries(m.skills).forEach(([k,v])=>acc[k]=(acc[k]||0)+v);return acc;},{});
    $('overlayBody').innerHTML=`<p style="color:#9fb4c4;line-height:1.55">TechOps tracks what you actually practiced. Exam weights below reflect the current A+ domain weighting; the progress bars reflect this game campaign, not a guaranteed exam score.</p><div class="matrix-grid">${Object.entries(DOMAIN_WEIGHTS).map(([k,w])=>{const max=totals[k]||1,got=state.mastery[k]||0,p=Math.min(100,Math.round(got/max*100));return `<div class="matrix-card"><div class="matrix-head"><span>${esc(k)}</span><strong>${p}%</strong></div><small>Official domain weight: ${w}%</small><div class="progress-track"><span style="width:${p}%"></span></div></div>`;}).join('')}</div>`;
  }

  function openControls(){openOverlay('How to Play','CONTROLS');$('overlayBody').innerHTML=`<div class="debrief"><div class="lesson-card"><strong>MOVE THROUGH THE OFFICE</strong><p>Use WASD or the arrow keys. On touch devices use the directional pad. Walk near a person or workstation until the interaction prompt appears, then press E.</p></div><div class="lesson-card"><strong>WORK THE PROBLEM</strong><p>Use evidence. Remote Desktop contains simulated Windows tools and a command terminal. Hardware missions send you to the Repair Bench. Mobile and AI incidents have their own labs.</p></div><div class="lesson-card"><strong>WRONG MOVES ARE ALLOWED</strong><p>Bad changes cost reputation but do not end the run. The goal is to learn the consequences of weak troubleshooting without being thrown back to a quiz screen.</p></div><div class="lesson-card"><strong>CLOSE THE LOOP</strong><p>After the technical fix, interact with the same user and choose Ticket Notes. Document the report, root cause, resolution, and verification.</p></div></div>`;}

  function hint(){
    const m=mission(),next=m.steps.find(([id])=>!isDone(id));if(!next){toast('All mission objectives are complete. Document the ticket.');return;}
    state.xp=Math.max(0,state.xp-20);beep('click');toast('TECH ASSIST • '+m.hint);updateHUD();save();
  }

  function interact(){
    if(!$('overlay').classList.contains('hidden')||!$('dialogue').classList.contains('hidden'))return;
    if(!nearest)return;const id=nearest.id;
    if(id==='bench'){openBench();return;}if(id==='closet'){openNetworkCloset();return;}if(id==='mobile'){openMobileLab();return;}
    talkTo(id);
  }

  function drawWorld(dt){
    const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#050b13';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#0d1c2a';ctx.lineWidth=1;for(let x=0;x<w;x+=34){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=34){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    zones.forEach(([name,x1,y1,x2,y2],i)=>{ctx.fillStyle=i%2?'#081522':'#07131f';ctx.fillRect(x1,y1,x2-x1,y2-y1);ctx.strokeStyle='#1b3347';ctx.strokeRect(x1,y1,x2-x1,y2-y1);ctx.fillStyle='#557085';ctx.font='700 12px system-ui';ctx.fillText(name,x1+10,y1+18);drawFurniture(name,x1,y1,x2,y2);});
    const target=mission().target;entities.forEach(e=>drawEntity(e,e.id===target));
    ctx.save();ctx.translate(state.player.x,state.player.y);ctx.fillStyle='#e8fbff';ctx.beginPath();ctx.arc(0,0,13,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#2ee7ff';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#07111e';ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-3,-5);ctx.lineTo(-3,5);ctx.fill();ctx.restore();
    updateNearest();updateZone();
  }
  function drawFurniture(name,x1,y1,x2,y2){
    ctx.fillStyle='#102436';ctx.strokeStyle='#1b3d55';
    if(['ACCOUNTING','DESIGN','SALES','ENGINEERING','OPERATIONS','EXEC SUPPORT','FRONT OFFICE'].includes(name)){
      for(let x=x1+28;x<x2-40;x+=95){ctx.fillRect(x,y1+55,68,38);ctx.strokeRect(x,y1+55,68,38);ctx.fillStyle='#1a4358';ctx.fillRect(x+24,y1+47,23,10);ctx.fillStyle='#102436';}
    } else if(name==='HELP DESK'){ctx.fillRect(x1+28,y1+58,130,45);ctx.strokeRect(x1+28,y1+58,130,45);}
    else if(name==='REPAIR LAB'){ctx.fillRect(x1+40,y1+70,180,70);ctx.strokeRect(x1+40,y1+70,180,70);}
    else if(name==='NETWORK CLOSET'){for(let x=x1+35;x<x2-35;x+=65){ctx.fillRect(x,y1+48,48,108);ctx.strokeRect(x,y1+48,48,108);}}
    else if(name==='MOBILE LAB'){ctx.fillRect(x1+25,y1+60,100,55);ctx.strokeRect(x1+25,y1+60,100,55);}
    else if(name==='IT DIRECTOR'){ctx.fillRect(x1+32,y1+60,150,60);ctx.strokeRect(x1+32,y1+60,150,60);}
  }
  function drawEntity(e,target){
    const pulse=target&&!state.completed.has(mission().id)?5+Math.sin(performance.now()/220)*4:0;
    if(target){ctx.strokeStyle=e.color;ctx.globalAlpha=.35;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,25+pulse,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
    if(e.kind==='npc'){
      ctx.fillStyle='#08121d';ctx.beginPath();ctx.arc(e.x,e.y,18,0,Math.PI*2);ctx.fill();ctx.strokeStyle=e.color;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=e.color;ctx.font='800 10px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(initials(e.name),e.x,e.y);ctx.textBaseline='alphabetic';ctx.fillStyle='#9fb2bf';ctx.font='700 10px system-ui';ctx.fillText(e.name,e.x,e.y+34);ctx.textAlign='left';
    } else {ctx.fillStyle=e.color;ctx.globalAlpha=.8;ctx.fillRect(e.x-12,e.y-12,24,24);ctx.globalAlpha=1;ctx.fillStyle='#9fb2bf';ctx.font='700 10px system-ui';ctx.textAlign='center';ctx.fillText(e.name,e.x,e.y+32);ctx.textAlign='left';}
  }
  function updateNearest(){
    let best=null,bestD=999;entities.forEach(e=>{const d=Math.hypot(e.x-state.player.x,e.y-state.player.y);if(d<55&&d<bestD){best=e;bestD=d;}});nearest=best;
    if(best){$('interactionPrompt').classList.remove('hidden');$('interactionPrompt').querySelector('span').textContent=best.kind==='npc'?'Talk to '+best.name:'Use '+best.name;} else $('interactionPrompt').classList.add('hidden');
  }
  function updateZone(){
    const z=zones.find(([,x1,y1,x2,y2])=>state.player.x>=x1&&state.player.x<=x2&&state.player.y>=y1&&state.player.y<=y2);$('zoneLabel').textContent=z?z[0]:'MAIN CORRIDOR';
  }
  function movePlayer(dt){
    if(!$('overlay').classList.contains('hidden')||!$('dialogue').classList.contains('hidden')||!$('menuPanel').classList.contains('hidden'))return;
    let dx=0,dy=0;if(keys.has('w')||keys.has('arrowup'))dy--;if(keys.has('s')||keys.has('arrowdown'))dy++;if(keys.has('a')||keys.has('arrowleft'))dx--;if(keys.has('d')||keys.has('arrowright'))dx++;
    if(dx||dy){const len=Math.hypot(dx,dy);dx/=len;dy/=len;const speed=195;state.player.x=Math.max(18,Math.min(canvas.width-18,state.player.x+dx*speed*dt));state.player.y=Math.max(18,Math.min(canvas.height-18,state.player.y+dy*speed*dt));}
  }
  function loop(ts){const dt=Math.min(.04,(ts-lastTime)/1000||0);lastTime=ts;movePlayer(dt);drawWorld(dt);animationId=requestAnimationFrame(loop);}
  function startLoop(){if(animationId)return;canvas=$('world');ctx=canvas.getContext('2d');lastTime=performance.now();animationId=requestAnimationFrame(loop);}

  function stationForMission(){const m=mission();if(m.id==='INC-004'||m.id==='INC-002')return'bench';if(m.id==='INC-007')return'mobile';return m.target;}

  function installEvents(){
    $('newGameBtn').addEventListener('click',startNew);$('continueBtn').addEventListener('click',enterGame);$('brandBtn').addEventListener('click',()=>{if(state.started){$('menuPanel').classList.remove('hidden');}else location.reload();});
    $('overlayClose').addEventListener('click',closeOverlay);$('overlay').addEventListener('mousedown',e=>{if(e.target===$('overlay'))closeOverlay();});
    $('soundBtn').addEventListener('click',()=>{state.sound=!state.sound;$('soundBtn').textContent=state.sound?'🔊':'🔇';save();if(state.sound)beep('click');});
    $('menuBtn').addEventListener('click',()=>{$('menuPanel').classList.remove('hidden');});$('closeMenu').addEventListener('click',()=>$('menuPanel').classList.add('hidden'));$('resumeBtn').addEventListener('click',()=>$('menuPanel').classList.add('hidden'));
    $('matrixMenuBtn').addEventListener('click',()=>{ $('menuPanel').classList.add('hidden');openMatrix();});$('controlsMenuBtn').addEventListener('click',()=>{$('menuPanel').classList.add('hidden');openControls();});$('resetBtn').addEventListener('click',()=>{if(confirm('Reset all TechOps playtest progress?'))resetSave();});
    $('objectivesBtn').addEventListener('click',openMatrix);$('hintBtn').addEventListener('click',hint);
    $('collapseRail').addEventListener('click',()=>$('missionRail').classList.toggle('open'));
    window.addEventListener('keydown',e=>{const tag=document.activeElement?.tagName;if(['INPUT','TEXTAREA'].includes(tag))return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){keys.add(k);e.preventDefault();}if(k==='e'){interact();e.preventDefault();}if(k==='escape'){closeDialogue();closeOverlay();$('menuPanel').classList.add('hidden');}});
    window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
    $$('[data-move]').forEach(b=>{const k={up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright'}[b.dataset.move];['pointerdown','touchstart'].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();keys.add(k);}));['pointerup','pointercancel','touchend'].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();keys.delete(k);}));});$('mobileInteract').addEventListener('click',interact);
    $('gameScreen').addEventListener('dblclick',e=>{if(window.innerWidth<=760){$('missionRail').classList.add('open');}});
  }

  const originalTalk=talkTo;
  talkTo=function(id){
    const m=mission();if(id===m.target&&technicalDone()){
      showDialogue(m.caller,m.dept,'The system looks good from here. If you have verified the fix, finish the service record so we can close this out.',m.avatar,[['Open Ticket Notes',()=>{closeDialogue();openTicket();}],['Review system again',()=>{closeDialogue();if(m.id==='INC-008')openAIConsole();else if(m.id==='INC-007')openMobileLab();else if(m.id==='INC-004'||m.id==='INC-002')openBench();else openDesktop();}]]);return;
    }
    originalTalk(id);
  };

  function boot(){
    installEvents();const has=load();$('soundBtn').textContent=state.sound?'🔊':'🔇';if(has&&state.started){$('continueBtn').classList.remove('hidden');$('continueBtn').textContent='CONTINUE • '+mission().title;}updateHUD();
    window.__TECHOPS__={missions, state, readiness, openDesktop, openBench, openMobileLab, openAIConsole};
  }

  boot();
})();
