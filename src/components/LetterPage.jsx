import React from 'react';
import './LetterPage.css';

const LetterPage = ({ children, settings, customStyle, footerData }) => {
  const style = customStyle || (settings ? {
    paddingTop: `${settings.marginTop}mm`,
    paddingBottom: `${settings.marginBottom}mm`,
    paddingLeft: `${settings.marginLeft}mm`,
    paddingRight: `${settings.marginRight}mm`
  } : {});

  return (
    <div className="letter-page">
      <div className="letter-background">
        <img src="/assets/letter_pad.jpg?v=1" alt="Letterhead Background" />
      </div>
      <div className="letter-content-overlay" style={style}>
        {children}
      </div>


    </div>
  );
};

export default LetterPage;