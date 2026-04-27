import React from 'react';
import './Editor.css';

const Editor = ({ activeTab, data, updateData, setData, updateCalculation }) => {
  const handleChange = (page, field, value) => {
    updateData(page, field, value);
  };

  const handleCalcChange = (path, value) => {
    updateCalculation(path, value);
  };

  const handleTableChange = (section, index, field, value) => {
    const newData = { ...data };
    newData.page4.designParams[section][index][field] = value;
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
    setData(newData);
  };

  const handleEquipmentChange = (page, equipIndex, specIndex, fieldIndex, value) => {
    const newData = { ...data };
    newData[page].equipments[equipIndex].specs[specIndex][fieldIndex] = value;
    setData(newData);
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
      {activeTab === 'calculation' && (
        <div className="editor-group">
          <h3>1. Flow Parameters</h3>
          <div className="calc-input-group">
            <div>
              <label>Flow Rate (KLD)</label>
              <input type="number" value={data.calculations.flowRate} onChange={(e) => handleCalcChange('flowRate', parseFloat(e.target.value))} />
            </div>
            <div>
              <label>Operating Hours (hrs)</label>
              <input type="number" value={data.calculations.operatingHours} onChange={(e) => handleCalcChange('operatingHours', parseFloat(e.target.value))} />
            </div>
          </div>

          <h3>2. Blower & Diffuser</h3>
          <div className="calc-input-group">
            <div>
              <label>Blower Capacity (HP)</label>
              <input type="number" value={data.calculations.blowerHP} onChange={(e) => handleCalcChange('blowerHP', parseFloat(e.target.value))} />
            </div>
            <div>
              <label>Air per Diffuser (m3/h)</label>
              <input type="number" value={data.calculations.airPerDiffuser} onChange={(e) => handleCalcChange('airPerDiffuser', parseFloat(e.target.value))} />
            </div>
          </div>

          <h3>3. Membrane Specs</h3>
          <div className="calc-input-group">
            <div>
              <label>Membrane Flux (L/m2/h)</label>
              <input type="number" value={data.calculations.membraneFlux} onChange={(e) => handleCalcChange('membraneFlux', parseFloat(e.target.value))} />
            </div>
            <div>
              <label>Module Size (sq m)</label>
              <input type="number" value={data.calculations.moduleSize} onChange={(e) => handleCalcChange('moduleSize', parseFloat(e.target.value))} />
            </div>
          </div>

          <h3>4. Tank Dimensions (m)</h3>
          {Object.keys(data.calculations.tanks).map(tank => (
            <div key={tank} className="tank-calc-row">
              <label className="capitalize">{tank.replace(/([A-Z])/g, ' $1')} Tank (L x W x D)</label>
              <div className="row-inputs">
                <input type="number" placeholder="L" value={data.calculations.tanks[tank].l} onChange={(e) => handleCalcChange(`tanks.${tank}.l`, parseFloat(e.target.value))} />
                <input type="number" placeholder="W" value={data.calculations.tanks[tank].w} onChange={(e) => handleCalcChange(`tanks.${tank}.w`, parseFloat(e.target.value))} />
                <input type="number" placeholder="D" value={data.calculations.tanks[tank].d} onChange={(e) => handleCalcChange(`tanks.${tank}.d`, parseFloat(e.target.value))} />
              </div>
            </div>
          ))}
          
          <div className="info-box">
            <p><strong>Formula Logic Enabled:</strong></p>
            <ul style={{fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-main)'}}>
              <li>Volume = L * W * D</li>
              <li>Blower Power = HP * 0.746 KW</li>
              <li>Membrane Area = (Flow / Hours) / Flux</li>
              <li>Diffusers = (Flow * 1.2) / Air per Diffuser</li>
              <li>Operating Cost = Power + Consumables</li>
            </ul>
          </div>
        </div>
      )}


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
          <input type="text" value={data.page1.proposalNo} onChange={(e) => handleChange('page1', 'proposalNo', e.target.value)} />
          <label>Date</label>
          <input type="text" value={data.page1.date} onChange={(e) => handleChange('page1', 'date', e.target.value)} />
        </div>
      )}

      {activeTab === 'page2' && (
        <div className="editor-group">
          <label>Reference No</label>
          <input type="text" value={data.page2.refNo} onChange={(e) => handleChange('page2', 'refNo', e.target.value)} />
          <label>Date</label>
          <input type="text" value={data.page2.date} onChange={(e) => handleChange('page2', 'date', e.target.value)} />
          <label>Recipient Name</label>
          <input type="text" value={data.page2.recipientName} onChange={(e) => handleChange('page2', 'recipientName', e.target.value)} />
          <label>Recipient Address</label>
          <textarea value={data.page2.recipientAddress} onChange={(e) => handleChange('page2', 'recipientAddress', e.target.value)} />
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
        </div>
      )}

      {activeTab === 'page4' && (
        <div className="editor-group">
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
              {section.params.map((param, pIdx) => (
                <div key={pIdx} className="row-inputs">
                  <input value={param[0]} onChange={(e) => handleComplexSectionChange(activeTab, sIdx, pIdx, 0, e.target.value)} />
                  <input value={param[1]} onChange={(e) => handleComplexSectionChange(activeTab, sIdx, pIdx, 1, e.target.value)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'page8' || activeTab === 'page9' || activeTab === 'page10' || activeTab === 'page11' || activeTab === 'page12') && (
        <div className="editor-group">
          <h3>{data[activeTab].title || 'Equipment List'}</h3>
          {data[activeTab].equipments.map((equip, eIdx) => (
            <div key={eIdx} className="complex-section">
              <label>{equip.id}. {equip.name}</label>
              {equip.specs.map((spec, sIdx) => (
                <div key={sIdx} className="row-inputs">
                  <input value={spec[0]} onChange={(e) => handleEquipmentChange(activeTab, eIdx, sIdx, 0, e.target.value)} />
                  <input value={spec[1]} onChange={(e) => handleEquipmentChange(activeTab, eIdx, sIdx, 1, e.target.value)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'page13' && (
        <div className="editor-group">
          <h3>Civil Tank Dimensions</h3>
          {data.page13.table.rows.map((row, rIdx) => (
            <div key={rIdx} className="row-inputs">
              <input value={row[1]} onChange={(e) => handleNestedTableChange('page13', 'table', rIdx, 1, e.target.value)} />
              <input value={row[2]} onChange={(e) => handleNestedTableChange('page13', 'table', rIdx, 2, e.target.value)} />
            </div>
          ))}
          <h3>Electrical Load Details</h3>
          {data.page13.electrical.rows.map((row, rIdx) => (
            <div key={rIdx} className="row-inputs">
              <input value={row[1]} onChange={(e) => handleNestedTableChange('page13', 'electrical', rIdx, 1, e.target.value)} />
              <input value={row[3]} onChange={(e) => handleNestedTableChange('page13', 'electrical', rIdx, 3, e.target.value)} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'page14' && (
        <div className="editor-group">
          <h3>Operating Cost</h3>
          {data.page14.rows.map((row, rIdx) => (
            <div key={rIdx} className="row-inputs">
              <input value={row[1]} onChange={(e) => {
                const newData = { ...data };
                newData.page14.rows[rIdx][1] = e.target.value;
                setData(newData);
              }} />
              <input value={row[2]} onChange={(e) => {
                const newData = { ...data };
                newData.page14.rows[rIdx][2] = e.target.value;
                setData(newData);
              }} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'page15' && (
        <div className="editor-group">
          <h3>Commercial Offer</h3>
          <label>Price</label>
          <input value={data.page15.priceTable[0][2]} onChange={(e) => {
            const newData = { ...data };
            newData.page15.priceTable[0][2] = e.target.value;
            setData(newData);
          }} />
          <h4>Notes</h4>
          {data.page15.notes.map((note, idx) => (
            <textarea key={idx} value={note} onChange={(e) => handleGenericArrayChange('page15', 'notes', idx, e.target.value)} />
          ))}
        </div>
      )}

      {activeTab === 'page16' && (
        <div className="editor-group">
          <h3>Scope of Exclusions</h3>
          {data.page16.exclusions.map((exc, idx) => (
            <textarea key={idx} value={exc} onChange={(e) => handleGenericArrayChange('page16', 'exclusions', idx, e.target.value)} />
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
          
          <h3>Cloud & Backup</h3>
          <div className="editor-row" style={{ marginTop: '1rem' }}>
            <label>Storage Mode</label>
            <select 
              value={data.settings.storageMode} 
              onChange={(e) => handleChange('settings', 'storageMode', e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0f172a', color: 'white', border: '1px solid #334155' }}
            >
              <option value="local">Browser Cache (Local)</option>
              <option value="cloud">MongoDB Cloud (Real-time)</option>
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
