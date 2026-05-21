import React from 'react';
import { Activity, DollarSign, Package } from 'lucide-react';
import './Editor.css';

const Editor = ({ activeTab, data, updateData, setData, updateCalculation, recalculateData }) => {
  const handleChange = (page, field, value) => {
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
          <label>Project Name</label>
          <input type="text" value={data.page1.project} onChange={(e) => handleChange('page1', 'project', e.target.value)} />
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
          <textarea value={data.page2.subject} onChange={(e) => handleChange('page2', 'subject', e.target.value)} />
          <label>Body Content</label>
          <textarea className="body-textarea" value={data.page2.body} onChange={(e) => handleChange('page2', 'body', e.target.value)} />
          <label>Signatory Name</label>
          <input type="text" value={data.page2.signatoryName} onChange={(e) => handleChange('page2', 'signatoryName', e.target.value)} />
          <label>Signatory Title</label>
          <input type="text" value={data.page2.signatoryTitle} onChange={(e) => handleChange('page2', 'signatoryTitle', e.target.value)} />
          <label>Signatory Phone</label>
          <input type="text" value={data.page2.signatoryPhone} onChange={(e) => handleChange('page2', 'signatoryPhone', e.target.value)} />
        </div>
      )}

      {activeTab === 'page3' && (
        <div className="editor-group">
          <label>Section Title</label>
          <input type="text" value={data.page3.title} onChange={(e) => handleChange('page3', 'title', e.target.value)} />
          <label>Content</label>
          <textarea className="body-textarea" value={data.page3.content} onChange={(e) => handleChange('page3', 'content', e.target.value)} />

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
                      <textarea
                        placeholder="Feature Title"
                        value={feature.title}
                        onChange={(e) => {
                          const newData = { ...data };
                          newData.page3.features[idx].title = e.target.value;
                          setData(newData);
                        }}
                        style={{ width: '100%', boxSizing: 'border-box', height: '70px', resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>Feature {idx + 1} Description</label>
                      <textarea
                        placeholder="Feature Description"
                        value={feature.desc}
                        onChange={(e) => {
                          const newData = { ...data };
                          newData.page3.features[idx].desc = e.target.value;
                          setData(newData);
                        }}
                        style={{ width: '100%', boxSizing: 'border-box', height: '70px', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
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
                      flex: 1, 
                      padding: '6px', 
                      borderRadius: '6px', 
                      border: 'none',
                      background: data.calculations.taxMode === 'inclusive' ? '#10b981' : 'transparent',
                      color: data.calculations.taxMode === 'inclusive' ? 'white' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.65rem',
                      fontWeight: '700'
                    }}
                  >
                    INCLUSIVE
                  </button>
                  <button 
                    onClick={() => handleCalcChange('taxMode', 'exclusive')}
                    style={{ 
                      flex: 1, 
                      padding: '6px', 
                      borderRadius: '6px', 
                      border: 'none',
                      background: data.calculations.taxMode === 'exclusive' ? '#10b981' : 'transparent',
                      color: data.calculations.taxMode === 'exclusive' ? 'white' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.65rem',
                      fontWeight: '700'
                    }}
                  >
                    EXCLUSIVE
                  </button>
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

          <h3>Design Parameters</h3>
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
          <h3>Assumptions</h3>
          {data.page4.assumptions.map((item, index) => (
            <textarea key={index} value={item} onChange={(e) => handleAssumptionChange(index, e.target.value)} />
          ))}
        </div>
      )}

      {(activeTab === 'page5' || activeTab === 'page6' || activeTab === 'page7') && (
        <div className="editor-group">
          <h3>{data[activeTab].title || activeTab.toUpperCase()}</h3>
          {data[activeTab].sections.map((section, sIdx) => (
            <div key={sIdx} className="complex-section">
              <h4>{section.name}</h4>
              {section.params.map((param, pIdx) => {
                const isNormalFlow = param[0].toLowerCase().includes('normal flow designed');
                return (
                  <div key={pIdx} className="row-inputs">
                    <input 
                      value={param[0]} 
                      onChange={(e) => handleComplexSectionChange(activeTab, sIdx, pIdx, 0, e.target.value)} 
                      disabled={isNormalFlow}
                      title={isNormalFlow ? "This value is automatically calculated from Page 4" : ""}
                      style={isNormalFlow ? { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#64748b', cursor: 'not-allowed' } : {}}
                    />
                    <input 
                      value={param[1]} 
                      onChange={(e) => handleComplexSectionChange(activeTab, sIdx, pIdx, 1, e.target.value)} 
                      disabled={isNormalFlow}
                      title={isNormalFlow ? "This value is automatically calculated from Page 4" : ""}
                      style={isNormalFlow ? { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#64748b', cursor: 'not-allowed' } : {}}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'page8' || activeTab === 'page9' || activeTab === 'page10' || activeTab === 'page11' || activeTab === 'page12' || activeTab === 'page13') && (
        <div className="editor-group">
          <h3 style={{ textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            {data[activeTab].title || 'Equipment List'}
          </h3>
          {data[activeTab].equipments.map((equip, eIdx) => (
            <div key={eIdx} className="equipment-edit-card" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
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
                    <div key={sIdx} className="spec-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', alignItems: 'center' }}>
                      <input 
                        value={label} 
                        onChange={(e) => handleEquipmentChange(activeTab, eIdx, sIdx, 0, e.target.value)}
                        style={{ fontSize: '0.85rem', color: '#94a3b8', background: 'transparent', border: 'none' }}
                      />
                      
                      {hasNumeric ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="number" 
                            step={label.toLowerCase().includes('motor') || label.toLowerCase().includes('hp') ? "0.1" : "1"}
                            value={parseFloat(numMatch[1])}
                            onChange={(e) => handleSpecValueChange(e.target.value + numMatch[2])}
                            style={{ width: '80px', padding: '4px 8px' }}
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
                          style={{ width: '100%' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pageCivil' && (
        <div className="editor-group">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--primary)" /> 
            Civil Tank Dimensions
          </h3>
          <p className="help-text">Adjust tank dimensions. Volume updates automatically.</p>
          
          {data.pageCivil.table.rows.map((row, rIdx) => {
            const dimStr = row[2] || "0m × 0m × 0m";
            const parts = dimStr.split('×').map(s => parseFloat(s.replace(/[^0-9.]/g, '')) || 0);
            const dims = { l: parts[0] || 0, b: parts[1] || 0, h: parts[2] || 0 };

            const updateDim = (field, val) => {
              const newDims = { ...dims, [field]: parseFloat(val) || 0 };
              const newDimStr = `${newDims.l.toFixed(2)}m × ${newDims.b.toFixed(1)}m × ${newDims.h.toFixed(1)}m`;
              const newVol = newDims.l * newDims.b * newDims.h;
              
              const newData = JSON.parse(JSON.stringify(data));
              newData.pageCivil.table.rows[rIdx][2] = newDimStr;
              newData.pageCivil.table.rows[rIdx][6] = newVol.toFixed(2);
              
              // Recalculate total volume
              const total = newData.pageCivil.table.rows.reduce((sum, r) => sum + (parseFloat(r[6]) || 0), 0);
              newData.pageCivil.table.total = total.toFixed(2);
              
              if (recalculateData) recalculateData(newData);
              else setData(newData);
            };

            return (
              <div key={rIdx} className="complex-section" style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
                <label style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem' }}>{row[1]}</label>
                <div className="calc-input-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px' }}>Length (L)</label>
                    <input type="number" step="0.05" value={dims.l} onChange={(e) => updateDim('l', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px' }}>Width (B)</label>
                    <input type="number" step="0.1" value={dims.b} onChange={(e) => updateDim('b', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px' }}>Height (H)</label>
                    <input type="number" step="0.1" value={dims.h} onChange={(e) => updateDim('h', e.target.value)} />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="settings-divider" style={{ margin: '2rem 0' }}></div>

          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} color="#10b981" />
            Electrical Load Details
          </h3>
          <p className="help-text">Update motor HP, quantity, and running hours. Operating costs will update reactively.</p>

          {data.pageCivil.electrical.rows.map((row, rIdx) => {
            // Row format: [SNo, Name, OpKW, ConnKW, Qty, RunHrs, KWHDay]
            const name = row[1];
            const opKW = parseFloat(row[2]) || 0;
            const hp = (opKW / 0.746).toFixed(2);
            const qtyStr = row[4];
            const qty = parseInt(qtyStr.replace(/[^0-9]/g, '')) || 1;
            const runHrs = parseFloat(row[5]) || 0;

            const updateElectrical = (field, val) => {
              const newData = JSON.parse(JSON.stringify(data));
              const r = newData.pageCivil.electrical.rows[rIdx];
              
              if (field === 'hp') {
                const newHP = parseFloat(val) || 0;
                const newKW = newHP * 0.746;
                r[2] = newKW.toFixed(2);
                
                // Sync back to equipment pages if possible
                [8, 9, 10, 11, 12, 13].forEach(pNum => {
                  const page = newData[`page${pNum}`];
                  if (!page || !page.equipments) return;
                  page.equipments.forEach(eq => {
                    if (eq.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(eq.name.toLowerCase())) {
                      const spec = eq.specs.find(s => s[0].toLowerCase().includes('motor') || s[0].toLowerCase().includes('power'));
                      if (spec) spec[1] = `${newHP} HP`;
                    }
                  });
                });
              } else if (field === 'qty') {
                const newQty = parseInt(val) || 1;
                r[4] = newQty === 2 ? '2(1W+1S)' : newQty.toString();
              } else if (field === 'runHrs') {
                r[5] = val.toString();
              }

              if (recalculateData) recalculateData(newData);
              else setData(newData);
            };

            return (
              <div key={rIdx} className="complex-section" style={{ borderLeft: '2px solid #10b981', paddingLeft: '12px' }}>
                <label style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem' }}>{name}</label>
                <div className="calc-input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px' }}>Motor HP</label>
                    <input type="number" step="0.1" value={hp} onChange={(e) => updateElectrical('hp', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px' }}>Qty (Nos)</label>
                    <input type="number" min="1" value={qty} onChange={(e) => updateElectrical('qty', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px' }}>Run Hrs</label>
                    <input type="number" min="0" max="24" step="0.5" value={runHrs} onChange={(e) => updateElectrical('runHrs', e.target.value)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'pageCost' && (
        <div className="editor-group">
          <h3>Operating Cost</h3>
          {data.pageCost.rows.map((row, rIdx) => (
            <div key={rIdx} className="row-inputs">
              <input value={row[1]} onChange={(e) => {
                const newData = { ...data };
                newData.pageCost.rows[rIdx][1] = e.target.value;
                setData(newData);
              }} />
              <input value={row[2]} onChange={(e) => {
                const newData = { ...data };
                newData.pageCost.rows[rIdx][2] = e.target.value;
                setData(newData);
              }} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pageCommercial' && (
        <div className="editor-group">
          <h3>Commercial Offer</h3>
          <label>Price</label>
          <input value={data.pageCommercial.priceTable[0][2]} onChange={(e) => {
            const newData = { ...data };
            newData.pageCommercial.priceTable[0][2] = e.target.value;
            setData(newData);
          }} />
          
          <div style={{ marginTop: '1rem', padding: '12px', background: 'rgba(16,185,129,0.05)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.15)' }}>
            <label style={{ color: '#10b981', marginBottom: '10px', display: 'block', fontSize: '0.65rem', fontWeight: '800' }}>GST CALCULATION MODE</label>
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
              <button 
                onClick={() => handleCalcChange('taxMode', 'inclusive')}
                style={{ 
                  flex: 1, 
                  padding: '9px', 
                  borderRadius: '6px', 
                  border: 'none',
                  background: data.calculations.taxMode === 'inclusive' ? '#10b981' : 'transparent',
                  color: data.calculations.taxMode === 'inclusive' ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                INCLUSIVE
              </button>
              <button 
                onClick={() => handleCalcChange('taxMode', 'exclusive')}
                style={{ 
                  flex: 1, 
                  padding: '9px', 
                  borderRadius: '6px', 
                  border: 'none',
                  background: data.calculations.taxMode === 'exclusive' ? '#10b981' : 'transparent',
                  color: data.calculations.taxMode === 'exclusive' ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                EXCLUSIVE
              </button>
            </div>
            <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '8px', fontStyle: 'italic' }}>
              {data.calculations.taxMode === 'inclusive' 
                ? 'Price includes 18% GST. Base price will be back-calculated.' 
                : 'Price is base amount. 18% GST will be added on top.'}
            </p>
          </div>
          <h4>Notes</h4>
          {data.pageCommercial.notes.map((note, idx) => (
            <textarea key={idx} value={note} onChange={(e) => handleGenericArrayChange('pageCommercial', 'notes', idx, e.target.value)} />
          ))}
        </div>
      )}

      {activeTab === 'pageExclusions' && (
        <div className="editor-group">
          <h3>Scope of Exclusions</h3>
          {data.pageExclusions.exclusions.map((exc, idx) => (
            <textarea key={idx} value={exc} onChange={(e) => handleGenericArrayChange('pageExclusions', 'exclusions', idx, e.target.value)} />
          ))}
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
