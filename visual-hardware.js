(() => {
  'use strict';

  const SAVE_KEY = 'techops-visual-hardware-v1';
  const LAB_KEY = 'techops-core1-lab-v1';
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const COMPONENTS = {
    board: [
      {id:'b650',name:'B650 microATX Motherboard',short:'B650 • AM5 • DDR5',kind:'motherboard',socket:'AM5',ram:'DDR5',form:'mATX',about:'The motherboard is the main circuit board. It connects the CPU, RAM, storage, expansion cards, power, and external ports.',connect:'Mounts to case standoffs. CPU goes in the socket; DIMMs go in memory slots; ATX/EPS power connect to board headers.',failure:'Wrong socket/CPU or wrong RAM generation can prevent POST.',hook:'Core 1 3.5 — motherboards, CPUs, and expansion cards.'},
      {id:'z790',name:'Z790 ATX Motherboard',short:'Z790 • LGA1700 • DDR5',kind:'motherboard',socket:'LGA1700',ram:'DDR5',form:'ATX',about:'A full-size desktop motherboard with CPU socket, four DIMM slots, PCIe slots, M.2 storage, SATA, and power headers.',connect:'Requires 24-pin ATX power plus CPU EPS power.',failure:'Missing CPU power can produce fans/lights with no successful POST.',hook:'Core 1 3.5 and 5.1.'},
      {id:'b550',name:'B550 ATX Motherboard',short:'B550 • AM4 • DDR4',kind:'motherboard',socket:'AM4',ram:'DDR4',form:'ATX',about:'A legacy AM4/DDR4 desktop platform used here to teach upgrade compatibility.',connect:'Match AM4 CPUs and DDR4 DIMMs.',failure:'DDR5 will not fit or work in DDR4 slots.',hook:'Core 1 3.3, 3.5, and 5.1.'}
    ],
    cpu: [
      {id:'r5-am5',name:'Ryzen 5 AM5 CPU',short:'AM5 • integrated graphics',kind:'cpu',socket:'AM5',igpu:true,tdp:65,about:'The CPU executes instructions. The socket generation must match the motherboard.',connect:'Drops into the CPU socket in one orientation, then the retention mechanism is closed.',failure:'Wrong socket or damaged/misaligned installation can stop POST.',hook:'Core 1 3.5 and 5.1.'},
      {id:'i7-lga',name:'Core i7 LGA1700 CPU',short:'LGA1700 • integrated graphics',kind:'cpu',socket:'LGA1700',igpu:true,tdp:125,about:'A higher-power desktop CPU used in the creator build.',connect:'Installs into an LGA1700 socket and requires adequate cooling and CPU power.',failure:'Poor cooling can cause thermal throttling or shutdown.',hook:'Core 1 3.5 and 5.1.'},
      {id:'r5-am4',name:'Ryzen 5 AM4 CPU',short:'AM4 • no integrated graphics',kind:'cpu',socket:'AM4',igpu:false,tdp:65,about:'A legacy CPU used to teach platform matching and discrete graphics requirements.',connect:'Requires an AM4 board. This scenario also needs a dedicated GPU for display output.',failure:'Connecting the monitor to motherboard video can produce no display when the CPU has no integrated graphics.',hook:'Core 1 3.5 and 5.3.'}
    ],
    paste: [
      {id:'thermal-paste',name:'Thermal Paste',short:'CPU ↔ cooler interface',kind:'paste',about:'Thermal compound fills microscopic gaps between the CPU heat spreader and cooler.',connect:'Apply a small amount before mounting the cooler.',failure:'Missing/poor thermal interface can contribute to high CPU temperatures.',hook:'Core 1 3.5 and 5.1.'}
    ],
    cooler: [
      {id:'tower-cooler',name:'CPU Air Cooler',short:'Heatsink + fan',kind:'cooler',capacity:150,about:'The heatsink moves heat away from the CPU; the fan moves air through the heatsink.',connect:'Mount over the CPU and connect the fan lead to CPU_FAN.',failure:'A missing cooler or disconnected fan can trigger thermal warnings/shutdowns.',hook:'Core 1 3.5 and 5.1.'},
      {id:'large-cooler',name:'High-Capacity CPU Cooler',short:'Larger heatsink + fan',kind:'cooler',capacity:220,about:'A larger cooler for higher-power CPUs and sustained workloads.',connect:'Mount securely and connect CPU_FAN.',failure:'Incorrect mounting pressure can cause poor thermal transfer.',hook:'Core 1 3.5 and 5.1.'}
    ],
    ram: [
      {id:'ddr5-16',name:'16 GB DDR5 Kit',short:'2 × 8 GB DIMMs',kind:'ram',gen:'DDR5',capacity:16,about:'RAM is fast working memory used while programs run. Desktop DIMMs install into motherboard memory slots.',connect:'Align the notch and press until the latches click. Paired slots are commonly used for dual-channel operation.',failure:'Wrong generation or partially seated memory can prevent POST.',hook:'Core 1 3.3 and 5.1.'},
      {id:'ddr5-32',name:'32 GB DDR5 Kit',short:'2 × 16 GB DIMMs',kind:'ram',gen:'DDR5',capacity:32,about:'A larger DDR5 kit used in the creator system.',connect:'Use the board-recommended paired slots.',failure:'Unseated DIMM = common no-POST symptom after an upgrade.',hook:'Core 1 3.3 and 5.1.'},
      {id:'ddr4-16',name:'16 GB DDR4 Kit',short:'2 × 8 GB DIMMs',kind:'ram',gen:'DDR4',capacity:16,about:'DDR4 is a different memory generation from DDR5 and has a different key/notch position.',connect:'Only install in a DDR4-compatible board.',failure:'DDR generations are not interchangeable.',hook:'Core 1 3.3.'}
    ],
    storage: [
      {id:'nvme-1t',name:'1 TB NVMe M.2 SSD',short:'M.2 • PCIe/NVMe',kind:'m2',bus:'NVMe',about:'A compact solid-state drive that commonly communicates over PCIe using NVMe.',connect:'Insert into the M.2 slot at an angle, press down, and secure it.',failure:'An unseated drive may not appear in BIOS/UEFI or the OS installer.',hook:'Core 1 3.4 and 5.2.'},
      {id:'sata-1t',name:'1 TB SATA SSD',short:'2.5-inch • SATA',kind:'sata-drive',bus:'SATA',about:'A 2.5-inch SATA SSD needs both a SATA data connection and SATA power.',connect:'SATA data → motherboard; SATA power → PSU.',failure:'Data without power—or power without data—means the drive is not usable.',hook:'Core 1 3.2, 3.4, and 5.2.'}
    ],
    gpu: [
      {id:'mid-gpu',name:'Midrange Graphics Card',short:'PCIe x16 • ~200 W',kind:'gpu',watts:200,power:1,about:'A dedicated GPU handles graphics and installs in a PCIe x16 expansion slot.',connect:'Seat in PCIe x16 and attach required PCIe power. Connect the monitor to the GPU outputs.',failure:'Missing GPU power or wrong display output can cause no display/instability.',hook:'Core 1 3.5, 3.6, and 5.3.'},
      {id:'creator-gpu',name:'Creator Graphics Card',short:'PCIe x16 • ~320 W',kind:'gpu',watts:320,power:2,about:'A high-power dedicated GPU for media workloads.',connect:'Requires the PCIe slot plus two simulated PCIe power leads.',failure:'Undersized PSU or missing connectors can crash under load.',hook:'Core 1 3.5, 3.6, and 5.1.'}
    ],
    psu: [
      {id:'450w',name:'450 W 80+ PSU',short:'ATX power supply',kind:'psu',watts:450,about:'The power supply converts AC wall power into regulated DC power used by PC components.',connect:'24-pin ATX → motherboard, EPS/CPU power → motherboard, SATA power → drives, PCIe power → GPU if required.',failure:'Insufficient wattage or missing power leads can cause no power, no POST, or load-related shutdowns.',hook:'Core 1 3.6 and 5.1.'},
      {id:'650w',name:'650 W 80+ Gold PSU',short:'ATX • modular',kind:'psu',watts:650,about:'A midrange modular PSU suitable for many discrete-GPU systems.',connect:'Only install the cables needed, then route them to the correct device/header.',failure:'Modular PSU cables are not universally interchangeable between PSU models in real life.',hook:'Core 1 3.6.'},
      {id:'850w',name:'850 W 80+ Gold PSU',short:'ATX • high-power GPU ready',kind:'psu',watts:850,about:'A higher-capacity PSU with headroom for a high-power graphics card.',connect:'Provide motherboard, CPU, storage, and GPU power as required.',failure:'Missing GPU power can still cause a failed or unstable build even if total wattage is sufficient.',hook:'Core 1 3.6 and 5.1.'}
    ],
    cable: [
      {id:'atx24',name:'24-pin ATX Power',short:'PSU → motherboard',kind:'atx24',about:'The main motherboard power connector.',connect:'PSU main power lead to the 24-pin motherboard header.',failure:'Without it the system will not fully power.',hook:'Core 1 3.2, 3.6, 5.1.'},
      {id:'eps8',name:'8-pin CPU/EPS Power',short:'PSU → CPU power',kind:'eps8',about:'Dedicated power for the CPU voltage-regulation area.',connect:'PSU CPU/EPS lead to the motherboard CPU power header.',failure:'Fans/lights may appear while the CPU cannot initialize.',hook:'Core 1 3.2, 3.6, 5.1.'},
      {id:'cpu-fan',name:'CPU Fan Lead',short:'Cooler → CPU_FAN',kind:'fan-cable',about:'A small fan power/control lead from the CPU cooler.',connect:'Connect to CPU_FAN so firmware can monitor and control CPU cooling.',failure:'Some boards warn or stop boot if no CPU fan is detected.',hook:'Core 1 3.5, 5.1.'},
      {id:'sata-data',name:'SATA Data Cable',short:'Drive → motherboard',kind:'sata',about:'Carries storage data between a SATA drive and motherboard controller.',connect:'One end to SATA SSD, one end to motherboard SATA port.',failure:'Drive has power but is not detected if data path is missing.',hook:'Core 1 3.2, 3.4, 5.2.'},
      {id:'sata-power',name:'SATA Power Lead',short:'PSU → SATA drive',kind:'sata-power',about:'Provides electrical power to SATA storage devices.',connect:'PSU SATA power lead to the drive.',failure:'Data cable alone cannot power the drive.',hook:'Core 1 3.2, 3.6, 5.2.'},
      {id:'front-panel',name:'Front Panel Power Lead',short:'Case button → F_PANEL',kind:'front-panel',about:'The case power-button lead connects to motherboard front-panel pins.',connect:'POWER SW pair → front-panel header.',failure:'A fully built PC can appear dead if the case power button is not connected.',hook:'Core 1 3.2 and 5.1.'},
      {id:'pcie-power',name:'PCIe GPU Power Lead',short:'PSU → graphics card',kind:'pcie-power',about:'Provides extra power beyond what the PCIe slot can supply.',connect:'PSU PCIe power to GPU power sockets.',failure:'High-power GPU may refuse to initialize or crash under load.',hook:'Core 1 3.2, 3.6, 5.1.'},
      {id:'displayport',name:'DisplayPort Cable',short:'GPU/PC → monitor',kind:'displayport',about:'A digital display cable commonly used for high-resolution/high-refresh monitors.',connect:'Video output to matching monitor input.',failure:'Connected to the wrong output path can produce no display.',hook:'Core 1 3.2 and 5.3.'},
      {id:'hdmi',name:'HDMI Cable',short:'PC → display',kind:'hdmi',about:'A common digital audio/video cable.',connect:'Video output to monitor/TV input.',failure:'Wrong source/input or wrong output device can produce no signal.',hook:'Core 1 3.2 and 5.3.'}
    ]
  };

  const BUILD_SCENARIOS = [
    {
      id:'office', name:'Guided Office PC', difficulty:'FOUNDATION',
      brief:'Build a quiet front-office PC for web apps, Microsoft 365, video meetings, and dual-display productivity. Use integrated graphics and a fast NVMe SSD.',
      req:{board:'b650',cpu:'r5-am5',paste:'thermal-paste',cooler:'tower-cooler',ram:'ddr5-16',storage:'nvme-1t',psu:'450w'},
      noGpu:true, minWatts:320, display:'motherboard', objectives:['3.3','3.4','3.5','3.6','5.1'],
      cables:['atx24','eps8','cpu-fan','front-panel','hdmi']
    },
    {
      id:'creator', name:'Creator Workstation', difficulty:'INTERMEDIATE',
      brief:'Build a media workstation with 32 GB DDR5, fast NVMe storage, a dedicated creator GPU, and enough power headroom for sustained workloads.',
      req:{board:'z790',cpu:'i7-lga',paste:'thermal-paste',cooler:'large-cooler',ram:'ddr5-32',storage:'nvme-1t',gpu:'creator-gpu',psu:'850w'},
      minWatts:720, display:'gpu', objectives:['3.3','3.4','3.5','3.6','5.1','5.3'],
      cables:['atx24','eps8','cpu-fan','front-panel','pcie-power','pcie-power','displayport']
    },
    {
      id:'legacy', name:'Broken Upgrade Rescue', difficulty:'TROUBLESHOOT',
      brief:'An older department PC was “upgraded” and now fails. Rebuild it correctly on the existing AM4 platform. It needs DDR4, SATA storage, discrete graphics, and proper power/data/display connections.',
      req:{board:'b550',cpu:'r5-am4',paste:'thermal-paste',cooler:'tower-cooler',ram:'ddr4-16',storage:'sata-1t',gpu:'mid-gpu',psu:'650w'},
      minWatts:560, display:'gpu', objectives:['3.2','3.3','3.4','3.5','3.6','5.1','5.2','5.3'],
      cables:['atx24','eps8','cpu-fan','front-panel','sata-data','sata-power','pcie-power','displayport']
    }
  ];

  const CABLES = [
    {id:'rj45',name:'RJ45 Ethernet',kind:'rj45',use:'Twisted-pair Ethernet network connections'},
    {id:'hdmi',name:'HDMI',kind:'hdmi',use:'Digital audio/video'},
    {id:'displayport',name:'DisplayPort',kind:'displayport',use:'Digital display, common on PCs/monitors'},
    {id:'usbc',name:'USB-C',kind:'usbc',use:'Reversible data/power and alternate modes'},
    {id:'sata',name:'SATA Data',kind:'sata',use:'Motherboard ↔ SATA storage'},
    {id:'atx24',name:'24-pin ATX',kind:'atx24',use:'Main motherboard power'}
  ];

  const CABLE_TASKS = [
    {id:'net',objective:'3.2 / 2.8',title:'Patch a workstation into the switch',prompt:'Connect the desktop NIC to an Ethernet switch access port.',cable:'rj45',left:{name:'Desktop NIC',port:'RJ45',kind:'rj45'},right:{name:'Ethernet Switch',port:'RJ45',kind:'rj45'},why:'RJ45 is the common modular connector for twisted-pair Ethernet.'},
    {id:'display',objective:'3.2 / 5.3',title:'Connect a PC to a high-refresh monitor',prompt:'Use the dedicated DisplayPort output and matching monitor input.',cable:'displayport',left:{name:'Graphics Card',port:'DP',kind:'dp'},right:{name:'Monitor',port:'DP',kind:'dp'},why:'DisplayPort is common for PC monitors, including high-resolution/high-refresh configurations.'},
    {id:'hdmi',objective:'3.2 / 5.3',title:'Connect a conference display',prompt:'The laptop and display both expose HDMI. Make the direct digital video connection.',cable:'hdmi',left:{name:'Laptop',port:'HDMI',kind:'hdmi'},right:{name:'Conference Display',port:'HDMI',kind:'hdmi'},why:'HDMI carries digital video and audio and is common on displays.'},
    {id:'dock',objective:'1.2 / 3.2',title:'Dock a modern laptop',prompt:'Use one reversible connector for charging, data, and display capability.',cable:'usbc',left:{name:'Laptop',port:'USB-C',kind:'usbc'},right:{name:'Dock',port:'USB-C',kind:'usbc'},why:'A capable USB-C/Thunderbolt-class connection can combine power, data, display, and peripherals.'},
    {id:'sata',objective:'3.2 / 3.4',title:'Connect SATA storage data',prompt:'Connect the SATA SSD data interface to a motherboard SATA port.',cable:'sata',left:{name:'2.5-inch SATA SSD',port:'SATA',kind:'sata'},right:{name:'Motherboard',port:'SATA',kind:'sata'},why:'SATA storage uses a SATA data cable to the motherboard and a separate power lead from the PSU.'},
    {id:'power',objective:'3.2 / 3.6',title:'Connect motherboard main power',prompt:'Connect the PSU main motherboard lead to the 24-pin ATX header.',cable:'atx24',left:{name:'Power Supply',port:'24-pin',kind:'atx'},right:{name:'Motherboard',port:'ATX',kind:'atx'},why:'The 24-pin ATX connector is the motherboard main power connection.'}
  ];

  const BIOS_SCENARIOS = [
    {id:'windows',title:'Prepare for Windows Installation',brief:'A new system must boot the Windows installer from a USB drive. Put the USB installer first in boot priority.',tab:'boot',check:s=>s.boot[0]==='USB Installer',success:'USB Installer is first in boot order. The system will try the installer before the internal drive.'},
    {id:'vm',title:'Prepare a Virtualization Lab',brief:'The technician needs to run local virtual machines. Enable CPU virtualization support in firmware.',tab:'advanced',check:s=>s.virtualization===true,success:'CPU virtualization is enabled for the hypervisor.'},
    {id:'security',title:'Prepare Windows 11 Security',brief:'This workstation must satisfy modern platform-security requirements. Enable TPM and Secure Boot.',tab:'security',check:s=>s.tpm===true&&s.secureBoot===true,success:'TPM and Secure Boot are enabled.'},
    {id:'thermal',title:'Respond to a Thermal Warning',brief:'CPU temperature reached 94°C under load after a cooler service. Confirm fan monitoring and use a stronger fan profile while the hardware is inspected.',tab:'monitor',check:s=>s.fanProfile==='Performance'&&s.cpuFan==='Detected',success:'The firmware is detecting the CPU fan and the fan profile is set to Performance. Hardware cooling still needs physical verification.'}
  ];

  const state = loadState();
  let currentView = 'hub';
  let buildScenario = state.lastScenario || 0;
  let mode = state.mode || 'learn';
  let build = blankBuild();
  let selectedPart = null;
  let selectedCable = null;
  let cableTaskIndex = state.cableTask || 0;
  let cableConnections = {left:false,right:false};
  let biosScenarioIndex = state.biosScenario || 0;
  let bios = defaultBios();
  let biosTab = 'main';
  let timerHandle = null;
  let challengeStarted = null;

  function defaults(){return {xp:0,buildAttempts:0,buildSuccess:0,cableSuccess:0,biosSuccess:0,mode:'learn',lastScenario:0,cableTask:0,biosScenario:0,seen:{}};}
  function loadState(){try{return {...defaults(),...JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')};}catch(_){return defaults();}}
  function saveState(){state.mode=mode;state.lastScenario=buildScenario;state.cableTask=cableTaskIndex;state.biosScenario=biosScenarioIndex;try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch(_){} updateStats();}
  function blankBuild(){return {esd:false,powered:false,installed:{},connections:{},safetyMisses:0,postStatus:'OFF',postLog:'SYSTEM OFFLINE. Assemble the PC, connect power/data, then press the chassis power button.'};}
  function defaultBios(){return {boot:['NVMe SSD','USB Installer','Network/PXE'],tpm:false,secureBoot:false,virtualization:false,memoryProfile:'Auto',fanProfile:'Standard',cpuFan:'Detected',cpuTemp:42};}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function findComponent(category,id){return (COMPONENTS[category]||[]).find(x=>x.id===id);}
  function allParts(){return Object.entries(COMPONENTS).flatMap(([category,items])=>items.map(x=>({...x,category})));}
  function partById(id){return allParts().find(x=>x.id===id);}
  function currentScenario(){return BUILD_SCENARIOS[buildScenario%BUILD_SCENARIOS.length];}
  function currentCableTask(){return CABLE_TASKS[cableTaskIndex%CABLE_TASKS.length];}
  function currentBiosScenario(){return BIOS_SCENARIOS[biosScenarioIndex%BIOS_SCENARIOS.length];}
  function setMode(next){mode=next;saveState();renderView(currentView);}
  function updateStats(){if($('vhXp'))$('vhXp').textContent=state.xp;if($('vhBuilds'))$('vhBuilds').textContent=state.buildSuccess;if($('vhModeStat'))$('vhModeStat').textContent=mode.toUpperCase();}

  function svg(kind, small=false){
    const w=small?90:150,h=small?62:100;
    const common=`viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(kind)} illustration"`;
    if(kind==='motherboard') return `<svg ${common}><rect x="5" y="5" width="${w-10}" height="${h-10}" rx="7" fill="#123a35" stroke="#4c8277" stroke-width="2"/><rect x="26" y="18" width="32" height="32" rx="3" fill="#a6ada9" stroke="#d7dbd6"/><rect x="65" y="14" width="5" height="46" fill="#161c20"/><rect x="75" y="14" width="5" height="46" fill="#161c20"/><rect x="17" y="69" width="82" height="7" fill="#d8d9d4"/><rect x="44" y="56" width="50" height="5" fill="#1d2c29" stroke="#9a7e4e"/><rect x="112" y="26" width="10" height="29" fill="#161a1d" stroke="#64757b"/><g fill="#243f3a"><circle cx="14" cy="14" r="3"/><circle cx="130" cy="76" r="3"/><circle cx="111" cy="72" r="3"/></g><path d="M10 52L31 52L31 61L55 61" stroke="#2f665c" fill="none"/><path d="M87 23L105 23L105 48" stroke="#2f665c" fill="none"/></svg>`;
    if(kind==='cpu') return `<svg ${common}><rect x="20" y="12" width="${w-40}" height="${h-24}" rx="7" fill="#aeb3ae" stroke="#e3e6df" stroke-width="2"/><rect x="31" y="23" width="${w-62}" height="${h-46}" rx="4" fill="#7c8583"/><g fill="#d5bb68">${Array.from({length:12},(_,i)=>`<circle cx="${26+(i%6)*18}" cy="${17+Math.floor(i/6)*(h-34)}" r="2"/>`).join('')}</g><text x="50%" y="53%" text-anchor="middle" fill="#dce1dd" font-size="10" font-family="sans-serif">CPU</text></svg>`;
    if(kind==='ram') return `<svg ${common}><rect x="7" y="19" width="${w-14}" height="${h-38}" rx="3" fill="#1e6b51" stroke="#65b28f"/><g fill="#14231f">${Array.from({length:8},(_,i)=>`<rect x="${14+i*((w-32)/8)}" y="25" width="${(w-42)/8}" height="${h-52}" rx="1"/>`).join('')}</g><g fill="#cdb45f">${Array.from({length:18},(_,i)=>`<rect x="${10+i*((w-20)/18)}" y="${h-21}" width="3" height="7"/>`).join('')}</g><path d="M${w/2-5} ${h-15}L${w/2+5} ${h-15}L${w/2+2} ${h-21}L${w/2-2} ${h-21}Z" fill="#07110e"/></svg>`;
    if(kind==='m2') return `<svg ${common}><rect x="8" y="28" width="${w-22}" height="${h-56}" rx="3" fill="#1c5f4c" stroke="#62ad8d"/><rect x="18" y="33" width="34" height="${h-58}" fill="#151f1c"/><rect x="58" y="33" width="34" height="${h-58}" fill="#151f1c"/><circle cx="${w-20}" cy="${h/2}" r="5" fill="none" stroke="#b5c3bc"/><g fill="#d0b65f">${Array.from({length:10},(_,i)=>`<rect x="${8+i*5}" y="${h-31}" width="3" height="6"/>`).join('')}</g></svg>`;
    if(kind==='sata-drive') return `<svg ${common}><rect x="12" y="12" width="${w-24}" height="${h-24}" rx="8" fill="#2b3135" stroke="#71808a" stroke-width="2"/><rect x="24" y="27" width="${w-48}" height="${h-54}" rx="4" fill="#d9dee0"/><text x="50%" y="52%" text-anchor="middle" fill="#33424a" font-size="9" font-family="sans-serif">SATA SSD</text><rect x="${w-45}" y="${h-16}" width="18" height="6" fill="#111719"/><rect x="${w-68}" y="${h-16}" width="18" height="6" fill="#111719"/></svg>`;
    if(kind==='gpu') return `<svg ${common}><rect x="8" y="12" width="${w-20}" height="${h-27}" rx="7" fill="#1b2228" stroke="#566d7a" stroke-width="2"/><circle cx="48" cy="${h/2}" r="22" fill="#0b1014" stroke="#667984"/><circle cx="100" cy="${h/2}" r="22" fill="#0b1014" stroke="#667984"/><g stroke="#3d4f58">${[0,45,90,135].map(a=>`<path d="M48 ${h/2}l${Math.cos(a*Math.PI/180)*18} ${Math.sin(a*Math.PI/180)*18}"/>`).join('')}${[0,45,90,135].map(a=>`<path d="M100 ${h/2}l${Math.cos(a*Math.PI/180)*18} ${Math.sin(a*Math.PI/180)*18}"/>`).join('')}</g><rect x="18" y="${h-15}" width="78" height="7" fill="#c8ad54"/><rect x="${w-29}" y="6" width="18" height="10" fill="#111619" stroke="#70828c"/></svg>`;
    if(kind==='psu') return `<svg ${common}><rect x="12" y="10" width="${w-24}" height="${h-20}" rx="6" fill="#252c31" stroke="#71808a" stroke-width="2"/><circle cx="55" cy="${h/2}" r="29" fill="#0f1518" stroke="#5f7079"/><g stroke="#46555c">${Array.from({length:8},(_,i)=>`<line x1="55" y1="${h/2}" x2="${55+Math.cos(i*Math.PI/4)*25}" y2="${h/2+Math.sin(i*Math.PI/4)*25}"/>`).join('')}</g><rect x="96" y="25" width="30" height="18" rx="2" fill="#101619"/><circle cx="110" cy="63" r="5" fill="#161d20" stroke="#6d7e87"/></svg>`;
    if(kind==='cooler') return `<svg ${common}><rect x="28" y="10" width="${w-56}" height="${h-20}" rx="8" fill="#7c888d" stroke="#b6c0c3"/><g stroke="#56636a">${Array.from({length:10},(_,i)=>`<line x1="${34+i*8}" y1="15" x2="${34+i*8}" y2="${h-15}"/>`).join('')}</g><circle cx="${w/2}" cy="${h/2}" r="29" fill="#11171a" stroke="#65747c"/><circle cx="${w/2}" cy="${h/2}" r="6" fill="#52636b"/><g stroke="#3f4d53" stroke-width="6">${[0,60,120].map(a=>`<line x1="${w/2}" y1="${h/2}" x2="${w/2+Math.cos(a*Math.PI/180)*23}" y2="${h/2+Math.sin(a*Math.PI/180)*23}"/>`).join('')}</g></svg>`;
    if(kind==='paste') return `<svg ${common}><g transform="rotate(-18 ${w/2} ${h/2})"><rect x="34" y="34" width="76" height="30" rx="8" fill="#d8dfe2" stroke="#7b8c94"/><rect x="104" y="40" width="28" height="18" rx="3" fill="#466170"/><rect x="23" y="40" width="18" height="18" rx="3" fill="#22333d"/><text x="72" y="53" text-anchor="middle" fill="#263c48" font-size="8" font-family="sans-serif">THERMAL</text></g></svg>`;
    if(['atx24','eps8','fan-cable','sata','sata-power','front-panel','pcie-power','displayport','hdmi','rj45','usbc','atx'].includes(kind)){
      const label={atx24:'24-PIN',eps8:'EPS 8','fan-cable':'FAN',sata:'SATA','sata-power':'SATA PWR','front-panel':'PWR SW','pcie-power':'PCIe','displayport':'DP',hdmi:'HDMI',rj45:'RJ45',usbc:'USB-C',atx:'ATX'}[kind]||kind;
      return `<svg ${common}><path d="M20 ${h/2} C45 8, ${w-45} ${h-8}, ${w-20} ${h/2}" fill="none" stroke="#354650" stroke-width="8"/><rect x="8" y="${h/2-13}" width="30" height="26" rx="5" fill="#171e22" stroke="#72828a"/><rect x="${w-38}" y="${h/2-13}" width="30" height="26" rx="5" fill="#171e22" stroke="#72828a"/><text x="50%" y="52%" text-anchor="middle" fill="#b9d2dd" font-size="9" font-family="sans-serif">${label}</text></svg>`;
    }
    return `<svg ${common}><rect x="8" y="8" width="${w-16}" height="${h-16}" rx="8" fill="#16232b" stroke="#5d7886"/><text x="50%" y="52%" text-anchor="middle" fill="#c0d6df" font-size="9" font-family="sans-serif">${esc(kind)}</text></svg>`;
  }

  function ensureOverlay(){
    if($('visualHardwareOverlay')) return;
    const el=document.createElement('div');el.id='visualHardwareOverlay';el.className='vh-overlay hidden';
    el.innerHTML=`<header class="vh-topbar"><div class="vh-logo">HW</div><div class="vh-brand"><strong>TechOps Visual Hardware Lab</strong><small>CORE 1 • BUILD / CONNECT / FIRMWARE</small></div><span class="vh-pill">220-1201 • VISUAL PRACTICE</span><div class="vh-grow"></div><div class="vh-stat"><small>MODE</small><strong id="vhModeStat">LEARN</strong></div><div class="vh-stat"><small>XP</small><strong id="vhXp">0</strong></div><div class="vh-stat"><small>BUILDS</small><strong id="vhBuilds">0</strong></div><button id="vhClose" class="vh-close" aria-label="Exit Visual Hardware Lab">×</button></header><div class="vh-shell"><nav id="vhNav" class="vh-nav"></nav><main id="vhStage" class="vh-stage"></main></div><div id="vhAchievement" class="vh-achievement hidden"></div>`;
    document.body.appendChild(el);
    $('vhClose').addEventListener('click',closeVisual);
    renderNav();
    updateStats();
  }

  function renderNav(){
    const nav=$('vhNav');if(!nav)return;
    nav.innerHTML=`<h3>VISUAL TRAINING FLOOR</h3>${[
      ['hub','⌂','Visual Lab Home','Choose a visual practice system'],
      ['build','🧩','PC Build Bay 2.0','Assemble and troubleshoot a desktop'],
      ['cables','🔌','Connection Workshop','See ports and connect real cable types'],
      ['bios','⌨','BIOS / UEFI Simulator','Boot, security, virtualization, thermals']
    ].map(([id,icon,name,sub])=>`<button data-vh-view="${id}" class="${currentView===id?'active':''}"><strong>${icon} ${name}</strong><span>${sub}</span></button>`).join('')}<h3 style="margin-top:18px">TRAINING MODE</h3>${['learn','practice','challenge'].map(m=>`<button data-vh-mode="${m}" class="${mode===m?'active':''}"><strong>${m==='learn'?'🧭 Learn':m==='practice'?'🛠 Practice':'⚡ Challenge'}</strong><span>${m==='learn'?'Labels + guidance':m==='practice'?'Hints on request':'Minimal assistance'}</span></button>`).join('')}`;
    $$('[data-vh-view]',nav).forEach(b=>b.addEventListener('click',()=>renderView(b.dataset.vhView)));
    $$('[data-vh-mode]',nav).forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.vhMode)));
  }

  function openVisual(view='hub'){
    ensureOverlay();
    $('visualHardwareOverlay').classList.remove('hidden');
    document.body.style.overflow='hidden';
    renderView(view);
  }
  function closeVisual(){
    $('visualHardwareOverlay')?.classList.add('hidden');
    document.body.style.overflow='';
    clearInterval(timerHandle);timerHandle=null;
  }
  function renderView(view){
    currentView=view;renderNav();
    if(view==='build')renderBuild();else if(view==='cables')renderCables();else if(view==='bios')renderBios();else renderHub();
  }

  function renderHub(){
    $('vhStage').innerHTML=`<section class="vh-hub"><div class="vh-kicker">TECHOPS 0.4 • VISUAL HARDWARE UPGRADE</div><h2>Learn the hardware by seeing where it actually goes.</h2><p>This lab replaces text-only hardware drills with technical illustrations, real placement logic, connection paths, POST failures, and firmware settings. In Learn mode, labels and coaching stay visible. Practice removes some help. Challenge expects you to recognize the parts and diagnose the result.</p><div class="vh-mode-row">${['learn','practice','challenge'].map(m=>`<button class="vh-mode ${mode===m?'active':''}" data-hub-mode="${m}">${m.toUpperCase()}</button>`).join('')}</div><div class="vh-card-grid"><article class="vh-card"><div class="vh-card-icon">🧩</div><h3>PC Build Bay 2.0</h3><p>Install the motherboard, CPU, thermal paste, cooler, RAM, storage, GPU, and PSU. Then connect power/data/display and run POST. Different mistakes produce different symptoms.</p><button class="primary" data-open-vh="build">ENTER BUILD BAY</button></article><article class="vh-card"><div class="vh-card-icon">🔌</div><h3>Connection Workshop</h3><p>See RJ45, USB-C, HDMI, DisplayPort, SATA, and ATX connectors as shapes—not just vocabulary. Physically match a cable to both endpoints and verify the link.</p><button data-open-vh="cables">OPEN CABLE BENCH</button></article><article class="vh-card"><div class="vh-card-icon">⌨</div><h3>BIOS / UEFI Simulator</h3><p>Use a firmware-style interface to change boot order, enable virtualization, configure TPM/Secure Boot, and react to thermal/fan information.</p><button data-open-vh="bios">ENTER FIRMWARE</button></article></div><div class="vh-card" style="margin-top:12px;min-height:auto"><div class="vh-kicker">DESIGN RULE</div><h3 style="margin:6px 0">If you should recognize it in real life, TechOps should show it.</h3><p style="margin:0">The visual models are technical training illustrations rather than manufacturer-specific replicas. They preserve the features a technician needs to recognize: socket, DIMM slots, PCIe, M.2, SATA, power headers, connectors, and device relationships.</p></div></section>`;
    $$('[data-hub-mode]',$('vhStage')).forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.hubMode)));
    $$('[data-open-vh]',$('vhStage')).forEach(b=>b.addEventListener('click',()=>renderView(b.dataset.openVh)));
  }

  function resetBuild(keepScenario=true){
    build=blankBuild();selectedPart=null;challengeStarted=mode==='challenge'?Date.now():null;
    if(!keepScenario) buildScenario=0;
  }

  function categoriesForScenario(){return ['board','cpu','paste','cooler','ram','storage','gpu','psu','cable'];}
  function inventoryItems(){
    const scenario=currentScenario();
    const items=[];
    categoriesForScenario().forEach(category=>{
      (COMPONENTS[category]||[]).forEach(item=>{
        if(category==='gpu'&&scenario.noGpu) return;
        if(category==='cable'&&!scenario.cables.includes(item.id)&&item.id!=='sata-power') return;
        items.push({...item,category});
      });
    });
    return items;
  }

  function isInstalled(id){return Object.values(build.installed).includes(id)||Object.values(build.connections).flat().includes(id);}
  function renderBuild(){
    const scenario=currentScenario();
    const hidden=mode==='challenge'?'vh-hidden-labels':'';
    $('vhStage').innerHTML=`<div class="vh-section-head"><div class="copy"><div class="vh-kicker">PC BUILD BAY 2.0 • ${scenario.difficulty}</div><h2>${scenario.name}</h2><p>${scenario.brief}</p><div class="vh-legend"><span>Core 1 ${scenario.objectives.join(' • ')}</span><span>${mode.toUpperCase()} MODE</span><span>Scenario ${buildScenario+1}/${BUILD_SCENARIOS.length}</span></div></div><div><button class="vh-btn" id="vhScenarioNext">NEXT BUILD ORDER ↻</button></div></div><div class="vh-workbench ${hidden}"><section class="vh-panel"><div class="vh-panel-head"><strong>PARTS + CABLE CART</strong><small>drag or click</small></div><div id="vhInventory" class="vh-inventory"></div></section><section class="vh-panel"><div class="vh-scenario-tabs">${BUILD_SCENARIOS.map((s,i)=>`<button data-build-scenario="${i}" class="${i===buildScenario?'active':''}">${s.name}</button>`).join('')}</div><div id="vhBench" class="vh-bench"><div class="vh-bench-grid"></div><div id="vhCoach" class="vh-mode-help">${coachText()}</div><div class="vh-case"><div class="vh-case-bay vh-mobo-zone ${build.installed.board?'filled':''}" data-drop-zone="board">${build.installed.board?boardMarkup():`MOTHERBOARD + STANDOFFS`}</div><div class="vh-case-bay vh-drive-zone ${build.installed.storage&&findComponent('storage',build.installed.storage)?.kind==='sata-drive'?'filled':''}" data-drop-zone="storage-bay">${driveMarkup()}</div><div class="vh-case-bay vh-psu-zone ${build.installed.psu?'filled':''}" data-drop-zone="psu">${psuMarkup()}</div><div class="vh-case-bay vh-gpu-zone ${build.installed.gpu?'filled':''}" data-drop-zone="gpu">${gpuZoneMarkup()}</div></div><div class="vh-monitor"><div id="vhMonitorScreen" class="vh-monitor-screen ${build.postStatus==='SUCCESS'?'on':''}">${build.postStatus==='SUCCESS'?'TECHOPS POST\nSUCCESS':'NO SIGNAL'}</div></div><button id="vhPower" class="vh-power-button ${minimumPowerReady()?'ready':''}" title="Power on / POST">⏻</button><div class="vh-toolbar"><button id="vhEsd" class="vh-btn ${build.esd?'success':''}">${build.esd?'✓ ESD CONNECTED':'CONNECT ESD STRAP'}</button><button id="vhResetBuild" class="vh-btn">RESET BENCH</button><button id="vhAutoHint" class="vh-btn">${mode==='challenge'?'INSPECT BUILD (-XP)':'SHOW NEXT STEP'}</button></div></div></section><aside class="vh-panel"><div class="vh-panel-head"><strong>TECH INSPECTOR</strong><small>click a part</small></div><div id="vhInspector" class="vh-inspector"></div></aside></div>`;
    renderInventory();renderInspector(selectedPart||partById(nextRequiredPartId())||partById('b650'));bindBuild();
  }

  function coachText(){
    if(mode==='challenge') return `<strong>Challenge mode.</strong> Labels and step coaching are suppressed. Build from the work order, then diagnose POST results.`;
    const next=nextRequiredPartId();const p=partById(next);
    if(!build.esd) return `<strong>Start safely:</strong> connect the ESD strap before handling internal electronics. ESD means electrostatic discharge.`;
    if(p) return `<strong>Next:</strong> ${esc(p.name)}. ${esc(p.connect||'Place it where it belongs in the system.')}`;
    return `<strong>Assembly complete?</strong> Check the cable cart and connect every required power/data/display path, then press the power button.`;
  }

  function boardMarkup(){
    const board=findComponent('board',build.installed.board);if(!board)return'';
    return `<div class="vh-mobo" data-inspect="${board.id}" title="${board.name}"><span class="vh-trace" style="left:12%;top:45%;width:34%;transform:rotate(8deg)"></span><span class="vh-trace" style="left:40%;top:55%;width:38%;transform:rotate(-13deg)"></span><div class="vh-socket"></div><i class="vh-dimm d1"></i><i class="vh-dimm d2"></i><i class="vh-dimm d3"></i><i class="vh-dimm d4"></i><div class="vh-pcie"></div><div class="vh-m2"></div><div class="vh-sata-bank"><i></i><i></i><i></i><i></i></div><div class="vh-atx24"></div><div class="vh-eps8"></div><div class="vh-cpufan"></div><div class="vh-frontpanel"></div><span class="vh-board-label">${esc(board.short)}</span>${onBoardComponents()}${connectionNodes()}</div>`;
  }

  function onBoardComponents(){
    let html='';
    if(build.installed.cpu) html+=`<div class="vh-component-on-board vh-installed-cpu" data-inspect="${build.installed.cpu}">${svg('cpu',true)}</div>`;
    if(build.installed.cooler) html+=`<div class="vh-component-on-board vh-installed-cooler" data-inspect="${build.installed.cooler}">${svg('cooler',true)}</div>`;
    if(build.installed.ram) html+=`<div class="vh-component-on-board vh-installed-ram" data-inspect="${build.installed.ram}">${svg('ram',true)}</div>`;
    if(build.installed.storage&&findComponent('storage',build.installed.storage)?.kind==='m2') html+=`<div class="vh-component-on-board vh-installed-m2" data-inspect="${build.installed.storage}">${svg('m2',true)}</div>`;
    return html;
  }

  function connectionNodes(){
    if(!build.installed.board)return'';
    const node=(id,cls,label)=>`<button class="vh-cable-node ${cls} ${isConnectionDone(id)?'connected':''}" data-connect-node="${id}" title="${label}">${label}</button>`;
    return `${node('atx24','vh-node-atx','24')}${node('eps8','vh-node-eps','8')}${node('cpu-fan','vh-node-fan','F')}${node('front-panel','vh-node-front','P')}${build.installed.storage&&findComponent('storage',build.installed.storage)?.kind==='sata-drive'?node('sata-data','vh-node-sata','S'):''}${build.installed.gpu?node('pcie-power','vh-node-gpu','G'):''}${node('display-mb','vh-node-display-mb','V')}${build.installed.gpu?node('display-gpu','vh-node-display-gpu','V'):''}${node('psu','vh-node-psu','P')}`;
  }

  function driveMarkup(){const id=build.installed.storage;const p=findComponent('storage',id);if(!p||p.kind!=='sata-drive')return'SATA DRIVE BAY';return `<div class="vh-installed-drive" data-inspect="${id}">${svg('sata-drive',true)}</div>`;}
  function psuMarkup(){const id=build.installed.psu;if(!id)return'POWER SUPPLY';return `<div class="vh-installed-psu" data-inspect="${id}">${svg('psu',true)}</div>`;}
  function gpuZoneMarkup(){const id=build.installed.gpu;if(!id)return currentScenario().noGpu?'NO ADD-IN GPU REQUIRED':'PCIe GRAPHICS';return `<div class="vh-installed-gpu" data-inspect="${id}">${svg('gpu',true)}</div>`;}

  function renderInventory(){
    const inv=$('vhInventory');if(!inv)return;
    inv.innerHTML=inventoryItems().map(p=>`<button class="vh-part ${selectedPart?.id===p.id?'selected':''} ${isInstalled(p.id)&&p.category!=='cable'?'used':''}" draggable="true" data-part-id="${p.id}" data-part-category="${p.category}">${svg(p.kind,true)}<span><strong>${esc(p.name)}</strong><span>${esc(p.short||p.connect||'')}</span></span></button>`).join('');
    $$('[data-part-id]',inv).forEach(btn=>{
      btn.addEventListener('dragstart',e=>{selectedPart=partById(btn.dataset.partId);e.dataTransfer.setData('text/plain',btn.dataset.partId);e.dataTransfer.effectAllowed='copy';renderInspector(selectedPart);highlightValidZones();});
      btn.addEventListener('click',()=>{selectedPart=partById(btn.dataset.partId);renderInventory();renderInspector(selectedPart);highlightValidZones();});
    });
  }

  function renderInspector(p){
    const box=$('vhInspector');if(!box)return;
    if(!p){box.innerHTML='<p>Select a visual component to inspect it.</p>';return;}
    state.seen[p.id]=(state.seen[p.id]||0)+1;saveState();
    box.innerHTML=`<div class="title">${svg(p.kind,true)}<div><div class="vh-kicker">COMPONENT ID</div><h3>${esc(p.name)}</h3></div></div><dl><div><dt>WHAT IT IS</dt><dd>${esc(p.about||'A PC component or connection used in this build.')}</dd></div><div><dt>WHERE IT CONNECTS</dt><dd>${esc(p.connect||'Inspect the hardware and use the matching slot or port.')}</dd></div><div><dt>COMMON FAILURE</dt><dd>${esc(p.failure||'Incorrect placement or connection can prevent normal operation.')}</dd></div><div><dt>COMPTIA HOOK</dt><dd>${esc(p.hook||'Core 1 hardware recognition and troubleshooting.')}</dd></div></dl>${buildChecklist()}<div id="vhPost" class="vh-post ${build.postStatus==='SUCCESS'?'success':(build.postStatus!=='OFF'?'fail':'')}">${esc(build.postLog)}</div>`;
  }

  function buildChecklist(){
    const s=currentScenario();
    const checks=[
      ['ESD safety',build.esd],['Motherboard',!!build.installed.board],['CPU',!!build.installed.cpu],['Thermal interface',!!build.installed.paste],['CPU cooler',!!build.installed.cooler],['RAM',!!build.installed.ram],['Storage',!!build.installed.storage],['Power supply',!!build.installed.psu],['Main ATX power',isConnectionDone('atx24')],['CPU power',isConnectionDone('eps8')],['CPU fan',isConnectionDone('cpu-fan')],['Power switch header',isConnectionDone('front-panel')]
    ];
    if(!s.noGpu)checks.push(['Graphics card',!!build.installed.gpu],['GPU power',requiredPcieCount()===0||connectionCount('pcie-power')>=requiredPcieCount()]);
    if(findComponent('storage',build.installed.storage)?.kind==='sata-drive')checks.push(['SATA data',isConnectionDone('sata-data')],['SATA power',isConnectionDone('sata-power')]);
    checks.push(['Display connection',displayConnectedCorrectly()]);
    return `<div class="vh-checklist">${checks.map(([name,done])=>`<div class="vh-check ${done?'done':''}"><span class="vh-dot">${done?'✓':''}</span><span>${esc(name)}</span></div>`).join('')}</div>`;
  }

  function bindBuild(){
    $('vhEsd').addEventListener('click',()=>{build.esd=true;build.postLog='ESD protection connected. You can now service internal components with safer handling habits.';renderBuild();});
    $('vhResetBuild').addEventListener('click',()=>{resetBuild();renderBuild();});
    $('vhPower').addEventListener('click',runPost);
    $('vhAutoHint').addEventListener('click',()=>{if(mode==='challenge'){state.xp=Math.max(0,state.xp-15);saveState();}const id=nextRequiredPartId()||nextRequiredCableId();const p=partById(id);if(p){selectedPart=p;renderInspector(p);highlightValidZones(true);toast(`Hint: inspect ${p.name}.`);}else toast('Everything looks assembled. Run POST and read the symptom.');});
    $('vhScenarioNext').addEventListener('click',()=>{buildScenario=(buildScenario+1)%BUILD_SCENARIOS.length;resetBuild();saveState();renderBuild();});
    $$('[data-build-scenario]',$('vhStage')).forEach(b=>b.addEventListener('click',()=>{buildScenario=Number(b.dataset.buildScenario);resetBuild();saveState();renderBuild();}));
    $$('[data-drop-zone]',$('vhStage')).forEach(zone=>{
      zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('hot');});
      zone.addEventListener('dragleave',()=>zone.classList.remove('hot'));
      zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('hot');const id=e.dataTransfer.getData('text/plain');placePart(id,zone.dataset.dropZone);});
      zone.addEventListener('click',e=>{if(e.target.closest('[data-inspect]'))return;if(selectedPart)placePart(selectedPart.id,zone.dataset.dropZone);});
    });
    $$('[data-connect-node]',$('vhStage')).forEach(node=>node.addEventListener('click',()=>connectSelectedCable(node.dataset.connectNode)));
    $$('[data-inspect]',$('vhStage')).forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();const p=partById(el.dataset.inspect);selectedPart=p;renderInspector(p);renderInventory();}));
  }

  function validZoneFor(p){
    if(!p)return null;
    if(p.category==='board')return'board';
    if(['cpu','paste','cooler','ram'].includes(p.category))return'board';
    if(p.category==='storage')return p.kind==='m2'?'board':'storage-bay';
    if(p.category==='gpu')return'gpu';
    if(p.category==='psu')return'psu';
    return null;
  }
  function highlightValidZones(force=false){
    $$('[data-drop-zone]',$('vhStage')).forEach(z=>z.classList.remove('hot'));
    if(!selectedPart)return;
    const zone=validZoneFor(selectedPart);if(zone){const el=document.querySelector(`[data-drop-zone="${zone}"]`);if(el&&(mode!=='challenge'||force))el.classList.add('hot');}
    if(selectedPart.category==='cable'){const target=cableTargetFor(selectedPart.id);if(target){$$(`[data-connect-node="${target}"]`,$('vhStage')).forEach(n=>n.classList.add('hot'));}}
  }

  function placePart(id,zone){
    const p=partById(id);if(!p)return;
    if(p.category==='cable'){toast('Cables plug into ports. Select the cable, then click its matching connector on the motherboard/device.');return;}
    const valid=validZoneFor(p);
    if(valid!==zone){feedback(`That ${p.name} does not physically belong in this area. Inspect the slot/connector shape and try again.`,true);return;}
    if(!build.esd){build.safetyMisses++;feedback('You handled internal electronics without connecting ESD protection. The part can still be installed, but TechOps records this as unsafe bench procedure.',true);}
    if(['cpu','paste','cooler','ram'].includes(p.category)&&!build.installed.board){feedback('Install the motherboard first so the socket/slots exist in the chassis.',true);return;}
    if(p.category==='paste'&&!build.installed.cpu){feedback('Thermal paste goes on the installed CPU before the cooler.',true);return;}
    if(p.category==='cooler'&&!build.installed.cpu){feedback('The CPU must be installed before its cooler.',true);return;}
    build.installed[p.category]=p.id;selectedPart=p;build.powered=false;build.postStatus='OFF';build.postLog=`Installed: ${p.name}. ${p.connect||''}`;
    renderBuild();
  }

  function cableTargetFor(id){
    const map={'atx24':'atx24','eps8':'eps8','cpu-fan':'cpu-fan','front-panel':'front-panel','sata-data':'sata-data','pcie-power':'pcie-power','displayport':currentScenario().display==='gpu'?'display-gpu':'display-mb','hdmi':currentScenario().display==='gpu'?'display-gpu':'display-mb','sata-power':'psu'};
    return map[id];
  }
  function connectSelectedCable(node){
    if(!selectedPart||selectedPart.category!=='cable'){toast('Select a cable from the parts cart first.');return;}
    const id=selectedPart.id;const expected=cableTargetFor(id);
    if(node!==expected){feedback(`${selectedPart.name} does not belong on that connector. Compare connector shape and destination.`,true);return;}
    if(['atx24','eps8','front-panel','cpu-fan'].includes(id)&&!build.installed.board){feedback('There is no motherboard installed to receive that connector.',true);return;}
    if(id==='cpu-fan'&&!build.installed.cooler){feedback('The CPU fan lead comes from the installed cooler.',true);return;}
    if(id==='sata-data'&&findComponent('storage',build.installed.storage)?.kind!=='sata-drive'){feedback('SATA data is only needed for the SATA drive in this build.',true);return;}
    if(id==='sata-power'&&findComponent('storage',build.installed.storage)?.kind!=='sata-drive'){feedback('No SATA-powered drive is installed.',true);return;}
    if(id==='pcie-power'&&!build.installed.gpu){feedback('Install the graphics card before connecting GPU power.',true);return;}
    if(['atx24','eps8','sata-power','pcie-power'].includes(id)&&!build.installed.psu){feedback('Install the PSU first. These leads originate from the power supply.',true);return;}
    if(id==='pcie-power'){
      build.connections[id]=build.connections[id]||[];build.connections[id].push(id);
    }else build.connections[id]=[id];
    build.postLog=`Connected: ${selectedPart.name}. ${selectedPart.connect}`;
    renderBuild();
  }
  function isConnectionDone(id){return (build.connections[id]||[]).length>0;}
  function connectionCount(id){return (build.connections[id]||[]).length;}
  function requiredPcieCount(){const g=findComponent('gpu',build.installed.gpu);return g?.power||0;}

  function nextRequiredPartId(){
    const req=currentScenario().req;
    for(const cat of ['board','cpu','paste','cooler','ram','storage','gpu','psu']){
      if(req[cat]&&!build.installed[cat])return req[cat];
    }
    return null;
  }
  function nextRequiredCableId(){
    for(const id of currentScenario().cables){
      if(id==='pcie-power'){if(connectionCount(id)<requiredPcieCount())return id;}
      else if(!isConnectionDone(id))return id;
    }
    if(findComponent('storage',build.installed.storage)?.kind==='sata-drive'&&!isConnectionDone('sata-power'))return'sata-power';
    return null;
  }
  function minimumPowerReady(){return !!build.installed.psu&&isConnectionDone('atx24')&&isConnectionDone('front-panel');}
  function displayConnectedCorrectly(){const s=currentScenario();const cable=s.cables.includes('displayport')?'displayport':'hdmi';const node=s.display==='gpu'?'display-gpu':'display-mb';return isConnectionDone(cable)&&cableTargetFor(cable)===node;}

  function validateBuild(){
    const s=currentScenario(),issues=[];
    const req=s.req;
    for(const [cat,id] of Object.entries(req)){
      if(!build.installed[cat])issues.push({type:'missing',cat,msg:`Missing ${cat}: ${findComponent(cat,id)?.name||id}.`});
    }
    const board=findComponent('board',build.installed.board),cpu=findComponent('cpu',build.installed.cpu),ram=findComponent('ram',build.installed.ram),psu=findComponent('psu',build.installed.psu),gpu=findComponent('gpu',build.installed.gpu),storage=findComponent('storage',build.installed.storage),cooler=findComponent('cooler',build.installed.cooler);
    if(board&&cpu&&board.socket!==cpu.socket)issues.push({type:'post',cat:'cpu',msg:`CPU socket mismatch: ${cpu.socket} CPU on ${board.socket} motherboard.`});
    if(board&&ram&&board.ram!==ram.gen)issues.push({type:'post',cat:'ram',msg:`Memory generation mismatch: ${ram.gen} DIMMs on ${board.ram} motherboard.`});
    if(!isConnectionDone('atx24'))issues.push({type:'power',msg:'24-pin ATX motherboard power is not connected.'});
    if(!isConnectionDone('front-panel'))issues.push({type:'power',msg:'Case power switch is not connected to the front-panel header.'});
    if(!isConnectionDone('eps8'))issues.push({type:'post',msg:'CPU/EPS power is not connected.'});
    if(build.installed.cooler&&!isConnectionDone('cpu-fan'))issues.push({type:'thermal',msg:'CPU cooler fan is not connected to CPU_FAN.'});
    if(!build.installed.paste)issues.push({type:'thermal',msg:'Thermal paste was skipped.'});
    if(!cooler)issues.push({type:'thermal',msg:'CPU cooler is missing.'});
    if(cpu&&cooler&&cooler.capacity<cpu.tdp)issues.push({type:'thermal',msg:'Cooler capacity is inadequate for the CPU workload.'});
    if(storage?.kind==='sata-drive'){
      if(!isConnectionDone('sata-data'))issues.push({type:'storage',msg:'SATA data cable is missing.'});
      if(!isConnectionDone('sata-power'))issues.push({type:'storage',msg:'SATA power is missing.'});
    }
    if(gpu){
      if(connectionCount('pcie-power')<gpu.power)issues.push({type:'display',msg:`GPU requires ${gpu.power} PCIe power connection${gpu.power>1?'s':''}; only ${connectionCount('pcie-power')} connected.`});
    }
    if(psu&&psu.watts<s.minWatts)issues.push({type:'power-load',msg:`${psu.watts} W PSU is below the simulated ${s.minWatts} W build requirement/headroom.`});
    const videoCable=s.cables.includes('displayport')?'displayport':'hdmi';
    if(!isConnectionDone(videoCable))issues.push({type:'display',msg:'No monitor video cable is connected.'});
    if(s.display==='gpu'&&!gpu)issues.push({type:'display',msg:'This build requires a dedicated GPU for display output.'});
    if(s.display==='motherboard'&&cpu&&!cpu.igpu)issues.push({type:'display',msg:'The CPU has no integrated graphics, so motherboard display output cannot produce video.'});
    return issues;
  }

  function runPost(){
    state.buildAttempts++;saveState();
    const issues=validateBuild();build.powered=true;
    if(!isConnectionDone('atx24')||!isConnectionDone('front-panel')||!build.installed.psu){
      build.postStatus='NO POWER';build.postLog='[POWER] Button pressed.\n[FAIL] No normal system power.\n'+issues.filter(x=>x.type==='power'||x.type==='missing').map(x=>'• '+x.msg).join('\n');renderBuild();return;
    }
    const postIssue=issues.find(x=>x.type==='post'||(x.type==='missing'&&['board','cpu','ram'].includes(x.cat)));
    if(postIssue){build.postStatus='NO POST';build.postLog='[POWER] Fans / LEDs may start.\n[POST] CPU and memory initialization...\n[FAIL] POST did not complete.\n• '+postIssue.msg+'\n\nTroubleshooting habit: focus on recent hardware changes and compatibility first.';renderBuild();return;}
    const displayIssue=issues.find(x=>x.type==='display');
    const storageIssue=issues.find(x=>x.type==='storage');
    const thermalIssue=issues.find(x=>x.type==='thermal');
    const powerLoad=issues.find(x=>x.type==='power-load');
    if(displayIssue){build.postStatus='NO DISPLAY';build.postLog='[POWER] System energized.\n[POST] CPU... OK\n[POST] Memory... OK\n[VIDEO] No usable display path.\n• '+displayIssue.msg;renderBuild();return;}
    if(powerLoad){build.postStatus='POWER RISK';build.postLog='[POST] Hardware detected.\n[WARN] Power budget/headroom check failed.\n• '+powerLoad.msg+'\nA system may POST but become unstable under heavy load.';renderBuild();return;}
    if(thermalIssue){build.postStatus='THERMAL WARNING';build.postLog='[POST] CPU... OK\n[POST] Memory... OK\n[THERMAL] WARNING\n• '+thermalIssue.msg+'\nFirmware may shut the system down if temperature rises.';renderBuild();return;}
    if(storageIssue){build.postStatus='STORAGE MISSING';build.postLog='[POST] CPU... OK\n[POST] Memory... OK\n[VIDEO] Display initialized.\n[STORAGE] Device not detected.\n• '+storageIssue.msg;renderBuild();return;}
    const wrong=Object.entries(currentScenario().req).find(([cat,id])=>build.installed[cat]!==id);
    if(wrong){const [cat,id]=wrong;build.postStatus='WRONG BUILD';build.postLog=`[POST] System starts, but the build does not meet the customer work order.\n[CHECK] ${cat.toUpperCase()} should be ${findComponent(cat,id)?.name||id}.\nPassing POST is not the same as satisfying the ticket.`;renderBuild();return;}
    build.postStatus='SUCCESS';build.postLog='[POWER] Stable\n[POST] CPU... OK\n[POST] Memory... OK\n[VIDEO] Initialized\n[STORAGE] Detected\n[THERMAL] CPU fan detected\n[RESULT] POST SUCCESS\n\nThe system meets the build order. Verify firmware sees the expected memory/storage before installing the OS.';
    state.buildSuccess++;state.xp+=mode==='challenge'?450:mode==='practice'?320:240;saveState();creditLab(currentScenario().objectives,220);achievement('POST SUCCESS',`${currentScenario().name} completed in ${mode} mode.`);renderBuild();
  }

  function feedback(msg,bad=false){build.postLog=(bad?'[COACH] ':'[INFO] ')+msg;renderInspector(selectedPart||partById(nextRequiredPartId()));toast(msg);}

  function renderCables(){
    const task=currentCableTask();
    $('vhStage').innerHTML=`<div class="vh-section-head"><div class="copy"><div class="vh-kicker">CONNECTION WORKSHOP • VISUAL PORT RECOGNITION</div><h2>${task.title}</h2><p>${task.prompt} Drag a visual cable to the ports, or click a cable and then click each endpoint.</p></div><button id="vhCableNext" class="vh-btn">NEW CONNECTION ↻</button></div><div class="vh-cable-layout"><aside class="vh-cable-rack"><h3>CABLE DRAWER</h3>${CABLES.map(c=>`<div class="vh-cable-card ${selectedCable===c.id?'selected':''}" draggable="true" data-vh-cable="${c.id}">${svg(c.kind,true)}<span><strong>${esc(c.name)}</strong><span>${mode==='challenge'?'Identify by shape':esc(c.use)}</span></span></div>`).join('')}</aside><main class="vh-cable-work"><div class="vh-cable-task"><small>CORE 1 ${task.objective}</small><strong>${task.title}</strong><p>${task.prompt}</p></div><div class="vh-cable-diagram"><section class="vh-cable-endpoint left"><h4>${esc(task.left.name)}</h4><p>${mode==='challenge'?'Inspect the port shape.':`Port: ${esc(task.left.port)}`}</p><button class="vh-cable-bigport ${task.left.kind} ${cableConnections.left?'connected':''}" data-cable-side="left">${mode==='challenge'?'':esc(task.left.port)}</button></section><section class="vh-cable-endpoint right"><h4>${esc(task.right.name)}</h4><p>${mode==='challenge'?'Inspect the port shape.':`Port: ${esc(task.right.port)}`}</p><button class="vh-cable-bigport ${task.right.kind} ${cableConnections.right?'connected':''}" data-cable-side="right">${mode==='challenge'?'':esc(task.right.port)}</button></section>${cableConnections.left&&cableConnections.right?'<div class="vh-connected-line"></div>':''}</div><div id="vhCableFeedback" class="vh-post ${cableConnections.left&&cableConnections.right?'success':''}">${cableConnections.left&&cableConnections.right?esc(task.why):'Select the cable that physically matches the connection. Then connect both endpoints.'}</div>${task.id==='net'?wireGameMarkup():''}</main><aside class="vh-device-rack"><h3>VISUAL REFERENCE</h3>${['rj45','usbc','hdmi','displayport','sata','atx24'].map(id=>{const c=CABLES.find(x=>x.id===id);return `<article class="vh-device"><strong style="font-size:.63rem">${mode==='challenge'?'PORT SAMPLE':esc(c.name)}</strong><div class="vh-device-visual">${portReference(c.kind)}</div><p style="font-size:.55rem;color:#718e9f">${mode==='learn'?esc(c.use):'Click/inspect by connector shape.'}</p></article>`}).join('')}</aside></div>`;
    bindCables();
  }

  function portReference(kind){
    const cls=kind==='displayport'?'dp':kind==='atx24'?'atx':kind;
    return `<div class="vh-port ${cls}" style="left:50%;top:50%;transform:translate(-50%,-50%)">${mode==='challenge'?'':esc(kind.toUpperCase())}</div>`;
  }
  function bindCables(){
    $$('[data-vh-cable]',$('vhStage')).forEach(card=>{
      card.addEventListener('click',()=>{selectedCable=card.dataset.vhCable;renderCables();});
      card.addEventListener('dragstart',e=>{selectedCable=card.dataset.vhCable;e.dataTransfer.setData('text/plain',selectedCable);});
    });
    $$('[data-cable-side]',$('vhStage')).forEach(port=>{
      port.addEventListener('dragover',e=>{e.preventDefault();port.classList.add('hot');});
      port.addEventListener('dragleave',()=>port.classList.remove('hot'));
      port.addEventListener('drop',e=>{e.preventDefault();selectedCable=e.dataTransfer.getData('text/plain')||selectedCable;connectCableSide(port.dataset.cableSide);});
      port.addEventListener('click',()=>connectCableSide(port.dataset.cableSide));
    });
    $('vhCableNext').addEventListener('click',()=>{cableTaskIndex=(cableTaskIndex+1)%CABLE_TASKS.length;cableConnections={left:false,right:false};selectedCable=null;saveState();renderCables();});
    bindWireGame();
  }
  function connectCableSide(side){
    const task=currentCableTask();
    if(!selectedCable){toast('Pick up a cable first.');return;}
    if(selectedCable!==task.cable){$('vhCableFeedback').className='vh-post fail';$('vhCableFeedback').textContent=`That cable does not match this job. Compare the connector shape at both endpoints.`;return;}
    cableConnections[side]=true;
    if(cableConnections.left&&cableConnections.right){state.cableSuccess++;state.xp+=mode==='challenge'?180:120;saveState();creditLab(task.objective.split(' / ').map(x=>x.trim()).filter(x=>/^\d/.test(x)),100);achievement('LINK VERIFIED',task.why);setTimeout(()=>{cableTaskIndex=(cableTaskIndex+1)%CABLE_TASKS.length;cableConnections={left:false,right:false};selectedCable=null;saveState();renderCables();},1200);}else renderCables();
  }

  const WIRE_ORDER=['W/O','O','W/G','B','W/B','G','W/Br','Br'];
  let wireSlots=[];
  function wireGameMarkup(){
    return `<section class="vh-wiregame"><div class="vh-kicker">BONUS • RJ45 TERMINATION</div><h3 style="font-size:.76rem;margin:5px 0">T568B visual pin order</h3><p style="font-size:.62rem;color:#829eae">Click conductors in the correct left-to-right pin order, then TEST. Learn mode shows the standard. Practice/Challenge expects recall.</p>${mode==='learn'?'<div style="font-size:.58rem;color:#a8bdc8">T568B: white/orange, orange, white/green, blue, white/blue, green, white/brown, brown</div>':''}<div id="vhWireSlots" class="vh-wire-slots">${Array.from({length:8},(_,i)=>`<button class="vh-wire-slot ${wireSlots[i]?'filled':''}" data-wire-slot="${i}">${wireSlots[i]||`PIN ${i+1}`}</button>`).join('')}</div><div class="vh-wire-palette">${WIRE_ORDER.map(w=>`<button class="vh-wire" data-wire="${w}">${w}</button>`).join('')}</div><div style="margin-top:9px;display:flex;gap:7px"><button id="vhWireTest" class="vh-btn">RUN CABLE TESTER</button><button id="vhWireClear" class="vh-btn">CLEAR</button></div><div id="vhWireResult" class="vh-post">Cable tester waiting...</div></section>`;
  }
  function bindWireGame(){
    if(!$('vhWireSlots'))return;
    $$('[data-wire]').forEach(b=>b.addEventListener('click',()=>{if(wireSlots.length<8){wireSlots.push(b.dataset.wire);renderCables();}}));
    $$('[data-wire-slot]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.wireSlot);if(wireSlots[i]){wireSlots.splice(i,1);renderCables();}}));
    $('vhWireClear')?.addEventListener('click',()=>{wireSlots=[];renderCables();});
    $('vhWireTest')?.addEventListener('click',()=>{const ok=wireSlots.length===8&&wireSlots.every((w,i)=>w===WIRE_ORDER[i]);const box=$('vhWireResult');box.className='vh-post '+(ok?'success':'fail');box.textContent=ok?'PASS: Pins 1–8 map correctly for T568B. A cable tester verifies continuity/wire map after termination.':'FAIL: Wire map does not match T568B. Inspect the conductor order and try again.';if(ok){state.xp+=140;saveState();creditLab(['3.2','2.8'],90);}});
  }

  function renderBios(){
    const scenario=currentBiosScenario();
    $('vhStage').innerHTML=`<div class="vh-section-head"><div class="copy"><div class="vh-kicker">BIOS / UEFI SIMULATOR • CORE 1 FIRMWARE PRACTICE</div><h2>${scenario.title}</h2><p>${scenario.brief}</p></div><button id="vhBiosNext" class="vh-btn">NEXT FIRMWARE TASK ↻</button></div><section class="vh-bios"><div class="vh-bios-top"><strong>TECHOPS UEFI SETUP UTILITY</strong><span>Board: Training Platform • Firmware 0.4</span></div><div class="vh-bios-tabs">${['main','boot','security','advanced','monitor'].map(t=>`<button data-bios-tab="${t}" class="${biosTab===t?'active':''}">${t.toUpperCase()}</button>`).join('')}</div><div class="vh-bios-body"><main id="vhBiosMain" class="vh-bios-main">${biosTabMarkup()}</main><aside class="vh-bios-help"><strong>TRAINING TICKET</strong><p>${esc(scenario.brief)}</p><hr style="border:0;border-top:1px solid #304d98"><p>${mode==='learn'?biosHelpText():mode==='practice'?'Use the ticket to decide which firmware setting matters.':'Challenge mode: no setting hint. Make the minimum required change and save.'}</p><div id="vhBiosResult" class="vh-bios-result">Changes are simulated until you select SAVE & EXIT.</div></aside></div><footer class="vh-bios-footer"><button id="vhBiosSave" class="vh-btn primary">F10 • SAVE & EXIT</button><button id="vhBiosDefaults" class="vh-btn">LOAD DEFAULTS</button><button id="vhBiosDiscard" class="vh-btn">DISCARD CHANGES</button></footer></section>`;
    bindBios();
  }
  function biosHelpText(){const s=currentBiosScenario();return {boot:'Boot order controls which device firmware tries first. Move the USB installer above the internal NVMe drive.',advanced:'CPU virtualization features must be enabled for many hypervisors to use hardware acceleration.',security:'TPM stores/protects cryptographic material; Secure Boot helps ensure trusted boot components.',monitor:'Firmware hardware-monitor pages can show CPU temperature and fan detection. A fan profile changes cooling behavior, but you still inspect the physical cooler.'}[s.tab]||'Use the firmware categories to find the setting described by the ticket.';}
  function biosTabMarkup(){
    if(biosTab==='main')return `${biosRow('System Date','2026-08-20')}${biosRow('CPU','Training CPU • 8 cores')}${biosRow('Installed Memory','32 GB DDR5')}${biosRow('NVMe Storage','1 TB NVMe SSD')}${biosRow('Firmware Mode','UEFI')}`;
    if(biosTab==='boot')return `<div class="vh-kicker">BOOT PRIORITY</div><p style="font-size:.64rem;color:#aebfec">The first device is attempted first.</p><div class="vh-boot-list">${bios.boot.map((x,i)=>`<div class="vh-boot-item"><span>${i+1}. ${esc(x)}</span><span><button data-boot-up="${i}" ${i===0?'disabled':''}>↑</button><button data-boot-down="${i}" ${i===bios.boot.length-1?'disabled':''}>↓</button></span></div>`).join('')}</div>`;
    if(biosTab==='security')return `${biosToggle('Trusted Platform Module (TPM)','tpm',bios.tpm)}${biosToggle('Secure Boot','secureBoot',bios.secureBoot)}${biosRow('Platform Key Status',bios.secureBoot?'Installed':'Not active')}`;
    if(biosTab==='advanced')return `${biosToggle('CPU Virtualization (SVM / VT-x)','virtualization',bios.virtualization)}${biosSelect('Memory Profile','memoryProfile',['Auto','EXPO/XMP Profile'])}${biosRow('PCIe Configuration','Auto')}`;
    if(biosTab==='monitor')return `${biosRow('CPU Temperature',bios.cpuTemp+' °C')}${biosRow('CPU Fan',bios.cpuFan)}${biosSelect('Fan Profile','fanProfile',['Silent','Standard','Performance'])}${biosRow('Motherboard Temperature','36 °C')}`;
    return'';
  }
  function biosRow(name,value){return `<div class="vh-bios-row"><strong>${esc(name)}</strong><div class="vh-bios-value"><span>${esc(value)}</span></div></div>`;}
  function biosToggle(name,key,val){return `<div class="vh-bios-row"><strong>${esc(name)}</strong><div class="vh-bios-value"><button data-bios-toggle="${key}">${val?'Enabled':'Disabled'}</button></div></div>`;}
  function biosSelect(name,key,options){return `<div class="vh-bios-row"><strong>${esc(name)}</strong><div class="vh-bios-value"><select class="vh-bios-select" data-bios-select="${key}">${options.map(o=>`<option ${bios[key]===o?'selected':''}>${esc(o)}</option>`).join('')}</select></div></div>`;}
  function bindBios(){
    $$('[data-bios-tab]',$('vhStage')).forEach(b=>b.addEventListener('click',()=>{biosTab=b.dataset.biosTab;renderBios();}));
    $$('[data-bios-toggle]',$('vhStage')).forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.biosToggle;bios[k]=!bios[k];renderBios();}));
    $$('[data-bios-select]',$('vhStage')).forEach(s=>s.addEventListener('change',()=>{bios[s.dataset.biosSelect]=s.value;renderBios();}));
    $$('[data-boot-up]',$('vhStage')).forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.bootUp);[bios.boot[i-1],bios.boot[i]]=[bios.boot[i],bios.boot[i-1]];renderBios();}));
    $$('[data-boot-down]',$('vhStage')).forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.bootDown);[bios.boot[i+1],bios.boot[i]]=[bios.boot[i],bios.boot[i+1]];renderBios();}));
    $('vhBiosDefaults').addEventListener('click',()=>{bios=defaultBios();renderBios();});
    $('vhBiosDiscard').addEventListener('click',()=>{bios=defaultBios();renderBios();});
    $('vhBiosSave').addEventListener('click',()=>{const s=currentBiosScenario();const box=$('vhBiosResult');if(s.check(bios)){box.className='vh-bios-result good';box.textContent='PASS: '+s.success;state.biosSuccess++;state.xp+=mode==='challenge'?220:150;saveState();creditLab(s.id==='vm'?['4.1']:s.id==='security'?['3.5']:s.id==='thermal'?['5.1']:['3.4'],100);achievement('FIRMWARE TASK COMPLETE',s.success);}else{box.className='vh-bios-result bad';box.textContent='NOT COMPLETE: The saved firmware state does not yet satisfy the ticket. Re-open the relevant category and make the minimum necessary change.';}});
    $('vhBiosNext').addEventListener('click',()=>{biosScenarioIndex=(biosScenarioIndex+1)%BIOS_SCENARIOS.length;bios=defaultBios();biosTab='main';saveState();renderBios();});
  }

  function creditLab(objectives,points){
    try{
      const exposed=window.__TECHOPS_LAB__?.state;
      let data=exposed||JSON.parse(localStorage.getItem(LAB_KEY)||'{}');
      data.objectives=data.objectives||{};objectives.forEach(id=>data.objectives[id]=(data.objectives[id]||0)+1);data.xp=(data.xp||0)+points;data.sessions=(data.sessions||0)+1;
      localStorage.setItem(LAB_KEY,JSON.stringify(data));
    }catch(_){}
  }
  function achievement(title,text){const box=$('vhAchievement');if(!box)return;box.innerHTML=`<strong>${esc(title)}</strong>${esc(text)}`;box.classList.remove('hidden');setTimeout(()=>box.classList.add('hidden'),3000);}
  function toast(text){achievement('TECH ASSIST',text);}

  function installLaunchers(){
    const heroActions=document.querySelector('.hero-actions');
    if(heroActions&&!$('titleVisualHardwareBtn')){
      const b=document.createElement('button');b.id='titleVisualHardwareBtn';b.className='btn ghost xl';b.textContent='🧩 VISUAL HARDWARE LAB';b.addEventListener('click',()=>openVisual('hub'));heroActions.insertBefore(b,$('continueBtn'));
    }
    const top=document.querySelector('.top-actions');
    if(top&&!$('visualHardwareBtn')){const b=document.createElement('button');b.id='visualHardwareBtn';b.className='icon-btn';b.title='Visual Hardware Lab';b.setAttribute('aria-label','Open Visual Hardware Lab');b.textContent='🧩';b.addEventListener('click',()=>openVisual('hub'));top.insertBefore(b,$('refreshBtn'));}
    const menu=$('menuPanel');
    if(menu&&!$('menuVisualHardwareBtn')){const b=document.createElement('button');b.id='menuVisualHardwareBtn';b.className='menu-item';b.innerHTML='Visual Hardware Lab <span>🧩</span>';b.addEventListener('click',()=>{menu.classList.add('hidden');openVisual('hub');});menu.insertBefore(b,$('menuLabBtn'));}
    const small=document.querySelector('.brand-lockup small');if(small)small.textContent='CORE 1 VISUAL BUILD • PLAYTEST 0.4';
    const hero=document.querySelector('.hero-card > p');if(hero)hero.textContent='TechOps now teaches Core 1 through guided First Shift missions, a repeatable Computer Lab, Technician Refresh, and a visual hardware simulator where you assemble PCs, connect real port types, read POST symptoms, and change BIOS/UEFI settings.';

    document.addEventListener('click',e=>{
      const target=e.target.closest?.('[data-lab-view]');
      if(!target)return;
      if(target.dataset.labView==='pc-build-bay'||target.dataset.labView==='cable-wall'){
        e.preventDefault();e.stopImmediatePropagation();
        window.__TECHOPS_LAB__?.close?.();
        openVisual(target.dataset.labView==='pc-build-bay'?'build':'cables');
      }
    },true);

    window.addEventListener('keydown',e=>{
      if($('visualHardwareOverlay')?.classList.contains('hidden'))return;
      if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeVisual();}
    },true);
  }

  function boot(){ensureOverlay();installLaunchers();window.__TECHOPS_VISUAL_HARDWARE__={open:openVisual,close:closeVisual,state,renderView,setMode,scenarios:BUILD_SCENARIOS,cableTasks:CABLE_TASKS,biosScenarios:BIOS_SCENARIOS};}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();