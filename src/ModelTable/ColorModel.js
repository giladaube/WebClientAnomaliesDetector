import React from 'react';
import '../App.css';

function ColorModel(props) {
    return (
        // add color identify for the model
        <div className="color-model" style={{backgroundColor: props.color}}/>
    )
}

export default ColorModel;