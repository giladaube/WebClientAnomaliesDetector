import React, {useState} from 'react';
import '../App.css';
import ModelText from "./ModelText";
import DateFormat from "dateformat";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip';
import ColorModel from "./ColorModel";

function ModelCard(props) {
    /**
     * decide on the background color of the card based on it's status
     * "example" is for dummy model
     * type "unknown" is for pre-existed models
     */
    let initialColor = props.status === "ready" ? "green" : (props.status === "example" ? "blue" : "orange");
    initialColor = props.type === "unknown" ? "lightgreen" : initialColor;

    // add state for model data, every change will render this card
    const [model, setModel] = useState({
        id : props.model_id,
        time: DateFormat(Date(props.time), "HH:MM:ss dd-mm-yyyy"), // show only half of the original upload_time
        type: props.type
    });
    // state for the color of the card (could change based on status)
    const [color, setColor] = useState(initialColor);
    // state for status's model. could be change by a function
    const [status, setStatus] = useState(props.status);

    // check to see if model's status has changed
    function checkStatus() {
        // only check for an update for new models (not pre-existed or "ready" models)
        if (status !== "ready" && status !== "example") {
            // using a given function to get update data
            props.checkStatus(props, function (rcv) {
                // update the model state with new information
                setModel({
                    id: rcv.model_id,
                    ...model});
                setStatus(rcv.status);
                // change color based on the new status
                setColor(rcv.status === "ready" ? "green" : "orange");
            });
        }
    }

    // display a graph and table of this model anomalies
    function displayAnomalies() {
        props.displayAnomalies(model.id);
    }

    // delete this model
    function deleteModel() {
        props.deleteModel(props);
    }

    return (
                <div onMouseOver={checkStatus} onClick={displayAnomalies} onDoubleClick={deleteModel}
                     className="model-card-container border rounded-pill" style={{backgroundColor: color}}>
                        {/* add a tooltip when hover this card model */}
                        <OverlayTrigger transition={false} data-bs-toggle="tooltip" data-bs-placement="top" overlay={<Tooltip id={model.id}>{props.tooltip}</Tooltip>}>
                            {/* if model's type is unknown- it is pre-existed model. there is no information to show */}
                            {model.type !== "unknown"
                                ?
                                    <div>
                                        <ModelText
                                            field="type"
                                            data={model.type}
                                        />
                                        <ColorModel color={props.color}/>
                                        <ModelText
                                            field="creation time"
                                            // in case it is an example model, show "hybrid or regression"
                                            data={model.type !== "hybrid or regression" ? model.time : props.time}
                                        />
                                    </div>
                                :
                                    <div>
                                        an active model from database
                                    </div>
                            }
                        </OverlayTrigger>
                </div>
    )
}

export default ModelCard;
