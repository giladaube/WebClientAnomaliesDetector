import React from 'react';
import '../App.css';

function ModelText(props) {
    return (
        <div>
            <label>
                {props.field}: {props.data}
            </label>
        </div>

    )
}

export default ModelText;