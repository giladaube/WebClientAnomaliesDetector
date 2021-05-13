import React, {useState} from 'react';
import '../App.css';
import ModelText from "./ModelText";
import DateFormat from "dateformat";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip'

function ModelCard(props) {
    let initialColor = props.status === "ready" ? "green" : (props.status === "example" ? "blue" : "orange");

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

                    {model.type !== "unknown"
                        ?
                        <OverlayTrigger
                        overlay={
                            <Tooltip data-bs-toggle="tooltip" id={model.id}>
                                {props.tooltip}
                            </Tooltip>
                        }>
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
                        </OverlayTrigger>
                        :
                        <div>
                            There is no information about this model.
                            <br/>
                            it belongs to someone else
                        </div>
                    }

                </div>
    )
}

export default ModelCard;
