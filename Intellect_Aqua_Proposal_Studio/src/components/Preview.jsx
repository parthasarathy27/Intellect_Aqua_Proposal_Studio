import React from 'react';
import LetterPage from './LetterPage';
import './Preview.css';

const Preview = ({ data }) => {
  const renderTechnicalPage = (pageKey) => {
    const page = data[pageKey];
    if (!page || !page.sections) return null;
    return (
      <div className="page-wrapper" key={pageKey} id={pageKey}>
        <LetterPage settings={data.settings}>
          <div className="technical-content">
            {page.title && <h2 className="section-title">{page.title}</h2>}
            {page.sections.map((section, sIdx) => (
              <div key={sIdx} className="param-section">
                <h3 className="sub-title-main">{section.name}</h3>
                <table className="param-table border-table">
                  <tbody>
                    {section.params.map((param, pIdx) => (
                      <tr key={pIdx}>
                        <td style={{width: '55mm', fontWeight: 'bold', background: '#f8fafc'}}>{param[0]}</td>
                        <td>{param[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </LetterPage>
      </div>
    );
  };


  const renderEquipmentPage = (pageKey) => {
    const page = data[pageKey];
    if (!page || !page.equipments) return null;

    let customStyle = null;
    if (pageKey === 'page9') {
      customStyle = {
        paddingTop: '57mm',
        paddingLeft: '20mm',
        paddingRight: '20mm',
        paddingBottom: '38mm'
      };
    }

    // Filter out equipments with no name
    const visibleEquipments = page.equipments.filter(e => e.name && e.name.trim() !== '');

    return (
      <div className="page-wrapper" key={pageKey} id={pageKey}>
        <LetterPage settings={data.settings} customStyle={customStyle}>
          <div className="equipment-content">
            {page.title && <h2 className="section-title small-title">{page.title}</h2>}
            
            {visibleEquipments.map((equip, eIdx) => (
              <div key={eIdx} className="equipment-item-block">
                <h3 className="equipment-item-title">
                  {eIdx + 1}. {equip.name}
                </h3>
                <table className="equipment-item-table">
                  <thead>
                    <tr>
                      <th>DESCRIPTION</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {equip.specs.map((spec, sIdx) => (
                      <tr key={sIdx}>
                        <td>{spec[0]}</td>
                        <td>{spec[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </LetterPage>
      </div>
    );
  };


  return (
    <div className="preview-container">
      {/* Page 1 */}
      <div className="page-wrapper" id="page1">
        <LetterPage settings={data.settings}>
          <div className="page1-content">
            <div className="client-label">CLIENT</div>
            <div className="client-info">
              <div className="client-name">{data.page1.client}</div>
              <div className="client-address">{data.page1.address}</div>
            </div>
            <div className="project-details">
              <div className="detail-row"><span className="label">PROJECT</span><span className="separator">:</span><span className="value">{data.page1.project}</span></div>
              <div className="detail-row"><span className="label">TECHNOLOGY</span><span className="separator">:</span><span className="value">{data.page1.technology}</span></div>
              <div className="detail-row"><span className="label">PROPOSAL NO</span><span className="separator">:</span><span className="value">{(data.page1.proposalPrefix || '') + data.page1.proposalNo}</span></div>
              <div className="detail-row"><span className="label">DATE</span><span className="separator">:</span><span className="value">{data.page1.date}</span></div>
            </div>
          </div>
        </LetterPage>
      </div>

      {/* Page 2 */}
      <div className="page-wrapper" id="page2">
        <LetterPage settings={data.settings}>
          <div className="page2-content">
            <div className="ref-date-row"><span>{(data.page1.proposalPrefix || '') + data.page1.proposalNo}</span><span>{data.page2.date || data.page1.date}</span></div>
            <div className="recipient-info"><div>To</div><div className="recipient-name">{data.page1.client}</div><div className="recipient-address">{data.page1.address}</div></div>
            <div className="salutation">{data.page2.salutation}</div>
            <div className="subject"><strong>Sub:</strong> {data.page2.subject}</div>
            <div className="body-text">{data.page2.body.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
            <div className="closing"><div>Thanking you,</div><div>Yours Truly,</div><div className="company-signature">For Intellect Aqua Private Limited</div><div className="signatory-name">{data.page2.signatoryName}</div><div className="signatory-title">{data.page2.signatoryTitle}</div><div className="signatory-phone">{data.page2.signatoryPhone}</div></div>
          </div>
        </LetterPage>
      </div>

      {/* Page 3 */}
      <div className="page-wrapper" id="page3">
        <LetterPage settings={data.settings}>
          <div className="page3-content">
            <h2 className="section-title">{data.page3.title}</h2>
            <div className="about-text">{data.page3.content}</div>
            {data.page3.features && data.page3.features.length > 0 && (
              <div className="features-section">
                <h3 className="sub-title-main">{data.page3.featuresTitle !== undefined ? data.page3.featuresTitle : 'Key Features of MBR Sewage Treatment Plant'}</h3>
                <ul className="features-list">
                  {data.page3.features.map((feature, idx) => (
                    <li key={idx}>
                      <strong>{feature.title}:</strong> <span>{feature.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </LetterPage>
      </div>

      {/* Page 4 */}
      <div className="page-wrapper" id="page4">
        <LetterPage settings={data.settings}>
          <div className="technical-content compact">
            <h2 className="section-title">DESIGN PARAMETERS:</h2>
            <div className="param-section">
              <h3 className="sub-title-main">A. Flow parameters</h3>
              <table className="param-table border-table">
                <tbody>
                  {data.page4.designParams.flow.map((item, i) => (
                    <tr key={i}>
                      <td style={{width: '55mm', fontWeight: 'bold', background: '#f8fafc'}}>{item.label}</td>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="param-section">
              <h3 className="sub-title-main">B. Raw waste water parameters</h3>
              <table className="param-table border-table">
                <tbody>
                  {data.page4.designParams.raw.map((item, i) => (
                    <tr key={i}>
                      <td style={{width: '55mm', fontWeight: 'bold', background: '#f8fafc'}}>{item.label}</td>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="param-section">
              <h3 className="sub-title-main">C. Treated waste water parameters</h3>
              <table className="param-table border-table">
                <tbody>
                  {data.page4.designParams.treated.map((item, i) => (
                    <tr key={i}>
                      <td style={{width: '55mm', fontWeight: 'bold', background: '#f8fafc'}}>{item.label}</td>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="assumptions-section">
              <h3 className="sub-title-main">ASSUMPTIONS:</h3>
              <ol className="exclusions-list">
                {data.page4.assumptions.filter(item => item && item.trim() !== '').map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </div>

            <div className="calculation-summary" style={{ marginTop: '10px', padding: '10px', background: '#f0f9ff', borderLeft: '4px solid #0284c7', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 'bold', marginBottom: '2px' }}>
                    Plant capacity &nbsp; <span style={{ color: '#0284c7' }}>{data.calculations.flowRate}</span> &nbsp; <span style={{ fontWeight: 'normal', color: '#64748b' }}>{data.calculations.operatingHours} hr running</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 'bold' }}>
                    Flow &nbsp; <span style={{ color: '#0284c7' }}>{(data.calculations.flowRate / data.calculations.operatingHours).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LetterPage>
      </div>


      {['page5', 'page6', 'page7'].map(renderTechnicalPage)}
      {/* Equipment Pages (Dynamic Range) */}
      {['page8', 'page9', 'page10', 'page11', 'page12', 'page13'].map(renderEquipmentPage)}

      {/* Subsequent Pages */}
      <div className="page-wrapper" id="pageCivil">
        <LetterPage settings={data.settings}>
          <div className="technical-content compact">
            {data.pageCivil ? (
              <>
                <h2 className="section-title small-title">{data.pageCivil.title}</h2>
                <table className="param-table border-table mini-text">
                  <thead>
                    <tr>{data.pageCivil.table.headers.map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let sNo = 1;
                      return data.pageCivil.table.rows.map((row, i) => {
                        const hasContent = row[1] && row[1].trim() !== '';
                        const currentSNo = hasContent ? `${sNo++}.` : '';
                        if (!hasContent) return null; // Filter empty rows entirely in preview
                        return (
                          <tr key={i}>
                            <td>{currentSNo}</td>
                            {row.slice(1).map((c, j) => <td key={j}>{c}</td>)}
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan="6"><strong>TOTAL VOLUME</strong></td>
                      <td><strong>{data.pageCivil.table.total} m³</strong></td>
                    </tr>
                  </tfoot>
                </table>

                <div className="section-divider" style={{height: '5mm'}}></div>

                <h3 className="sub-title-main">{data.pageCivil.electrical.title}</h3>
                <table className="param-table border-table mini-text">
                  <thead>
                    <tr>{data.pageCivil.electrical.headers.map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let sNo = 1;
                      return data.pageCivil.electrical.rows.map((row, i) => {
                        const hasContent = row[1] && row[1].trim() !== '';
                        const currentSNo = hasContent ? sNo++ : '';
                        if (!hasContent) return null; // Filter empty rows
                        return (
                          <tr key={i}>
                            <td>{currentSNo}</td>
                            {row.slice(1).map((c, j) => <td key={j} style={j >= 1 ? {textAlign: 'center'} : {}}>{c}</td>)}
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan="7"><strong>TOTAL KWH/DAY</strong></td>
                      <td style={{textAlign: 'center'}}><strong>{data.pageCivil.electrical.total}</strong></td>
                    </tr>
                    <tr>
                      <td colSpan="8" style={{textAlign: 'right', fontStyle: 'italic', fontSize: '8pt'}}>{data.pageCivil.electrical.calc}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="formula-reference" style={{ fontSize: '7.5pt', marginTop: '10px', background: '#f8fafc', padding: '8px', borderLeft: '3px solid #0284c7', borderRadius: '4px', color: '#475569' }}>
                  <strong style={{ color: '#0f172a' }}>Formula Reference:</strong><br />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
                    <div>• Flow Rate = Plant Capacity ÷ Operating Hours</div>
                    <div>• Op. Load KW = Motor HP × 0.746</div>
                    <div>• Tot. Load KW = Quantity × Op. Load KW</div>
                    <div>• KWH/Day = Run Hrs/Day × Op. Load KW</div>
                  </div>
                  <div style={{ marginTop: '4px' }}>• 70% Effective Load = Total KWH/Day × 0.70</div>
                </div>
              </>
            ) : (
              <div className="error-placeholder">Civil data loading...</div>
            )}
          </div>
        </LetterPage>
      </div>

      <div className="page-wrapper" id="pageCost">
        <LetterPage settings={data.settings}>
          <div className="technical-content">
            <h2 className="section-title">{data.pageCost.title}</h2>
            <table className="param-table border-table cost-table">
              <tbody>
                {(() => {
                  let sNo = 1;
                  return data.pageCost.rows.map((row, i) => {
                    const hasContent = row[1] && row[1].trim() !== '';
                    const currentSNo = hasContent ? `${sNo++}.` : '';
                    if (!hasContent) return null;
                    return (
                      <tr key={i} style={i === 2 ? {background: '#f0f9ff'} : {}}>
                        <td style={{width:'8mm'}}>{currentSNo}</td>
                        <td>{row[1]}</td>
                        <td style={{fontWeight: i >= 2 ? 'bold' : 'normal', textAlign: 'right', color: i === 2 ? '#0369a1' : 'inherit'}}>{row[2]}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </LetterPage>
      </div>

      <div className="page-wrapper" id="pageCommercial">
        <LetterPage settings={data.settings}>
          <div className="commercial-content compact">
            <h2 className="section-title small-title" style={{marginBottom:'2.5mm'}}>{data.pageCommercial.title}</h2>

            {data.pageCommercial.commercialData && (
              <table className="param-table border-table price-table" style={{marginBottom:'2.5mm'}}>
                <thead>
                  <tr style={{background:'#0284c7', color:'white'}}>
                    <th style={{width:'10mm', textAlign:'center', padding:'1.2mm 2mm'}}>S.No</th>
                    <th style={{padding:'1.2mm 2mm'}}>Description</th>
                    <th style={{width:'14mm', textAlign:'center', padding:'1.2mm 2mm'}}>Qty</th>
                    <th style={{width:'32mm', textAlign:'right', padding:'1.2mm 2.5mm'}}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let sNo = 1;
                    const cData = data.pageCommercial.commercialData;
                    const rows = [];
                    
                    if (data.pageCommercial.priceTable[0][1]) {
                      rows.push(
                        <tr key="equip">
                          <td style={{textAlign:'center'}}>{sNo++}.</td>
                          <td>{data.pageCommercial.priceTable[0][1]}</td>
                          <td style={{textAlign:'center'}}>1 Lot</td>
                          <td style={{textAlign:'right', fontWeight:'bold'}}>{cData.equipmentPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                        </tr>
                      );
                    }
                    
                    rows.push(
                      <tr key="civil" style={{background:'#f8fafc'}}>
                        <td style={{textAlign:'center'}}>{sNo++}.</td>
                        <td>Civil Work &amp; Construction (RCC Tanks)</td>
                        <td style={{textAlign:'center'}}>1 Lot</td>
                        <td style={{textAlign:'right', color:'#64748b', fontStyle:'italic'}}>By Client</td>
                      </tr>
                    );
                    
                    if (cData.erectionPrice > 0) {
                      rows.push(
                        <tr key="erect">
                          <td style={{textAlign:'center'}}>{sNo++}.</td>
                          <td>Erection &amp; Commissioning Charges</td>
                          <td style={{textAlign:'center'}}>1 Lot</td>
                          <td style={{textAlign:'right', fontWeight:'bold'}}>{cData.erectionPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                        </tr>
                      );
                    }
                    
                    if (cData.amcPrice > 0) {
                      rows.push(
                        <tr key="amc" style={{background:'#f8fafc'}}>
                          <td style={{textAlign:'center'}}>{sNo++}.</td>
                          <td>Annual Maintenance Contract <em style={{color:'#94a3b8', fontSize:'7pt'}}>(Optional)</em></td>
                          <td style={{textAlign:'center'}}>1 Year</td>
                          <td style={{textAlign:'right', fontWeight:'bold'}}>{cData.amcPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                        </tr>
                      );
                    }
                    
                    return rows;
                  })()}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" style={{fontWeight:'bold', background:'#f1f5f9', padding:'1.2mm 2.5mm'}}>{data.calculations.taxMode === 'inclusive' ? 'Sub-Total (Back-calculated)' : 'Sub-Total (Excl. GST)'}</td>
                    <td style={{textAlign:'right', fontWeight:'bold', background:'#f1f5f9', padding:'1.2mm 2.5mm'}}>{data.pageCommercial.commercialData.subtotal.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{padding:'1mm 2.5mm'}}>{`GST @ 18% (${data.calculations.taxMode === 'inclusive' ? 'Included' : 'Extra'})`}</td>
                    <td style={{textAlign:'right', padding:'1mm 2.5mm'}}>{data.pageCommercial.commercialData.gstAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                  </tr>
                  <tr style={{background:'#0284c7', color:'white'}}>
                    <td colSpan="3" style={{fontWeight:'bold', letterSpacing:'0.5px', padding:'1.2mm 2.5mm'}}>GRAND TOTAL {data.calculations.taxMode === 'inclusive' ? '(Fixed - Incl. GST)' : '(Incl. GST @18%)'}</td>
                    <td style={{textAlign:'right', fontWeight:'bold', fontSize:'10pt', padding:'1.2mm 2.5mm'}}>₹ {data.pageCommercial.commercialData.grandTotal.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                  </tr>
                </tfoot>
              </table>
            )}

            <div className="notes-block" style={{marginBottom:'1.5mm'}}>
              {(() => {
                let sNo = 1;
                return data.pageCommercial.notes.filter(n => n && n.trim() !== '').map((note, i) => (
                  <div key={i} className="note-item-simple"><strong>Note-{sNo++}:</strong> {note}</div>
                ));
              })()}
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4mm', marginTop:'2mm'}}>
              <div className="terms-section-simple">
                <h4>Terms and Conditions:</h4>
                <div className="terms-list">
                  {data.pageCommercial.terms.map(([k, v]) => (
                    <div key={k} className="term-row"><span className="term-label">{k}</span><span className="term-value">: {v}</span></div>
                  ))}
                </div>
              </div>
              <div className="payment-section-simple">
                <h4>Payment Terms:</h4>
                <ul className="payment-ul">
                  {data.pageCommercial.payment.filter(p => p && p.trim() !== '').map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>

            <div className="warranty-section-simple" style={{marginTop:'2mm', padding:'2mm 3mm', background:'#f0f9ff', borderLeft:'3px solid #0284c7', borderRadius:'2px'}}>
              <h4 style={{marginBottom:'1mm'}}>Warranty:</h4>
              <p>{data.pageCommercial.warranty}</p>
            </div>
          </div>
        </LetterPage>
      </div>

      {/* Page Exclusions */}
      <div className="page-wrapper" id="pageExclusions">
        <LetterPage settings={data.settings}>
          <div className="technical-content">
            <h2 className="section-title">{data.pageExclusions.title}</h2>
            <ol className="exclusions-list">
              {data.pageExclusions.exclusions.filter(exc => exc && exc.trim() !== '').map((exc, i) => <li key={i}>{exc}</li>)}
            </ol>
            <div className="final-notes-box">
              {(() => {
                let sNo = 1;
                return data.pageExclusions.notes.filter(n => n && n.trim() !== '').map((note, i) => (
                  <div key={i} className="note-item"><strong>Note {sNo++}:</strong> {note}</div>
                ));
              })()}
            </div>
          </div>
        </LetterPage>
      </div>
    </div>
  );
};

export default Preview;
