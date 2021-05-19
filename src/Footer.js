import React from 'react';

var year = (new Date()).getFullYear();


function Footer() {
    return (
       <div>
           <label className="footer">
               © Gilad Daube, Or Gottman, Yahel Jacobs, Tal Klein {year}
           </label>
       </div>
    )
}

export default Footer;