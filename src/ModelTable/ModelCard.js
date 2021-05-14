import React, {useState} from 'react';
import '../App.css';
import ModelText from "./ModelText";
import DateFormat from "dateformat";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip'

function ModelCard(props) {
    let initialColor = props.status === "ready" ? "green" : (props.status === "example" ? "blue" : "orange");
    initialColor = props.type === "unknown" ? "lightgreen" : initialColor;

    const [model, setModel] = useState({
        id : props.model_id,
        time: DateFormat(Date(props.time), "HH:MM:ss dd-mm-yyyy"),
        type: props.type
    });
    const [color, setColor] = useState(initialColor);
    const [status, setStatus] = useState(props.status);

    function checkStatus() {
        if (status !== "ready" && status !== "example") {
            props.checkStatus(props, function (rcv) {
                console.log(rcv)
                setModel({
                    id: rcv.model_id,
                    ...model});
                setStatus(rcv.status);
                setColor(rcv.status === "ready" ? "green" : "orange");
            });
        }
    }

    function deleteModel() {
        props.deleteModel(props);
    }

    return (
                <div onMouseOver={checkStatus} onDoubleClick={deleteModel}
                     className="model-card-container border rounded-pill" style={{backgroundColor: color}}>
                        <OverlayTrigger data-bs-toggle="tooltip" data-bs-placement="top" overlay={<Tooltip id={model.id}>{props.tooltip}</Tooltip>}>

                            {model.type !== "unknown"
                                ?
                                    <div>
                                        <ModelText
                                            filed="type"
                                            data={model.type}
                                        />
                                        <ModelText
                                            filed="creation time"
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
