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
    flowRate: 84,           // KLD
    operatingHours: 20,      // hrs/day
    membraneModuleUnitCost: 25000, // ₹ per 20 sqm module
    blowerHP: 5.0,          // standard HP
    powerRate: 10,          // Rs per KWH unit
    taxMode: 'exclusive',   // 'inclusive' or 'exclusive'
    stpRatePerKLD: 23140,   // ₹ per KLD for STP price auto-calculation
    ocemsCost: 328600       // ₹ fixed cost for OCEMS
  },
  page1: {
    client: 'M/s. ANANYA SHELTERS PRIVATE LIMITED,',
    address: 'COIMBATORE.',
    site: 'HOTEL@ KAVUNDAMPALAYAM',
    project: 'STP 84 KLD',
    technology: 'MBR – PACKAGED',
    proposalPrefix: 'APL/QT/ANN/STP/',
    proposalNo: '9665R4',
    date: 'APRIL 25, 2026'
  },
  page2: {
    subject: 'Techno-Commercial Proposal for 50 KLD MBR Based Civil STP - Reg.',
    salutation: 'Dear Sir,',
    kindAttn: 'Mr. Praveen R, Associate Director',
    body: '<p>With reference to your enquiry, we are pleased to submit our <strong>Techno-Commercial Proposal for the design, engineering, construction of civil structures, supply, erection, testing, and commissioning of a 50 KLD Sewage Treatment Plant (STP) based on MBR (Membrane Bioreactor) technology</strong>, proposed to be installed at your site.</p><p>Intellect Aqua Private Limited has proven expertise in executing <strong>compact, high-efficiency MBR-based STPs with integrated civil and electro-mechanical works</strong>, designed to meet <strong>CPCB / TNPCB discharge norms</strong> and site-specific requirements. The proposed system ensures <strong>superior treated water quality, minimal footprint, odour-free operation, low sludge generation, and consistent performance</strong>, making it ideal for reuse applications such as flushing, gardening, and utility purposes.</p><p>Our solution is engineered with a focus on <strong>robust civil construction, optimized hydraulic design, reliable MBR membrane performance, automation-ready operation, and long-term operational stability,</strong> resulting in <strong>lower life-cycle costs and ease of maintenance</strong>.</p><p>We are confident that our <strong>end-to-end execution capability, quality workmanship, and competitive commercial offering</strong> will add measurable value to your project. We trust that our proposal will meet your expectations and look forward to the opportunity of receiving your valued order.</p><p>For any further clarification or for detailed technical or commercial discussions, our team would be pleased to meet you at your convenience.</p><p>Thanking you and assuring you of our <strong>best services, prompt support, and a long-term professional partnership.</strong></p>',
    signatoryName: 'Rtn. BOOPATHI S.P',
    signatoryTitle: 'Chief Managing Director',
    signatoryPhone: '+91 95973 17861 / 95850 75552',
    executiveName: 'praveen',
    executiveRole: 'Executive',
    executivePhone: ''
  },
  page3: {
    title: 'ABOUT INTELLECT - STP',
    content: "Intellect Aqua proposes a state-of-the-art Sewage Treatment Plant (STP) based on Membrane BioReactor (MBR) technology, designed to achieve high-quality treated water suitable for reuse and safe discharge as per Pollution Control Board norms. The MBR system integrates biological treatment with advanced membrane filtration, ensuring effective removal of suspended solids, organic matter, and pathogens. This compact, fully automatic system provides consistent performance with minimal operator attention, low footprint, and reduced sludge generation. Our design ensures reliable operation, ease of maintenance, and long-term efficiency—making it an ideal solution for residential, commercial, and industrial wastewater treatment applications.",
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
    ],
    benefitsTitle: 'Benefits of MBR Technology',
    benefits: [
      { title: "Consistent Effluent Quality", desc: "Meets and exceeds Pollution Control Board norms even under fluctuating load conditions." },
      { title: "Water Reuse & Conservation", desc: "Treated water can be reused, reducing freshwater dependency." },
      { title: "Reduced Footprint", desc: "Ideal for projects with limited space such as apartments, hotels, hospitals, and industries." },
      { title: "Environmentally Sustainable", desc: "Promotes eco-friendly wastewater management and resource recovery." },
      { title: "Long-Term Reliability", desc: "Proven technology with stable performance and reduced downtime." }
    ],
    assumptions: []
  },
  page4: {
    title: 'DESIGN PARAMETERS:',
    assumptionsTitle: 'ASSUMPTIONS:',
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
    exclusions: [],
    notes: [],
    sections: [
      {
        name: 'Screen Chamber:',
        hidden: false,
        params: [
          ['Normal flow designed', '5.0m³/hr.', '', ''],
          ['No. of Screen Chamber', 'One', '', ''],
          ['Angle of Inclination', '45°', '', ''],
          ['Size Of the screen chamber', '1.0m X 1.0m x 1.3m', '', ''],
          ['MOC of screen chamber', 'RCC', '', '']
        ]
      },
      {
        name: 'Oil Trap Chamber:',
        params: [
          ['Normal flow designed', '5.0m³/hr.'],
          ['Size Of the oil & Grease chamber', '1.0m X 2.0m x 1.3m'],
          ['No Of Tanks', 'One'],
          ['MOC of chamber', 'RCC']
        ]
      },
      {
        name: 'Collection Tank:',
        params: [
          ['Normal Flow Designed', '5.0m³/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '12 Hrs.'],
          ['Volume of the Tank', '60 m³'],
          ['Size Of the Tank', '3.9m X 3.9m x 4.3m'],
          ['MOC', 'RCC']
        ]
      }
    ]
  },
  page6: {
    exclusions: [],
    notes: [],
    sections: [
      {
        name: 'ANOXIC Tank:',
        params: [
          ['Normal Flow Designed', '3.0m³/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '3 Hrs.'],
          ['Volume of the Tank', '9.00 m³'],
          ['Size Of the Tank', '0.75m X 3.0m x 4.3m'],
          ['MOC', 'MSFRP']
        ]
      },
      {
        name: 'Aeration Tank:',
        params: [
          ['Normal Flow Designed', '3.0m³/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8 Hrs.'],
          ['Volume of the Tank', '24.00 m³'],
          ['Size Of the Tank', '2.00m X 3.0m x 4.3m'],
          ['MOC', 'MSFRP']
        ]
      },
      {
        name: 'MBR Tank:',
        params: [
          ['Normal Flow Designed', '3.0m³/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8 Hrs.'],
          ['Volume of the Tank', '24.00 m³'],
          ['Size Of the Tank', '2.00m X 3.0m x 4.3m'],
          ['MOC', 'MSFRP']
        ]
      },
      {
        name: 'Treated Water Tank:',
        params: [
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8 Hrs.'],
          ['Volume of the Tank', '24.00 m³'],
          ['Size Of the Tank', '2.00m X 3.0m x 4.3m'],
          ['MOC of Treated Water Tank', 'RCC']
        ]
      }
    ]
  },
  page7: {
    exclusions: [],
    notes: [],
    sections: [
      {
        name: 'Sludge Holding Tank:',
        params: [
          ['Normal flow designed', '3.0m³/hr.'],
          ['No. of Tanks', 'ONE'],
          ['Retention Time', '8 Hrs.'],
          ['Volume of the Tank', '24.00 m³'],
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
    title: 'CIVIL AND MS DIMENSIONS',
    specialNote: 'If the client opts for RCC construction, all civil works shall be under the client’s scope.',
    table: {
      headers: ['S.No', 'Description', 'Size (M)', 'Quantity', 'Type', 'Scope', 'Volume m³'],
      rows: [
        ['1.', 'SCREEN CHAMBER', '2.3 m X 1.1 m x 0.6m T.D', '1No', 'RCC', 'Client', '1.50'],
        ['2.', 'OIL TRAP CHAMBER', '2.3 m X 1.7 m x 0.6 T.D', '1No', 'RCC', 'Client', '2.40'],
        ['3.', 'PRE-COLLECTION TANK', '3.7 m X 2.5 m X 1.4m T.D', '1No', 'RCC', 'Client', '10.60'],
        ['4.', 'FLOCULLATION TANK', '2.0 m X 1.2 m X 0.3m T.D', '1No', 'RCC', 'Client', '0.72'],
        ['5.', 'PRIMARY SETTLING TANK', '1.2 m X 3.1 m X 1.4m T.D', '1No', 'RCC', 'Client', '4.30'],
        ['6.', 'COLLECTION TANK', '4.2 m X 3.5 m X 2.2m T.D', '1No', 'RCC', 'Client', '28.10'],
        ['7.', 'ANOXIC TANK', '4.2 m X 2.3 m X 2.2 m T.D', '1No', 'RCC', 'Client', '11.80'],
        ['8.', 'AERATION TANK', '2.6 m X 4.8 m X 2.2 m T.D', '1No', 'RCC', 'Client', '21.40'],
        ['9.', 'MBR TANK', '2.6 m X 2.1 m X 2.2 m T.D', '1No', 'RCC', 'Client', '10.30']
      ],
      total: '91.12'
    },
    electrical: {
      title: 'ELECTRICAL LOAD DETAILS (CONNECTED LOAD)',
      headers: ['S.No', 'Description', 'Op. Load (kW)', 'Conn. Load (kW)', 'Qty', 'Run Hrs', 'kWh/Day'],
      rows: [
        ['1.', 'Raw Water Pump (PreCollection to Flocculation Chamber)', '0.375', '0.75', '2Nos', '20.0', '7.5'],
        ['2.', 'Raw Water Pump (Collection Tank to Anoxic Tank)', '0.75', '1.5', '2 Nos', '20.0', '15.0'],
        ['3.', 'MBR Feed Pump', '0.75', '1.5', '2Nos', '20.0', '15.0'],
        ['4.', 'Back Wash Pump', '0.75', '1.5', '2Nos', '1.0', '0.75'],
        ['5.', 'Air Blower with Motor', '3.75', '7.5', '2Nos', '24.0', '90.0'],
        ['6.', 'RAS Pump', '0.75', '0.75', '2 Nos', '1.0', '0.75'],
        ['7.', 'UV System', '0.04', '0.04', '1No', '20.0', '0.8'],
        ['8.', 'Sludge Transfer pump', '0.375', '0.75', '2Nos', '1.0', '0.375'],
        ['9.', 'Chemical Dosing systems', '0.04', '0.12', '3Nos', '20.0', '2.4'],
        ['10.', 'Agitator For Anoxic Tank', '1.1', '1.1', '1 No', '20.0', '22.0'],
        ['11.', 'Mechanical Screen Chamber', '1.5', '1.5', '1 No', '20.0', '30.0'],
        ['12.', 'Oil Skimmer', '0.375', '0.75', '2 Nos', '20.0', '15.0'],
        ['13.', 'Screw press', '0.375', '0.375', '1 No', '1.0', '0.375']
      ],
      total: '199.95',
      calc: '70% Demand Factor: 139.9 kWh/Day | Total installed: 199.95 kWh/Day'
    }
  },
  pageCost: {
    title: 'OPERATING COST',
    headers: ['S. No', 'Description', 'Cost per day'],
    rows: [
      { id: '1', name: 'Power consumption cost per day', value: 'Rs. 1399 (At Rs. 10 per unit)' },
      { id: '2', name: 'Chemical and Consumables per day', value: 'Rs. 100' },
      { id: '3', name: 'Total Cost per day', value: 'Rs. 1499' },
      { id: '4', name: 'Operating cost for treating 50,000 litres sewage per day', value: '1499 / 50000\nCalculated Results\nRs. 0.0299 / Liter\nRs. 29.9 / 1000 L' }
    ]
  },
  pageCommercial: {
    title: 'COMMERCIAL OFFER',
    _cv: '2', // commercial version — bump this to force-reset stale saved amounts
    // item1Desc: KLD will be auto-synced by runCalculations
    item1Desc: 'The Price for Supply, Installation and Commissioning of Conventional Sewage Treatment Plant Capacity of 50 KLD MBR – Hollowbrane Membrane',
    item1Amount: 2314000,  // raw number (23,14,000)
    item2Desc: 'The Price for Supply, Installation of OCEMS – 1 No\nMake: Aster',
    item2Amount: 328600,   // raw number (3,28,600)
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
  pageProcessFlow: {
    title: 'PROCESS FLOW DIAGRAM',
    imagePath: '/assets/STP MBR 2.jpg'
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
BLANK_DATA.pageCommercial.item1Amount = 0;
BLANK_DATA.pageCommercial.item2Amount = 0;

const CATEGORIES = [
  { id: 'client', name: 'CLIENT', icon: User, pages: ['page1', 'page2', 'page3'] },
  { id: 'technical', name: 'TECHNICAL', icon: Activity, pages: ['page4', 'page5', 'page6', 'page7', 'pageProcessFlow'] },
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
        // Only reset page3 (static feature/benefit content) — page1/page2 KLD sync
        // is handled by runCalculations() automatically
        baseData.page3 = INITIAL_DATA.page3;
        // Ensure calculations object exists
        if (!baseData.calculations) baseData.calculations = INITIAL_DATA.calculations;

        // ── Migrate / ensure calculations has new fields ────────────────────
        if (!baseData.calculations) baseData.calculations = INITIAL_DATA.calculations;
        if (baseData.calculations.stpRatePerKLD === undefined)
          baseData.calculations.stpRatePerKLD = INITIAL_DATA.calculations.stpRatePerKLD;
        if (baseData.calculations.ocemsCost === undefined)
          baseData.calculations.ocemsCost = INITIAL_DATA.calculations.ocemsCost;

        // ── Remove legacy Flow rate (m³/hr) from Page 4 ──────────────────────
        if (baseData.page4 && baseData.page4.designParams && baseData.page4.designParams.flow) {
          baseData.page4.designParams.flow = baseData.page4.designParams.flow.filter(fp => {
            const lbl = (fp.label || '').toLowerCase();
            return !lbl.includes('m\u00b3/hr') && !lbl.includes('m3/hr');
          });
        }

        // ── Fix Degree and M3 symbols globally in saved data ────────────────
        const fixSymbols = (obj) => {
          if (typeof obj === 'string') {
            return obj.replace(/450/g, '45°').replace(/m3/g, 'm³');
          }
          if (Array.isArray(obj)) {
            return obj.map(fixSymbols);
          }
          if (obj !== null && typeof obj === 'object') {
            const newObj = {};
            for (const key in obj) {
              newObj[key] = fixSymbols(obj[key]);
            }
            return newObj;
          }
          return obj;
        };
        baseData = fixSymbols(baseData);

        // ── Migrate old commercialData/priceTable → new item1/item2 structure ──
        if (baseData.pageCommercial) {
          if (baseData.pageCommercial.item1Desc === undefined)
            baseData.pageCommercial.item1Desc = INITIAL_DATA.pageCommercial.item1Desc;
          if (baseData.pageCommercial.item2Desc === undefined)
            baseData.pageCommercial.item2Desc = INITIAL_DATA.pageCommercial.item2Desc;
          // Always let runCalculations recompute amounts — remove stale values
          delete baseData.pageCommercial.item1Amount;
          delete baseData.pageCommercial.item2Amount;
          // Remove stale legacy keys
          delete baseData.pageCommercial.commercialData;
          delete baseData.pageCommercial.priceTable;
          delete baseData.pageCommercial._cv;
        }
        // ── Unify Civil/Electrical Titles ──────────────────────────────────
        if (baseData.pageCivil) {
          baseData.pageCivil.title = 'CIVIL AND MS DIMENSIONS';
          if (!baseData.pageCivil.specialNote) {
            baseData.pageCivil.specialNote = INITIAL_DATA.pageCivil.specialNote;
          }
          if (baseData.pageCivil.table && baseData.pageCivil.table.headers) {
            if (baseData.pageCivil.table.headers.includes('Dimensions (L×B×H)')) {
              baseData.pageCivil.table = INITIAL_DATA.pageCivil.table;
            }
          }
          if (baseData.pageCivil.electrical) {
            baseData.pageCivil.electrical.title = 'ELECTRICAL LOAD DETAILS (CONNECTED LOAD)';
            // Migration: Reset electrical table if it has old column count (6)
            if (baseData.pageCivil.electrical.headers.length < 7) {
              baseData.pageCivil.electrical = INITIAL_DATA.pageCivil.electrical;
            }
          }
        }
        // ── Migrate Screen Chamber extra column ──────────────────────────────
        if (baseData.page5 && baseData.page5.sections && baseData.page5.sections[0] && baseData.page5.sections[0].name.toLowerCase().includes('screen chamber')) {
          baseData.page5.sections[0].params.forEach(p => {
            if (p.length < 4) p.push('');
          });
          if (baseData.page5.sections[0].hidden === undefined) {
            baseData.page5.sections[0].hidden = false;
          }
        }
        ['page5', 'page6', 'page7'].forEach(p => {
          if (baseData[p]) {
            if (!baseData[p].exclusions) baseData[p].exclusions = [];
            if (!baseData[p].notes) baseData[p].notes = [];
          }
        });

        // Restore equipments if they were accidentally removed or migrated to sections previously
        ['page8', 'page9', 'page10', 'page11', 'page12', 'page13'].forEach(p => {
          if (baseData[p] && !baseData[p].equipments) {
            baseData[p].equipments = INITIAL_DATA[p].equipments;
          }
        });
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

    // ============================================================
    // ALWAYS sync KLD to page4 design parameters table
    // ============================================================
    if (newData.page4?.designParams?.flow) {
      newData.page4.designParams.flow.forEach(fp => {
        const lbl = fp.label.toLowerCase();
        if (lbl.includes('flow rate') && lbl.includes('kld')) {
          fp.value = `${KLD} KLD`;
        } else if (lbl.includes('operating hour')) {
          fp.value = `${opHrs} Hours`;
        }
      });
    }

    // ============================================================
    // ALWAYS sync KLD to page1 project name (replace numeric KLD)
    // ============================================================
    if (newData.page1?.project !== undefined) {
      newData.page1.project = newData.page1.project.replace(/(\d+\.?\d*)\s*KLD/i, `${KLD} KLD`);
    }

    // ============================================================
    // ALWAYS sync KLD to page2 subject line
    // ============================================================
    if (newData.page2?.subject !== undefined) {
      newData.page2.subject = newData.page2.subject.replace(/(\d+\.?\d*)\s*KLD/gi, `${KLD} KLD`);
    }

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
      // --- Tank Sizing Logic (Calculate target volumes) ---
      const calcV = (rt) => flow * rt;
      const targets = [
        { name: 'SCREEN CHAMBER', vol: 2.02 },
        { name: 'OIL TRAP CHAMBER', vol: 2.02 },
        { name: 'PRE-COLLECTION TANK', vol: calcV(12) * 0.4 },
        { name: 'FLOCULLATION TANK', vol: 0.72 },
        { name: 'PRIMARY SETTLING TANK', vol: calcV(3) },
        { name: 'COLLECTION TANK', vol: calcV(12) },
        { name: 'ANOXIC TANK', vol: calcV(3) },
        { name: 'AERATION TANK', vol: calcV(8) },
        { name: 'MBR TANK', vol: calcV(8) }
      ];

      // Auto-update existing rows in the dynamic civil table
      if (newData.pageCivil.table && newData.pageCivil.table.rows) {
        newData.pageCivil.table.rows.forEach(row => {
          // Safety check: handle both object {name} and legacy array [sno, name, ...]
          const rowName = row.name || (Array.isArray(row) ? row[1] : null);
          if (!rowName) return;

          const target = targets.find(t => rowName.toUpperCase().includes(t.name.toUpperCase()));
          if (target) {
            row.vol = parseFloat(target.vol.toFixed(2));
            const B = 3.0, H = 4.3;
            if (rowName.toUpperCase().includes('TANK') && !rowName.toUpperCase().includes('SCREEN') && !rowName.toUpperCase().includes('OIL')) {
              const L = row.vol / (B * H);
              const dimStr = `${L.toFixed(2)} m X ${B} m X ${H} m`;
              if (Array.isArray(row)) row[2] = dimStr;
              else row.dimStr = dimStr;
            }
          }
        });
      }

      // Process Design Pages (5–7)
      const flowStr = `${flow.toFixed(2)} m³/hr`;
      const updSection = (page, idx, name, params) => {
        const s = newData[page]?.sections?.[idx];
        if (!s) return;
        s.params.forEach(p => {
          const lbl = p[0].toLowerCase();
          if (lbl.includes('normal flow')) p[1] = flowStr;
          if (params.size && lbl.includes('size of')) p[1] = params.size;
          if (params.vol && lbl.includes('volume of the tank')) p[1] = params.vol;
        });
      };

      const getTank = (n) => {
        const r = (newData.pageCivil.table.rows || []).find(t => {
          const rowName = Array.isArray(t) ? t[1] : (t.name || null);
          return rowName && rowName.toUpperCase().includes(n.toUpperCase());
        });
        if (!r) return { dimStr: '', vol: '0' };
        if (Array.isArray(r)) {
          return { dimStr: r[2], vol: r[6] };
        }
        return r;
      };
      const fmtT = (t) => t.dimStr || '';

      updSection('page5', 0, 'SCREEN CHAMBER', { size: fmtT(getTank('SCREEN')) });
      updSection('page5', 1, 'OIL TRAP', { size: fmtT(getTank('OIL')) });
      updSection('page5', 2, 'COLLECTION', { size: fmtT(getTank('COLLECTION')), vol: `${getTank('COLLECTION').vol} m³` });
      updSection('page6', 0, 'ANOXIC', { size: fmtT(getTank('ANOXIC')), vol: `${getTank('ANOXIC').vol} m³` });
      updSection('page6', 1, 'AERATION', { size: fmtT(getTank('AERATION')), vol: `${getTank('AERATION').vol} m³` });
      updSection('page6', 2, 'MBR', { size: fmtT(getTank('MBR')), vol: `${getTank('MBR').vol} m³` });
      updSection('page6', 3, 'PRIMARY', { size: fmtT(getTank('PRIMARY')), vol: `${getTank('PRIMARY').vol} m³` });
      updSection('page7', 0, 'PRE-COLLECTION', { size: fmtT(getTank('PRE-COLLECTION')), vol: `${getTank('PRE-COLLECTION').vol} m³` });

      // ── RECALCULATE CIVIL TOTAL VOLUME ────────────────────────────────────
      if (newData.pageCivil && newData.pageCivil.table) {
        const totalVol = newData.pageCivil.table.rows.reduce((sum, r) => sum + (parseFloat(r[6]) || 0), 0);
        newData.pageCivil.table.total = totalVol.toFixed(2);
      }

      // ── MEMBRANE (LMH flux = 15, 20 sqm modules) ──────────────────────────
      const requiredMemSqm = (flow * 1000) / 15;
      const numberOfModules = Math.ceil(requiredMemSqm / 20);
      const totalMembraneSqm = numberOfModules * 20;

      // ── BLOWER (Excel CEILING formula) ─────────────────────────────────────
      const aerationVol = getTank('AERATION').vol || 0;
      const mbrVol = getTank('MBR').vol || 0;
      const equalizationVol = getTank('COLLECTION').vol || 0;
      const rawBlowerCap = (aerationVol + mbrVol + equalizationVol) * 1.1;
      const blowerCapacity = Math.ceil(rawBlowerCap / 10) * 10; // CEILING to nearest 10 m³

      const getBlowerHP = (cap) => {
        if (cap <= 10) return 1;
        if (cap <= 30) return 1.5;
        if (cap <= 40) return 2;
        if (cap <= 50) return 2;
        if (cap <= 90) return 3;
        if (cap <= 140) return 5;
        if (cap <= 200) return 7.5;
        if (cap <= 300) return 10;
        return 12.5;
      };
      const blowerHP = getBlowerHP(blowerCapacity);

      // ── PUMP HP (Excel IF formula) ─────────────────────────────────────────
      const getPumpHP = (f) => {
        if (f < 7) return 1.0;
        if (f <= 10) return 1.5;
        return 2.0;
      };
      const pumpHP = getPumpHP(flow);

      // ── DIFFUSERS ──────────────────────────────────────────────────────────
      const mbrAirFlowM3Hr = totalMembraneSqm * 0.2;
      const aerationAirFlowM3Hr = (getTank('AERATION').vol || 0) * 0.5;
      const coarseDiffusers = Math.ceil(mbrAirFlowM3Hr / 3.8);
      const fineDiffusers = Math.ceil(aerationAirFlowM3Hr / 2.5);

      // ── UPDATE EQUIPMENT PAGES ─────────────────────────────────────────────
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
      updateEquipment('Air Blower', [['Capacity', `${blowerCapacity} m³`], ['Motor', `${blowerHP} HP`]]);
      updateEquipment('MBR Membrane', [['Quantity', `${numberOfModules} Nos × 20 m² = ${totalMembraneSqm} m² (Hollowbrane, Submerged Hollow Fibre, 0.06 Micron, R-PVDF)`]]);
      updateEquipment('Coarse Bubble', [['Quantity', `${coarseDiffusers} Nos`]]);
      updateEquipment('Fine Bubble', [['Quantity', `${fineDiffusers} Nos`]]);

      // Store computed HP/cap for electrical section below (avoid re-reading equipment pages)
      newData._computed = { pumpHP, blowerHP, blowerCapacity };
    }

    // ── ELECTRICAL (always recomputed from formula inputs) ──────────────────
    const computed = newData._computed || {};
    const pumpHPe = computed.pumpHP || 1.0;
    const blowerHPe = computed.blowerHP || 5;

    // ── ELECTRICAL LOAD CALCULATION (Page Civil) ─────────────────────────────
    let demand70 = 0;
    if (newData.pageCivil && newData.pageCivil.electrical) {
      const elec = newData.pageCivil.electrical;
      // Ensure headers match the 7-column layout
      elec.headers = ['S.No', 'Description', 'Op. Load (kW)', 'Conn. Load (kW)', 'Qty', 'Run Hrs', 'kWh/Day'];
      
      // Recalculate each row's kWh/Day: Op. Load * Run Hrs
      elec.rows.forEach(r => {
        const opKW = parseFloat(r[2]) || 0;
        const runHrs = parseFloat(r[5]) || 0;
        r[6] = (opKW * runHrs).toFixed(2);
      });

      const totalOpLoad = elec.rows.reduce((sum, r) => sum + (parseFloat(r[2]) || 0), 0);
      const totalConnLoad = elec.rows.reduce((sum, r) => sum + (parseFloat(r[3]) || 0), 0);
      const totalKWhDay = elec.rows.reduce((sum, r) => sum + (parseFloat(r[6]) || 0), 0);
      demand70 = totalKWhDay * 0.70;
      
      elec.totalOpLoad = totalOpLoad.toFixed(2);
      elec.totalConnLoad = totalConnLoad.toFixed(3);
      elec.total = totalKWhDay.toFixed(2);
      elec.calc = `70% Demand Factor: ${demand70.toFixed(1)} kWh/Day | Total installed: ${totalKWhDay.toFixed(2)} kWh/Day`;
      newData.pageCivil.electrical.demandFactor = demand70;
    }

    // ── OPERATING COST ───────────────────────────────────────────────────────
    const powerRate = calc.powerRate || 10;   // ₹ per unit
    const chemCostPerDay = calc.chemCost || 100;
    const powerCostPerDay = demand70 * powerRate;
    const totalCostPerDay = powerCostPerDay + chemCostPerDay;
    const costPerLitre = totalCostPerDay / (KLD * 1000);

    const powerValueStr = `Rs. ${Math.round(powerCostPerDay)}(At Rs. ${powerRate} per unit)`;
    const chemValueStr = `Rs. ${chemCostPerDay}`;
    const totalValueStr = `Rs. ${Math.round(totalCostPerDay)}`;
    const treatmentLabel = `Operating cost for Treating ${(KLD * 1000).toLocaleString()} litres Sewage per day`;
    const treatmentValue = `= ${Math.round(totalCostPerDay)}/${(KLD * 1000)}\nRs. ${costPerLitre.toFixed(4)}/ Liter\nRs. ${(costPerLitre * 1000).toFixed(1)}/ 1000 L`;

    if (!newData.pageCost) newData.pageCost = JSON.parse(JSON.stringify(INITIAL_DATA.pageCost));
    
    if (newData.pageCost) {
      const standardRows = [
        { id: '1', name: 'Power consumption cost per day', value: powerValueStr },
        { id: '2', name: 'Chemical And Consumables per day', value: chemValueStr },
        { id: '3', name: 'Total Cost per day', value: totalValueStr },
        { id: '4', name: treatmentLabel, value: treatmentValue }
      ];

      const customRows = (newData.pageCost.rows || []).filter(row => {
        const n = (row.name || '').toLowerCase().trim();
        const v = (row.value || '').toLowerCase().trim();
        if (!n && !v) return false;
        if (n.includes('power consumption') || n.includes('chemical') || n.includes('total cost') || n.includes('treating')) return false;
        return true;
      });

      newData.pageCost.rows = [...standardRows, ...customRows];
    }

    // --- Commercial Offer — sync KLD into item1 description AND recalculate amounts ---
    if (newData.pageCommercial.item1Desc !== undefined) {
      newData.pageCommercial.item1Desc = newData.pageCommercial.item1Desc.replace(
        /(\d+\.?\d*)\s*KLD/i,
        `${KLD} KLD`
      );
    }
    // Auto-compute STP price from rate × KLD (rounds to nearest ₹100)
    const stpRate = calc.stpRatePerKLD || 23140;
    newData.pageCommercial.item1Amount = Math.round((KLD * stpRate) / 100) * 100;
    // Auto-sync OCEMS fixed cost
    if (calc.ocemsCost !== undefined) {
      newData.pageCommercial.item2Amount = calc.ocemsCost;
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
            recalculateData={(newData) => setData(runCalculations(newData, false, false))}
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

