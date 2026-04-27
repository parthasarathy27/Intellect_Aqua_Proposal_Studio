import React from 'react';
import LetterPage from './LetterPage';
import './Preview.css';

const Preview = ({ data }) => {
  const renderTechnicalPage = (pageKey) => {
    const page = data[pageKey];
    return (
      <div className="page-wrapper" key={pageKey}>
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
    return (
      <div className="page-wrapper" key={pageKey}>
        <LetterPage settings={data.settings}>
          <div className="equipment-content">
            {page.title && <h2 className="section-title small-title">{page.title}</h2>}
            <table className="param-table border-table equipment-table">
              <thead>
                <tr>
                  <th style={{width: '12mm', textAlign: 'center'}}>S.No</th>
                  <th style={{width: '55mm'}}>Description</th>
                  <th>Technical Specifications</th>
                </tr>
              </thead>
              <tbody>
                {page.equipments.map((equip, eIdx) => (
                  <tr key={eIdx}>
                    <td style={{textAlign: 'center', verticalAlign: 'top', fontWeight: 'bold'}}>{equip.id}.</td>
                    <td style={{fontWeight: 'bold', verticalAlign: 'top', color: '#1e293b'}}>{equip.name}</td>
                    <td style={{padding: '1mm 2mm'}}>
                      <div className="specs-list-mini">
                        {equip.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="spec-mini-row">
                            <span className="spec-label-mini">{spec[0]}</span>
                            <span className="spec-value-mini">: {spec[1]}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LetterPage>
      </div>
    );
  };


  return (
    <div className="preview-container">
      {/* Page 1 */}
      <div className="page-wrapper">
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
              <div className="detail-row"><span className="label">PROPOSAL NO</span><span className="separator">:</span><span className="value">{data.page1.proposalNo}</span></div>
              <div className="detail-row"><span className="label">DATE</span><span className="separator">:</span><span className="value">{data.page1.date}</span></div>
            </div>
          </div>
        </LetterPage>
      </div>

      {/* Page 2 */}
      <div className="page-wrapper">
        <LetterPage settings={data.settings}>
          <div className="page2-content">
            <div className="ref-date-row"><span>{data.page2.refNo}</span><span>{data.page2.date}</span></div>
            <div className="recipient-info"><div>To</div><div className="recipient-name">{data.page2.recipientName}</div><div className="recipient-address">{data.page2.recipientAddress}</div></div>
            <div className="salutation">{data.page2.salutation}</div>
            <div className="subject"><strong>Sub:</strong> {data.page2.subject}</div>
            <div className="body-text">{data.page2.body.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
            <div className="closing"><div>Thanking you,</div><div>Yours Truly,</div><div className="company-signature">For Intellect Aqua Private Limited</div><div className="signatory-name">{data.page2.signatoryName}</div><div className="signatory-title">{data.page2.signatoryTitle}</div><div className="signatory-phone">{data.page2.signatoryPhone}</div></div>
          </div>
        </LetterPage>
      </div>

      {/* Page 3 */}
      <div className="page-wrapper">
        <LetterPage settings={data.settings}>
          <div className="page3-content">
            <h2 className="section-title">{data.page3.title}</h2>
            <div className="about-text">{data.page3.content}</div>
          </div>
        </LetterPage>
      </div>

      {/* Page 4 */}
      <div className="page-wrapper">
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
                {data.page4.assumptions.map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </div>
          </div>
        </LetterPage>
      </div>


      {['page5', 'page6', 'page7'].map(renderTechnicalPage)}
      {['page8', 'page9', 'page10', 'page11', 'page12'].map(renderEquipmentPage)}

      {/* Page 13 */}
      <div className="page-wrapper">
        <LetterPage settings={data.settings}>
          <div className="technical-content compact">
            <h2 className="section-title small-title">{data.page13.title}</h2>
            <table className="param-table border-table mini-text">
              <thead>
                <tr>{data.page13.table.headers.map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.page13.table.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((c, j) => <td key={j}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan="5"><strong>TOTAL VOLUME</strong></td>
                  <td><strong>{data.page13.table.total}</strong></td>
                </tr>
              </tfoot>
            </table>

            <div className="section-divider" style={{height: '5mm'}}></div>

            <h3 className="sub-title-main">{data.page13.electrical.title}</h3>
            <table className="param-table border-table mini-text">
              <thead>
                <tr>{data.page13.electrical.headers.map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.page13.electrical.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((c, j) => <td key={j}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan="6"><strong>TOTAL LOAD (KW)</strong></td>
                  <td><strong>{data.page13.electrical.total}</strong></td>
                </tr>
                <tr>
                  <td colSpan="7" style={{textAlign: 'right', fontStyle: 'italic', fontSize: '8pt'}}>{data.page13.electrical.calc}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </LetterPage>
      </div>

      {/* Page 14 */}
      <div className="page-wrapper">
        <LetterPage settings={data.settings}>
          <div className="technical-content">
            <h2 className="section-title">{data.page14.title}</h2>
            <table className="param-table border-table cost-table">
              <tbody>
                {data.page14.rows.map((row, i) => (
                  <tr key={i}><td>{row[0]}</td><td>{row[1]}</td><td style={{fontWeight: 'bold', textAlign: 'right'}}>{row[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </LetterPage>
      </div>

      {/* Page 15 */}
      <div className="page-wrapper">
        <LetterPage settings={data.settings}>
          <div className="commercial-content compact">
            <h2 className="section-title">{data.page15.title}</h2>
            
            <table className="param-table border-table price-table">
              <thead>
                <tr style={{background: '#f8fafc'}}>
                  <th style={{width: '15mm'}}>S.No</th>
                  <th>Description</th>
                  <th style={{width: '40mm', textAlign: 'right'}}>Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {data.page15.priceTable.map((row, i) => (
                  <tr key={i}><td>{row[0]}</td><td>{row[1]}</td><td style={{fontWeight: 'bold', textAlign: 'right'}}>{row[2]}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="notes-block">
              {data.page15.notes.map((note, i) => (
                <div key={i} className="note-item-simple"><strong>Note-{i+1}:</strong> {note}</div>
              ))}
            </div>

            <div className="terms-section-simple">
              <h4>Terms and Conditions: -</h4>
              <div className="terms-list">
                {data.page15.terms.map(([k, v]) => (
                  <div key={k} className="term-row"><span className="term-label">{k}</span><span className="term-value">: {v}</span></div>
                ))}
              </div>
            </div>

            <div className="payment-section-simple">
              <h4>Payment Terms:-</h4>
              <ul className="payment-ul">
                {data.page15.payment.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            <div className="warranty-section-simple">
              <h4>Warranty:</h4>
              <p>{data.page15.warranty}</p>
            </div>
          </div>
        </LetterPage>
      </div>

      {/* Page 16 */}
      <div className="page-wrapper">
        <LetterPage settings={data.settings}>
          <div className="technical-content">
            <h2 className="section-title">{data.page16.title}</h2>
            <ol className="exclusions-list">
              {data.page16.exclusions.map((exc, i) => <li key={i}>{exc}</li>)}
            </ol>
            <div className="final-notes-box">
              {data.page16.notes.map((note, i) => <div key={i} className="note-item"><strong>Note {i+1}:</strong> {note}</div>)}
            </div>
          </div>
        </LetterPage>
      </div>
    </div>
  );
};

export default Preview;
