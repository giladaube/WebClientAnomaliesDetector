import React from 'react';

var year = (new Date()).getFullYear();


function Footer() {
    return (
       <div className="fixed-bottom">
           <p className="footer"> Copyright {year}</p>
       </div>
    )
}

export default Footer;