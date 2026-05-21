import React, { useState } from 'react';
import { 
  Plus, Trash2, RefreshCcw, DollarSign, Activity, Package, ChevronDown, ChevronRight
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.css';

const modules = {
  toolbar: [
    ['bold', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean']
  ],
};

const Editor = ({ activeTab, data, updateData, setData, updateCalculation, recalculateData }) => {
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleCollapse = (key) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (page, field, value) => {
    if (JSON.stringify(data[page][field]) === JSON.stringify(value)) return;
    updateData(page, field, value);
  };

  const handleCalcChange = (path, value) => {
    updateCalculation(path, value);
  };

  const handleTableChange = (section, index, field, value) => {
    const newData = { ...data };
    newData.page4.designParams[section][index][field] = value;

    // Intercept flow parameter changes to update calculations directly
    if (section === 'flow' && field === 'value') {
      const parsedValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsedValue)) {
        const label = newData.page4.designParams[section][index].label.toLowerCase();
        if (label.includes('flow rate') || label === 'flow') {
          // They edited the KLD!
          updateCalculation('flowRate', parsedValue);
          return;
        } else if (label.includes('operating hours')) {
          updateCalculation('operatingHours', parsedValue);
          return;
        }
      }
    }

    if (data.page4.designParams[section][index][field] === value) return;
    setData(newData);
  };

  const handleAssumptionChange = (index, value) => {
    const newData = { ...data };
    newData.page4.assumptions[index] = value;
    setData(newData);
  };

  const handleComplexSectionChange = (page, sectionIndex, paramIndex, fieldIndex, value) => {
    const newData = { ...data };
    newData[page].sections[sectionIndex].params[paramIndex][fieldIndex] = value;
    if (recalculateData) recalculateData(newData);
    else setData(newData);
  };

  const handleEquipmentChange = (page, equipIndex, specIndex, fieldIndex, value) => {
    const newData = { ...data };
    newData[page].equipments[equipIndex].specs[specIndex][fieldIndex] = value;
    if (recalculateData) recalculateData(newData);
    else setData(newData);
  };

  const handleGenericArrayChange = (page, field, index, value) => {
    const newData = { ...data };
    newData[page][field][index] = value;
    setData(newData);
  };

  const handleNestedTableChange = (page, field, rowIdx, colIdx, value) => {
    const newData = { ...data };
    newData[page][field].rows[rowIdx][colIdx] = value;
    setData(newData);
  };

  return (
    <div className="editor-content">
      {activeTab === 'page1' && (

        <div className="editor-group">
          <label>Client Name</label>
          <input type="text" value={data.page1.client} onChange={(e) => handleChange('page1', 'client', e.target.value)} />
          <label>Address</label>
          <textarea value={data.page1.address} onChange={(e) => handleChange('page1', 'address', e.target.value)} />
          <label>PO Site</label>
          <input type="text" value={data.page1.site || ''} onChange={(e) => handleChange('page1', 'site', e.target.value)} />
          <label>Project Name</label>
          {/* Smart KLD editor: prefix | KLD number stepper | suffix */}
          {(() => {
            const proj = data.page1.project || '';
            // Split on the KLD number: e.g. "STP 60 KLD" => prefix="STP ", kld=60, suffix=" KLD"
            const match = proj.match(/^(.*?)(\d+\.?\d*)\s*(KLD.*)$/i);
            const prefix = match ? match[1] : proj;
            const kldNum = match ? parseFloat(match[2]) : (data.calculations?.flowRate || 100);
            const suffix = match ? ' ' + match[3] : ' KLD';

            const handleKLDChange = (newVal) => {
              const n = parseFloat(newVal);
              if (!isNaN(n) && n > 0) {
                // This updates ALL pages via the calculation engine
                handleCalcChange('flowRate', n);
              }
            };

            return (
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '0', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(15,23,42,0.6)' }}>
                {/* Prefix text */}
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => {
                    // Update just the text prefix, keep KLD number from calc engine
                    const newProj = e.target.value + kldNum + suffix;
                    handleChange('page1', 'project', newProj);
                  }}
                  title="Edit prefix text (e.g. 'STP ')"
                  style={{ flex: 1, background: 'transparent', border: 'none', borderRight: '1px solid rgba(255,255,255,0.12)', borderRadius: 0, padding: '8px 10px', color: 'white', outline: 'none', minWidth: '40px' }}
                />
                {/* KLD Number stepper — this drives ALL pages */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(14,165,233,0.12)', borderRight: '1px solid rgba(255,255,255,0.12)' }}>
                  <button
                    onClick={() => handleKLDChange(kldNum + 1)}
                    title="Increase KLD"
                    style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px 10px', fontSize: '10px', lineHeight: 1, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                  >▲</button>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={kldNum}
                    onChange={(e) => handleKLDChange(e.target.value)}
                    title="Plant Capacity KLD — changes ALL pages"
                    style={{ width: '64px', background: 'transparent', border: 'none', textAlign: 'center', color: '#38bdf8', fontWeight: '800', fontSize: '1.1rem', padding: '4px 2px', outline: 'none', appearance: 'textfield', MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                  />
                  <button
                    onClick={() => handleKLDChange(Math.max(1, kldNum - 1))}
                    title="Decrease KLD"
                    style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px 10px', fontSize: '10px', lineHeight: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}
                  >▼</button>
                </div>
                {/* Suffix text */}
                <input
                  type="text"
                  value={suffix.trim()}
                  onChange={(e) => {
                    const newProj = prefix + kldNum + ' ' + e.target.value;
                    handleChange('page1', 'project', newProj);
                  }}
                  title="Edit suffix text (e.g. 'KLD')"
                  style={{ flex: 1, background: 'transparent', border: 'none', borderRadius: 0, padding: '8px 10px', color: 'white', outline: 'none', minWidth: '40px' }}
                />
              </div>
            );
          })()}
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', marginBottom: '4px' }}>
            ⚡ Changing the <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>KLD number</span> updates all pages (Page 4, Design Parameters, Commercial, Costs, etc.)
          </div>
          <label>Technology</label>
          <input type="text" value={data.page1.technology} onChange={(e) => handleChange('page1', 'technology', e.target.value)} />
          <label>Proposal No</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" value={data.page1.proposalPrefix !== undefined ? data.page1.proposalPrefix : 'IAPL/QT/AAC/ STP/'} onChange={(e) => handleChange('page1', 'proposalPrefix', e.target.value)} style={{ flex: 2 }} />
            <input type="text" value={data.page1.proposalNo} onChange={(e) => handleChange('page1', 'proposalNo', e.target.value)} style={{ flex: 1 }} />
          </div>
          <label>Date</label>
          <input type="text" value={data.page1.date} onChange={(e) => handleChange('page1', 'date', e.target.value)} />
        </div>
      )}

      {activeTab === 'page2' && (
        <div className="editor-group">
          <label>Subject</label>
          <ReactQuill
            theme="snow"
            value={data.page2.subject}
            onChange={(value) => handleChange('page2', 'subject', value)}
            modules={modules}
            className="quill-editor" />
          <label>Kind Attn</label>
          <input type="text" value={data.page2.kindAttn || ''} onChange={(e) => handleChange('page2', 'kindAttn', e.target.value)} />
          <label>Body Content</label>
          <ReactQuill
            theme="snow"
            value={data.page2.body}
            onChange={(value) => handleChange('page2', 'body', value)}
            modules={modules}
            className="quill-editor"
          />
          <label>Signatory Name</label>
          <input type="text" value={data.page2.signatoryName} onChange={(e) => handleChange('page2', 'signatoryName', e.target.value)} />
          <label>Signatory Title</label>
          <input type="text" value={data.page2.signatoryTitle} onChange={(e) => handleChange('page2', 'signatoryTitle', e.target.value)} />
          <label>Signatory Phone</label>
          <input type="text" value={data.page2.signatoryPhone} onChange={(e) => handleChange('page2', 'signatoryPhone', e.target.value)} />
          <label>Executive Name (Footer - Right Side)</label>
          <input type="text" value={data.page2.executiveName || ''} onChange={(e) => handleChange('page2', 'executiveName', e.target.value)} placeholder="e.g. Praveen" />
          <label>Executive Role</label>
          <input type="text" value={data.page2.executiveRole || ''} onChange={(e) => handleChange('page2', 'executiveRole', e.target.value)} placeholder="e.g. Executive" />
          <label>Executive Phone</label>
          <input type="text" value={data.page2.executivePhone || ''} onChange={(e) => handleChange('page2', 'executivePhone', e.target.value)} placeholder="e.g. +91 95850 75551" />
        </div>
      )}

      {activeTab === 'page3' && (
        <div className="editor-group">
          <label>Section Title</label>
          <input type="text" value={data.page3.title} onChange={(e) => handleChange('page3', 'title', e.target.value)} />
          <label>Content</label>
          <ReactQuill
            theme="snow"
            value={data.page3.content}
            onChange={(value) => handleChange('page3', 'content', value)}
            modules={modules}
            className="quill-editor"
          />

          {data.page3.features && (
            <>
              <div className="settings-divider" style={{ margin: '1.5rem 0', borderTop: '1px solid #334155' }}></div>
              <label>Features Section Title</label>
              <input
                type="text"
                value={data.page3.featuresTitle !== undefined ? data.page3.featuresTitle : 'Key Features of MBR Sewage Treatment Plant'}
                onChange={(e) => handleChange('page3', 'featuresTitle', e.target.value)}
                style={{ marginBottom: '15px' }}
              />

              <h4 style={{ marginBottom: '10px' }}>Feature Items</h4>
              {data.page3.features.map((feature, idx) => (
                <div key={idx} className="complex-section">
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>Feature {idx + 1} Title</label>
                      <ReactQuill
                        theme="snow"
                        value={feature.title}
                        onChange={(value) => {
                          const newData = { ...data };
                          newData.page3.features[idx].title = value;
                          setData(newData);
                        }}
                        modules={modules}
                        className="quill-editor"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>Feature {idx + 1} Description</label>
                      <ReactQuill
                        theme="snow"
                        value={feature.desc}
                        onChange={(value) => {
                          const newData = { ...data };
                          newData.page3.features[idx].desc = value;
                          setData(newData);
                        }}
                        modules={modules}
                        className="quill-editor"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {data.page3.benefits && (
            <>
              <div className="settings-divider" style={{ margin: '1.5rem 0', borderTop: '1px solid #334155' }}></div>
              <label>Benefits Section Title</label>
              <input
                type="text"
                value={data.page3.benefitsTitle || 'Benefits of MBR Technology'}
                onChange={(e) => handleChange('page3', 'benefitsTitle', e.target.value)}
                style={{ marginBottom: '15px' }}
              />

              <h4 style={{ marginBottom: '10px' }}>Benefit Items</h4>
              {data.page3.benefits.map((benefit, idx) => (
                <div key={idx} className="complex-section">
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>Benefit {idx + 1} Title</label>
                      <ReactQuill
                        theme="snow"
                        value={benefit.title}
                        onChange={(value) => {
                          const newBenefits = [...data.page3.benefits];
                          newBenefits[idx] = { ...newBenefits[idx], title: value };
                          handleChange('page3', 'benefits', newBenefits);
                        }}
                        modules={modules}
                        className="quill-editor"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>Benefit {idx + 1} Description</label>
                      <ReactQuill
                        theme="snow"
                        value={benefit.desc}
                        onChange={(value) => {
                          const newBenefits = [...data.page3.benefits];
                          newBenefits[idx] = { ...newBenefits[idx], desc: value };
                          handleChange('page3', 'benefits', newBenefits);
                        }}
                        modules={modules}
                        className="quill-editor"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="settings-divider" style={{ margin: '1.5rem 0', borderTop: '1px solid #334155' }}></div>
          <h3>Assumptions</h3>
          {(data.page3.assumptions || []).map((item, index) => (
            <div key={index} style={{ marginBottom: '1rem', position: 'relative' }}>
              <ReactQuill
                theme="snow"
                value={item}
                onChange={(value) => {
                  const newAssumptions = [...data.page3.assumptions];
                  newAssumptions[index] = value;
                  handleChange('page3', 'assumptions', newAssumptions);
                }}
                modules={modules}
                className="quill-editor"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const newAssumptions = data.page3.assumptions.filter((_, i) => i !== index);
                  handleChange('page3', 'assumptions', newAssumptions);
                }}
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', zIndex: 10, fontSize: '12px' }}
              >×</button>
            </div>
          ))}
          <button
            onClick={() => {
              const newAssumptions = [...(data.page3.assumptions || []), ''];
              handleChange('page3', 'assumptions', newAssumptions);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >+ Add Assumption</button>
        </div>
      )}

      {activeTab === 'page4' && (
        <div className="editor-group">
          <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(14,165,233,0.03))', padding: '14px', borderRadius: '10px', borderLeft: '3px solid var(--primary)', marginBottom: '1rem' }}>
            <h3 style={{ marginTop: 0, color: 'var(--primary)', borderBottom: 'none', paddingBottom: 0, marginBottom: '12px', fontSize: '0.78rem' }}>⚙️ MBR STP Auto-Calculation Engine</h3>
            <div className="calc-input-group">
              <div>
                <label>Plant Capacity (KLD)</label>
                <input type="number" min="1" value={data.calculations.flowRate} onChange={(e) => handleCalcChange('flowRate', parseFloat(e.target.value))} />
              </div>
              <div>
                <label>Operating Hours / Day</label>
                <input type="number" min="1" max="24" value={data.calculations.operatingHours} onChange={(e) => handleCalcChange('operatingHours', parseFloat(e.target.value))} />
              </div>
              <div>
                <label>GST Mode</label>
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
                  <button
                    onClick={() => handleCalcChange('taxMode', 'inclusive')}
                    style={{
                      flex: 1, padding: '6px', borderRadius: '6px', border: 'none',
                      background: data.calculations.taxMode === 'inclusive' ? '#10b981' : 'transparent',
                      color: data.calculations.taxMode === 'inclusive' ? 'white' : '#94a3b8',
                      cursor: 'pointer', fontSize: '0.65rem', fontWeight: '700'
                    }}
                  >INCLUSIVE</button>
                  <button
                    onClick={() => handleCalcChange('taxMode', 'exclusive')}
                    style={{
                      flex: 1, padding: '6px', borderRadius: '6px', border: 'none',
                      background: data.calculations.taxMode === 'exclusive' ? '#10b981' : 'transparent',
                      color: data.calculations.taxMode === 'exclusive' ? 'white' : '#94a3b8',
                      cursor: 'pointer', fontSize: '0.65rem', fontWeight: '700'
                    }}
                  >EXCLUSIVE</button>
                </div>
              </div>
            </div>

            {/* ── Commercial Pricing Inputs ── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '10px', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: '800', letterSpacing: '0.06em', marginBottom: '8px' }}>
                💰 COMMERCIAL OFFER AUTO-PRICING
              </div>
              <div className="calc-input-group">
                <div>
                  <label style={{ fontSize: '0.7rem' }}>STP Rate per KLD (₹)</label>
                  <input
                    type="number" min="1" step="100"
                    value={data.calculations.stpRatePerKLD || 23140}
                    onChange={(e) => handleCalcChange('stpRatePerKLD', parseFloat(e.target.value) || 23140)}
                  />
                  <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '3px' }}>
                    STP Price = {data.calculations.flowRate} × ₹{(data.calculations.stpRatePerKLD || 23140).toLocaleString('en-IN')} = <strong style={{ color: '#38bdf8' }}>₹{(Math.round((data.calculations.flowRate * (data.calculations.stpRatePerKLD || 23140)) / 100) * 100).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem' }}>OCEMS Fixed Cost (₹)</label>
                  <input
                    type="number" min="0" step="100"
                    value={data.calculations.ocemsCost || 328600}
                    onChange={(e) => handleCalcChange('ocemsCost', parseFloat(e.target.value) || 0)}
                  />
                  <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '3px' }}>
                    Fixed regardless of KLD
                  </div>
                </div>
              </div>
            </div>
            {(() => {
              const KLD = data.calculations.flowRate || 100;
              const opHrs = data.calculations.operatingHours || 20;
              const flow = KLD / opHrs;

              const requiredMemSqm = (flow * 1000) / 15;
              const numberOfModules = Math.ceil(requiredMemSqm / 20);
              const totalMembraneSqm = numberOfModules * 20;

              const aerationVol = flow * 8; // RT = 8
              const aerationAirFlowM3Hr = (aerationVol * 0.5) * 60;
              let selectedBlowerM3Hr = 80;
              let blowerHP = 5;
              if (aerationAirFlowM3Hr <= 80) { selectedBlowerM3Hr = 80; blowerHP = 5; }
              else if (aerationAirFlowM3Hr <= 160) { selectedBlowerM3Hr = 160; blowerHP = 7.5; }
              else if (aerationAirFlowM3Hr <= 250) { selectedBlowerM3Hr = 250; blowerHP = 10; }
              else if (aerationAirFlowM3Hr <= 350) { selectedBlowerM3Hr = 350; blowerHP = 15; }
              else { selectedBlowerM3Hr = Math.ceil(aerationAirFlowM3Hr / 50) * 50; blowerHP = 20; }

              const totalKWhDay = (blowerHP * 0.746 * 24) + (1.0 * 0.746 * opHrs * 3); // Simplified for summary
              const demandFactorTotal = totalKWhDay * 0.70;
              const powerCost = demandFactorTotal * (data.calculations.powerRate || 10);
              const totalCost = powerCost + 100;

              return (
                <div className="calc-summary-grid">
                  <div className="calc-card flow">🔵 Flow: {flow.toFixed(2)} m³/hr</div>
                  <div className="calc-card mem">🔷 Membrane: {numberOfModules} Nos × 20 m² = {totalMembraneSqm} m²</div>
                  <div className="calc-card tanks">
                    📐 Blower: {selectedBlowerM3Hr} m³/hr ({blowerHP} HP)
                  </div>
                  <div className="calc-card kwh">⚡ KWH/Day: {totalKWhDay.toFixed(1)}</div>
                  <div className="calc-card power">🔴 Power: ₹{powerCost.toFixed(0)}/day</div>
                  <div className="calc-card cost">💸 Total: ₹{totalCost.toFixed(0)}/day</div>
                </div>
              );
            })()}
          </div>

          <label>Section Heading</label>
          <input
            type="text"
            value={data.page4.title || 'DESIGN PARAMETERS:'}
            onChange={(e) => handleChange('page4', 'title', e.target.value)}
            style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}
          />
          <h4>A. Flow Parameters</h4>
          {data.page4.designParams.flow.map((item, index) => (
            <div key={index} className="row-inputs">
              <input value={item.label} onChange={(e) => handleTableChange('flow', index, 'label', e.target.value)} />
              <input value={item.value} onChange={(e) => handleTableChange('flow', index, 'value', e.target.value)} />
            </div>
          ))}
          <h4>B. Raw Waste Water</h4>
          {data.page4.designParams.raw.map((item, index) => (
            <div key={index} className="row-inputs">
              <input value={item.label} onChange={(e) => handleTableChange('raw', index, 'label', e.target.value)} />
              <input value={item.value} onChange={(e) => handleTableChange('raw', index, 'value', e.target.value)} />
            </div>
          ))}
          <h4>C. Treated Waste Water</h4>
          {data.page4.designParams.treated.map((item, index) => (
            <div key={index} className="row-inputs">
              <input value={item.label} onChange={(e) => handleTableChange('treated', index, 'label', e.target.value)} />
              <input value={item.value} onChange={(e) => handleTableChange('treated', index, 'value', e.target.value)} />
            </div>
          ))}
          <label style={{ marginTop: '1rem', display: 'block' }}>Assumptions Heading</label>
          <input
            type="text"
            value={data.page4.assumptionsTitle || 'ASSUMPTIONS:'}
            onChange={(e) => handleChange('page4', 'assumptionsTitle', e.target.value)}
            style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}
          />
          {data.page4.assumptions.map((item, index) => (
            <div key={index} style={{ marginBottom: '1rem', position: 'relative' }}>
              <ReactQuill
                theme="snow"
                value={item}
                onChange={(value) => {
                  if (value === item) return;
                  const newAssumptions = [...data.page4.assumptions];
                  newAssumptions[index] = value;
                  handleChange('page4', 'assumptions', newAssumptions);
                }}
                modules={modules}
                className="quill-editor"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const newAssumptions = data.page4.assumptions.filter((_, i) => i !== index);
                  handleChange('page4', 'assumptions', newAssumptions);
                }}
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', zIndex: 10, fontSize: '12px' }}
              >×</button>
            </div>
          ))}
          <button
            onClick={() => {
              const newAssumptions = [...data.page4.assumptions, ''];
              handleChange('page4', 'assumptions', newAssumptions);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >+ Add Assumption</button>
        </div>
      )}

      {(activeTab === 'page5' || activeTab === 'page6' || activeTab === 'page7') && (
        <div className="editor-group">
          <label>Section Heading</label>
          <input
            type="text"
            value={data[activeTab].title || ''}
            onChange={(e) => handleChange(activeTab, 'title', e.target.value)}
            style={{ marginBottom: '1rem', fontWeight: 'bold' }}
          />
          {data[activeTab].sections.map((section, sIdx) => {
            const isCollapsed = collapsedSections[`${activeTab}_${sIdx}`];
            return (
            <div key={sIdx} className="complex-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Sub-section Name</label>
                <button 
                  onClick={() => toggleCollapse(`${activeTab}_${sIdx}`)} 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={section.name}
                  onChange={(e) => {
                    const newData = { ...data };
                    newData[activeTab].sections[sIdx].name = e.target.value;
                    setData(newData);
                  }}
                  style={{ fontWeight: '600', flex: 1 }}
                />
                <button
                  onClick={() => {
                    const newData = { ...data };
                    newData[activeTab].sections.splice(sIdx, 1);
                    setData(newData);
                  }}
                  title="Remove Section"
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {!isCollapsed && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white', fontSize: '0.8rem' }}>
                      <input
                        type="checkbox"
                        checked={section.hidden || false}
                        onChange={(e) => {
                          const newData = { ...data };
                          newData[activeTab].sections[sIdx].hidden = e.target.checked;
                          setData(newData);
                        }}
                      />
                      Hide Section
                    </label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => {
                          const newData = { ...data };
                          newData[activeTab].sections[sIdx].params.forEach(p => p.push(''));
                          setData(newData);
                        }}
                        style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        + Add Column
                      </button>
                      <button
                        onClick={() => {
                          const newData = { ...data };
                          const currentCols = newData[activeTab].sections[sIdx].params[0].length;
                          if (currentCols > 2) {
                            newData[activeTab].sections[sIdx].params.forEach(p => p.pop());
                            setData(newData);
                          }
                        }}
                        style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        - Remove Column
                      </button>
                    </div>
                  </div>
                  
                  {section.params.map((param, pIdx) => {
                    const isNormalFlow = param[0].toLowerCase().includes('normal flow designed');
                    return (
                      <div key={pIdx} className="row-inputs" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {param.map((col, colIdx) => (
                          <input
                            key={colIdx}
                            value={col}
                            onChange={(e) => handleComplexSectionChange(activeTab, sIdx, pIdx, colIdx, e.target.value)}
                            disabled={colIdx === 1 && isNormalFlow}
                            title={colIdx === 1 && isNormalFlow ? "This value is automatically calculated from Page 4" : ""}
                            style={colIdx === 1 && isNormalFlow ? { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#64748b', cursor: 'not-allowed', flex: 1 } : { flex: 1 }}
                          />
                        ))}
                        <button
                          onClick={() => {
                            const newData = { ...data };
                            newData[activeTab].sections[sIdx].params.splice(pIdx, 1);
                            setData(newData);
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Remove Row"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  
                  <button
                    onClick={() => {
                      const newData = { ...data };
                      const colCount = newData[activeTab].sections[sIdx].params[0]?.length || 2;
                      const newRow = Array(colCount).fill('');
                      newData[activeTab].sections[sIdx].params.push(newRow);
                      setData(newData);
                    }}
                    style={{ fontSize: '0.75rem', marginTop: '10px', padding: '6px 12px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                  >
                    + Add Row
                  </button>
                </>
              )}
            </div>
            );
          })}
          
          <button
            onClick={() => {
              const newData = { ...data };
              newData[activeTab].sections.push({
                name: 'New Section',
                hidden: false,
                params: [['Parameter', 'Value']]
              });
              setData(newData);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add Section
          </button>

          <div className="settings-divider" style={{ margin: '2rem 0', borderTop: '1px solid #334155' }}></div>
          
          <h4 style={{ marginBottom: '10px' }}>Scope of Exclusions</h4>
          {(data[activeTab].exclusions || []).map((exc, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <ReactQuill
                theme="snow"
                value={exc}
                onChange={(value) => handleGenericArrayChange(activeTab, 'exclusions', idx, value)}
                modules={modules}
                className="quill-editor"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const newExclusions = (data[activeTab].exclusions || []).filter((_, i) => i !== idx);
                  handleChange(activeTab, 'exclusions', newExclusions);
                }}
                style={{ padding: '0 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newExclusions = [...(data[activeTab].exclusions || []), ''];
              handleChange(activeTab, 'exclusions', newExclusions);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}
          >
            + Add Exclusion
          </button>

          <h4 style={{ marginBottom: '10px' }}>Notes</h4>
          {(data[activeTab].notes || []).map((note, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <ReactQuill
                theme="snow"
                value={note}
                onChange={(value) => handleGenericArrayChange(activeTab, 'notes', idx, value)}
                modules={modules}
                className="quill-editor"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const newNotes = (data[activeTab].notes || []).filter((_, i) => i !== idx);
                  handleChange(activeTab, 'notes', newNotes);
                }}
                style={{ padding: '0 15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newNotes = [...(data[activeTab].notes || []), ''];
              handleChange(activeTab, 'notes', newNotes);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add Note
          </button>
        </div>
      )}

      {(activeTab === 'page8' || activeTab === 'page9' || activeTab === 'page10' || activeTab === 'page11' || activeTab === 'page12' || activeTab === 'page13') && (
        <div className="editor-group">
          <label>Section Heading</label>
          <input
            type="text"
            value={data[activeTab].title || ''}
            placeholder="e.g. OUR SCOPE OF WORK..."
            onChange={(e) => handleChange(activeTab, 'title', e.target.value)}
            style={{ marginBottom: '1rem', fontWeight: 'bold' }}
          />
          {(data[activeTab].equipments || []).map((equip, eIdx) => {
            const isCollapsed = collapsedSections[`${activeTab}_equip_${eIdx}`];
            return (
            <div key={eIdx} className="equipment-edit-card" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <Package size={18} color="var(--primary)" />
                  <input
                    value={equip.name}
                    onChange={(e) => {
                      const newData = { ...data };
                      newData[activeTab].equipments[eIdx].name = e.target.value;
                      setData(newData);
                    }}
                    style={{ fontWeight: 'bold', fontSize: '1.1rem', background: 'transparent', border: 'none', borderBottom: '1px dashed #444', padding: '2px 5px', width: '100%', color: 'white' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <button 
                    onClick={() => toggleCollapse(`${activeTab}_equip_${eIdx}`)} 
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                  >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <button
                    onClick={() => {
                      const newData = { ...data };
                      newData[activeTab].equipments.splice(eIdx, 1);
                      setData(newData);
                    }}
                    title="Remove Equipment"
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {!isCollapsed && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginBottom: '10px' }}>
                    <button
                      onClick={() => {
                        const newData = { ...data };
                        newData[activeTab].equipments[eIdx].specs.forEach(s => s.push(''));
                        setData(newData);
                      }}
                      style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      + Add Column
                    </button>
                    <button
                      onClick={() => {
                        const newData = { ...data };
                        const currentCols = newData[activeTab].equipments[eIdx].specs[0]?.length || 2;
                        if (currentCols > 2) {
                          newData[activeTab].equipments[eIdx].specs.forEach(s => s.pop());
                          setData(newData);
                        }
                      }}
                      style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      - Remove Column
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    {equip.specs.map((spec, sIdx) => {
                      const label = spec[0] || "";
                      const value = spec[1] || "";

                      // Helper to separate number and unit for steppers
                      // Matches leading number (e.g. "1.0", "12", "75")
                      const numMatch = value.match(/^([0-9.]+)(\s*.*)$/);
                      const hasNumeric = numMatch && !isNaN(parseFloat(numMatch[1]));

                      const handleSpecValueChange = (newVal) => {
                        handleEquipmentChange(activeTab, eIdx, sIdx, 1, newVal);
                      };

                      return (
                        <div key={sIdx} className="spec-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input
                            value={label}
                            onChange={(e) => handleEquipmentChange(activeTab, eIdx, sIdx, 0, e.target.value)}
                            style={{ flex: 1, fontSize: '0.85rem', color: '#94a3b8', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                          />

                          {hasNumeric ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                              <input
                                type="number"
                                step={label.toLowerCase().includes('motor') || label.toLowerCase().includes('hp') ? "0.1" : "1"}
                                value={parseFloat(numMatch[1])}
                                onChange={(e) => handleSpecValueChange(e.target.value + numMatch[2])}
                                style={{ width: '60px', padding: '4px 8px' }}
                              />
                              <input
                                value={numMatch[2].trim()}
                                onChange={(e) => handleSpecValueChange(numMatch[1] + " " + e.target.value)}
                                style={{ flex: 1, fontSize: '0.9rem' }}
                              />
                            </div>
                          ) : (
                            <input
                              value={value}
                              onChange={(e) => handleSpecValueChange(e.target.value)}
                              style={{ flex: 1 }}
                            />
                          )}
                          
                          {/* Render dynamically added columns */}
                          {spec.slice(2).map((extraCol, extraIdx) => (
                            <input
                              key={extraIdx + 2}
                              value={extraCol}
                              onChange={(e) => handleEquipmentChange(activeTab, eIdx, sIdx, extraIdx + 2, e.target.value)}
                              style={{ flex: 1 }}
                            />
                          ))}

                          <button
                            onClick={() => {
                              const newData = { ...data };
                              newData[activeTab].equipments[eIdx].specs.splice(sIdx, 1);
                              setData(newData);
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Remove Row"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      const newData = { ...data };
                      const colCount = newData[activeTab].equipments[eIdx].specs[0]?.length || 2;
                      const newRow = Array(colCount).fill('');
                      newData[activeTab].equipments[eIdx].specs.push(newRow);
                      setData(newData);
                    }}
                    style={{ fontSize: '0.75rem', marginTop: '10px', padding: '6px 12px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                  >
                    + Add Row
                  </button>
                </>
              )}
            </div>
            );
          })}
          
          <button
            onClick={() => {
              const newData = { ...data };
              newData[activeTab].equipments.push({
                id: Date.now().toString(),
                name: 'New Equipment',
                specs: [['Description', 'Value']]
              });
              setData(newData);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add Equipment
          </button>
        </div>
      )}

      {activeTab === 'pageCivil' && (
        <div className="editor-group">
          <label>Civil Table Heading</label>
          <input
            type="text"
            value={data.pageCivil.title || ''}
            onChange={(e) => handleChange('pageCivil', 'title', e.target.value)}
            style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}
          />
          <p className="help-text">Adjust tank dimensions. Volume updates automatically.</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ marginBottom: 0 }}>Civil/MS Dimensions Table Heading</label>
            <button 
              className="btn-ghost" 
              onClick={() => {
                const newData = JSON.parse(JSON.stringify(data));
                const sNo = (newData.pageCivil.table.rows.length + 1) + ".";
                newData.pageCivil.table.rows.push([sNo, 'NEW TANK', '0m X 0m X 0m', '1No', 'RCC', 'Client', '0']);
                setData(newData);
              }}
              style={{ fontSize: '12px', padding: '4px 12px', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '4px' }}
            >
              + Add Tank
            </button>
          </div>

          <input
            type="text"
            value={data.pageCivil.title || ''}
            onChange={(e) => handleChange('pageCivil', 'title', e.target.value)}
            style={{ marginBottom: '1rem', fontWeight: 'bold' }}
          />
          
          <div className="civil-rows-container">
            {data.pageCivil.table.rows.map((row, rIdx) => (
              <div key={rIdx} className="complex-section" style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '12px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <input 
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem', width: '85%', padding: '2px 0' }}
                    value={row[1]}
                    onChange={(e) => {
                      const newData = JSON.parse(JSON.stringify(data));
                      newData.pageCivil.table.rows[rIdx][1] = e.target.value;
                      setData(newData);
                    }}
                  />
                  <button 
                    onClick={() => {
                      const newData = JSON.parse(JSON.stringify(data));
                      newData.pageCivil.table.rows.splice(rIdx, 1);
                      newData.pageCivil.table.rows.forEach((r, idx) => r[0] = (idx + 1) + ".");
                      if (recalculateData) recalculateData(newData);
                      else setData(newData);
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="calc-input-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '10px' }}>Size (M)</label>
                    <input 
                      type="text" 
                      value={row[2]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.table.rows[rIdx][2] = e.target.value;
                        setData(newData);
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px' }}>Quantity</label>
                    <input 
                      type="text" 
                      value={row[3]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.table.rows[rIdx][3] = e.target.value;
                        setData(newData);
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px' }}>Type</label>
                    <input 
                      type="text" 
                      value={row[4]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.table.rows[rIdx][4] = e.target.value;
                        setData(newData);
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px' }}>Scope</label>
                    <input 
                      type="text" 
                      value={row[5]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.table.rows[rIdx][5] = e.target.value;
                        setData(newData);
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px' }}>Volume m³</label>
                    <input 
                      type="number" step="0.01" 
                      value={row[6]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.table.rows[rIdx][6] = e.target.value;
                        if (recalculateData) recalculateData(newData);
                        else setData(newData);
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="editor-group" style={{ marginTop: '1rem' }}>
            <label>Special Note</label>
            <textarea
              value={data.pageCivil.specialNote || ''}
              onChange={(e) => handleChange('pageCivil', 'specialNote', e.target.value)}
              placeholder="e.g. If the client opts for RCC construction..."
              rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <div className="settings-divider" style={{ margin: '2rem 0' }}></div>

          <div className="settings-divider" style={{ margin: '2rem 0' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ marginBottom: 0 }}>Electrical Table Heading</label>
            <button 
              className="btn-ghost" 
              onClick={() => {
                const newData = JSON.parse(JSON.stringify(data));
                const sNo = (newData.pageCivil.electrical.rows.length + 1) + ".";
                newData.pageCivil.electrical.rows.push([sNo, 'New Equipment', '0', '0', '1 No', '20.0', '0']);
                setData(newData);
              }}
              style={{ fontSize: '12px', padding: '4px 12px', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px' }}
            >
              + Add Item
            </button>
          </div>

          <input
            type="text"
            value={data.pageCivil.electrical?.title || ''}
            onChange={(e) => {
              const newData = JSON.parse(JSON.stringify(data));
              newData.pageCivil.electrical.title = e.target.value;
              setData(newData);
            }}
            style={{ marginBottom: '1rem', fontWeight: 'bold' }}
          />
          
          <p className="help-text">Update operating/connected load, quantity, and running hours. Total kWh/Day and Demand Factor update automatically.</p>

          <div className="electrical-rows-container">
            {data.pageCivil.electrical.rows.map((row, rIdx) => (
              <div key={rIdx} className="complex-section" style={{ borderLeft: '2px solid #10b981', paddingLeft: '12px', marginBottom: '15px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <input 
                    style={{ background: 'transparent', border: 'none', color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem', width: '85%', padding: '2px 0' }}
                    value={row[1]}
                    onChange={(e) => {
                      const newData = JSON.parse(JSON.stringify(data));
                      newData.pageCivil.electrical.rows[rIdx][1] = e.target.value;
                      setData(newData);
                    }}
                  />
                  <button 
                    onClick={() => {
                      const newData = JSON.parse(JSON.stringify(data));
                      newData.pageCivil.electrical.rows.splice(rIdx, 1);
                      // Reset S.No
                      newData.pageCivil.electrical.rows.forEach((r, idx) => r[0] = (idx + 1) + ".");
                      if (recalculateData) recalculateData(newData);
                      else setData(newData);
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="calc-input-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Op. Load (kW)</label>
                    <input 
                      type="number" step="0.001" 
                      value={row[2]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.electrical.rows[rIdx][2] = e.target.value;
                        if (recalculateData) recalculateData(newData);
                        else setData(newData);
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Conn. Load (kW)</label>
                    <input 
                      type="number" step="0.001" 
                      value={row[3]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.electrical.rows[rIdx][3] = e.target.value;
                        setData(newData);
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Qty</label>
                    <input 
                      type="text" 
                      value={row[4]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.electrical.rows[rIdx][4] = e.target.value;
                        setData(newData);
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Run Hrs</label>
                    <input 
                      type="number" step="0.5" 
                      value={row[5]} 
                      onChange={(e) => {
                        const newData = JSON.parse(JSON.stringify(data));
                        newData.pageCivil.electrical.rows[rIdx][5] = e.target.value;
                        if (recalculateData) recalculateData(newData);
                        else setData(newData);
                      }} 
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '10px', color: '#94a3b8' }}>Total kWh/Day (Auto)</label>
                    <input type="text" value={row[6]} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', cursor: 'not-allowed' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pageCost' && (
        <div className="editor-group">
          <label>Section Heading</label>
          <input
            type="text"
            value={data.pageCost.title || ''}
            onChange={(e) => handleChange('pageCost', 'title', e.target.value)}
            style={{ marginBottom: '1rem', fontWeight: 'bold' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} color="#10b981" />
              Operating Cost Details
            </h3>
            <button 
              className="btn-ghost" 
              onClick={() => {
                const newData = JSON.parse(JSON.stringify(data));
                const newId = Date.now().toString();
                newData.pageCost.rows.push({
                  id: newId,
                  name: 'New Cost Item',
                  value: 'Rs. 0'
                });
                setData(newData);
              }}
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              <Plus size={14} /> Add Cost Item
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '12px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.1)' }}>
            <div className="calc-input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '11px' }}>Power Rate (₹ / Unit)</label>
                <input 
                  type="number" 
                  value={data.calculations.powerRate || 10} 
                  onChange={(e) => {
                    const newData = JSON.parse(JSON.stringify(data));
                    newData.calculations.powerRate = parseFloat(e.target.value) || 0;
                    if (recalculateData) recalculateData(newData);
                    else setData(newData);
                  }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '11px' }}>Chemical Cost (₹ / Day)</label>
                <input 
                  type="number" 
                  value={data.calculations.chemCost || 100} 
                  onChange={(e) => {
                    const newData = JSON.parse(JSON.stringify(data));
                    newData.calculations.chemCost = parseFloat(e.target.value) || 0;
                    if (recalculateData) recalculateData(newData);
                    else setData(newData);
                  }} 
                />
              </div>
            </div>
          </div>

          {data.pageCost.rows.map((row, rIdx) => (
            <div key={row.id || rIdx} className="complex-section" style={{ borderLeft: '2px solid #10b981', paddingLeft: '12px', position: 'relative', marginBottom: '1rem' }}>
              <button 
                onClick={() => {
                  const newData = JSON.parse(JSON.stringify(data));
                  newData.pageCost.rows.splice(rIdx, 1);
                  setData(newData);
                }}
                style={{ position: 'absolute', right: 0, top: 0, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Trash2 size={14} />
              </button>
              
              <div style={{ marginBottom: '8px' }}>
                <input 
                  value={row.name} 
                  placeholder="Description"
                  onChange={(e) => {
                    const newData = JSON.parse(JSON.stringify(data));
                    newData.pageCost.rows[rIdx].name = e.target.value;
                    setData(newData);
                  }}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem', width: '100%' }}
                />
              </div>
              <textarea 
                value={row.value} 
                placeholder="Value (e.g. Rs. 1499)"
                onChange={(e) => {
                  const newData = JSON.parse(JSON.stringify(data));
                  newData.pageCost.rows[rIdx].value = e.target.value;
                  setData(newData);
                }}
                style={{ fontWeight: 'bold', width: '100%', minHeight: '60px', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pageCommercial' && (
        <div className="editor-group">
          <label>Section Heading</label>
          <input
            type="text"
            value={data.pageCommercial.title || ''}
            onChange={(e) => handleChange('pageCommercial', 'title', e.target.value)}
            style={{ marginBottom: '1rem', fontWeight: 'bold' }}
          />

          {/* ── ITEM 1 ── */}
          <div style={{ background: 'rgba(14,165,233,0.06)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(14,165,233,0.18)', marginBottom: '1rem' }}>
            <label style={{ color: '#38bdf8', fontWeight: '800', fontSize: '0.72rem', letterSpacing: '0.06em' }}>ITEM 1 — STP (Description)</label>
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginBottom: '6px' }}>
              ⚡ <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Amount auto-calculates</span> from KLD × Rate per KLD set in the engine above.
            </div>
            <ReactQuill
              theme="snow"
              value={data.pageCommercial.item1Desc || ''}
              onChange={(value) => {
                const newData = { ...data, pageCommercial: { ...data.pageCommercial, item1Desc: value } };
                setData(newData);
              }}
              modules={modules}
              className="quill-editor"
              style={{ flex: 1 }}
            />
            <div style={{ marginTop: '10px', background: 'rgba(56,189,248,0.08)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(56,189,248,0.2)' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '4px' }}>AUTO-CALCULATED AMOUNT</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8' }}>
                ₹ {(data.pageCommercial.item1Amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '3px' }}>
                {data.calculations.flowRate} KLD × ₹{(data.calculations.stpRatePerKLD || 23140).toLocaleString('en-IN')}/KLD → rounded to ₹100
              </div>
            </div>
          </div>

          {/* ── ITEM 2 ── */}
          <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(16,185,129,0.18)', marginBottom: '1rem' }}>
            <label style={{ color: '#10b981', fontWeight: '800', fontSize: '0.72rem', letterSpacing: '0.06em' }}>ITEM 2 — OCEMS (Description)</label>
            <ReactQuill
              theme="snow"
              value={data.pageCommercial.item2Desc || ''}
              onChange={(value) => {
                const newData = { ...data, pageCommercial: { ...data.pageCommercial, item2Desc: value } };
                setData(newData);
              }}
              modules={modules}
              className="quill-editor"
              style={{ flex: 1 }}
            />
            <label style={{ marginTop: '10px', display: 'block' }}>Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={data.pageCommercial.item2Amount || 0}
              onChange={(e) => {
                const newData = { ...data, pageCommercial: { ...data.pageCommercial, item2Amount: parseFloat(e.target.value) || 0 } };
                setData(newData);
              }}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
              Formatted: ₹ {(data.pageCommercial.item2Amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* ── LIVE TOTALS PREVIEW ── */}
          {(() => {
            const a1 = data.pageCommercial.item1Amount || 0;
            const a2 = data.pageCommercial.item2Amount || 0;
            const subtotal = a1 + a2;
            const gst = Math.round(subtotal * 0.18);
            const grand = subtotal + gst;
            const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
            return (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.72rem', letterSpacing: '0.06em', color: '#e2e8f0' }}>AUTO TOTALS (read-only)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px', fontSize: '0.82rem' }}>
                  <span style={{ color: '#94a3b8' }}>Total</span>
                  <span style={{ color: '#f1f5f9', textAlign: 'right', fontWeight: 'bold' }}>₹ {fmt(subtotal)}</span>
                  <span style={{ color: '#94a3b8' }}>GST @ 18%</span>
                  <span style={{ color: '#f1f5f9', textAlign: 'right' }}>₹ {fmt(gst)}</span>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Grand Total</span>
                  <span style={{ color: '#38bdf8', textAlign: 'right', fontWeight: 'bold', fontSize: '0.9rem' }}>₹ {fmt(grand)}</span>
                </div>
              </div>
            );
          })()}

          <h4>Notes</h4>
          {data.pageCommercial.notes.map((note, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', position: 'relative' }}>
              <ReactQuill
                theme="snow"
                value={note}
                onChange={(value) => handleGenericArrayChange('pageCommercial', 'notes', idx, value)}
                modules={modules}
                className="quill-editor"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const newNotes = data.pageCommercial.notes.filter((_, i) => i !== idx);
                  handleChange('pageCommercial', 'notes', newNotes);
                }}
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', zIndex: 10, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>
          ))}
          <button
            onClick={() => {
              const newNotes = [...(data.pageCommercial.notes || []), ''];
              handleChange('pageCommercial', 'notes', newNotes);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >+ Add Note</button>
        </div>
      )}

      {activeTab === 'pageExclusions' && (
        <div className="editor-group">
          <label>Section Heading</label>
          <input
            type="text"
            value={data.pageExclusions.title || ''}
            onChange={(e) => handleChange('pageExclusions', 'title', e.target.value)}
            style={{ marginBottom: '1rem', fontWeight: 'bold' }}
          />
          <h4 style={{ marginBottom: '10px' }}>Scope of Exclusions</h4>
          {data.pageExclusions.exclusions.map((exc, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', position: 'relative' }}>
              <ReactQuill
                theme="snow"
                value={exc}
                onChange={(value) => handleGenericArrayChange('pageExclusions', 'exclusions', idx, value)}
                modules={modules}
                className="quill-editor"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const newExclusions = data.pageExclusions.exclusions.filter((_, i) => i !== idx);
                  handleChange('pageExclusions', 'exclusions', newExclusions);
                }}
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', zIndex: 10, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>
          ))}
          <button
            onClick={() => {
              const newExclusions = [...(data.pageExclusions.exclusions || []), ''];
              handleChange('pageExclusions', 'exclusions', newExclusions);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '2rem' }}
          >+ Add Exclusion</button>

          <div className="settings-divider" style={{ margin: '1.5rem 0', borderTop: '1px solid #334155' }}></div>
          <h4 style={{ marginBottom: '10px' }}>Notes</h4>
          {data.pageExclusions.notes.map((note, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', position: 'relative' }}>
              <ReactQuill
                theme="snow"
                value={note}
                onChange={(value) => handleGenericArrayChange('pageExclusions', 'notes', idx, value)}
                modules={modules}
                className="quill-editor"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => {
                  const newNotes = data.pageExclusions.notes.filter((_, i) => i !== idx);
                  handleChange('pageExclusions', 'notes', newNotes);
                }}
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', zIndex: 10, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>
          ))}
          <button
            onClick={() => {
              const newNotes = [...(data.pageExclusions.notes || []), ''];
              handleChange('pageExclusions', 'notes', newNotes);
            }}
            className="btn-add-item"
            style={{ width: '100%', padding: '10px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >+ Add Note</button>
        </div>
      )}

      {activeTab === 'pageProcessFlow' && (
        <div className="editor-group">
          <h3>Process Flow Diagram</h3>
          <div className="input-group">
            <label>Heading</label>
            <input value={data.pageProcessFlow?.title || ''} onChange={(e) => handleChange('pageProcessFlow', 'title', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Image Path</label>
            <input value={data.pageProcessFlow?.imagePath || ''} onChange={(e) => handleChange('pageProcessFlow', 'imagePath', e.target.value)} placeholder="/assets/STP MBR 2.jpg" />
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="editor-group">
          <h3>Layout Settings</h3>
          <p className="help-text">Adjust these to prevent text from overlapping your letterhead image.</p>
          <label>Top Margin (mm)</label>
          <input type="number" value={data.settings.marginTop} onChange={(e) => handleChange('settings', 'marginTop', parseInt(e.target.value))} />
          <label>Bottom Margin (mm)</label>
          <input type="number" value={data.settings.marginBottom} onChange={(e) => handleChange('settings', 'marginBottom', parseInt(e.target.value))} />
          <label>Left Margin (mm)</label>
          <input type="number" value={data.settings.marginLeft} onChange={(e) => handleChange('settings', 'marginLeft', parseInt(e.target.value))} />
          <label>Right Margin (mm)</label>
          <input type="number" value={data.settings.marginRight} onChange={(e) => handleChange('settings', 'marginRight', parseInt(e.target.value))} />

          <div className="settings-divider" style={{ margin: '2rem 0', borderTop: '1px solid #334155' }}></div>

          <h3>Storage & Sync</h3>
          <p className="help-text">Choose how your data is saved. Local mode works offline.</p>
          <div className="editor-row" style={{ marginTop: '1rem' }}>
            <label>Storage Mode</label>
            <select
              value={data.settings.storageMode}
              onChange={(e) => handleChange('settings', 'storageMode', e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0f172a', color: 'white', border: '1px solid #334155' }}
            >
              <option value="local">Local Mode (Browser Cache - Fast & Reliable)</option>
              <option value="cloud">Cloud Mode (MongoDB - Sync across devices)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            <input
              type="checkbox"
              id="autoSave"
              checked={data.settings.autoSave}
              onChange={(e) => handleChange('settings', 'autoSave', e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="autoSave" style={{ cursor: 'pointer' }}>Enable Auto-save</label>
          </div>
        </div>

      )}
    </div>
  );
};


export default Editor;