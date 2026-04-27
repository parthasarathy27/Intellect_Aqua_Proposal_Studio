import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { Settings, FileText, GripVertical, User, Activity, Package, DollarSign, Download, Plus, Save, Cloud, Database, History, X, Trash2, Menu, Eye } from 'lucide-react';




const INITIAL_DATA = {
  settings: {
    marginTop: 65,
    marginBottom: 50,
    marginLeft: 20,
    marginRight: 20,
    storageMode: 'local', // 'local' or 'cloud'
    autoSave: true




  },
  calculations: {
    flowRate: 100,
    operatingHours: 20,
    blowerHP: 5.0,
    airPerDiffuser: 5,
    membraneFlux: 15,
    moduleSize: 20,
    tanks: {
      screen: { l: 1.0, w: 1.0, d: 1.3 },
      oil: { l: 1.0, w: 2.0, d: 1.3 },
      collection: { l: 3.9, w: 3.9, d: 4.3 },
      anoxic: { l: 1.1, w: 3.0, d: 3.15 },
      mbr: { l: 4.23, w: 3.0, d: 3.15 },
      treated: { l: 2.2, w: 2.2, d: 4.3 },
      sludge: { l: 1.0, w: 1.0, d: 1.3 }
    }
  },
  page1: {
    client: 'M/s. AKSHAYA ACADEMY CBSE SCHOOL,',
    address: 'PUDHUCHATRAM POST, DINDIGUL HWY, ODDANCHATRAM- 624619',
    project: 'STP 100 KLD',
    technology: 'MBR – PACKAGED',
    proposalNo: 'IAPL/QT/AAC/ STP/9373',
    date: '23.09.2025'
  },
  page2: {
    refNo: 'IAPL/QT/AAC/STP/9373',
    date: 'SEPTEMBER 23, 2024',
    recipientName: 'M/s.AKSHAYA ACADEMY CBSE SCHOOL,',
    recipientAddress: 'PUDHUCHATRAM POST, DINDIGUL HWY, ODDANCHATRAM- 624619',
    subject: 'Proposal for Supply of Sewage Treatment Plant Using Membrane Bio Reactors (MBR) with a Treatment Capacity of 1,00,000 Liters/Day to be installed at Your Site.',
    salutation: 'Dear Sir,',
    body: 'This is with reference to your enquiry; we are pleased to enclose our Techno- Commercial proposal for Design, Supply, Erection and Commissioning of the above mentioned with respect to subject work.\n\nWe trust that you will find our proposal acceptable and we look forward to the receipt of your order at the earliest.\n\nFor any Clarifications, Technical / Commercial discussion we shall be pleased to call on you, on hearing from you.',
    signatoryName: 'Rtn. BOOPATHI S.P',
    signatoryTitle: 'Chief Managing Director',
    signatoryPhone: '+91 95973 17861 / 95850 75552'
  },
  page3: {
    title: 'ABOUT INTELLECT - STP',
    content: "INTELLECT - STP are Membrane Bio Reactor based Sewage treatment and recycling plants. It is indigenously developed for meeting stringent treated water norms for sewage water and various other ETP's. It works on principle of biological digestion followed by specially designed submerged hollow fiber membrane filtration. Hollow fiber membranes have pore size of 0.06 micron which ensures removal of pathogens and bacteria in treated water. INTELLECT - STP is a combination of membranes, pumps and other electrical equipment's which makes itself unique in operation and having hassle free maintenance."
  },
  page4: {
    designParams: {
      flow: [
        { label: 'Nature of waste water', value: 'Sewage' },
        { label: 'Flow rate (KLD)', value: '100 KLD' },
        { label: 'Operating hours', value: '20 Hours' }
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
          ['Normal Flow Designed', '5.0m3/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '2 Hrs.'],
          ['Volume of the Tank', '10 m3'],
          ['Size Of the Tank', '1.1m X 3.0m x 3.15m'],
          ['MOC', 'MSFRP']
        ]
      },
      {
        name: 'MBR Tank:',
        params: [
          ['Normal Flow Designed', '5.0m3/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8hrs'],
          ['Volume of the Tank', '40m3'],
          ['Size Of the Tank', '4.23m X 3.0m x 3.15m'],
          ['MOC', 'MSFRP']
        ]
      },
      {
        name: 'Treated Water Tank: - (Optional)',
        params: [
          ['No. of Tanks', 'ONE'],
          ['Volume of the Tank', '5.0m3'],
          ['Retention Time', '4hrs'],
          ['Volume of the Tank', '20m3'],
          ['Size Of the Tank', '2.2m X 2.2m x 4.3m'],
          ['MOC of Treated Water Tank', 'RCC']
        ]
      }
    ]
  },
  page7: {
    sections: [
      {
        name: 'Sludge Drying Bed:',
        params: [
          ['Normal flow designed', '5.0m3/hr.'],
          ['No. of Chamber', 'Two'],
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
      },
      {
        id: '5', name: 'Back Wash Pump', 
        specs: [['Quantity', '1 No'], ['Motor', '1 HP'], ['Head', '20 m'], ['Type', 'Monobloc Pump'], ['Make', 'Kirloskar']]
      }
    ]
  },
  page9: {
    equipments: [
      {
        id: '6', name: 'Air Blower', 
        specs: [['Quantity', '2Nos (1W+1S)'], ['Make', 'A-ONE/Akash'], ['Type', 'Twin lobe roots blower'], ['Capacity', '5.0 HP'], ['Motor Make', 'Crompton Greaves']]
      },
      {
        id: '7', name: 'Chemical Dosing System', 
        specs: [['Quantity', '1 No'], ['Type', 'Diaphragm'], ['Capacity', '0-6LPH'], ['Pressure', '4 Bar'], ['End Connection', '4/6mm'], ['Max. Suction Pressure', '1.5m'], ['Make', 'Infinity'], ['PP –Storage Tank', '100 Liters']]
      },
      {
        id: '8', name: 'PH Correction Dosing System', 
        specs: [['Quantity', '1 No'], ['Type', 'Diaphragm'], ['Capacity', '0-6LPH'], ['Pressure', '4 Bar'], ['End Connection', '4/6mm'], ['Max. Suction Pressure', '1.5m'], ['Make', 'Infinity'], ['PP –Storage Tank', '100 Liters']]
      },
      {
        id: '9', name: 'Coarse Bubble Membrane Aerator', 
        specs: [['Quantity', '1 LOT'], ['Make', 'Airtech/ Equivalent'], ['Medium Of Flow', 'Air'], ['Type', 'Disc'], ['Dimension of Bubble', '1mm Pore Size'], ['Service Temperature', '80 º C'], ['Membrane Construction', 'High Grade EPDM']]
      }
    ]
  },
  page10: {
    equipments: [
      {
        id: '10', name: 'Fine Bubble Membrane Aerator', 
        specs: [['Quantity', '1 LOT'], ['Make', 'Airtech / Equivalent'], ['Medium Of Flow', 'Air'], ['Type', 'Disc'], ['Dimension of Bubble', '0.mm – 0.2mm'], ['Service Temperature', '80 º C'], ['Membrane Construction', 'High Grade EPDM']]
      },
      {
        id: '11', name: 'MBR Membrane', 
        specs: [['Quantity', '340 sq m'], ['Make', 'Hallow brane'], ['MOC of Stand', 'SS 304'], ['Type', 'Submerged hollow fibre membrane'], ['Pore Size', '0.04 Micron'], ['Membrane Construction', 'R- PVDF']]
      },
      {
        id: '12', name: 'Sludge Transfer Pump', 
        specs: [['Quantity', '2 Nos'], ['Head', '10 M'], ['Motor', '1.0 HP'], ['Type', 'Monoblock'], ['Make', 'Kirloskar']]
      },
      {
        id: '13', name: 'Equipment Skid', 
        specs: [['Quantity', '1 No'], ['Model', 'SS 304'], ['Make', 'IAPL']]
      }
    ]
  },
  page11: {
    equipments: [
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
      },
      {
        id: '17', name: 'Electromagnetic flow meter', 
        specs: [['Quantity', '2 No'], ['Size', '11/2”'], ['Make', 'Flow measures']]
      },
      {
        id: '18', name: 'Solenoid valve', 
        specs: [['Interconnected Pipes, Fittings and Valves', '1 Lot'], ['Make', 'Aira/Equivalent'], ['MOC', 'CA'], ['Type', 'Diaphragm']]
      }
    ]
  },
  page12: {
    equipments: [
      {
        id: '19', name: 'PH Meter', 
        specs: [['Quantity', '1 No'], ['Make', 'ASTER'], ['Specification', '0-12'], ['MOC', 'SS304']]
      },
      {
        id: '20', name: 'CIP CUM BACK WASH TANK', 
        specs: [['Quantity', '1 No'], ['Make', 'KAVERI'], ['Specification', '1000 Ltr'], ['MOC', 'HDPE']]
      },
      {
        id: '21', name: 'UV System', 
        specs: [['Quantity', '1No'], ['Model', 'SS304, Tube type'], ['Capacity', '0-7500LPH'], ['Make', 'Alfa'], ['Power', '0.04']]
      },
      {
        id: '22', name: 'Rotameter', 
        specs: [['Quantity', '1 No.'], ['Capacity', '1000-10000 LPH'], ['Make', 'ASTER'], ['MOC', 'Acrylic']]
      }
    ]
  },
  page13: {
    title: 'CIVIL TANK DIMENSIONS',
    table: {
      headers: ['Sl. No', 'DETAILS', 'DIMENSION', 'MOC', 'SCOPE', 'VOLUME'],
      rows: [
        ['1.', 'Screen Chamber', '1.0m X 1.0m x 1.3m T.D', 'RCC', 'CLIENT', '1.3'],
        ['2.', 'Oil Trap Chamber', '1.0m X 2.0m x 1.3m T.D', 'RCC', 'CLIENT', '2.3'],
        ['3.', 'Collection Sump', '3.9 m X 3.9 m X 4.3m T.D', 'RCC', 'CLIENT', '65.4'],
        ['4.', 'ANOXIC Tank', '1.1 m X 3.0 m X 3.15 m T.D', 'MSFRP', 'IAPL', '10.39'],
        ['5.', 'MBR Tank', '4.23 m X 3.0 m X 3.15 m T.D', 'MSFRP', 'IAPL', '39.97'],
        ['6.', 'Treated Water Tank', '2.2 m x 2.2 m x 4.3 m T. D', 'RCC', 'IAPL', '20.81'],
        ['7.', 'Sludge Drying Bed', '1.0 m x 1.0 m x1.3 m T.D', 'BW/RCC', 'CLIENT', '2.6']
      ],
      total: '142.77'
    },
    electrical: {
      title: 'Electrical Load Details:',
      headers: ['S. No', 'Description', 'Op. Load KW', 'Tot. Load KW', 'Qty', 'Hrs', 'KWH/Day'],
      rows: [
        ['1', 'Raw Water Pump', '0.75', '3.0', '2 Nos', '20.0', '15.0'],
        ['2', 'MBR Feed Pump', '0.75', '3.0', '2 Nos', '20.0', '15.0'],
        ['3', 'Back Wash Pump', '0.75', '1.5', '1 Nos', '1.0', '0.75'],
        ['4', 'Air Blower with Motor', '3.75', '7.5', '2 Nos', '24.0', '90.0'],
        ['5', 'Sludge Transfer Pump', '0.75', '1.5', '2 Nos', '1.0', '0.75'],
        ['6', 'UV System', '0.04', '0.04', '1No', '20.0', '0.8'],
        ['7', 'Hypo Dosing System', '0.04', '0.04', '1No', '1.0', '0.04'],
        ['8', 'Chemical Dosing systems', '0.04', '0.04', '1No', '1.0', '0.04']
      ],
      total: '122.38',
      calc: '70% of Total Load: 85.67'
    }
  },
  page14: {
    title: 'OPERATING COST',
    rows: [
      ['1.', 'Power consumption cost per day', 'Rs. 857(At Rs. 10 per unit)'],
      ['2.', 'Chemical and Consumables per day', 'Rs 50'],
      ['3.', 'Total Cost per day', 'Rs. 907'],
      ['4.', 'Operating cost for Treating 1,0,000litres Sewage per day', 'Rs. 0.0091/ Liter (Rs. 9.1/ 1000 L)']
    ]
  },
  page15: {
    title: 'COMMERCIAL OFFER',
    priceTable: [['1.', 'The Price for Supply, Installation and commissioning of PACKAGED Sewage Treatment Plant Capacity of 100 KLD MBR', '34,30,000.00']],
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
  page16: {
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
BLANK_DATA.page2.recipientName = '';
BLANK_DATA.page2.recipientAddress = '';
BLANK_DATA.page15.priceTable[0][2] = '';

const CATEGORIES = [
  { id: 'client', name: 'CLIENT', icon: User, pages: ['page1', 'page2', 'page3'] },
  { id: 'technical', name: 'TECHNICAL', icon: Activity, pages: ['page4', 'page5', 'page6', 'page7'] },
  { id: 'tools', name: 'EQUIPMENT', icon: Package, pages: ['page8', 'page9', 'page10', 'page11', 'page12'] },
  { id: 'commercial', name: 'COMMERCIAL', icon: DollarSign, pages: ['page13', 'page14', 'page15', 'page16'] },
  { id: 'calculation', name: 'CALCULATION', icon: Activity, pages: ['calculation'] },
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





  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('intellect_aqua_proposal_last');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
      } catch (err) {
        console.error('Failed to load saved data', err);
      }
    }
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



  useEffect(() => {
    runCalculations(data);
  }, []);


  const runCalculations = (currentData) => {
    const calc = currentData.calculations;
    const newData = { ...currentData };

    // 1. Update Flow Rate in Page 4
    newData.page4.designParams.flow[1].value = `${calc.flowRate} KLD`;
    
    // 2. Tank Volumes & Dimensions
    const updateTank = (page, sectionIdx, tankKey, name) => {
      const tank = calc.tanks[tankKey];
      const vol = (tank.l * tank.w * tank.d).toFixed(2);
      newData[page].sections[sectionIdx].params[3][1] = `${tank.l}m X ${tank.w}m x ${tank.d}m`;
      if (newData[page].sections[sectionIdx].params[2][0] === 'Volume of the Tank') {
        newData[page].sections[sectionIdx].params[3][1] = `${vol} m3`;
        newData[page].sections[sectionIdx].params[4][1] = `${tank.l}m X ${tank.w}m x ${tank.d}m`;
      }
    };

    // Civil Table Page 13
    let totalVol = 0;
    const tankKeys = ['screen', 'oil', 'collection', 'anoxic', 'mbr', 'treated', 'sludge'];
    newData.page13.table.rows.forEach((row, i) => {
      const key = tankKeys[i];
      const tank = calc.tanks[key];
      const vol = (tank.l * tank.w * tank.d).toFixed(2);
      row[2] = `${tank.l}m X ${tank.w}m x ${tank.d}m T.D`;
      row[5] = vol;
      totalVol += parseFloat(vol);
    });
    newData.page13.table.total = totalVol.toFixed(2);

    // 3. Equipment Updates
    // Blower HP -> Page 9
    newData.page9.equipments[0].specs[3][1] = `${calc.blowerHP} HP`;
    const blowerKW = (calc.blowerHP * 0.746).toFixed(2);
    
    // Diffusers -> Page 10 (Fine Bubble)
    // Formula: Flow * 1.2 (Standard factor for air) / airPerDiffuser
    const diffuserCount = Math.ceil((calc.flowRate * 1.2) / calc.airPerDiffuser);
    newData.page10.equipments[0].specs[0][1] = `${diffuserCount} Nos`;

    // Membrane -> Page 10
    // Flux is 15 L/m2/h. Flow is KLD.
    const hourlyFlow = (calc.flowRate * 1000) / calc.operatingHours;
    const totalArea = Math.ceil(hourlyFlow / calc.membraneFlux);
    newData.page10.equipments[1].specs[0][1] = `${totalArea} sq m`;

    // 4. Electrical Load Details Page 13
    let totalLoad = 0;
    let totalKwh = 0;
    
    // Update Blower Load
    newData.page13.electrical.rows[3][2] = blowerKW;
    
    newData.page13.electrical.rows.forEach((row) => {
      const opLoad = parseFloat(row[2]);
      const qtyStr = row[4].split(' ')[0];
      const qty = parseInt(qtyStr) || 1;
      const hrs = parseFloat(row[5]);
      
      const totLoad = (opLoad * qty).toFixed(2);
      const kwh = (opLoad * hrs).toFixed(2);
      
      row[3] = totLoad;
      row[6] = kwh;
      
      totalLoad += parseFloat(totLoad);
      totalKwh += parseFloat(kwh);
    });
    
    newData.page13.electrical.total = totalKwh.toFixed(2);
    const seventyPercent = (totalKwh * 0.7).toFixed(2);
    newData.page13.electrical.calc = `70% of Total Load: ${seventyPercent}`;

    // 5. Operating Cost Page 14
    const powerCost = (totalKwh * 10).toFixed(0);
    newData.page14.rows[0][2] = `Rs. ${powerCost}`;
    const totalDayCost = parseInt(powerCost) + 50;
    newData.page14.rows[2][2] = `Rs. ${totalDayCost}`;
    const costPerLiter = (totalDayCost / (calc.flowRate * 1000)).toFixed(4);
    const costPer1000 = (costPerLiter * 1000).toFixed(2);
    newData.page14.rows[3][2] = `Rs. ${costPerLiter}/ Liter (Rs. ${costPer1000}/ 1000 L)`;

    setData(newData);
  };

  const updateData = (page, field, value) => {
    setData(prev => {
      const next = { ...prev, [page]: { ...prev[page], [field]: value } };
      return next;
    });
  };

  const updateCalculation = (path, value) => {
    setData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData.calculations;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = value;
      runCalculations(newData);
      return newData;
    });
  };



  // Auto-save logic
  useEffect(() => {
    if (data.settings.autoSave) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handleSave = async (isAuto = false) => {
    setSaveStatus('saving');
    const saveData = { ...data, updatedAt: new Date() };
    
    // Always update local collection for redundancy
    const localProposals = JSON.parse(localStorage.getItem('intellect_aqua_proposals_collection') || '[]');
    let updatedLocal;
    
    if (saveData._id) {
      updatedLocal = localProposals.map(p => p._id === saveData._id ? saveData : p);
    } else {
      // Generate a local ID if none exists
      saveData._id = `local_${Date.now()}`;
      updatedLocal = [saveData, ...localProposals];
      setData(saveData); // Update state with the new local ID
    }
    localStorage.setItem('intellect_aqua_proposals_collection', JSON.stringify(updatedLocal));
    localStorage.setItem('intellect_aqua_proposal_last', JSON.stringify(saveData));

    if (data.settings.storageMode === 'cloud') {
      try {
        const response = await fetch('/api/proposals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData),
        });
        
        const contentType = response.headers.get('content-type');
        if (!response.ok || !contentType || !contentType.includes('application/json')) {
          throw new Error('Cloud API not available');
        }

        const result = await response.json();
        if (result.id && !saveData._id.startsWith('local_')) {
          setData(prev => ({ ...prev, _id: result.id }));
        }
        
        setSaveStatus('saved');
        if (!isAuto) alert('Proposal saved to Cloud successfully!');
      } catch (err) {
        console.warn('Cloud save fallback to local:', err.message);
        setSaveStatus('saved');
        if (!isAuto) alert('Saved to Browser Storage (Cloud API currently unavailable).');
      }
    } else {
      setSaveStatus('saved');
      if (!isAuto) alert('Proposal saved to Browser Storage successfully!');
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const fetchHistory = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/proposals');
      const contentType = response.headers.get('content-type');
      
      if (response.ok && contentType && contentType.includes('application/json')) {
        const list = await response.json();
        setHistoryList(list);
      } else {
        // Fallback to local history
        const localData = localStorage.getItem('intellect_aqua_proposals_collection');
        if (localData) {
          setHistoryList(JSON.parse(localData));
        } else {
          const last = localStorage.getItem('intellect_aqua_proposal_last');
          if (last) setHistoryList([JSON.parse(last)]);
        }
      }
    } catch (err) {
      // Don't log if it's just a 404/fallback during local dev
      if (!isSyncing) console.error('Failed to fetch history', err);
    } finally {
      setIsSyncing(false);
    }
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
      setData(proposal);
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
      setData(JSON.parse(JSON.stringify(BLANK_DATA)));
      setActiveTab('page1');
      setActiveCategory(CATEGORIES[0]);
    }
  };



  const handleDownloadPDF = async () => {
    const element = document.querySelector('.preview-container');
    if (!element) return;

    setIsGeneratingPDF(true);

    const opt = {
      margin: 0,
      filename: `Intellect_Aqua_Proposal_${data.page1.client.split(' ')[0] || 'Studio'}.pdf`,
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
                            setData(item);
                            setTimeout(() => {
                              handleDownloadPDF();
                              setData(oldData);
                            }, 500);
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

