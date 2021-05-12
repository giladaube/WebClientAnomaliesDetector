import React, {useState} from 'react';
import '../App.css';
import ModelText from "./ModelText";
import DateFormat from "dateformat";

function ModelCard(props) {
    let initialColor = props.status === "ready" ? "green" : "orange";

    const [model, setModel] = useState({
        id : props.id,
        time: DateFormat(Date(props.time), "HH:MM:ss dd-mm-yyyy"),
        type: props.type
    });
    const [color, setColor] = useState(initialColor);
    const [status, setStatus] = useState(props.status);

    function checkStatus() {
        if (status !== "ready") {
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
        props.deleteModel(props, function (result) {
            if (result) {
                setModel({
                    id: undefined,
                    time: undefined,
                    type: undefined
                });
                setStatus(undefined);
            }
        });
    }

    return (
        <div onMouseOver={checkStatus} onDoubleClick={deleteModel}
            className= "model-card-container border rounded-pill" style= {{backgroundColor : color}}>
            <div >
                <ModelText
                    filed= "Type"
                    data= {model.type}
                />
                <ModelText
                    filed= "Upload time"
                    data= {model.time}
                />
            </div>
        </div>
    )
}

export default ModelCard;
