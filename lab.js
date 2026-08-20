(() => {
  'use strict';

  const LAB_SAVE = 'techops-core1-lab-v1';
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const DOMAINS = [
    {id:'1.0',name:'Mobile Devices',weight:13,objectives:['1.1','1.2','1.3']},
    {id:'2.0',name:'Networking',weight:23,objectives:['2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8']},
    {id:'3.0',name:'Hardware',weight:25,objectives:['3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8']},
    {id:'4.0',name:'Virtualization & Cloud',weight:11,objectives:['4.1','4.2']},
    {id:'5.0',name:'Hardware & Network Troubleshooting',weight:28,objectives:['5.1','5.2','5.3','5.4','5.5','5.6']}
  ];

  const OBJECTIVES = {
    '1.1':'Mobile hardware replacement techniques','1.2':'Mobile accessories and connectivity','1.3':'Mobile networking and application support',
    '2.1':'TCP/UDP ports and protocols','2.2':'Wireless networking technologies','2.3':'Networked host services','2.4':'Network configuration concepts','2.5':'Networking hardware devices','2.6':'SOHO wired/wireless configuration','2.7':'Internet connections and network types','2.8':'Networking tools',
    '3.1':'Display components and attributes','3.2':'Cables and connectors','3.3':'RAM characteristics','3.4':'Storage devices and RAID','3.5':'Motherboards, CPUs and expansion cards','3.6':'Power supplies','3.7':'Multifunction devices and printers','3.8':'Printer maintenance',
    '4.1':'Virtualization concepts','4.2':'Cloud computing concepts',
    '5.1':'Motherboard, RAM, CPU and power troubleshooting','5.2':'Drive and RAID troubleshooting','5.3':'Video, projector and display troubleshooting','5.4':'Mobile device troubleshooting','5.5':'Network troubleshooting','5.6':'Printer troubleshooting'
  };

  const STATIONS = [
    {id:'pc-build-bay',icon:'🖥️',name:'PC Build Bay',domain:'Hardware',desc:'Build working PCs from customer briefs. Practice compatibility, RAM, storage, motherboards, CPUs, power, cooling, POST and RAID.',objectives:['3.3','3.4','3.5','3.6','5.1','5.2']},
    {id:'cable-wall',icon:'🔌',name:'Cable Wall',domain:'Hardware + Networking',desc:'Identify connectors, cable media, pinout use cases and the technician tools used to terminate and test them.',objectives:['3.2','2.8']},
    {id:'network-rack',icon:'🌐',name:'Network Rack',domain:'Networking',desc:'Work ports, Wi-Fi, services, DNS/DHCP, VLANs, SOHO addressing, devices, connection types and network tools.',objectives:['2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8']},
    {id:'mobile-clinic',icon:'📱',name:'Mobile Clinic',domain:'Mobile Devices',desc:'Repair laptops and mobile devices, configure Bluetooth and cellular connectivity, and handle MDM and synchronization.',objectives:['1.1','1.2','1.3','5.4']},
    {id:'display-lab',icon:'🖼️',name:'Display Lab',domain:'Hardware',desc:'Compare panel technologies and display attributes, then diagnose projectors, monitors and cabling symptoms.',objectives:['3.1','5.3']},
    {id:'printer-shop',icon:'🖨️',name:'Printer Shop',domain:'Hardware',desc:'Configure, maintain and troubleshoot laser, inkjet, thermal and impact printers plus multifunction devices.',objectives:['3.7','3.8','5.6']},
    {id:'vm-cloud-sandbox',icon:'☁️',name:'VM / Cloud Sandbox',domain:'Virtualization & Cloud',desc:'Provision virtual machines, choose hypervisors, allocate resources and match real workloads to cloud models.',objectives:['4.1','4.2']},
    {id:'troubleshooting-arena',icon:'⚠️',name:'Troubleshooting Arena',domain:'Troubleshooting',desc:'Rapid mixed incidents. Gather evidence, identify the likely cause, choose a safe fix and verify the result.',objectives:['5.1','5.2','5.3','5.4','5.5','5.6']}
  ];

  const PARTS = {
    board:[
      {id:'am5-matx',name:'B650 microATX board',spec:'AM5 • DDR5 • M.2 • PCIe',tags:['am5','ddr5','matx']},
      {id:'lga-atx',name:'Z790 ATX board',spec:'LGA1700 • DDR5 • M.2 • PCIe',tags:['lga1700','ddr5','atx']},
      {id:'am4-atx',name:'B550 ATX board',spec:'AM4 • DDR4 • M.2 • PCIe',tags:['am4','ddr4','atx']}
    ],
    cpu:[
      {id:'r5-am5',name:'Ryzen 5',spec:'AM5 • 6 cores • integrated graphics',tags:['am5','igpu']},
      {id:'i7-lga',name:'Core i7',spec:'LGA1700 • 16 cores • integrated graphics',tags:['lga1700','igpu']},
      {id:'r5-am4',name:'Ryzen 5 Legacy',spec:'AM4 • 6 cores • no integrated graphics',tags:['am4']}
    ],
    ram:[
      {id:'ddr5-16',name:'16 GB DDR5 DIMM kit',spec:'2×8 GB • dual-channel',tags:['ddr5','dimm']},
      {id:'ddr5-32',name:'32 GB DDR5 DIMM kit',spec:'2×16 GB • dual-channel',tags:['ddr5','dimm']},
      {id:'ddr4-16',name:'16 GB DDR4 DIMM kit',spec:'2×8 GB • dual-channel',tags:['ddr4','dimm']},
      {id:'ecc-ddr5',name:'32 GB ECC DDR5',spec:'Error-correcting • workstation/server',tags:['ddr5','ecc','dimm']}
    ],
    storage:[
      {id:'nvme-1t',name:'1 TB NVMe M.2 SSD',spec:'PCIe/NVMe • high performance',tags:['nvme','m2','ssd']},
      {id:'sata-1t',name:'1 TB SATA SSD',spec:'2.5-inch • SATA',tags:['sata','ssd']},
      {id:'hdd-4t',name:'4 TB HDD',spec:'3.5-inch • 7200 RPM • SATA',tags:['sata','hdd']},
      {id:'sas-2t',name:'2 TB SAS SSD',spec:'SAS • enterprise',tags:['sas','ssd']}
    ],
    psu:[
      {id:'450w',name:'450 W 80+ PSU',spec:'Non-modular • 20+4 pin',watts:450},
      {id:'650w',name:'650 W 80+ Gold PSU',spec:'Modular • 20+4 pin',watts:650},
      {id:'850w',name:'850 W 80+ Gold PSU',spec:'Modular • high-power GPU ready',watts:850}
    ],
    gpu:[
      {id:'igpu',name:'Use integrated graphics',spec:'No add-in video card'},
      {id:'mid-gpu',name:'Midrange PCIe video card',spec:'8 GB VRAM • ~200 W'},
      {id:'creator-gpu',name:'Creator PCIe video card',spec:'16 GB VRAM • ~320 W'}
    ]
  };

  const BUILD_BRIEFS = [
    {name:'Front Office Workstation',text:'Build a quiet, reliable office desktop. It needs integrated graphics, 16 GB RAM, fast solid-state storage, and no unnecessary high-wattage parts.',req:{board:'am5-matx',cpu:'r5-am5',ram:'ddr5-16',storage:'nvme-1t',psu:'450w',gpu:'igpu'},objectives:['3.3','3.4','3.5','3.6']},
    {name:'Design Creator Station',text:'Build a high-performance creator PC for large media projects. Use the Intel platform, 32 GB DDR5, NVMe storage, a dedicated creator GPU, and enough power headroom.',req:{board:'lga-atx',cpu:'i7-lga',ram:'ddr5-32',storage:'nvme-1t',psu:'850w',gpu:'creator-gpu'},objectives:['3.3','3.4','3.5','3.6']},
    {name:'Legacy Upgrade Rescue',text:'A department is keeping an AM4 workstation. Upgrade it without replacing the motherboard. It needs DDR4 memory, SATA SSD storage, dedicated graphics, and adequate power.',req:{board:'am4-atx',cpu:'r5-am4',ram:'ddr4-16',storage:'sata-1t',psu:'650w',gpu:'mid-gpu'},objectives:['3.3','3.4','3.5','3.6','5.1']}
  ];

  const STORAGE_CASES = [
    {objective:'3.4',q:'A laptop has an M.2 slot wired for PCIe and needs the fastest practical local storage. What belongs in the slot?',choices:['1 TB NVMe M.2 SSD','3.5-inch 7200 RPM HDD','SAS SSD','Optical drive'],answer:0,explain:'NVMe commonly uses PCIe and the M.2 form factor, giving much higher performance than a mechanical HDD.'},
    {objective:'3.4',q:'Which RAID level stripes data for speed but provides no fault tolerance?',choices:['RAID 0','RAID 1','RAID 5','RAID 10'],answer:0,explain:'RAID 0 stripes data across drives for performance. One drive failure can destroy the array.'},
    {objective:'3.4',q:'A two-drive workstation must keep an identical copy of data if either drive fails. Which configuration fits?',choices:['RAID 0','RAID 1','RAID 5','JBOD only'],answer:1,explain:'RAID 1 mirrors data between two drives, trading usable capacity for redundancy.'},
    {objective:'5.2',q:'A hard drive starts clicking and S.M.A.R.T. reports imminent failure. What is the safest priority?',choices:['Back up/replace the failing drive','Defragment repeatedly','Increase CPU voltage','Replace the monitor'],answer:0,explain:'Clicking plus S.M.A.R.T. failure is strong evidence of a failing drive. Protect data and replace the drive.'},
    {objective:'5.2',q:'A RAID array reports one member missing and an audible alarm. What should you investigate first?',choices:['Which physical drive failed and the array state','The browser cache','Display resolution','Bluetooth pairing'],answer:0,explain:'RAID alarms and missing members point to storage health. Identify the failed member and preserve the array before unrelated changes.'}
  ];

  const CABLE_CASES = [
    {objective:'3.2',q:'You need to terminate a standard copper Ethernet patch cable. Which connector is expected?',choices:['RJ45','RJ11','F-type','DB9'],answer:0,explain:'RJ45 is the common connector used with twisted-pair Ethernet cabling.'},
    {objective:'3.2',q:'A cable from a cable modem screws onto the wall outlet. Which connector is this?',choices:['F-type','LC','RJ45','USB-C'],answer:0,explain:'Coaxial cable internet commonly uses threaded F-type connectors.'},
    {objective:'3.2',q:'A modern monitor supports high refresh rate video and the PC has the matching dedicated video output. Which cable is a strong choice?',choices:['DisplayPort','RJ11','SATA','DB9'],answer:0,explain:'DisplayPort is a modern digital video interface commonly used for high-resolution/high-refresh displays.'},
    {objective:'3.2',q:'Which connector is small, reversible, and can carry power, data, and sometimes video?',choices:['USB-C','VGA','RJ11','Molex'],answer:0,explain:'USB-C is reversible and can support data, charging, and alternate modes such as display output.'},
    {objective:'3.2',q:'You are connecting a SATA SSD to a desktop motherboard. Which data cable is appropriate?',choices:['SATA','HDMI','LC fiber','Lightning'],answer:0,explain:'SATA data cables connect SATA drives to compatible motherboard ports.'},
    {objective:'3.2',q:'A fiber patch cord uses a small form-factor connector with a latch. Which is it?',choices:['LC','F-type','RJ11','DB9'],answer:0,explain:'LC is a compact fiber-optic connector common in modern network environments.'},
    {objective:'2.8',q:'You need to identify which unlabeled wall jack leads to a specific cable in a wiring closet. Which tool helps?',choices:['Toner probe','Multimeter','Loopback plug','Wi-Fi analyzer'],answer:0,explain:'A tone generator/probe traces a copper cable through a bundle or wall run.'},
    {objective:'2.8',q:'You just terminated an Ethernet cable and want to verify pin continuity and wiring. Which tool should you use?',choices:['Cable tester','Punchdown tool','Wi-Fi analyzer','Screwdriver'],answer:0,explain:'A cable tester checks continuity and wiring order after termination.'},
    {objective:'2.8',q:'Which tool seats individual copper conductors into an IDC block on a patch panel?',choices:['Punchdown tool','Crimper','Cable toner','Loopback plug'],answer:0,explain:'A punchdown tool seats and trims conductors into insulation-displacement terminals.'},
    {objective:'2.8',q:'You are attaching an RJ45 plug to bulk twisted-pair cable. Which tool is used to secure the plug?',choices:['Crimper','Punchdown tool','Network tap','Wi-Fi analyzer'],answer:0,explain:'A crimper secures modular connectors such as RJ45 onto prepared cable.'}
  ];

  const NETWORK_CASES = [
    {objective:'2.1',q:'A secure website must be allowed through a firewall. Which destination is the expected HTTPS service?',choices:['TCP 443','UDP 67','TCP 25','TCP 3389'],answer:0,explain:'HTTPS uses TCP port 443. Knowing common ports helps you reason about services and firewall rules.'},
    {objective:'2.1',q:'A workstation needs to obtain an address automatically. Which protocol/ports support the normal DHCP exchange?',choices:['UDP 67/68','TCP 20/21','TCP 389','TCP 445'],answer:0,explain:'DHCP uses UDP ports 67 and 68 for server/client address configuration.'},
    {objective:'2.2',q:'A new wireless deployment can use 6 GHz and needs more clean spectrum at short range. Which band should you evaluate?',choices:['6 GHz','900 MHz','AM radio','Coax only'],answer:0,explain:'Current A+ objectives include 2.4, 5 and 6 GHz wireless frequency considerations.'},
    {objective:'2.3',q:'Users know server names but clients need those names translated into IP addresses. Which host service provides that?',choices:['DNS server','Print server','Syslog server','Load balancer'],answer:0,explain:'DNS resolves names into IP addresses and can host multiple record types.'},
    {objective:'2.4',q:'Mail for a domain must be directed to the correct mail server. Which DNS record type is intended for this?',choices:['MX','A','CNAME','TXT only'],answer:0,explain:'MX records identify mail exchangers for a domain.'},
    {objective:'2.4',q:'You want the DHCP server to always give one printer the same address based on its device identity. What do you configure?',choices:['DHCP reservation','DHCP exclusion only','Random scope','Public DNS TXT record'],answer:0,explain:'A DHCP reservation maps a client to a consistent leased address.'},
    {objective:'2.5',q:'Twenty wired office PCs need to communicate on the same LAN. Which device provides the normal Layer 2 access ports?',choices:['Ethernet switch','Cable modem','ONT only','Projector'],answer:0,explain:'A switch connects wired devices inside a LAN. Managed switches can add features such as VLANs.'},
    {objective:'2.5',q:'Wireless clients need access to the wired LAN. Which device bridges Wi-Fi clients into that network?',choices:['Wireless access point','Patch panel','Cable stripper','UPS'],answer:0,explain:'An access point provides Wi-Fi connectivity and bridges clients to the network.'},
    {objective:'2.6',q:'A PC receives 169.254.22.9 and no gateway on a SOHO network. Which service should you investigate first?',choices:['DHCP','NTP','SMTP','Bluetooth'],answer:0,explain:'169.254.x.x is APIPA and often means the client could not obtain normal DHCP configuration.'},
    {objective:'2.6',q:'A SOHO router LAN is 192.168.50.0/24. Which address is a sensible default gateway for clients?',choices:['192.168.50.1','8.8.8.8','169.254.1.1','255.255.255.0'],answer:0,explain:'The gateway should normally be an address on the client local subnet, commonly the router interface.'},
    {objective:'2.7',q:'A business wants very high bandwidth and low latency delivered over optical media. Which internet connection best fits?',choices:['Fiber','DSL','Satellite','Dial-up'],answer:0,explain:'Fiber uses optical transmission and commonly provides high bandwidth with low latency.'},
    {objective:'2.7',q:'A smartwatch talking directly to a phone is an example of which network scope?',choices:['PAN','WAN','MAN','SAN'],answer:0,explain:'A personal area network covers a very small area around a person and commonly includes Bluetooth devices.'},
    {objective:'2.8',q:'Users report Wi-Fi interference and poor channels. Which technician tool provides the most direct radio/channel evidence?',choices:['Wi-Fi analyzer','Crimper','Punchdown tool','Cable stripper'],answer:0,explain:'A Wi-Fi analyzer reveals nearby networks, channels, signal strength and interference clues.'}
  ];

  const MOBILE_CASES = [
    {objective:'1.1',q:'A laptop only runs while plugged in and the battery health report is severely degraded. Which component is the likely replacement?',choices:['Battery','Webcam','Wi-Fi antenna','Keyboard'],answer:0,explain:'Poor battery health and loss of runtime point directly to battery replacement.'},
    {objective:'1.1',q:'A laptop loses Wi-Fi after the display assembly was replaced. The wireless card is detected. What physical item deserves inspection?',choices:['Wi-Fi antenna connector/placement','SSD partition','Printer toner','CPU socket'],answer:0,explain:'Laptop Wi-Fi antennas often route through the display assembly. Loose antenna leads can cause poor/no connectivity.'},
    {objective:'1.2',q:'A user wants one cable to charge a laptop and connect displays/peripherals through a desk accessory. Which combination fits?',choices:['USB-C docking station','RJ11 splitter','F-type adapter','SATA cable'],answer:0,explain:'USB-C docks can carry power, data and display signals when the device supports the required modes.'},
    {objective:'1.2',q:'A phone should exchange a tiny amount of data by being tapped near a reader. Which technology is designed for this?',choices:['NFC','SATA','VGA','DSL'],answer:0,explain:'Near-field communication works over very short distances and is used for tap-based interactions.'},
    {objective:'1.3',q:'A new phone cannot see a headset. What sequence is the best starting point?',choices:['Enable Bluetooth, put headset in pairing mode, select it, authenticate, test','Replace the phone motherboard','Change DNS first','Format the device'],answer:0,explain:'Bluetooth pairing is procedural: radio enabled, accessory discoverable, select, authenticate, then test.'},
    {objective:'1.3',q:'A company needs to enforce device configuration and approved corporate apps on employee phones. What platform capability is intended for this?',choices:['MDM','RAID','POST','PCL'],answer:0,explain:'Mobile device management applies policy, configurations and corporate application controls.'},
    {objective:'1.3',q:'A user is near the monthly cellular limit. Which support concern should you explain before a large cloud sync?',choices:['Data cap usage','CPU socket type','Printer ribbon','VLAN trunking'],answer:0,explain:'Mobile synchronization can consume cellular data, so data-cap awareness matters.'},
    {objective:'5.4',q:'A phone battery is visibly swollen. What is the safest response?',choices:['Stop using/charging it and follow safe battery handling/replacement procedures','Press the battery flat','Keep charging overnight','Heat the phone'],answer:0,explain:'A swollen battery is a physical safety hazard. Stop use and handle it according to safe procedures.'},
    {objective:'5.4',q:'A touchscreen registers taps several centimeters away from where the user touches. Which symptom category fits?',choices:['Digitizer/calibration issue','DNS failure','RAID failure','Toner issue'],answer:0,explain:'Touch position mismatch points to the touchscreen digitizer or calibration.'}
  ];

  const DISPLAY_CASES = [
    {objective:'3.1',q:'A designer values wide viewing angles and strong color consistency more than the fastest gaming response. Which LCD panel type is commonly a good fit?',choices:['IPS','TN','Coax','Impact'],answer:0,explain:'IPS panels are widely associated with strong viewing angles and color performance.'},
    {objective:'3.1',q:'Which display attribute tells you how many times per second the image can update?',choices:['Refresh rate','Pixel density only','Color gamut only','Subnet mask'],answer:0,explain:'Refresh rate is measured in hertz and describes display updates per second.'},
    {objective:'3.1',q:'Which technology can switch individual pixels off to produce very deep blacks?',choices:['OLED','VGA','TN cable','Thermal'],answer:0,explain:'OLED pixels emit their own light and can turn fully off.'},
    {objective:'5.3',q:'A projector powers on but shows the laptop menu from yesterday instead of today’s connected PC. What simple check comes first?',choices:['Correct input source','Replace the motherboard','Rebuild RAID','Reset DHCP scope'],answer:0,explain:'Incorrect projector input is a common display issue and should be checked before invasive repair.'},
    {objective:'5.3',q:'A monitor intermittently flashes when the desk is bumped. What evidence should you inspect first?',choices:['Physical video cable and connector seating','Cloud model','Printer ribbon','SIM card'],answer:0,explain:'Movement-related intermittent video strongly suggests a physical cabling/connection issue.'},
    {objective:'5.3',q:'A static logo remains faintly visible after hours on an OLED display. Which symptom is this?',choices:['Burn-in','DHCP failure','POST beep','Jitter'],answer:0,explain:'Persistent retained imagery is characteristic of display burn-in.'}
  ];

  const PRINTER_CASES = [
    {objective:'3.7',q:'A shared office printer must require staff to authenticate before a sensitive job is released. Which feature best fits?',choices:['Secured print/user authentication','Disable all logs','Use simplex only','Replace toner'],answer:0,explain:'Secure print and user authentication protect confidential jobs on shared devices.'},
    {objective:'3.7',q:'A multifunction printer must scan directly into a department file share. Which network service is appropriate?',choices:['SMB','NFC only','POST','RAID 0'],answer:0,explain:'SMB is commonly used for Windows-compatible network file shares and scan-to-folder workflows.'},
    {objective:'3.8',q:'A laser printer has normal connectivity but print density is fading because the consumable is nearly empty. What maintenance action fits?',choices:['Replace toner','Replace impact ribbon','Install thermal paper','Change DNS'],answer:0,explain:'Toner is the normal consumable for laser printing.'},
    {objective:'3.8',q:'An inkjet has missing lines even with a good cartridge. Which maintenance action is appropriate?',choices:['Clean the printhead','Replace fuser','Replace ribbon','Change VLAN'],answer:0,explain:'Clogged inkjet printheads can cause missing lines and are commonly cleaned as maintenance.'},
    {objective:'3.8',q:'A receipt printer produces blank output after someone loaded standard copier paper. What does a thermal printer require?',choices:['Thermal paper','Toner cartridge','Impact ribbon','Photo drum'],answer:0,explain:'Direct thermal printers require heat-sensitive thermal paper.'},
    {objective:'5.6',q:'Multiple Windows print jobs remain pending while the printer itself reports Ready. What should you inspect?',choices:['Print queue/spooler path','CPU thermal paste','Bluetooth PIN','RAID stripe'],answer:0,explain:'A frozen queue can stop printing even when the printer hardware is ready.'},
    {objective:'5.6',q:'A laser printer produces repeated ghost images down the page. Which area is associated with this symptom?',choices:['Laser imaging/fuser process','DNS server','SIM card','Display refresh rate'],answer:0,explain:'Repeated or echo images are a laser-print process symptom and can involve imaging/fuser components.'}
  ];

  const VM_CASES = [
    {objective:'4.1',q:'A developer needs to run an isolated legacy OS on a normal Windows laptop for testing. Which approach is practical?',choices:['Type 2 hypervisor with a VM','Replace the laptop with a switch','RAID 0 only','Printer server'],answer:0,explain:'A Type 2 hypervisor runs on a host operating system and is common for workstation testing.'},
    {objective:'4.1',q:'A data center server runs a hypervisor directly on hardware to host many VMs. Which type is this?',choices:['Type 1 hypervisor','Type 2 only','NFC','PCL'],answer:0,explain:'A Type 1 hypervisor runs directly on hardware and is common in server virtualization.'},
    {objective:'4.1',q:'Users receive centrally hosted desktop sessions from the data center. Which concept fits?',choices:['VDI','WISP','Impact printing','APIPA'],answer:0,explain:'Virtual Desktop Infrastructure delivers centrally hosted desktops to endpoints.'},
    {objective:'4.2',q:'A company rents virtual servers and networking but manages the operating systems and apps itself. Which service model is this?',choices:['IaaS','SaaS','PaaS only','PAN'],answer:0,explain:'Infrastructure as a Service provides compute/network/storage building blocks while the customer manages more of the software stack.'},
    {objective:'4.2',q:'Employees use a complete browser-based productivity application managed by the provider. Which model fits?',choices:['SaaS','IaaS','Type 1 hypervisor','RAID 5'],answer:0,explain:'Software as a Service delivers a complete managed application to users.'},
    {objective:'4.2',q:'A workload automatically grows resources during a traffic spike and shrinks later. Which cloud characteristic is demonstrated?',choices:['Elasticity','POST','Punchdown','Pixel density'],answer:0,explain:'Elasticity is the ability to scale resources up or down with demand.'},
    {objective:'4.2',q:'A company combines its private environment with resources from a public provider. Which cloud model is this?',choices:['Hybrid cloud','PAN','Community printer','RAID 1'],answer:0,explain:'Hybrid cloud combines private and public cloud resources.'}
  ];

  const TROUBLE_CASES = [
    {objective:'5.1',title:'No POST after memory upgrade',symptom:'A desktop powers on and beeps repeatedly after new RAM was installed.',stages:[
      {label:'EVIDENCE',q:'What should you investigate first?',choices:['The recently installed RAM seating/compatibility','DNS records','Printer queue'],answer:0,explain:'The problem started immediately after a RAM change, so that change is high-value evidence.'},
      {label:'CAUSE',q:'One DIMM is visibly not fully latched. What is the likely cause?',choices:['Poorly seated RAM','Failed web server','Bad toner'],answer:0,explain:'An unseated DIMM can prevent successful POST.'},
      {label:'FIX',q:'What is the safe corrective action?',choices:['Power down, use ESD precautions, reseat compatible RAM','Force it while powered on','Reinstall browser'],answer:0,explain:'Internal hardware work should be powered down and performed safely.'},
      {label:'VERIFY',q:'How do you verify success?',choices:['Power on and confirm POST/display/memory detection','Assume it worked','Only ping a router'],answer:0,explain:'A hardware repair is not complete until normal POST and operation are verified.'}
    ]},
    {objective:'5.2',title:'Clicking storage drive',symptom:'A workstation becomes very slow and the HDD makes repeated clicking sounds.',stages:[
      {label:'EVIDENCE',q:'Which evidence is most important next?',choices:['Drive health/S.M.A.R.T. status and backup state','Monitor color gamut','Bluetooth name'],answer:0,explain:'Noise and slow I/O point to storage health.'},
      {label:'CAUSE',q:'S.M.A.R.T. reports imminent failure. What is the likely cause?',choices:['Failing HDD','DHCP lease','Projector bulb'],answer:0,explain:'S.M.A.R.T. failure plus clicking is strong drive-failure evidence.'},
      {label:'FIX',q:'What should you do?',choices:['Protect data and replace the failing drive','Keep stress-testing it for days','Replace keyboard'],answer:0,explain:'Preserve data and replace failing hardware.'},
      {label:'VERIFY',q:'What proves the repair?',choices:['New drive healthy, data accessible, normal I/O','Printer test page','Phone pairs'],answer:0,explain:'Verify storage health, data access and performance.'}
    ]},
    {objective:'5.3',title:'Conference room projector',symptom:'The projector is on but shows “No Signal” after a laptop was connected.',stages:[
      {label:'EVIDENCE',q:'Best first checks?',choices:['Input source and physical video cable','RAID alarm','DHCP scope'],answer:0,explain:'Input/cabling are common simple projector causes.'},
      {label:'CAUSE',q:'The projector is set to HDMI 2 while the laptop is on HDMI 1. Cause?',choices:['Incorrect input source','Burned toner','Bad SIM'],answer:0,explain:'The selected source does not match the connected port.'},
      {label:'FIX',q:'Correct action?',choices:['Select HDMI 1','Replace motherboard','Change DNS'],answer:0,explain:'Select the source matching the physical connection.'},
      {label:'VERIFY',q:'Verification?',choices:['Confirm stable image at correct resolution','Only reboot router','Clear print queue'],answer:0,explain:'Verify the user-facing display output.'}
    ]},
    {objective:'5.4',title:'Phone will not charge',symptom:'A phone only charges if the cable is held at an angle; the port looks damaged.',stages:[
      {label:'EVIDENCE',q:'What should you inspect?',choices:['Charging cable and physical port condition','DNS MX record','Printer fuser'],answer:0,explain:'A position-dependent charge points to a physical connection.'},
      {label:'CAUSE',q:'Known-good cable behaves the same. Likely cause?',choices:['Physically damaged charging port','RAID 1','Wireless channel'],answer:0,explain:'A known-good cable isolates the fault toward the device port.'},
      {label:'FIX',q:'Best repair path?',choices:['Service/replace the damaged port following device procedure','Jam metal into port','Change cloud model'],answer:0,explain:'Physical port damage requires appropriate repair, not software changes.'},
      {label:'VERIFY',q:'Verify?',choices:['Known-good cable charges normally without pressure','Only open browser','Print a page'],answer:0,explain:'Test the actual charging function after repair.'}
    ]},
    {objective:'5.5',title:'Intermittent office Wi-Fi',symptom:'Users disconnect every few minutes in one room while nearby rooms are stable.',stages:[
      {label:'EVIDENCE',q:'Which tool gives useful radio evidence?',choices:['Wi-Fi analyzer','Crimper only','Power supply tester'],answer:0,explain:'A Wi-Fi analyzer can reveal signal, channel congestion and interference.'},
      {label:'CAUSE',q:'Analyzer shows heavy co-channel interference. Cause?',choices:['Wireless interference/channel congestion','Failed printer tray','RAM seating'],answer:0,explain:'The evidence directly points to a crowded/interfered wireless channel.'},
      {label:'FIX',q:'Appropriate action?',choices:['Select an appropriate cleaner channel/band after site analysis','Replace all SSDs','Change printer toner'],answer:0,explain:'Channel/band planning addresses radio interference.'},
      {label:'VERIFY',q:'Verify?',choices:['Monitor stable connectivity, latency and throughput in the room','Only inspect CPU temperature','Check ribbon'],answer:0,explain:'Verify the actual network quality where the symptom occurred.'}
    ]},
    {objective:'5.6',title:'Printer jobs frozen',symptom:'The printer display says Ready, but every workstation job stays pending.',stages:[
      {label:'EVIDENCE',q:'What do you inspect first?',choices:['Print queue and spooler state','CPU socket','Bluetooth radio'],answer:0,explain:'Printer ready + jobs pending points to the print path rather than paper/toner first.'},
      {label:'CAUSE',q:'One corrupted job blocks the queue. Cause?',choices:['Frozen print queue','Bad RAID','Incorrect projector input'],answer:0,explain:'A stuck job can block following print jobs.'},
      {label:'FIX',q:'Correct repair?',choices:['Clear the stuck job and restore spooler operation','Replace monitor','Change SIM'],answer:0,explain:'Clear the queue blockage and restore the Windows print service path.'},
      {label:'VERIFY',q:'Verification?',choices:['Send a test page and confirm normal queue completion','Ping 8.8.8.8 only','Run POST'],answer:0,explain:'A test print verifies the user-facing print workflow.'}
    ]}
  ];

  const labState = loadLab();
  let currentView = 'hub';
  let currentCaseIndex = {};
  let build = {brief:0,esd:false,installed:{},category:'board'};
  let vmConfig = {cpu:2,ram:4,storage:60,hypervisor:null,cloud:null};

  function defaultLab(){return {xp:0,sessions:0,correct:0,attempts:0,streak:0,bestStreak:0,objectives:{},stations:{}};}
  function loadLab(){try{return {...defaultLab(),...JSON.parse(localStorage.getItem(LAB_SAVE)||'{}')};}catch(_){return defaultLab();}}
  function saveLab(){try{localStorage.setItem(LAB_SAVE,JSON.stringify(labState));}catch(_){} updateTopStats();}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function allObjectiveIds(){return Object.keys(OBJECTIVES);}
  function coverage(){const done=allObjectiveIds().filter(id=>(labState.objectives[id]||0)>0).length;return Math.round(done/allObjectiveIds().length*100);}
  function stationProgress(st){return Math.round(st.objectives.filter(id=>(labState.objectives[id]||0)>0).length/st.objectives.length*100);}
  function domainProgress(d){return Math.round(d.objectives.filter(id=>(labState.objectives[id]||0)>0).length/d.objectives.length*100);}
  function markPractice(objectives,stationId,points=100){
    objectives.forEach(id=>labState.objectives[id]=(labState.objectives[id]||0)+1);
    labState.stations[stationId]=(labState.stations[stationId]||0)+1;
    labState.sessions++;
    labState.xp+=points;
    saveLab();
  }
  function recordAnswer(correct){labState.attempts++;if(correct){labState.correct++;labState.streak++;labState.bestStreak=Math.max(labState.bestStreak,labState.streak);}else labState.streak=0;saveLab();}

  function ensureLab(){
    if($('labOverlay'))return;
    const overlay=document.createElement('div');overlay.id='labOverlay';overlay.className='lab-overlay hidden';
    overlay.innerHTML=`<div class="lab-shell"><header class="lab-topbar"><button id="labNavToggle" class="lab-close" aria-label="Toggle lab navigation">☰</button><div class="lab-brand"><span class="lab-brand-mark">C1</span><div><strong>TechOps Computer Lab</strong><small>CORE 1 TRAINING FACILITY</small></div></div><span class="lab-exam-pill">A+ 220-1201 • OBJECTIVES v2.0</span><span class="lab-spacer"></span><div class="lab-stat"><small>LAB XP</small><strong id="labXp">0</strong></div><div class="lab-stat"><small>COVERAGE</small><strong id="labCoverage">0%</strong></div><button id="labClose" class="lab-close" aria-label="Exit Computer Lab">×</button></header><div class="lab-main"><aside id="labNav" class="lab-nav"></aside><main id="labStage" class="lab-stage"></main></div></div>`;
    document.body.appendChild(overlay);
    $('labClose').addEventListener('click',closeLab);$('labNavToggle').addEventListener('click',()=>$('labNav').classList.toggle('open'));
    overlay.addEventListener('click',e=>{
      const nav=e.target.closest('[data-lab-view]');if(nav){renderView(nav.dataset.labView);if(innerWidth<=800)$('labNav').classList.remove('open');}
    });
  }

  function openLab(){ensureLab();$('labOverlay').classList.remove('hidden');document.body.style.overflow='hidden';renderView('hub');}
  function closeLab(){$('labOverlay')?.classList.add('hidden');document.body.style.overflow='';}
  function updateTopStats(){if($('labXp'))$('labXp').textContent=labState.xp;if($('labCoverage'))$('labCoverage').textContent=coverage()+'%';}
  function renderNav(active){
    if(!$('labNav'))return;
    $('labNav').innerHTML=`<div class="lab-nav-head"><small>TRAINING FLOOR</small><h2>Core 1 Practice</h2><p>Practice stations never expire. Repeat weak topics until the tools and terminology feel normal.</p></div><div class="lab-nav-list"><button class="lab-nav-btn ${active==='hub'?'active':''}" data-lab-view="hub"><span class="lab-icon">⌂</span><span><strong>Training Floor</strong><small>All stations</small></span></button>${STATIONS.map(s=>`<button class="lab-nav-btn ${active===s.id?'active':''}" data-lab-view="${s.id}"><span class="lab-icon">${s.icon}</span><span><strong>${s.name}</strong><small>${stationProgress(s)}% objective coverage</small></span><span class="station-check">${stationProgress(s)===100?'✓':''}</span></button>`).join('')}<button class="lab-nav-btn ${active==='matrix'?'active':''}" data-lab-view="matrix"><span class="lab-icon">▦</span><span><strong>Core 1 Matrix</strong><small>27 objectives</small></span></button></div><div class="lab-nav-progress"><div class="lab-nav-progress-line"><span>Core 1 lab coverage</span><strong>${coverage()}%</strong></div><div class="lab-domain-track"><span style="width:${coverage()}%"></span></div>${DOMAINS.map(d=>`<div class="lab-nav-progress-line"><span>${d.id} ${d.name}</span><strong>${domainProgress(d)}%</strong></div><div class="lab-domain-track"><span style="width:${domainProgress(d)}%"></span></div>`).join('')}</div>`;
  }

  function renderView(view){
    ensureLab();currentView=view;renderNav(view);updateTopStats();
    if(view==='hub')renderHub();
    else if(view==='matrix')renderMatrix();
    else if(view==='pc-build-bay')renderBuildBay();
    else if(view==='cable-wall')renderQuestionStation(STATIONS[1],CABLE_CASES,'CABLE ID / TOOL DRILL');
    else if(view==='network-rack')renderNetworkRack();
    else if(view==='mobile-clinic')renderMobileClinic();
    else if(view==='display-lab')renderDisplayLab();
    else if(view==='printer-shop')renderPrinterShop();
    else if(view==='vm-cloud-sandbox')renderVMSandbox();
    else if(view==='troubleshooting-arena')renderTroubleshooting();
  }

  function heroButtons(){return `<div class="lab-hero-actions"><button class="lab-btn primary" data-lab-view="pc-build-bay">START A PC BUILD</button><button class="lab-btn" data-lab-view="troubleshooting-arena">RANDOM INCIDENT</button><button class="lab-btn" data-lab-view="matrix">VIEW 27-OBJECTIVE MATRIX</button></div>`;}
  function renderHub(){
    $('labStage').innerHTML=`<section class="lab-hero"><div class="lab-hero-copy"><div class="lab-kicker">TECHOPS CORE 1 ACADEMY</div><h1>Touch it. Break it.<br><span>Learn why it works.</span></h1><p>This is your no-pressure practice floor. Build computers, cable networks, repair devices and repeat troubleshooting drills whenever you want. The goal is not to memorize answers—it is to make Core 1 hardware and networking feel familiar.</p>${heroButtons()}</div><aside class="lab-score-card"><small>CORE 1 LAB COVERAGE</small><div class="lab-score-big">${coverage()}%</div><p>${allObjectiveIds().filter(id=>(labState.objectives[id]||0)>0).length} of 27 current Core 1 objectives practiced at least once. Coverage is a training tracker, not a predicted exam score.</p><div class="lab-mini-stats"><div><strong>${labState.sessions}</strong><span>completed drills</span></div><div><strong>${labState.bestStreak}</strong><span>best streak</span></div><div><strong>${labState.correct}/${labState.attempts}</strong><span>correct attempts</span></div><div><strong>${labState.xp}</strong><span>lab XP</span></div></div></aside></section><div class="lab-section-head"><div><h2>Training Stations</h2><p>Every Core 1 objective is assigned to one or more repeatable stations.</p></div></div><section class="station-grid">${STATIONS.map((s,i)=>`<button class="station-card ${stationProgress(s)===100?'completed':''}" data-lab-view="${s.id}" style="--station-glow:${['rgba(46,231,255,.11)','rgba(255,216,107,.1)','rgba(112,247,168,.1)','rgba(164,139,255,.11)','rgba(84,212,255,.1)','rgba(245,139,198,.1)','rgba(109,170,255,.1)','rgba(255,100,119,.1)'][i]}"><span class="station-icon">${s.icon}</span><h3>${s.name}</h3><p>${s.desc}</p><footer><span class="station-domain">${s.domain}</span><span>${s.objectives.join(' • ')}</span></footer></button>`).join('')}</section>`;
  }

  function stationHead(st,eyebrow){return `<div class="lab-section-head"><div><div class="lab-kicker">${eyebrow||st.domain}</div><h2>${st.icon} ${st.name}</h2><p>${st.desc}</p></div><button class="lab-btn lab-back" data-lab-view="hub">← Training Floor</button></div>`;}
  function objectiveTags(ids){return `<div class="objective-tags">${ids.map(id=>`<span class="objective-tag ${(labState.objectives[id]||0)>0?'done':''}">${id} ${esc(OBJECTIVES[id])}</span>`).join('')}</div>`;}

  function renderBuildBay(){
    const st=STATIONS[0],brief=BUILD_BRIEFS[build.brief%BUILD_BRIEFS.length];
    const cats=['board','cpu','ram','storage','psu','gpu'];
    const slotLabel={board:'MOTHERBOARD',cpu:'CPU',ram:'MEMORY',storage:'STORAGE',psu:'POWER',gpu:'EXPANSION / VIDEO'};
    $('labStage').innerHTML=`${stationHead(st,'HARDWARE WORKSHOP')}<div class="lab-console"><div class="lab-console-head"><span class="lights"><i></i><i></i><i></i></span><div><strong>BUILD BENCH 01</strong><small> • anti-static workstation</small></div></div><div class="lab-console-body"><div class="lab-brief"><small>CUSTOMER BUILD ORDER</small><strong>${brief.name}</strong><p>${brief.text}</p>${objectiveTags(brief.objectives)}</div><div class="build-layout"><div><div class="pc-rig">${cats.map(c=>`<div class="pc-slot ${c} ${build.installed[c]?'filled':''}" data-slot="${c}"><span>${slotLabel[c]}</span><strong>${build.installed[c]?esc(findPart(c,build.installed[c]).name):'EMPTY SLOT'}</strong></div>`).join('')}</div><div class="bench-actions"><button id="esdBtn" class="lab-btn ${build.esd?'green':''}">${build.esd?'✓ ESD STRAP CONNECTED':'CONNECT ESD STRAP'}</button><button id="postBuildBtn" class="lab-btn primary">POWER ON / POST</button><button id="clearBuildBtn" class="lab-btn">CLEAR BENCH</button><button id="raidDrillBtn" class="lab-btn">STORAGE / RAID DRILL</button></div><div class="esd-status ${build.esd?'safe':''}" id="esdStatus">${build.esd?'ESD protection active. Safe to service internal components.':'ESD protection is not connected.'}</div><div id="buildFeedback" class="lab-feedback">Choose compatible parts from inventory. The bench will let you make mistakes—POST is where you find out whether the build actually works.</div></div><aside class="parts-panel"><div class="parts-panel-head"><strong>PARTS INVENTORY</strong><small>click to install</small></div><div class="parts-tabs">${cats.map(c=>`<button class="parts-tab ${build.category===c?'active':''}" data-part-tab="${c}">${slotLabel[c]}</button>`).join('')}</div><div id="partList" class="part-list"></div></aside></div></div></div>`;
    renderParts();
    $$('.parts-tab',$('labStage')).forEach(b=>b.addEventListener('click',()=>{build.category=b.dataset.partTab;renderBuildBay();}));
    $('esdBtn').addEventListener('click',()=>{build.esd=true;renderBuildBay();});
    $('clearBuildBtn').addEventListener('click',()=>{build.installed={};build.esd=false;renderBuildBay();});
    $('postBuildBtn').addEventListener('click',validateBuild);
    $('raidDrillBtn').addEventListener('click',()=>renderQuestionStation(st,STORAGE_CASES,'STORAGE / RAID DRILL',true));
  }
  function findPart(cat,id){return PARTS[cat].find(p=>p.id===id)||{name:id,spec:''};}
  function renderParts(){const cat=build.category;const list=$('partList');if(!list)return;list.innerHTML=PARTS[cat].map(p=>`<button class="part-card" data-install="${p.id}"><strong>${p.name}</strong><span>${p.spec}</span></button>`).join('');$$('[data-install]',list).forEach(b=>b.addEventListener('click',()=>{if(!build.esd){$('buildFeedback').className='lab-feedback fail';$('buildFeedback').textContent='Connect the ESD strap before handling internal parts. TechOps will not reward unsafe bench habits.';return;}build.installed[cat]=b.dataset.install;renderBuildBay();}));}
  function validateBuild(){
    const feedback=$('buildFeedback'),brief=BUILD_BRIEFS[build.brief%BUILD_BRIEFS.length];
    if(!build.esd){feedback.className='lab-feedback fail';feedback.textContent='POST blocked: you did not establish ESD protection before internal service.';recordAnswer(false);return;}
    const missing=Object.keys(brief.req).filter(k=>!build.installed[k]);
    if(missing.length){feedback.className='lab-feedback fail';feedback.textContent='POST failed: missing '+missing.join(', ')+'. A PC cannot boot with required core components absent.';recordAnswer(false);return;}
    const wrong=Object.entries(brief.req).filter(([k,v])=>build.installed[k]!==v);
    if(wrong.length){const [cat,need]=wrong[0];feedback.className='lab-feedback fail';feedback.innerHTML=`POST / validation failed at <strong>${cat.toUpperCase()}</strong>. Installed: ${esc(findPart(cat,build.installed[cat]).name)}. This build brief calls for ${esc(findPart(cat,need).name)}. Compare socket, memory generation, workload and power requirements.`;recordAnswer(false);return;}
    feedback.className='lab-feedback success';feedback.innerHTML='<strong>POST SUCCESS.</strong> Hardware is compatible and the build meets the customer requirement. You practiced platform compatibility instead of memorizing isolated component names.';recordAnswer(true);markPractice(brief.objectives,'pc-build-bay',260);build.brief=(build.brief+1)%BUILD_BRIEFS.length;setTimeout(()=>renderBuildBay(),1400);
  }

  function getCaseIndex(station,bank){if(currentCaseIndex[station]==null)currentCaseIndex[station]=Math.floor(Math.random()*bank.length);return currentCaseIndex[station]%bank.length;}
  function nextCase(station,bank){currentCaseIndex[station]=(getCaseIndex(station,bank)+1)%bank.length;}
  function renderQuestionStation(st,bank,kicker,keepBack=false){
    const idx=getCaseIndex(st.id+(kicker||''),bank),c=bank[idx],key=st.id+(kicker||'');
    $('labStage').innerHTML=`${stationHead(st,kicker)}<div class="lab-console"><div class="lab-console-head"><span class="lights"><i></i><i></i><i></i></span><div><strong>${kicker||'PRACTICE TERMINAL'}</strong><small> • unlimited attempts</small></div></div><div class="lab-console-body"><div class="challenge-grid"><section class="challenge-stage"><div class="lab-brief"><small>CORE 1 OBJECTIVE ${c.objective}</small><strong>${OBJECTIVES[c.objective]}</strong><p>Use the equipment and terminology as clues. Choose the action or item that fits the real job scenario.</p></div><div class="challenge-question">${esc(c.q)}</div><div class="choice-grid" id="choiceGrid">${c.choices.map((x,i)=>`<button class="choice-card" data-choice="${i}"><strong>${esc(x)}</strong></button>`).join('')}</div><div id="caseExplain"></div></section><aside class="challenge-side"><div class="challenge-score"><div><strong>${labState.streak}</strong><span>STREAK</span></div><div><strong>${labState.correct}</strong><span>CORRECT</span></div><div><strong>${labState.xp}</strong><span>LAB XP</span></div></div>${objectiveTags(st.objectives)}<div class="lab-feedback">Wrong answers do not end practice. TechOps explains why, then you try again or move to another case.</div><button id="nextCaseBtn" class="lab-btn" style="margin-top:10px">NEW CASE ↻</button>${keepBack?'<button id="backBuildBtn" class="lab-btn" style="margin-top:7px">← BUILD BENCH</button>':''}</aside></div></div></div>`;
    $$('[data-choice]',$('labStage')).forEach(b=>b.addEventListener('click',()=>answerSimple(c,Number(b.dataset.choice),b,st.id,key,bank)));
    $('nextCaseBtn').addEventListener('click',()=>{nextCase(key,bank);renderQuestionStation(st,bank,kicker,keepBack);});
    $('backBuildBtn')?.addEventListener('click',renderBuildBay);
  }
  function answerSimple(c,choice,button,station,key,bank){
    const good=choice===c.answer;recordAnswer(good);
    if(good){button.classList.add('correct');$$('[data-choice]',$('labStage')).forEach(b=>b.disabled=true);$('caseExplain').innerHTML=`<div class="explain-box"><strong>✓ CORRECT</strong><br>${esc(c.explain)}</div>`;markPractice([c.objective],station,100+Math.min(60,labState.streak*5));setTimeout(()=>{nextCase(key,bank);if(currentView===station)renderView(station);},1150);}
    else{button.classList.add('wrong');button.disabled=true;$('caseExplain').innerHTML=`<div class="explain-box fail"><strong>NOT THIS ONE.</strong><br>Use the scenario clues and eliminate options that belong to a completely different layer or device. Try another choice.</div>`;}
  }

  function renderNetworkRack(){
    const st=STATIONS[2],idx=getCaseIndex(st.id,NETWORK_CASES),c=NETWORK_CASES[idx];
    $('labStage').innerHTML=`${stationHead(st,'NETWORK OPERATIONS LAB')}<div class="lab-console"><div class="lab-console-head"><span class="lights"><i></i><i></i><i></i></span><div><strong>RACK A • LIVE TRAINING VLAN</strong><small> • simulated network</small></div></div><div class="lab-console-body"><div class="network-rack-sim"><div class="rack-device"><strong>EDGE ROUTER</strong><span>WAN ↔ LAN gateway</span></div><div class="rack-device"><strong>MANAGED SWITCH</strong><span>24 ports • VLAN capable</span></div><div class="rack-device"><strong>ACCESS POINT</strong><span>2.4 / 5 / 6 GHz</span></div><div class="rack-device"><strong>DHCP / DNS</strong><span>10.20.1.10</span></div><div class="rack-device"><strong>PATCH PANEL</strong><span>Structured cabling</span></div><div class="rack-device"><strong>TOOL CART</strong><span>Tester • toner • analyzer</span></div></div><div class="lab-brief" style="margin-top:13px"><small>NETWORK TASK • OBJECTIVE ${c.objective}</small><strong>${OBJECTIVES[c.objective]}</strong><p>${esc(c.q)}</p></div><div class="choice-grid" id="choiceGrid">${c.choices.map((x,i)=>`<button class="choice-card" data-choice="${i}"><strong>${esc(x)}</strong></button>`).join('')}</div><div id="caseExplain"></div><div class="bench-actions"><button id="networkNext" class="lab-btn">LOAD ANOTHER NETWORK TASK</button></div>${objectiveTags(st.objectives)}</div></div>`;
    $$('[data-choice]',$('labStage')).forEach(b=>b.addEventListener('click',()=>answerNetwork(c,Number(b.dataset.choice),b)));
    $('networkNext').addEventListener('click',()=>{nextCase(st.id,NETWORK_CASES);renderNetworkRack();});
  }
  function answerNetwork(c,i,b){const good=i===c.answer;recordAnswer(good);if(good){b.classList.add('correct');$$('[data-choice]',$('labStage')).forEach(x=>x.disabled=true);$('caseExplain').innerHTML=`<div class="explain-box"><strong>NETWORK CHANGE ACCEPTED.</strong><br>${esc(c.explain)}</div>`;markPractice([c.objective],'network-rack',120);setTimeout(()=>{nextCase('network-rack',NETWORK_CASES);renderNetworkRack();},1200);}else{b.classList.add('wrong');b.disabled=true;$('caseExplain').innerHTML='<div class="explain-box fail">That choice does not match the network layer or service described. Re-read what the user actually needs.</div>';}}

  function renderMobileClinic(){
    const st=STATIONS[3],idx=getCaseIndex(st.id,MOBILE_CASES),c=MOBILE_CASES[idx];
    $('labStage').innerHTML=`${stationHead(st,'MOBILE REPAIR & CONFIGURATION')}<div class="lab-console"><div class="lab-console-head"><span class="lights"><i></i><i></i><i></i></span><div><strong>MOBILE SERVICE BENCH</strong><small> • phone / tablet / laptop</small></div></div><div class="lab-console-body"><div class="challenge-grid"><div class="mobile-device"><div class="notch"></div><div class="mobile-status"><span>TECHOPS LAB DEVICE</span><span>▮▮▮</span></div><div class="mobile-screen-card"><h3>Service Ticket ${c.objective}</h3><p>${esc(c.q)}</p>${c.choices.map((x,i)=>`<button class="mobile-action" data-choice="${i}">${esc(x)}</button>`).join('')}</div></div><aside class="challenge-side"><div class="lab-kicker">MOBILE CLINIC</div><h3 style="margin:6px 0">Diagnose before replacing.</h3><p style="color:#8ca4b3;font-size:.72rem;line-height:1.5">Mobile questions become easier when you separate physical hardware, short-range connectivity, cellular/Wi-Fi configuration, and management policy.</p><div id="caseExplain"></div>${objectiveTags(st.objectives)}<button id="mobileNext" class="lab-btn" style="margin-top:10px">NEXT DEVICE</button></aside></div></div></div>`;
    $$('[data-choice]',$('labStage')).forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.choice),good=i===c.answer;recordAnswer(good);if(good){b.classList.add('correct');$$('[data-choice]',$('labStage')).forEach(x=>x.disabled=true);$('caseExplain').innerHTML=`<div class="explain-box">${esc(c.explain)}</div>`;markPractice([c.objective],'mobile-clinic',110);setTimeout(()=>{nextCase(st.id,MOBILE_CASES);renderMobileClinic();},1150);}else{b.classList.add('wrong');b.disabled=true;$('caseExplain').innerHTML='<div class="explain-box fail">That action does not fit the symptom or device layer. Try another path.</div>';}}));
    $('mobileNext').addEventListener('click',()=>{nextCase(st.id,MOBILE_CASES);renderMobileClinic();});
  }

  function renderDisplayLab(){
    const st=STATIONS[4],idx=getCaseIndex(st.id,DISPLAY_CASES),c=DISPLAY_CASES[idx];
    $('labStage').innerHTML=`${stationHead(st,'DISPLAY DIAGNOSTICS')}<div class="lab-console"><div class="lab-console-head"><span class="lights"><i></i><i></i><i></i></span><div><strong>DISPLAY WALL</strong><small> • monitor / OLED / projector</small></div></div><div class="lab-console-body"><div class="display-wall"><div class="display-unit" data-label="IPS TEST PANEL"><span>COLOR / ANGLES</span></div><div class="display-unit problem-dim" data-label="PROJECTOR"><span>DIM / INPUT</span></div><div class="display-unit problem-color" data-label="OLED TEST PANEL"><span>PIXELS / BURN-IN</span></div></div><div class="lab-brief" style="margin-top:14px"><small>DISPLAY TASK • OBJECTIVE ${c.objective}</small><strong>${OBJECTIVES[c.objective]}</strong><p>${esc(c.q)}</p></div><div class="choice-grid">${c.choices.map((x,i)=>`<button class="choice-card" data-choice="${i}"><strong>${esc(x)}</strong></button>`).join('')}</div><div id="caseExplain"></div>${objectiveTags(st.objectives)}<div class="bench-actions"><button id="displayNext" class="lab-btn">NEW DISPLAY FAULT</button></div></div></div>`;
    bindBasicCase(c,'display-lab',DISPLAY_CASES,'displayNext',renderDisplayLab);
  }

  function renderPrinterShop(){
    const st=STATIONS[5],idx=getCaseIndex(st.id,PRINTER_CASES),c=PRINTER_CASES[idx];
    $('labStage').innerHTML=`${stationHead(st,'PRINT SERVICES WORKSHOP')}<div class="lab-console"><div class="lab-console-head"><span class="lights"><i></i><i></i><i></i></span><div><strong>MFP SERVICE BAY</strong><small> • configuration / maintenance / repair</small></div></div><div class="lab-console-body"><div class="printer-sim"><div class="printer-body"><div class="printer-top"></div><div class="sheet"></div><div class="printer-panel">STATUS: READY<br>QUEUE: ${c.objective==='5.6'?'7 pending':'0 pending'}<br>NETWORK: ONLINE</div><div class="paper-tray"></div></div><div class="printer-controls"><div class="lab-brief"><small>PRINTER TASK • OBJECTIVE ${c.objective}</small><strong>${OBJECTIVES[c.objective]}</strong><p>${esc(c.q)}</p></div><div class="choice-grid">${c.choices.map((x,i)=>`<button class="choice-card" data-choice="${i}"><strong>${esc(x)}</strong></button>`).join('')}</div><div id="caseExplain"></div>${objectiveTags(st.objectives)}<button id="printerNext" class="lab-btn" style="margin-top:10px">LOAD NEXT PRINTER JOB</button></div></div></div></div>`;
    bindBasicCase(c,'printer-shop',PRINTER_CASES,'printerNext',renderPrinterShop);
  }

  function bindBasicCase(c,station,bank,nextId,renderFn){
    $$('[data-choice]',$('labStage')).forEach(b=>b.addEventListener('click',()=>{const good=Number(b.dataset.choice)===c.answer;recordAnswer(good);if(good){b.classList.add('correct');$$('[data-choice]',$('labStage')).forEach(x=>x.disabled=true);$('caseExplain').innerHTML=`<div class="explain-box"><strong>✓ GOOD CALL.</strong><br>${esc(c.explain)}</div>`;markPractice([c.objective],station,115);setTimeout(()=>{nextCase(station,bank);renderFn();},1150);}else{b.classList.add('wrong');b.disabled=true;$('caseExplain').innerHTML='<div class="explain-box fail">That does not fit the evidence. Try another option and think about the hardware or service layer involved.</div>';}}));
    $(nextId).addEventListener('click',()=>{nextCase(station,bank);renderFn();});
  }

  function renderVMSandbox(){
    const st=STATIONS[6],idx=getCaseIndex(st.id,VM_CASES),c=VM_CASES[idx];
    $('labStage').innerHTML=`${stationHead(st,'VIRTUALIZATION & CLOUD RANGE')}<div class="lab-console"><div class="lab-console-head"><span class="lights"><i></i><i></i><i></i></span><div><strong>HYPERVISOR CONSOLE</strong><small> • safe sandbox</small></div></div><div class="lab-console-body"><div class="vm-canvas"><section class="host-machine"><div class="lab-kicker">VM PROVISIONER</div><h3 style="margin:6px 0">Build a test virtual machine</h3><p style="font-size:.68rem;color:#839baa">Practice resource allocation. These controls are intentionally simple—the goal is understanding what CPU, RAM, storage and hypervisor type mean.</p><div class="host-bars"><label class="resource-row"><span>vCPU</span><input id="vmCpu" type="range" min="1" max="8" value="${vmConfig.cpu}"><strong id="vmCpuVal">${vmConfig.cpu}</strong></label><label class="resource-row"><span>RAM GB</span><input id="vmRam" type="range" min="1" max="16" value="${vmConfig.ram}"><strong id="vmRamVal">${vmConfig.ram}</strong></label><label class="resource-row"><span>Disk GB</span><input id="vmDisk" type="range" min="20" max="200" step="10" value="${vmConfig.storage}"><strong id="vmDiskVal">${vmConfig.storage}</strong></label></div><div class="vm-preview"><strong>Lab VM</strong><small id="vmPreview">${vmConfig.cpu} vCPU • ${vmConfig.ram} GB RAM • ${vmConfig.storage} GB virtual disk</small></div></section><section class="host-machine"><div class="lab-brief"><small>CORE 1 OBJECTIVE ${c.objective}</small><strong>${OBJECTIVES[c.objective]}</strong><p>${esc(c.q)}</p></div><div class="cloud-models">${c.choices.map((x,i)=>`<button class="cloud-card" data-choice="${i}"><strong>${esc(x)}</strong><span>Select for this workload</span></button>`).join('')}</div><div id="caseExplain"></div><button id="vmNext" class="lab-btn" style="margin-top:10px">NEW CLOUD / VM CASE</button></section></div>${objectiveTags(st.objectives)}</div></div>`;
    [['vmCpu','cpu','vmCpuVal'],['vmRam','ram','vmRamVal'],['vmDisk','storage','vmDiskVal']].forEach(([id,key,out])=>$(id).addEventListener('input',e=>{vmConfig[key]=Number(e.target.value);$(out).textContent=e.target.value;$('vmPreview').textContent=`${vmConfig.cpu} vCPU • ${vmConfig.ram} GB RAM • ${vmConfig.storage} GB virtual disk`;}));
    $$('[data-choice]',$('labStage')).forEach(b=>b.addEventListener('click',()=>{const good=Number(b.dataset.choice)===c.answer;recordAnswer(good);if(good){b.classList.add('selected');$$('[data-choice]',$('labStage')).forEach(x=>x.disabled=true);$('caseExplain').innerHTML=`<div class="explain-box">${esc(c.explain)}<br><br>Your VM resource controls remain available so you can experiment with CPU, memory and storage allocation.</div>`;markPractice([c.objective],'vm-cloud-sandbox',120);setTimeout(()=>{nextCase(st.id,VM_CASES);renderVMSandbox();},1300);}else{b.classList.add('wrong');b.disabled=true;$('caseExplain').innerHTML='<div class="explain-box fail">That model does not match who owns/manages the layer described. Try again.</div>';}}));
    $('vmNext').addEventListener('click',()=>{nextCase(st.id,VM_CASES);renderVMSandbox();});
  }

  function renderTroubleshooting(){
    const st=STATIONS[7],idx=getCaseIndex(st.id,TROUBLE_CASES),c=TROUBLE_CASES[idx];let stage=0;
    $('labStage').innerHTML=`${stationHead(st,'INCIDENT SIMULATOR')}<div class="lab-console"><div class="lab-console-head"><span class="lights"><i></i><i></i><i></i></span><div><strong>FAULT INJECTION ARENA</strong><small> • consequences disabled • learning enabled</small></div></div><div class="lab-console-body"><div class="lab-brief"><small>RANDOMIZED INCIDENT • OBJECTIVE ${c.objective}</small><strong>${c.title}</strong><p>${c.symptom}</p></div><div class="trouble-timeline">${c.stages.map((s,i)=>`<div class="trouble-step ${i===0?'active':''}" data-tstep="${i}"><small>STEP ${i+1}</small><strong>${s.label}</strong></div>`).join('')}</div><div id="troubleStage"></div>${objectiveTags(st.objectives)}<div class="bench-actions"><button id="troubleNew" class="lab-btn">INJECT NEW FAULT</button></div></div></div>`;
    function drawStage(){const s=c.stages[stage];$('troubleStage').innerHTML=`<div class="challenge-question">${esc(s.q)}</div><div class="choice-grid">${s.choices.map((x,i)=>`<button class="choice-card" data-trouble-choice="${i}"><strong>${esc(x)}</strong></button>`).join('')}</div><div id="troubleExplain"></div>`;$$('[data-trouble-choice]',$('troubleStage')).forEach(b=>b.addEventListener('click',()=>{const good=Number(b.dataset.troubleChoice)===s.answer;recordAnswer(good);if(!good){b.classList.add('wrong');b.disabled=true;$('troubleExplain').innerHTML='<div class="explain-box fail">That move does not follow the evidence. Try a safer or more relevant action.</div>';return;}b.classList.add('correct');$$('[data-trouble-choice]',$('troubleStage')).forEach(x=>x.disabled=true);$('troubleExplain').innerHTML=`<div class="explain-box">${esc(s.explain)}</div>`;const tile=document.querySelector(`[data-tstep="${stage}"]`);tile.classList.remove('active');tile.classList.add('done');if(stage<c.stages.length-1){stage++;document.querySelector(`[data-tstep="${stage}"]`).classList.add('active');setTimeout(drawStage,850);}else{markPractice([c.objective],'troubleshooting-arena',180);$('troubleExplain').innerHTML+=`<div class="explain-box"><strong>INCIDENT RESOLVED.</strong> You completed evidence → cause → fix → verification for ${c.objective}.</div>`;}}));}
    drawStage();$('troubleNew').addEventListener('click',()=>{nextCase(st.id,TROUBLE_CASES);renderTroubleshooting();});
  }

  function renderMatrix(){
    $('labStage').innerHTML=`<div class="lab-section-head"><div><div class="lab-kicker">CORE 1 COVERAGE CONTROL</div><h2>27-Objective Training Matrix</h2><p>Green means you have completed at least one hands-on drill mapped to that objective. Repeat practice increases experience but this is not a guaranteed exam score.</p></div><button class="lab-btn" data-lab-view="hub">← Training Floor</button></div><div class="core1-matrix">${DOMAINS.map(d=>`<section class="domain-card"><div class="domain-head"><div><h3>${d.id} ${d.name}</h3><small style="color:#758f9f">Official exam weight: ${d.weight}%</small></div><strong>${domainProgress(d)}%</strong></div><div class="lab-domain-track"><span style="width:${domainProgress(d)}%"></span></div><div class="objective-list">${d.objectives.map(id=>`<div class="objective-row ${(labState.objectives[id]||0)>0?'practiced':''}"><span class="oid">${id}</span><span>${esc(OBJECTIVES[id])}</span><b>${labState.objectives[id]||0}${(labState.objectives[id]||0)>0?' ✓':''}</b></div>`).join('')}</div></section>`).join('')}</div>`;
  }

  function installLaunchers(){
    ['labBtn','titleLabBtn','menuLabBtn'].forEach(id=>$(id)?.addEventListener('click',()=>{if(id==='menuLabBtn')$('menuPanel')?.classList.add('hidden');openLab();}));
    window.addEventListener('keydown',e=>{
      if(!$('labOverlay')?.classList.contains('hidden')){
        if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeLab();return;}
        if(!['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName) && ['w','a','s','d','e','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.stopImmediatePropagation();}
      }
    },true);
  }

  function boot(){ensureLab();installLaunchers();updateTopStats();window.__TECHOPS_LAB__={open:openLab,close:closeLab,state:labState,coverage,stations:STATIONS,objectives:OBJECTIVES,renderView};}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
