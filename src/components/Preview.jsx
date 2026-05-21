import React from 'react';
import LetterPage from './LetterPage';
import './Preview.css';

const Preview = ({ data }) => {
  const footerData = {
    name: data.page2?.signatoryName || '',
    title: data.page2?.signatoryTitle || '',
    phone: data.page2?.signatoryPhone || '',
    executiveName: data.page2?.executiveName || '',
    executiveRole: data.page2?.executiveRole || '',
    executivePhone: data.page2?.executivePhone || '',
  };

  const renderTechnicalPage = (pageKey) => {
    const page = data[pageKey];
    if (!page || !page.sections) return null;
    return (
      <div className="page-wrapper" key={pageKey} id={pageKey}>
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="technical-content">
            {page.title && <h2 className="section-title">{page.title}</h2>}
            {page.sections.filter(s => !s.hidden).map((section, sIdx) => (
              <div key={sIdx} className="param-section">
                <h3 className="sub-title-main">{section.name}</h3>
                <table className="param-table border-table">
                  <tbody>
                    {section.params.map((param, pIdx) => (
                      <tr key={pIdx}>
                        <td style={{ width: '55mm', fontWeight: 'bold', background: '#f8fafc' }}>{param[0]}</td>
                        <td>{param[1]}</td>
                        {param.slice(2).map((col, cIdx) => (
                          <td key={cIdx + 2}>{col}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            
            {page.exclusions && page.exclusions.length > 0 && page.exclusions.some(e => e && e.trim() !== '') && (
              <div className="exclusions-section" style={{ marginTop: '5mm' }}>
                <h3 className="sub-title-main">Scope of Exclusions:</h3>
                <ol className="exclusions-list" style={{ textAlign: 'justify', paddingLeft: '5mm', marginTop: '2mm', fontSize: '10pt' }}>
                  {page.exclusions.filter(item => item && item.trim() !== '').map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              </div>
            )}
            
            {page.notes && page.notes.length > 0 && page.notes.some(n => n && n.trim() !== '') && (
              <div className="notes-section" style={{ marginTop: '5mm' }}>
                <h3 className="sub-title-main">Notes:</h3>
                <ol className="exclusions-list" style={{ textAlign: 'justify', paddingLeft: '5mm', marginTop: '2mm', fontSize: '10pt' }}>
                  {page.notes.filter(item => item && item.trim() !== '').map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              </div>
            )}
          </div>
        </LetterPage>
      </div>
    );
  };


  const renderEquipmentPage = (pageKey, startIndex = 0) => {
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
        <LetterPage settings={data.settings} customStyle={customStyle} footerData={footerData}>
          <div className="equipment-content">
            {page.title && <h2 className="section-title small-title">{page.title}</h2>}

            {visibleEquipments.map((equip, eIdx) => (
              <div key={eIdx} className="equipment-item-block">
                <h3 className="equipment-item-title">
                  {startIndex + eIdx + 1}. {equip.name}
                </h3>
                <table className="equipment-item-table">
                  <thead>
                    <tr>
                      <th>DESCRIPTION</th>
                      {(equip.specs[0] || [1, 2]).slice(1).map((_, i) => (
                        <th key={i}></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {equip.specs.map((spec, sIdx) => (
                      <tr key={sIdx}>
                        {spec.map((col, cIdx) => (
                          <td key={cIdx}>{col}</td>
                        ))}
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
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="page1-content">
            {data.page1.client && <div className="client-label">CLIENT</div>}
            <div className="client-info">
              <div className="client-name">{data.page1.client}</div>
              <div className="client-address">{data.page1.address}</div>
            </div>

            {data.page1.site && (
              <div className="detail-row" style={{ marginTop: '2mm' }}>
                <span className="label" style={{ letterSpacing: '3px', fontWeight: 'bold', fontSize: '14pt' }}>PO SITE</span>
                <span className="separator" style={{ fontSize: '14pt' }}>:</span>
                <span className="value" style={{ fontSize: '14pt' }}>{data.page1.site}</span>
              </div>
            )}
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
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="page2-content">
            <div className="ref-date-row"><span>{(data.page1.proposalPrefix || '') + data.page1.proposalNo}</span><span>{data.page2.date || data.page1.date}</span></div>
            <div className="recipient-info"><div>To</div><div className="recipient-name">{data.page1.client}</div><div className="recipient-address">{data.page1.address}</div></div>
            {data.page2.kindAttn && <div className="kind-attn"><strong>Kind Attn:</strong> {data.page2.kindAttn}</div>}
            <div className="salutation">{data.page2.salutation}</div>
            <div className="subject"><strong>Sub:</strong> <span dangerouslySetInnerHTML={{ __html: data.page2.subject }} style={{ display: 'inline' }} /></div>
            <div className="body-text" dangerouslySetInnerHTML={{ __html: data.page2.body }} />

            <div className="closing-area" style={{ marginTop: '2mm', pageBreakInside: 'avoid' }}>
              <div style={{ marginBottom: '2mm', fontWeight: 'bold' }}>Thanking you,</div>
              <div style={{ marginBottom: '1mm', fontWeight: 'bold' }}>Yours Truly,</div>
              <div className="company-signature" style={{ marginBottom: '4mm', fontWeight: 'bold' }}>For Intellect Aqua Private Limited</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="signatory-side" style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{data.page2.signatoryName}</div>
                  <div style={{ fontSize: '9.5pt' }}>{data.page2.signatoryTitle}</div>
                  <div style={{ fontSize: '9.5pt' }}>{data.page2.signatoryPhone}</div>
                </div>
                <div className="executive-side" style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{data.page2.executiveName}</div>
                  <div style={{ fontSize: '9.5pt' }}>{data.page2.executiveRole}</div>
                  <div style={{ fontSize: '9.5pt' }}>{data.page2.executivePhone}</div>
                </div>
              </div>
            </div>

          </div>
        </LetterPage>
      </div>

      {/* Page 3 */}
      <div className="page-wrapper" id="page3">
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="page3-content">
            {data.page3.title && <h2 className="section-title" style={{ borderBottom: 'none' }}>{data.page3.title}</h2>}
            <div className="about-text" dangerouslySetInnerHTML={{ __html: data.page3.content }} />

            {data.page3.features && data.page3.features.length > 0 && (
              <div className="features-section">
                <h3 className="sub-title-main">{data.page3.featuresTitle !== undefined ? data.page3.featuresTitle : 'Key Features of MBR Sewage Treatment Plant'}</h3>
                <ul className="features-list">
                  {data.page3.features.map((feature, idx) => (
                    <li key={idx}>
                      <strong dangerouslySetInnerHTML={{ __html: feature.title }} /> <span dangerouslySetInnerHTML={{ __html: feature.desc }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.page3.benefits && data.page3.benefits.length > 0 && (
              <div className="features-section" style={{ marginTop: '5mm' }}>
                <h3 className="sub-title-main">{data.page3.benefitsTitle}</h3>
                <ul className="features-list">
                  {data.page3.benefits.map((benefit, idx) => (
                    <li key={idx}>
                      <strong dangerouslySetInnerHTML={{ __html: benefit.title }} /> <span dangerouslySetInnerHTML={{ __html: benefit.desc }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.page3.assumptions && data.page3.assumptions.length > 0 && (
              <div className="assumptions-section" style={{ marginTop: '5mm' }}>
                <h3 className="sub-title-main">Assumptions:</h3>
                <ol className="exclusions-list" style={{ textAlign: 'justify', paddingLeft: '5mm', marginTop: '2mm' }}>
                  {data.page3.assumptions.filter(item => item && item.trim() !== '').map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              </div>
            )}
          </div>
        </LetterPage>
      </div>

      {/* Page 4 */}
      <div className="page-wrapper" id="page4">
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="technical-content compact">
            <h2 className="section-title">{data.page4.title || 'DESIGN PARAMETERS:'}</h2>
            <div className="param-section">
              <table className="param-table border-table" style={{ border: '1px solid black', width: '80%', margin: '0 auto', tableLayout: 'fixed' }}>
                <tbody>
                  {/* A. Flow parameters */}
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', background: 'transparent' }}>
                      A. Flow parameters
                    </td>
                  </tr>
                  {data.page4.designParams.flow.map((item, i) => (
                    <tr key={`flow-${i}`}>
                      <td style={{ width: '50%', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', background: 'transparent', padding: '2mm' }}>{item.label}</td>
                      <td style={{ width: '50%', textAlign: 'center', border: '1px solid black', background: 'transparent', padding: '2mm' }}>{item.value}</td>
                    </tr>
                  ))}

                  {/* B. Raw waste water parameters */}
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', background: 'transparent' }}>
                      B. Raw waste water parameters
                    </td>
                  </tr>
                  {data.page4.designParams.raw.map((item, i) => (
                    <tr key={`raw-${i}`}>
                      <td style={{ width: '50%', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', background: 'transparent', padding: '2mm' }}>{item.label}</td>
                      <td style={{ width: '50%', textAlign: 'center', border: '1px solid black', background: 'transparent', padding: '2mm' }}>{item.value}</td>
                    </tr>
                  ))}

                  {/* C. Treated waste water parameters */}
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', background: 'transparent' }}>
                      C. Treated waste water parameters
                    </td>
                  </tr>
                  {data.page4.designParams.treated.map((item, i) => (
                    <tr key={`treated-${i}`}>
                      <td style={{ width: '50%', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', background: 'transparent', padding: '2mm' }}>{item.label}</td>
                      <td style={{ width: '50%', textAlign: 'center', border: '1px solid black', background: 'transparent', padding: '2mm' }}>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'left', marginTop: '3mm', fontSize: '9pt', color: 'black' }}>
                <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Note:</span> Above treated water parameters are for using treated water in flushing
              </div>
            </div>

            <div className="assumptions-section" style={{ marginTop: '3mm' }}>
              <h2 className="section-title">{data.page4.assumptionsTitle || 'ASSUMPTIONS:'}</h2>
              <ol className="exclusions-list" style={{ textAlign: 'justify', paddingLeft: '5mm', marginTop: '2mm' }}>
                {data.page4.assumptions.filter(item => item && item.trim() !== '').map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            </div>
          </div>
        </LetterPage>
      </div>


      {['page5', 'page6', 'page7'].map(renderTechnicalPage)}
      {/* Equipment Pages (Dynamic Range with continuous numbering) */}
      {(() => {
        let currentGlobalIndex = 0;
        return ['page8', 'page9', 'page10', 'page11', 'page12', 'page13'].map((pageKey) => {
          const page = data[pageKey];
          if (!page || !page.equipments) return null;

          const result = renderEquipmentPage(pageKey, currentGlobalIndex);

          // Increment global index by the number of visible items on this page
          const visibleCount = page.equipments.filter(e => e.name && e.name.trim() !== '').length;
          currentGlobalIndex += visibleCount;

          return result;
        });
      })()}

      {/* Subsequent Pages */}
      <div className="page-wrapper" id="pageCivil">
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="technical-content compact">
            {data.pageCivil ? (
              <>
                <h2 className="section-title small-title" style={{ textDecoration: 'underline' }}>{data.pageCivil.title}</h2>
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

                <div className="section-divider" style={{ height: '5mm' }}></div>

                {data.pageCivil.specialNote && (
                  <div style={{ marginTop: '-15px', marginBottom: '15px', fontSize: '9pt', fontStyle: 'italic', color: '#475569' }}>
                    <strong>Special Note:</strong> {data.pageCivil.specialNote}
                  </div>
                )}

                <h2 className="section-title small-title" style={{ textDecoration: 'underline' }}>{data.pageCivil.electrical.title}</h2>
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
                            {row.slice(1).map((c, j) => <td key={j} style={j >= 1 ? { textAlign: 'center' } : {}}>{c}</td>)}
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan="2"><strong>TOTAL</strong></td>
                      <td style={{ textAlign: 'center' }}><strong>{data.pageCivil.electrical.totalOpLoad}</strong></td>
                      <td style={{ textAlign: 'center' }}><strong>{data.pageCivil.electrical.totalConnLoad}</strong></td>
                      <td></td>
                      <td></td>
                      <td style={{ textAlign: 'center' }}><strong>{data.pageCivil.electrical.total}</strong></td>
                    </tr>
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'right', fontStyle: 'italic', fontSize: '8pt' }}>{data.pageCivil.electrical.calc}</td>
                    </tr>
                  </tfoot>
                </table>


              </>
            ) : (
              <div className="error-placeholder">Civil data loading...</div>
            )}
          </div>
        </LetterPage>
      </div>

      <div className="page-wrapper" id="pageCost">
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="technical-content">
            <h2 className="section-title">{data.pageCost.title}</h2>
            <table className="param-table border-table cost-table">
              <thead>
                <tr>
                  {data.pageCost.headers && data.pageCost.headers.map((h, i) => (
                    <th key={i} style={{ background: '#f8fafc', fontWeight: 'bold' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let sNo = 1;
                  return data.pageCost.rows.map((row, i) => {
                    const hasContent = row.name && row.name.trim() !== '';
                    const currentSNo = hasContent ? `${sNo++}.` : '';
                    if (!hasContent) return null;
                    return (
                      <tr key={row.id || i}>
                        <td style={{ width: '12mm', textAlign: 'center' }}>{currentSNo}</td>
                        <td>{row.name}</td>
                        <td style={{ textAlign: 'right' }}>
                          {(row.value || '').split('\n').map((line, idx) => (
                            <div key={idx}>{line}</div>
                          ))}
                        </td>
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
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="commercial-content compact">
            <h2 className="section-title small-title" style={{ marginBottom: '2.5mm', textAlign: 'center', borderBottom: '1px solid black', width: 'fit-content', margin: '0 auto 5mm auto' }}>{data.pageCommercial.title}</h2>

            {(() => {
              const a1 = data.pageCommercial?.item1Amount || 0;
              const a2 = data.pageCommercial?.item2Amount || 0;
              const subtotal = a1 + a2;
              const gst = Math.round(subtotal * 0.18);
              const grand = subtotal + gst;
              const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

              // Convert number to Indian words
              const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                'Seventeen', 'Eighteen', 'Nineteen'];
              const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
              const numToWords = (n) => {
                if (n === 0) return 'Zero';
                const convert = (num) => {
                  if (num === 0) return '';
                  if (num < 20) return ones[num] + ' ';
                  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '') + ' ';
                  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred ' + convert(num % 100);
                  if (num < 100000) return convert(Math.floor(num / 1000)) + 'Thousand ' + convert(num % 1000);
                  if (num < 10000000) return convert(Math.floor(num / 100000)) + 'Lakh ' + convert(num % 100000);
                  return convert(Math.floor(num / 10000000)) + 'Crore ' + convert(num % 10000000);
                };
                const rupees = Math.floor(n);
                const paise = Math.round((n - rupees) * 100);
                let result = convert(rupees).trim() + ' Rupees';
                if (paise > 0) result += ' and ' + convert(paise).trim() + ' Paise';
                result += ' Only';
                return result;
              };

              const item1Lines = (data.pageCommercial?.item1Desc || '').split('\n');
              const item2Lines = (data.pageCommercial?.item2Desc || '').split('\n');

              return (
                <table className="param-table border-table price-table" style={{ marginBottom: '4mm', border: '1px solid black', width: '100%' }}>
                  <thead>
                    <tr style={{ background: 'transparent', color: 'black' }}>
                      <th style={{ width: '14mm', textAlign: 'center', padding: '2mm 1.5mm', border: '1px solid black', fontSize: '9pt' }}>S. No</th>
                      <th style={{ padding: '2mm', border: '1px solid black', fontSize: '9pt' }}>Description</th>
                      <th style={{ width: '42mm', textAlign: 'right', padding: '2mm', border: '1px solid black', fontSize: '9pt' }}>Amount (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1 — STP */}
                    <tr>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', border: '1px solid black', padding: '2mm 1.5mm', fontSize: '9pt' }}>1.</td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '9pt', lineHeight: '1.5' }}>
                        <div dangerouslySetInnerHTML={{ __html: data.pageCommercial?.item1Desc }} />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', border: '1px solid black', padding: '2mm', fontSize: '9pt', whiteSpace: 'nowrap' }}>{fmt(a1)}</td>
                    </tr>
                    {/* Row 2 — OCEMS */}
                    <tr>
                      <td style={{ textAlign: 'center', verticalAlign: 'top', border: '1px solid black', padding: '2mm 1.5mm', fontSize: '9pt' }}>2.</td>
                      <td style={{ border: '1px solid black', padding: '2mm', fontSize: '9pt', lineHeight: '1.5' }}>
                        <div dangerouslySetInnerHTML={{ __html: data.pageCommercial?.item2Desc }} />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', border: '1px solid black', padding: '2mm', fontSize: '9pt', whiteSpace: 'nowrap' }}>{fmt(a2)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2" style={{ fontWeight: 'bold', padding: '2mm', border: '1px solid black', fontSize: '9pt' }}>Total</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '2mm', border: '1px solid black', fontSize: '9pt', whiteSpace: 'nowrap' }}>{fmt(subtotal)}</td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ padding: '2mm', border: '1px solid black', fontSize: '9pt' }}>GST 18%</td>
                      <td style={{ textAlign: 'right', padding: '2mm', border: '1px solid black', fontSize: '9pt', whiteSpace: 'nowrap' }}>{fmt(gst)}</td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ fontWeight: 'bold', padding: '2.5mm 2mm', border: '1px solid black', fontSize: '9.5pt' }}>Grand Total</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '10pt', padding: '2.5mm 2mm', border: '1px solid black', whiteSpace: 'nowrap' }}>₹ {fmt(grand)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ padding: '2mm', border: '1px solid black', fontSize: '8.5pt', fontStyle: 'italic', color: '#333' }}>
                        <strong>Amount in Words:</strong> {numToWords(grand)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              );
            })()}

            <div className="notes-block" style={{ marginBottom: '1.5mm' }}>
              {(() => {
                let sNo = 1;
                return data.pageCommercial.notes.filter(n => n && n.trim() !== '').map((note, i) => (
                  <div key={i} className="note-item-simple"><strong>Note-{sNo++}:</strong> <span dangerouslySetInnerHTML={{ __html: note }} style={{ display: 'inline' }} /></div>
                ));
              })()}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm', marginTop: '2mm' }}>
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

            <div className="warranty-section-simple" style={{ marginTop: '3mm' }}>
              <h4 style={{ textDecoration: 'underline', fontSize: '9pt', marginBottom: '1.5mm' }}>Warranty:</h4>
              <p style={{ fontSize: '9pt', margin: 0, lineHeight: '1.4' }}>{data.pageCommercial.warranty}</p>
            </div>
          </div>
        </LetterPage>
      </div>

      {/* Page Process Flow Diagram */}
      <div className="page-wrapper" id="pageProcessFlow">
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="technical-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 className="section-title">{data.pageProcessFlow?.title || 'PROCESS FLOW DIAGRAM'}</h2>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '5mm', minHeight: '600px' }}>
              <img src={data.pageProcessFlow?.imagePath || '/assets/STP MBR 2.jpg'} alt="Process Flow Diagram" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </LetterPage>
      </div>

      {/* Page Exclusions */}
      <div className="page-wrapper" id="pageExclusions">
        <LetterPage settings={data.settings} footerData={footerData}>
          <div className="technical-content">
            <h2 className="section-title" style={{ fontSize: '10pt' }}>{data.pageExclusions.title}</h2>
            <ol className="exclusions-list" style={{ fontSize: '10pt' }}>
              {data.pageExclusions.exclusions.filter(exc => exc && exc.trim() !== '').map((exc, i) => <li key={i} style={{ fontSize: '10pt' }} dangerouslySetInnerHTML={{ __html: exc }} />)}
            </ol>
            <div className="notes-section" style={{ marginTop: '5mm' }}>
              <div style={{ fontWeight: 'bold', fontSize: '10pt', textDecoration: 'underline', marginBottom: '2mm', color: 'black' }}>Note:</div>
              <ol className="exclusions-list" style={{ marginTop: 0, fontSize: '10pt' }}>
                {data.pageExclusions.notes.filter(n => n && n.trim() !== '').map((note, i) => (
                  <li key={i} style={{ fontSize: '10pt' }} dangerouslySetInnerHTML={{ __html: note }} />
                ))}
              </ol>
            </div>
          </div>
        </LetterPage>
      </div>
    </div>
  );
};


export default Preview;
