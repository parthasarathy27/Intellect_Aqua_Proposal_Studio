import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { Settings, FileText, GripVertical, User, Activity, Package, DollarSign, Download, Plus, Save, Cloud, Database, History, X, Trash2, Menu, Eye } from 'lucide-react';




const today = new Date();
const defaultDatePage1 = today.toLocaleDateString('en-GB').replace(/\//g, '.');
const defaultDatePage2 = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

const INITIAL_DATA = {
  settings: {
    marginTop: 60,
    marginBottom: 80,
    marginLeft: 15,
    marginRight: 15,
    storageMode: 'local', // Default to local for frontend-first experience
    autoSave: true




  },
  calculations: {
    flowRate: 100,           // KLD
    operatingHours: 20,      // hrs/day
    membraneModuleUnitCost: 25000, // ₹ per 20 sqm module
    blowerHP: 5.0,          // standard HP
    powerRate: 10,          // Rs per KWH unit
    taxMode: 'exclusive'    // 'inclusive' or 'exclusive'
  },
  page1: {
    client: 'M/s. AKSHAYA ACADEMY CBSE SCHOOL,',
    address: 'PUDHUCHATRAM POST, DINDIGUL HWY, ODDANCHATRAM- 624619',
    project: 'STP 100 KLD',
    technology: 'MBR – PACKAGED',
    proposalPrefix: 'IAPL/QT/AAC/ STP/',
    proposalNo: '9373',
    date: defaultDatePage1
  },
  page2: {
    subject: 'Proposal for Supply of Sewage Treatment Plant Using Membrane Bio Reactors (MBR) with a Treatment Capacity of 1,00,000 Liters/Day to be installed at Your Site.',
    salutation: 'Dear Sir,',
    body: 'This is with reference to your enquiry; we are pleased to enclose our Techno- Commercial proposal for Design, Supply, Erection and Commissioning of the above mentioned with respect to subject work.\n\nWe trust that you will find our proposal acceptable and we look forward to the receipt of your order at the earliest.\n\nFor any Clarifications, Technical / Commercial discussion we shall be pleased to call on you, on hearing from you.',
    signatoryName: 'Rtn. BOOPATHI S.P',
    signatoryTitle: 'Chief Managing Director',
    signatoryPhone: '+91 95973 17861 / 95850 75552'
  },
  page3: {
    title: 'ABOUT INTELLECT - STP',
    content: "INTELLECT - STP are Membrane Bio Reactor based Sewage treatment and recycling plants. It is indigenously developed for meeting stringent treated water norms for sewage water and various other ETP's. It works on principle of biological digestion followed by specially designed submerged hollow fiber membrane filtration. Hollow fiber membranes have pore size of 0.06 micron which ensures removal of pathogens and bacteria in treated water. INTELLECT - STP is a combination of membranes, pumps and other electrical equipment's which makes itself unique in operation and having hassle free maintenance.",
    featuresTitle: 'Key Features of MBR Sewage Treatment Plant',
    features: [
      { title: "Advanced Membrane Filtration", desc: "Combines biological treatment and membrane separation for superior effluent quality." },
      { title: "Compact & Space Saving Design", desc: "Requires significantly less area compared to conventional systems." },
      { title: "High Treated Water Quality", desc: "Produces clear, odour-free, and disinfected water suitable for reuse in gardening, flushing, and cooling towers." },
      { title: "Automatic Operation", desc: "PLC-based or fully automatic operation ensures minimal manual intervention." },
      { title: "Low Sludge Generation", desc: "Optimized biological process reduces excess sludge production." },
      { title: "Modular Construction", desc: "Easy to install, expand, and relocate as per site requirements." },
      { title: "Odour-Free & Silent Operation", desc: "Enclosed process eliminates foul odour and noise nuisance." },
      { title: "Durable Materials", desc: "All tanks, piping, and membranes are corrosion-resistant for long service life." },
      { title: "Energy Efficient", desc: "Designed for low power consumption and cost-effective operation." },
      { title: "Easy Maintenance", desc: "Simple cleaning and backwash process ensures long membrane life." }
    ]
  },
  page4: {
    designParams: {
      flow: [
        { label: 'Nature of waste water', value: 'Sewage' },
        { label: 'Flow rate (KLD)', value: '60 KLD' },
        { label: 'Operating hours', value: '20 Hours' },
        { label: 'Flow rate (m\u00b3/hr)', value: '3.0 m\u00b3/hr' }
      ],
      raw: [
        { label: 'pH', value: '7.0 - 8.5' },
        { label: 'COD', value: '≤ 500 - 600ppm' },
        { label: 'BOD – (3 days @ 27 ˚C)', value: '≤ 350 ppm' },
        { label: 'TSS', value: '≤ 200 ppm' },
        { label: 'Oil & Grease', value: '≤ 50 ppm' }
      ],
      treated: [
        { label: 'pH', value: '7.0 - 8.5' },
        { label: 'COD', value: '≤ 30 ppm' },
        { label: 'BOD – (3 days @ 27 ˚C)', value: '≤ 10 ppm' },
        { label: 'TSS', value: '≤ 5 ppm' },
        { label: 'Oil & Grease', value: '≤ 1 ppm' }
      ]
    },
    assumptions: [
      'The plant is designed to operate at +/- 10 % variation in raw wastewater parameter.',
      'No other parameters other than mentioned above is present in the raw waste water which is beyond Pollution Control Norms and hazardous to micro-organisms.',
      'Treated water quality will be achieved if the inlet raw water quality is as per the raw water quality mentioned as well as no other pollutant than the mentioned, is present or exceeds the limits or which is hazardous in nature, which otherwise may affect the biological treatment process'
    ]
  },
  page5: {
    title: 'PROCESS DESIGN DETAILS:',
    sections: [
      {
        name: 'Screen Chamber:',
        params: [
          ['Normal flow designed', '5.0m3/hr.'],
          ['No. of Screen Chamber', 'One'],
          ['Angle of Inclination', '450'],
          ['Size Of the screen chamber', '1.0m X 1.0m x 1.3m'],
          ['MOC of screen chamber', 'RCC']
        ]
      },
      {
        name: 'Oil Trap Chamber:',
        params: [
          ['Normal flow designed', '5.0m3/hr.'],
          ['Size Of the oil & Grease chamber', '1.0m X 2.0m x 1.3m'],
          ['No Of Tanks', 'One'],
          ['MOC of chamber', 'RCC']
        ]
      },
      {
        name: 'Collection Tank:',
        params: [
          ['Normal Flow Designed', '5.0m3/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '12 Hrs.'],
          ['Volume of the Tank', '60 m3'],
          ['Size Of the Tank', '3.9m X 3.9m x 4.3m'],
          ['MOC', 'RCC']
        ]
      }
    ]
  },
  page6: {
    sections: [
      {
        name: 'ANOXIC Tank:',
        params: [
          ['Normal Flow Designed', '3.0m3/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '3 Hrs.'],
          ['Volume of the Tank', '9.00 m3'],
          ['Size Of the Tank', '0.75m X 3.0m x 4.3m'],
          ['MOC', 'MSFRP']
        ]
      },
      {
        name: 'Aeration Tank:',
        params: [
          ['Normal Flow Designed', '3.0m3/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8 Hrs.'],
          ['Volume of the Tank', '24.00 m3'],
          ['Size Of the Tank', '2.00m X 3.0m x 4.3m'],
          ['MOC', 'MSFRP']
        ]
      },
      {
        name: 'MBR Tank:',
        params: [
          ['Normal Flow Designed', '3.0m3/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8 Hrs.'],
          ['Volume of the Tank', '24.00 m3'],
          ['Size Of the Tank', '2.00m X 3.0m x 4.3m'],
          ['MOC', 'MSFRP']
        ]
      },
      {
        name: 'Treated Water Tank:',
        params: [
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8 Hrs.'],
          ['Volume of the Tank', '24.00 m3'],
          ['Size Of the Tank', '2.00m X 3.0m x 4.3m'],
          ['MOC of Treated Water Tank', 'RCC']
        ]
      }
    ]
  },
  page7: {
    sections: [
      {
        name: 'Sludge Holding Tank:',
        params: [
          ['Normal flow designed', '3.0m3/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8 Hrs.'],
          ['Volume of the Tank', '24.00 m3'],
          ['Size Of the Tank', '2.00m X 3.0m x 4.3m'],
          ['MOC of Chamber', 'RCC']
        ]
      }
    ]
  },
  page8: {
    title: 'OUR SCOPE OF WORK & SPECIFICATIONS FOR SUPPLYING EQUIPMENTS:',
    equipments: [
      {
        id: '1', name: 'Bar Screen (COARSE)',
        specs: [['Quantity', '1 No'], ['Spacing', '12mm'], ['MOC', 'SS 304']]
      },
      {
        id: '2', name: 'Bar Screen (FINE)',
        specs: [['Quantity', '1 No'], ['Spacing', '5-6mm'], ['MOC', 'SS 304']]
      },
      {
        id: '3', name: 'Raw Water Pump',
        specs: [['Quantity', '2 Nos (1W+1S)'], ['Motor', '1 HP'], ['Head', '10 m'], ['Type', 'Monobloc Pump'], ['Make', 'Kirloskar']]
      },
      {
        id: '4', name: 'MBR Feed Pump',
        specs: [['Quantity', '2 Nos (1W+1S) KSMB'], ['Motor', '1 HP'], ['Head', '20m'], ['Type', 'Monobloc Pump'], ['Make', 'Kirloskar']]
      }
    ]
  },
  page9: {
    equipments: [
      {
        id: '5', name: 'Back Wash Pump',
        specs: [['Quantity', '1 No'], ['Motor', '1 HP'], ['Head', '20 m'], ['Type', 'Monobloc Pump'], ['Make', 'Kirloskar']]
      },
      {
        id: '6', name: 'Air Blower',
        specs: [['Quantity', '2Nos (1W+1S)'], ['Make', 'A-ONE/Akash'], ['Type', 'Twin lobe roots blower'], ['Capacity', '5.0 HP'], ['Motor Make', 'Crompton Greaves']]
      },
      {
        id: '7', name: 'Chemical Dosing System',
        specs: [['Quantity', '1 No'], ['Type', 'Diaphragm'], ['Capacity', '0-6LPH'], ['Pressure', '4 Bar'], ['End Connection', '4/6mm'], ['Max. Suction Pressure', '1.5m'], ['Make', 'Infinity'], ['PP \u2013Storage Tank', '100 Liters']]
      },
      {
        id: '8', name: 'PH Correction Dosing System',
        specs: [['Quantity', '1 No'], ['Type', 'Diaphragm'], ['Capacity', '0-6LPH'], ['Pressure', '4 Bar'], ['End Connection', '4/6mm'], ['Max. Suction Pressure', '1.5m'], ['Make', 'Infinity'], ['PP \u2013Storage Tank', '100 Liters']]
      }
    ]
  },
  page10: {
    equipments: [
      {
        id: '9', name: 'Coarse Bubble Membrane Aerator',
        specs: [['Quantity', '40 Nos'], ['Make', 'Airtech/ Equivalent'], ['Medium Of Flow', 'Air'], ['Type', 'Disc'], ['Dimension of Bubble', '1mm Pore Size'], ['Service Temperature', '80 \u00ba C'], ['Membrane Construction', 'High Grade EPDM']]
      },
      {
        id: '10', name: 'Fine Bubble Membrane Aerator',
        specs: [['Quantity', '1 LOT'], ['Make', 'Airtech / Equivalent'], ['Medium Of Flow', 'Air'], ['Type', 'Disc'], ['Dimension of Bubble', '0.mm \u2013 0.2mm'], ['Service Temperature', '80 \u00ba C'], ['Membrane Construction', 'High Grade EPDM']]
      },
      {
        id: '11', name: 'MBR Membrane',
        specs: [['Quantity', '340 sq m'], ['Make', 'Hallow brane'], ['MOC of Stand', 'SS 304'], ['Type', 'Submerged hollow fibre membrane'], ['Pore Size', '0.04 Micron'], ['Membrane Construction', 'R- PVDF']]
      },
      {
        id: '12', name: 'Sludge Transfer Pump',
        specs: [['Quantity', '2 Nos'], ['Head', '10 M'], ['Motor', '1.0 HP'], ['Type', 'Monoblock'], ['Make', 'Kirloskar']]
      }
    ]
  },
  page11: {
    equipments: [
      {
        id: '13', name: 'Equipment Skid',
        specs: [['Quantity', '1 No'], ['Model', 'SS 304'], ['Make', 'IAPL']]
      },
      {
        id: '14', name: 'Membrane Lifting Stand',
        specs: [['Quantity', '1set'], ['Make', 'IAPL'], ['MOC', 'MS SQUARE TUBE'], ['Details', '(Along with chain pulley block and chain for lifting of membrane stand)']]
      },
      {
        id: '15', name: 'Piping',
        specs: [['Interconnected Pipes, Fittings and Valves', '1 Lot'], ['Make UPVC', 'Supreme Astral'], ['MOC', 'UPVC'], ['Make MS', 'TATA/JINDAL'], ['MOC', 'MS']]
      },
      {
        id: '16', name: 'PLC Control Panel',
        specs: [['Quantity', '1 No'], ['Components Make', 'DELTA'], ['Electrical Accessories', 'Flexible'], ['Cable', 'Poly Cab']]
      }
    ]
  },
  page12: {
    equipments: [
      {
        id: '17', name: 'Electromagnetic flow meter',
        specs: [['Quantity', '2 No'], ['Size', '11/2\u201d'], ['Make', 'Flow measures']]
      },
      {
        id: '18', name: 'Solenoid valve',
        specs: [['Interconnected Pipes, Fittings and Valves', '1 Lot'], ['Make', 'Aira/Equivalent'], ['MOC', 'CA'], ['Type', 'Diaphragm']]
      },
      {
        id: '19', name: 'PH Meter',
        specs: [['Quantity', '1 No'], ['Make', 'ASTER'], ['Specification', '0-12'], ['MOC', 'SS304']]
      },
      {
        id: '20', name: 'CIP CUM BACK WASH TANK',
        specs: [['Quantity', '1 No'], ['Make', 'KAVERI'], ['Specification', '1000 Ltr'], ['MOC', 'HDPE']]
      }
    ]
  },
  page13: {
    equipments: [
      {
        id: '21', name: 'UV System',
        specs: [['Quantity', '1No'], ['Model', 'SS304, Tube type'], ['Capacity', '0-7500LPH'], ['Make', 'Alfa'], ['Power', '5595.00']]
      },
      {
        id: '22', name: 'Rotameter',
        specs: [['Quantity', '1 No.'], ['Capacity', '1000-10000 LPH'], ['Make', 'ASTER'], ['MOC', 'Acrylic']]
      }
    ]
  },
  pageCivil: {
    title: 'IV. CIVIL & CONSTRUCTIONS (RCC TANKS) - SCOPE OF CLIENT:',
    table: {
      headers: ['S.No', 'Description', 'No. of tanks', 'Length (m)', 'Width (m)', 'SWD (m)', 'Vol (m3)'],
      rows: [
        ['', 'Oil & Grease Trap', '1', '1.5', '1.5', '1.0', '2.25'],
        ['', 'Screen Chamber', '1', '1.5', '1.5', '1.0', '2.25'],
        ['', 'Raw Sewage Collection Tank', '1', '4.0', '4.0', '4.3', '68.80'],
        ['', 'MBR Tank', '1', '2.5', '2.5', '4.3', '26.88'],
        ['', 'Treated Water Tank', '1', '3.5', '3.5', '2.5', '30.63'],
        ['', 'Sludge Holding Tank', '1', '1.5', '1.5', '2.5', '5.63']
      ],
      total: '136.44'
    },
    electrical: {
      title: 'V. ELECTRICAL LOAD DETAILS (CONNECTED LOAD)',
      headers: ['S.No', 'Description', 'Qty', 'Unit Load', 'Total Load', 'Working Hrs', 'KWH/Day'],
      rows: [
        ['', 'Raw Water Pump', '2', '1 HP', '2 HP', '10', '14.92'],
        ['', 'Air Blower', '2', '5 HP', '10 HP', '20', '149.20'],
        ['', 'MBR Pump', '2', '2 HP', '4 HP', '10', '29.84'],
        ['', 'Dosing Pumps', '3', '0.1 HP', '0.3 HP', '20', '4.48'],
        ['', 'Sludge Pump', '1', '1 HP', '1 HP', '2', '1.49'],
        ['', 'Misc (Lighting/Panel)', '1 Lot', '1 HP', '1 HP', '10', '7.46']
      ],
      total: '207.39',
      calc: 'Calculated at 0.746 KW per HP'
    }
  },
  pageCost: {
    title: 'OPERATING COST',
    rows: [
      ['', 'Power consumption cost per day', 'Rs. 906.57 (At Rs. 10 per unit)'],
      ['', 'Chemical and Consumables per day', 'Rs. 100.00'],
      ['', 'Total cost per day', 'Rs. 1006.57'],
      ['', 'Cost per KLD treated', 'Rs. 16.78 / KLD'],
      ['', 'Cost per liter treated', 'Rs. 0.01678 / Liter (Rs. 16.78 / 1000 Liters)']
    ]
  },
  pageCommercial: {
    title: 'COMMERCIAL OFFER',
    commercialData: {
      equipmentPrice: 2000000,
      erectionPrice:   300000,
      amcPrice:        160000,
      subtotal:       2300000,
      gstAmount:       414000,
      grandTotal:     2714000
    },
    priceTable: [['1.', 'The Price for Supply, Installation and commissioning of PACKAGED Sewage Treatment Plant Capacity of 60 KLD MBR', '20,00,000.00']],
    notes: [
      'Order to be placed as per the description mentioned above.',
      'The above design parameters of the plant shall be modified at time of Erection/Commissioning without compromising the Performance of the system.',
      'If Required Core cutting at the time of erection cost will extra.',
      'The Tax invoice will be generated after all the payment transaction only.',
      'In the event of order cancellation after 15 days from the date of payment, the advance payment will be considered non-refundable.'
    ],
    terms: [
      ['Delivery', '4-6 weeks from the date of purchase order along with Advance'],
      ['GST', '18% Extra at actual in the above price.'],
      ['Erection & Comm.', 'Included in the above price.'],
      ['Freight', 'Included in the above price.'],
      ['Unloading', 'Client Scope.']
    ],
    payment: [
      'Mobilization Advance: 50% of the total project cost upon receipt of the Purchase Order.',
      'Material Supply: 40% of the total project cost, along with 18% GST, to be paid against submission of a proforma invoice, prior to the supply of materials.',
      'Handover Payment: 10% of the total project cost against handover on an immediate basis.',
      'In case of delays due to electrical supply or insufficient feed water, ₹25,000 can be kept on hold and the remaining payment should be released upon completion of work.',
      'If balance payment exceeding 45days from the tax invoice is subjected to fall within MSME norms and compliance.'
    ],
    warranty: '12 months from the date of Erection or 18 months from the date of supply whichever is earlier. This warranty includes only inherent manufacturing defects; it does not cover any replacement for normal wear and tear.'
  },
  pageExclusions: {
    title: 'SCOPE OF EXCLUSIONS:',
    exclusions: [
      'Water required for Erection and Commissioning to be supplied at free of cost.',
      'Civil Works, Plant Room & Shed, Treated water Pump.',
      'Raw Sewage inlet pipe to Screen Chamber, Interconnecting Pipes in the Tanks and Treated water final discharge pipe line are not included in our scope of supply.',
      'Airs vent line for all the treatment tanks.',
      'Electrical Cabling will be laid from our Panel Board and if the Panel Board is above 5m from the proposed plant it will cost extra.',
      'Lighting arrangements and generators if required during erection work, Ladder, Handrails and Walkway arrangement for tanks',
      'Incoming Power Supply to our proposed panel board with 3phase connection, 415V, 50Hz.',
      'During Commissioning we will depute our Engineer for the same and we require an Operator to operate the plant.',
      'Any other things which are not mentioned apart from our proposal.'
    ],
    notes: [
      'After supply of materials to site, Client is the responsible if there is any problem occurred due to mishandling of materials by you.',
      'All the lump sum electrical / plumbing material will be taken back by the supplier after complete erection & commissioning'
    ]
  }
};

const BLANK_DATA = JSON.parse(JSON.stringify(INITIAL_DATA));
BLANK_DATA.page1.client = '';
BLANK_DATA.page1.address = '';
BLANK_DATA.page1.project = '';
BLANK_DATA.page1.proposalNo = '';
BLANK_DATA.pageCommercial.priceTable[0][2] = '';

const CATEGORIES = [
  { id: 'client', name: 'CLIENT', icon: User, pages: ['page1', 'page2', 'page3'] },
  { id: 'technical', name: 'TECHNICAL', icon: Activity, pages: ['page4', 'page5', 'page6', 'page7'] },
  { id: 'tools', name: 'EQUIPMENT', icon: Package, pages: ['page8', 'page9', 'page10', 'page11', 'page12', 'page13'] },
  { id: 'commercial', name: 'COMMERCIAL', icon: DollarSign, pages: ['pageCivil', 'pageCost', 'pageCommercial', 'pageExclusions'] },
  { id: 'settings', name: 'SETTINGS', icon: Settings, pages: ['settings'] }
];

function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeTab, setActiveTab] = useState('page1');
  const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth / 2);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const isResizing = useRef(false);
  const componentRef = useRef(null);
  const previewAreaRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [showMobilePreview, setShowMobilePreview] = useState(false);





  // Combined initialization effect: Load saved data AND run calculations
  useEffect(() => {
    const saved = localStorage.getItem('intellect_aqua_proposal_last');
    let baseData = INITIAL_DATA;
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Data Migration: Map old numbered keys to new descriptive keys if needed
        if (parsed.page13 && parsed.page13.table) {
          if (!parsed.pageCivil) parsed.pageCivil = parsed.page13;
          parsed.page13 = INITIAL_DATA.page13; // Restore the equipment data
        }
        if (parsed.page14 && !parsed.pageCost) parsed.pageCost = parsed.page14;
        if (parsed.page15 && !parsed.pageCommercial) parsed.pageCommercial = parsed.page15;
        if (parsed.page16 && !parsed.pageExclusions) parsed.pageExclusions = parsed.page16;
        baseData = parsed;
      } catch (err) {
        console.error('Failed to load saved data', err);
      }
    }
    
    // Run calculations on the loaded data and set state once
    const finalData = runCalculations(baseData, false);
    setData(finalData);
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const padding = window.innerWidth < 1024 ? 20 : 64;
        const availableWidth = entry.contentRect.width - padding;
        const a4WidthPx = 794;
        if (availableWidth < a4WidthPx) {
          setPreviewScale(availableWidth / a4WidthPx);
        } else {
          setPreviewScale(1);
        }
      }
    });

    if (previewAreaRef.current) {
      observer.observe(previewAreaRef.current);
    }
    return () => observer.disconnect();
  }, [sidebarWidth]);

  const runCalculations = (currentData, shouldUpdateState = true, forceFormula = true) => {
    const calc = currentData.calculations;
    const newData = JSON.parse(JSON.stringify(currentData));

    const KLD = calc.flowRate || 100;
    const opHrs = calc.operatingHours || 20;
    const flow = KLD / opHrs; // m³/hr (Flow per hour)

    // Helper to find equipment spec
    const getEquipSpec = (name, specName) => {
      for (let i = 8; i <= 13; i++) {
        const page = newData[`page${i}`];
        if (!page || !page.equipments) continue;
        const eq = page.equipments.find(e => e.name.toLowerCase().includes(name.toLowerCase()));
        if (eq) {
          const spec = eq.specs.find(s => s[0].toLowerCase().includes(specName.toLowerCase()));
          if (spec) return spec[1];
        }
      }
      return null;
    };

    if (forceFormula) {
      // --- Section 1 & 2: Tank Sizing ---
      const B = 3.0; // fixed width (m)
      const H = 4.3; // fixed total depth (m)
      // Fixed chambers
      const screenL = 1.0, screenB = 1.0, screenH = 1.3;
      const oilL = 1.0, oilB = 1.0, oilH = 1.3;
      const volScreen = screenL * screenB * screenH;
      const volOil = oilL * oilB * oilH;

      // Calculated tanks based on Retention Time (RT)
      const calcTank = (rt) => {
        const vol = flow * rt;
        const L = vol / (B * H);
        return { vol, L };
      };

      const col = calcTank(12); // RT = 12 hrs
      const anoxic = calcTank(3); // RT = 3 hrs
      const aeration = calcTank(8); // RT = 8 hrs
      const mbrTank = calcTank(8); // RT = 8 hrs
      const twt = calcTank(8); // RT = 8 hrs
      const sludge = calcTank(8); // RT = 8 hrs

      const totalVol = volScreen + volOil + col.vol + anoxic.vol + aeration.vol + mbrTank.vol + twt.vol + sludge.vol;

      const fmt = n => parseFloat(n).toFixed(2);
      const fmtDim = (l, b, h) => `${fmt(l)}m × ${b}m × ${h}m`;

      newData.pageCivil.table.rows = [
        ['', 'Screen Chamber', fmtDim(screenL, screenB, screenH), '1 No', 'RCC', 'CLIENT', fmt(volScreen)],
        ['', 'Oil Trap Chamber', fmtDim(oilL, oilB, oilH), '1 No', 'RCC', 'CLIENT', fmt(volOil)],
        ['', 'Collection/Equalization Tank', fmtDim(col.L, B, H), '1 No', 'RCC', 'CLIENT', fmt(col.vol)],
        ['', 'Anoxic Tank', fmtDim(anoxic.L, B, H), '1 No', 'RCC', 'CLIENT', fmt(anoxic.vol)],
        ['', 'Aeration Tank', fmtDim(aeration.L, B, H), '1 No', 'RCC', 'CLIENT', fmt(aeration.vol)],
        ['', 'MBR Tank', fmtDim(mbrTank.L, B, H), '1 No', 'RCC', 'CLIENT', fmt(mbrTank.vol)],
        ['', 'Treated Water Tank', fmtDim(twt.L, B, H), '1 No', 'RCC', 'CLIENT', fmt(twt.vol)],
        ['', 'Sludge Holding Tank', fmtDim(sludge.L, B, H), '1 No', 'RCC', 'CLIENT', fmt(sludge.vol)],
      ];
      newData.pageCivil.table.total = fmt(totalVol);

      // Update Process Design Pages (5-7)
      const flowStr = `${flow.toFixed(2)} m3/hr`;
      const updSection = (page, idx, params) => {
        const s = newData[page]?.sections?.[idx];
        if (!s) return;
        s.params.forEach(p => {
          const lbl = p[0].toLowerCase();
          if (lbl.includes('normal flow')) p[1] = flowStr;
          if (params.size && lbl.includes('size of')) p[1] = params.size;
          if (params.vol && lbl.includes('volume of the tank')) p[1] = params.vol;
        });
      };

      updSection('page5', 0, { size: `${screenL}m × ${screenB}m × ${screenH}m` });
      updSection('page5', 1, { size: `${oilL}m × ${oilB}m × ${oilH}m` });
      updSection('page5', 2, { size: `${fmt(col.L)}m × ${B}m × ${H}m`, vol: `${fmt(col.vol)} m3` });
      updSection('page6', 0, { size: `${fmt(anoxic.L)}m × ${B}m × ${H}m`, vol: `${fmt(anoxic.vol)} m3` });
      updSection('page6', 1, { size: `${fmt(aeration.L)}m × ${B}m × ${H}m`, vol: `${fmt(aeration.vol)} m3` });
      updSection('page6', 2, { size: `${fmt(mbrTank.L)}m × ${B}m × ${H}m`, vol: `${fmt(mbrTank.vol)} m3` });
      updSection('page6', 3, { size: `${fmt(twt.L)}m × ${B}m × ${H}m`, vol: `${fmt(twt.vol)} m3` });
      updSection('page7', 0, { size: `${fmt(sludge.L)}m × ${B}m × ${H}m`, vol: `${fmt(sludge.vol)} m3` });

      // --- Section 1: MBR Membrane ---
      const requiredMemSqm = (flow * 1000) / 15;
      const numberOfModules = Math.ceil(requiredMemSqm / 20);
      const totalMembraneSqm = numberOfModules * 20;

      // --- Section 1: Air Blower ---
      const aerationAirFlowM3Hr = aeration.vol * 0.5; // corrected from m3/min to m3/hr
      const mbrAirFlowM3Hr = totalMembraneSqm * 0.2;
      const totalAirFlowM3Hr = aerationAirFlowM3Hr + mbrAirFlowM3Hr;
      
      // Select standard blower size and HP
      let selectedBlowerM3Hr = 80;
      let blowerHP = 5;
      if (totalAirFlowM3Hr <= 80) { selectedBlowerM3Hr = 80; blowerHP = 5; }
      else if (totalAirFlowM3Hr <= 160) { selectedBlowerM3Hr = 160; blowerHP = 7.5; }
      else if (totalAirFlowM3Hr <= 250) { selectedBlowerM3Hr = 250; blowerHP = 10; }
      else if (totalAirFlowM3Hr <= 350) { selectedBlowerM3Hr = 350; blowerHP = 15; }
      else { selectedBlowerM3Hr = Math.ceil(totalAirFlowM3Hr / 50) * 50; blowerHP = 20; }

      // --- Section 1: Diffusers ---
      const coarseDiffurers = Math.ceil(mbrAirFlowM3Hr / 3.8);
      const fineDiffusers = Math.ceil(aerationAirFlowM3Hr / 2.5);

      // --- Section 1: Pumps ---
      const pumpHP = flow <= 10 ? 1.0 : 2.0;

      // Update Equipment Pages (8-13)
      const updateEquipment = (name, specsToUpdate) => {
        [8, 9, 10, 11, 12, 13].forEach(pNum => {
          const page = newData[`page${pNum}`];
          if (!page || !page.equipments) return;
          page.equipments.forEach(eq => {
            if (eq.name.toLowerCase().includes(name.toLowerCase())) {
              specsToUpdate.forEach(([sName, sVal]) => {
                const spec = eq.specs.find(s => s[0].toLowerCase().includes(sName.toLowerCase()));
                if (spec) spec[1] = sVal;
              });
            }
          });
        });
      };

      updateEquipment('Raw Water Pump', [['Motor', `${pumpHP} HP`]]);
      updateEquipment('MBR Feed Pump', [['Motor', `${pumpHP} HP`]]);
      updateEquipment('Back Wash Pump', [['Motor', `${pumpHP} HP`]]);
      updateEquipment('Sludge Transfer Pump', [['Motor', `${pumpHP} HP`]]);
      updateEquipment('Air Blower', [['Capacity', `${selectedBlowerM3Hr} m³/hr`], ['Motor', `${blowerHP} HP`]]);
      updateEquipment('MBR Membrane', [['Quantity', `${numberOfModules} Nos × 20 m² = ${totalMembraneSqm} m² (Hollowbrane, Submerged Hollow Fibre, 0.06 Micron, R-PVDF)`]]);
      updateEquipment('Coarse Bubble', [['Quantity', `${coarseDiffurers} Nos`]]);
      updateEquipment('Fine Bubble', [['Quantity', `${fineDiffusers} Nos`]]);
    }

    // --- Section 3: Electrical Load (Always synced from Equipment specs) ---
    const getHP = (name) => {
      const val = getEquipSpec(name, 'Motor') || getEquipSpec(name, 'Power') || getEquipSpec(name, 'Capacity') || '1.0 HP';
      return parseFloat(val.replace(/[^0-9.]/g, '')) || 1.0;
    };
    const getQty = (name) => {
      const val = getEquipSpec(name, 'Quantity') || '1 No';
      if (val.includes('1W+1S') || val.includes('2 Nos')) return 2;
      return parseInt(val.replace(/[^0-9]/g, '')) || 1;
    };

    const electricalRows = [
      { name: 'Raw Water Pump', hp: getHP('Raw Water Pump'), qty: getQty('Raw Water Pump'), runHrs: opHrs },
      { name: 'MBR Feed Pump', hp: getHP('MBR Feed Pump'), qty: getQty('MBR Feed Pump'), runHrs: opHrs },
      { name: 'Backwash Pump', hp: getHP('Back Wash Pump'), qty: getQty('Back Wash Pump'), runHrs: 1 },
      { name: 'Air Blower', hp: getHP('Air Blower'), qty: getQty('Air Blower'), runHrs: 24 },
      { name: 'RAS Pump', hp: getHP('Sludge Transfer Pump'), qty: getQty('Sludge Transfer Pump'), runHrs: 1 },
      { name: 'UV System', hp: 0.5, qty: getQty('UV System'), runHrs: opHrs },
      { name: 'pH Dosing System', hp: 0.04, qty: getQty('PH Correction'), runHrs: opHrs },
      { name: 'Chemical Dosing System', hp: 0.04, qty: getQty('Chemical Dosing'), runHrs: opHrs },
    ];

    let totalKWhDay = 0;
    newData.pageCivil.electrical.headers = ['S.No', 'Description', 'Op. Load (kW)', 'Conn. Load (kW)', 'Qty', 'Running Hrs', 'Total kWh/Day'];
    newData.pageCivil.electrical.rows = electricalRows.map((item, i) => {
      const opKW = item.hp * 0.746;
      const connKW = item.qty * opKW;
      const workingQty = item.qty > 1 ? (item.qty / 2) : 1; // Assume half are working if > 1 (e.g. 1W+1S)
      const kwhDay = opKW * workingQty * item.runHrs; 
      totalKWhDay += kwhDay;
      return [
        '', // S.No (Handled by Preview)
        item.name,
        opKW.toFixed(2),
        connKW.toFixed(2),
        item.qty === 2 ? '2(1W+1S)' : item.qty.toString(),
        item.runHrs.toString(),
        kwhDay.toFixed(2)
      ];
    });

    const demandFactorTotal = totalKWhDay * 0.70;
    newData.pageCivil.electrical.total = totalKWhDay.toFixed(2);
    newData.pageCivil.electrical.calc = `70% Demand Factor Total: ${demandFactorTotal.toFixed(2)} kWh/Day`;

    // --- Section 4: Operating Cost ---
    const powerCostPerDay = demandFactorTotal * (calc.powerRate || 10);
    const chemCostPerDay = 100;
    const totalCostPerDay = powerCostPerDay + chemCostPerDay;
    const costPerKLD = totalCostPerDay / KLD;
    const costPerLitre = costPerKLD / 1000;

    newData.pageCost.rows = [
      ['', 'Power cost per day', `₹ ${Math.round(powerCostPerDay)}`],
      ['', 'Chemical cost per day', `₹ ${chemCostPerDay}`],
      ['', 'Total cost per day', `₹ ${Math.round(totalCostPerDay)}`],
      ['', 'Cost per KLD', `₹ ${costPerKLD.toFixed(2)}`],
      ['', 'Cost per 1000 Litres', `₹ ${costPerKLD.toFixed(2)}`],
      ['', 'Cost per Litre', `₹ ${costPerLitre.toFixed(4)}`],
    ];

    // --- Section 5: Commercial Offer ---
    const reqMemSqm = (flow * 1000) / 15;
    const numModules = Math.ceil(reqMemSqm / 20);
    const membraneModuleUnitCost = calc.membraneModuleUnitCost || 25000;
    const membraneTotalCost = numModules * membraneModuleUnitCost;
    
    if (newData.pageCommercial.priceTable) {
      newData.pageCommercial.priceTable[0][1] = `Supply, Erection & Commissioning of ${KLD} KLD MBR STP (incl. ${numModules} Nos Membrane Modules)`;
    }
    
    const basePriceRef = 2000000; 
    const scaledPrice = Math.round((basePriceRef / 60) * KLD);
    
    let equipPrice = scaledPrice + membraneTotalCost;
    if (newData.pageCommercial.commercialData) {
      newData.pageCommercial.commercialData.equipmentPrice = equipPrice;
      newData.pageCommercial.commercialData.subtotal = equipPrice;
      newData.pageCommercial.commercialData.gstAmount = Math.round(equipPrice * 0.18);
      newData.pageCommercial.commercialData.grandTotal = equipPrice + newData.pageCommercial.commercialData.gstAmount;
    }

    if (shouldUpdateState) {
      setData(newData);
    }
    return newData;
  };


  const updateData = (page, field, value) => {
    setData(prev => {
      const next = { ...prev, [page]: { ...prev[page], [field]: value } };
      return next;
    });
  };

  const updateCalculation = (path, value) => {
    setData(prev => {
      const keys = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData.calculations;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = value;
      
      // Calculate and return the new state
      return runCalculations(newData, false, true); // forceFormula = true for KLD/Hrs changes
    });
  };



  // Scroll preview when active tab changes
  useEffect(() => {
    if (activeTab && previewAreaRef.current && !isGeneratingPDF) {
      const el = document.getElementById(activeTab);
      if (el) {
        // Find the preview container to scroll it, or just use scrollIntoView
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeTab, isGeneratingPDF]);

  // Auto-save logic
  useEffect(() => {
    if (data.settings.autoSave) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Always persist the auto-save setting itself when it changes
      localStorage.setItem('intellect_aqua_proposal_last', JSON.stringify(data));
    }
  }, [data.settings.autoSave, data.settings.storageMode]); // Depend on settings specifically for immediate persist

  useEffect(() => {
    if (data.settings.autoSave) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handleSave = async (isAuto = false) => {
    setSaveStatus('saving');
    const saveData = { ...data, updatedAt: new Date() };

    // 1. ALWAYS save to local storage first (Primary source of truth)
    const localProposals = JSON.parse(localStorage.getItem('intellect_aqua_proposals_collection') || '[]');
    let updatedLocal;

    if (saveData._id) {
      updatedLocal = localProposals.map(p => p._id === saveData._id ? saveData : p);
    } else {
      // Generate a local ID if none exists
      saveData._id = `local_${Date.now()}`;
      updatedLocal = [saveData, ...localProposals];
      setData(saveData); 
    }
    
    localStorage.setItem('intellect_aqua_proposals_collection', JSON.stringify(updatedLocal));
    localStorage.setItem('intellect_aqua_proposal_last', JSON.stringify(saveData));

    // 2. If Cloud mode is ON, attempt to sync to MongoDB
    if (data.settings.storageMode === 'cloud') {
      try {
        const response = await fetch('/api/proposals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData),
        });

        if (!response.ok) {
          throw new Error('Cloud sync failed');
        }

        const result = await response.json();
        // If server returns a new permanent ID, update local state and storage
        if (result.id && String(saveData._id).startsWith('local_')) {
          const finalData = { ...saveData, _id: result.id };
          setData(finalData);
          localStorage.setItem('intellect_aqua_proposal_last', JSON.stringify(finalData));
          // Update the ID in the collection as well
          const updatedWithRemoteId = updatedLocal.map(p => p._id === saveData._id ? finalData : p);
          localStorage.setItem('intellect_aqua_proposals_collection', JSON.stringify(updatedWithRemoteId));
        }

        setSaveStatus('saved');
        if (!isAuto) alert('Proposal synced to Cloud (MongoDB) successfully!');
      } catch (err) {
        console.warn('Cloud sync background failed:', err);
        setSaveStatus('saved'); // Still "saved" because local was successful
        if (!isAuto) alert('Saved locally. Cloud sync failed, but your data is safe in browser cache.');
      }
    } else {
      // Local mode only
      setSaveStatus('saved');
      if (!isAuto) {
        // Only show alert for manual saves
        // alert('Saved to local storage.'); 
      }
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const fetchHistory = async () => {
    setIsSyncing(true);
    
    // 1. Immediately load from Local Storage
    const localData = localStorage.getItem('intellect_aqua_proposals_collection');
    if (localData) {
      try {
        setHistoryList(JSON.parse(localData));
      } catch (e) {
        console.error("Corrupt local storage", e);
      }
    }

    // 2. If Cloud mode is ON, attempt to merge with Cloud history
    if (data.settings.storageMode === 'cloud') {
      try {
        const response = await fetch('/api/proposals');
        if (response.ok) {
          const cloudList = await response.json();
          // Merge logic: prioritize local if updated more recently, or just use cloud as source
          // For now, let's just use cloud list as the primary when in cloud mode
          if (Array.isArray(cloudList) && cloudList.length > 0) {
            setHistoryList(cloudList);
          }
        }
      } catch (err) {
        console.warn('Could not fetch cloud history', err);
      }
    }
    
    setIsSyncing(false);
  };


  const handleDelete = async (proposalId) => {
    if (!window.confirm('Are you sure you want to delete this proposal? This cannot be undone.')) return;

    // Remove from Local Storage
    const localProposals = JSON.parse(localStorage.getItem('intellect_aqua_proposals_collection') || '[]');
    const updatedLocal = localProposals.filter(p => p._id !== proposalId);
    localStorage.setItem('intellect_aqua_proposals_collection', JSON.stringify(updatedLocal));

    // Remove from Cloud if applicable
    if (data.settings.storageMode === 'cloud' && !proposalId.startsWith('local_')) {
      try {
        await fetch(`/api/proposals?id=${proposalId}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Cloud delete failed', err);
      }
    }

    // Update UI
    setHistoryList(prev => prev.filter(p => p._id !== proposalId));

    // If the currently open proposal was deleted, clear it
    if (data._id === proposalId) {
      handleNew();
    }
  };

  const loadProposal = (proposal) => {
    if (window.confirm(`Load proposal for ${proposal.page1.client || 'Untitled'}? Unsaved changes will be lost.`)) {
      setData(runCalculations(proposal, false));
      setShowHistory(false);
    }
  };

  const handleSaveAsNew = async () => {
    setSaveStatus('saving');
    // Strip the ID to force a new entry in MongoDB
    const { _id, ...cleanData } = data;
    const newData = { ...cleanData, updatedAt: new Date() };

    if (data.settings.storageMode === 'cloud') {
      try {
        const response = await fetch('/api/proposals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newData),
        });
        if (!response.ok) throw new Error('Cloud save failed');
        const result = await response.json();
        // Update current state with the new ID
        setData({ ...newData, _id: result.id });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 3000);
        fetchHistory(); // Refresh history
      } catch (err) {
        console.error(err);
        setSaveStatus('error');
      }
    } else {
      setSaveStatus('error');
      alert('Save as New is only available in Cloud mode. In Local mode, each save overwrites the cache.');
    }
  };

  const handleNew = () => {
    if (window.confirm('Are you sure you want to start a new proposal? This will clear all current changes.')) {
      const newData = JSON.parse(JSON.stringify(BLANK_DATA));
      setData(runCalculations(newData, false));
      setActiveTab('page1');
      setActiveCategory(CATEGORIES[0]);
    }
  };



  const handleDownloadPDF = async () => {
    const element = document.querySelector('.preview-container');
    if (!element) return;

    setIsGeneratingPDF(true);

    const cleanProject = data.page1.project.replace(/[\/\\]/g, '_');
    const cleanTech = data.page1.technology.replace(/[\/\\]/g, '_');
    const filename = `IAPL ${data.page1.proposalNo} ${cleanProject} ${cleanTech}.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // Temporarily add a class to body to help with PDF styling if needed
      document.body.classList.add('is-generating-pdf');

      // Use html2pdf to generate and save
      await window.html2pdf().set(opt).from(element).save();

    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Please try using the Print button and "Save as PDF".');
    } finally {
      document.body.classList.remove('is-generating-pdf');
      setIsGeneratingPDF(false);
    }
  };





  const startResizing = () => {

    isResizing.current = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize';
  };

  const handleResize = (e) => {
    if (!isResizing.current) return;
    if (e.clientX > 300 && e.clientX < 800) setSidebarWidth(e.clientX);
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'default';
  };

  const selectCategory = (cat) => {
    setActiveCategory(cat);
    setActiveTab(cat.pages[0]);
  };

  return (
    <div className="app-container">
      <header className="no-print glass">
        <div className="header-content">
          <div className="logo-section">
            <img src="/assets/intellect_logo.png" alt="Intellect Aqua Logo" className="header-logo" />
            <h1>Intellect Aqua <span>Proposal Studio</span></h1>
          </div>
          <div className="header-actions">
            {saveStatus === 'saving' && <span className="status-msg syncing">Saving...</span>}
            {saveStatus === 'saved' && <span className="status-msg success">Saved!</span>}
            {saveStatus === 'error' && <span className="status-msg error">Error Saving!</span>}

            <div className="action-group">
              <button onClick={handleNew} className="btn-ghost" title="New Proposal">
                <Plus size={18} />
                <span>New</span>
              </button>
              <button onClick={() => { setShowHistory(true); fetchHistory(); }} className="btn-ghost" title="View History">
                <History size={18} />
                <span>History</span>
              </button>
              <button onClick={() => setShowMobilePreview(true)} className="btn-ghost mobile-only" title="Preview Proposal">
                <Eye size={18} />
                <span>Preview</span>
              </button>
            </div>

            <div className="action-group">
              <button onClick={() => handleSave(false)} className="btn-secondary" title="Save Changes">
                <Save size={18} />
                <span>Save</span>
              </button>
              <button onClick={handleSaveAsNew} className="btn-secondary" title="Save as a new entry">
                <Database size={18} />
                <span>Save as New</span>
              </button>
            </div>

            <button onClick={handleDownloadPDF} className="btn-primary desktop-only">
              <Download size={18} />
              <span>Download PDF</span>
            </button>
          </div>

        </div>
      </header>

      <main className="main-content">
        <aside className="editor-sidebar no-print" style={{ width: `${sidebarWidth}px` }}>
          <div className="nav-categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`cat-btn ${activeCategory.id === cat.id ? 'active' : ''}`}
                onClick={() => selectCategory(cat)}
              >
                <cat.icon size={16} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="tabs-container">
            <div className="sub-tabs">
              {activeCategory.pages.map(tab => (
                <button
                  key={tab}
                  className={`sub-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'calculation' ? 'Auto-Calculations' : (tab === 'settings' ? 'Global' : tab.replace('page', 'Page '))}
                </button>
              ))}
            </div>
          </div>

          <Editor
            activeTab={activeTab}
            data={data}
            updateData={updateData}
            setData={setData}
            updateCalculation={updateCalculation}
            recalculateData={(newData) => setData(runCalculations(newData, true, false))}
          />
        </aside>

        <div className="resize-handle no-print" onMouseDown={startResizing}>
          <GripVertical size={16} color="#94a3b8" />
        </div>

        <section className="preview-area" ref={previewAreaRef}>
          <div className={`preview-container ${isGeneratingPDF ? 'printing-reset' : ''}`} style={{
            transform: isGeneratingPDF ? 'none' : `scale(${previewScale})`,
            transformOrigin: 'top center',
            width: '210mm'
          }}>
            <div ref={componentRef}>
              <Preview data={data} />
            </div>
          </div>
        </section>


      </main>

      <footer className="app-footer no-print">
        <p>© {new Date().getFullYear()} Intellect Aqua Proposal Studio. Developed by <strong>Jod Tech IT Solution</strong></p>
      </footer>

      {isGeneratingPDF && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <h3>Generating PDF Preview...</h3>
            <p>Please wait while we prepare your 16-page proposal.</p>
          </div>
        </div>
      )}
      {/* History Slide-out Panel */}
      <div className={`history-panel ${showHistory ? 'open' : ''}`}>
        <div className="history-header">
          <div className="history-title">
            <h3><History size={20} /> History</h3>
            <button onClick={() => setShowHistory(false)} className="close-btn"><X size={24} /></button>
          </div>
          <div className="history-search">
            <input
              type="text"
              placeholder="Search by client or project..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
            />
          </div>
        </div>
        <div className="history-body">
          {isSyncing ? (
            <div className="history-loading">Syncing with Cloud...</div>
          ) : (
            historyList
              .filter(item =>
                (item.page1.client || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                (item.page1.project || '').toLowerCase().includes(historySearch.toLowerCase())
              )
              .length === 0 ? (
              <div className="history-empty">No matching proposals found.</div>
            ) : (
              historyList
                .filter(item =>
                  (item.page1.client || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                  (item.page1.project || '').toLowerCase().includes(historySearch.toLowerCase())
                )
                .map((item, idx) => (
                  <div key={idx} className="history-item">
                    <div className="item-main" onClick={() => loadProposal(item)}>
                      <div className="item-info">
                        <strong>{item.page1.client || 'Untitled Client'}</strong>
                        <span>{item.page1.project || 'No Project'}</span>
                        <small>{new Date(item.updatedAt || Date.now()).toLocaleString()}</small>
                      </div>
                      <div className="item-badge">
                        {item.page15?.priceTable?.[0]?.[2] || 'No Price'}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        className="item-download-btn"
                        title="Quick Download PDF"
                        onClick={(e) => {
                          e.stopPropagation();
                          const oldData = data;
                          setData(runCalculations(item, false));
                          setTimeout(() => {
                            handleDownloadPDF();
                            setData(oldData);
                          }, 1000); // Increased timeout to ensure render
                        }}
                      >
                        <Download size={18} />
                      </button>
                      <button
                        className="item-delete-btn"
                        title="Delete Proposal"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
            )
          )}
        </div>
      </div>

      {showHistory && <div className="panel-overlay" onClick={() => setShowHistory(false)}></div>}

      {/* Mobile Verify & Download Modal */}
      {showMobilePreview && (
        <div className="mobile-preview-modal no-print">
          <div className="modal-header">
            <h3>Verify Proposal</h3>
            <button onClick={() => setShowMobilePreview(false)} className="btn-close">
              <X size={24} />
            </button>
          </div>
          <div className="modal-body">
            <div className="modal-preview-wrapper">
              <div
                className="preview-scale-wrapper"
                style={{
                  transform: `scale(${window.innerWidth / 794})`,
                  transformOrigin: 'top center'
                }}
              >
                <Preview data={data} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={() => setShowMobilePreview(false)} className="btn-secondary">
              Back to Edit
            </button>
            <button
              onClick={() => { handleDownloadPDF(); setShowMobilePreview(false); }}
              className="btn-primary"
            >
              <Download size={18} />
              <span>Confirm & Download</span>
            </button>
          </div>
        </div>
      )}

      {/* Premium Center-Action Bottom Navigation for Mobile */}
      <nav className="mobile-bottom-nav no-print">
        <div className="nav-group">
          <button
            className={`mobile-nav-item ${activeCategory.id === 'client' ? 'active' : ''}`}
            onClick={() => selectCategory(CATEGORIES.find(c => c.id === 'client'))}
          >
            <User size={20} />
            <span>CLIENT</span>
          </button>
          <button
            className={`mobile-nav-item ${activeCategory.id === 'technical' ? 'active' : ''}`}
            onClick={() => selectCategory(CATEGORIES.find(c => c.id === 'technical'))}
          >
            <Activity size={20} />
            <span>TECH</span>
          </button>
        </div>

        <button
          onClick={() => setShowMobilePreview(true)}
          className="center-fab"
          title="Preview & Verify"
        >
          <div className="fab-inner">
            <Eye size={28} />
          </div>
        </button>

        <div className="nav-group">
          <button
            className={`mobile-nav-item ${activeCategory.id === 'tools' ? 'active' : ''}`}
            onClick={() => selectCategory(CATEGORIES.find(c => c.id === 'tools'))}
          >
            <Package size={20} />
            <span>EQUIP</span>
          </button>
          <button
            className={`mobile-nav-item ${activeCategory.id === 'settings' ? 'active' : ''}`}
            onClick={() => selectCategory(CATEGORIES.find(c => c.id === 'settings'))}
          >
            <Settings size={20} />
            <span>SETTINGS</span>
          </button>
        </div>
      </nav>
    </div>
  );
}




export default App;

