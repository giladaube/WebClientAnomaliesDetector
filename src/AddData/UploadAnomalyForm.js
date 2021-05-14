import React from 'react';
import '../App.css';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip';
import UploadFile from "./UploadFile";

function UploadAnomalyForm(props) {


    return (
            <form className="col-3 text-left upload-data">
                <UploadFile placeholder={props.header} callback={props.setAnomalyFiles}/>

                <div className="row mb-3">
                    <div className="dropdown">
                        <button disabled={props.anomalyFile === ""} className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                aria-expanded="false"> {props.headerChoose} </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            {props.models.length === 0 ? (
                                <li className="dropdown-item">{props.errorMessage}</li>) :
                                props.models.map(model => {
                                    if (model.status === "ready" && model.type !== "unknown") {
                                        return (<li key={model.key} className="dropdown-item" id={model.model_id}
                                                    onClick={props.setIdToDetect}>{model.type} model
                                            (id: {model.model_id})</li>)
                                    }
                                    return undefined;
                                })}
                        </ul>
                    </div>
                </div>
                <div className="row mb-3">
                    <OverlayTrigger data-bs-toggle="tooltip" data-bs-placement="top" overlay={<Tooltip id="tooltip">{props.tooltipLable}</Tooltip>}>
                        <button disabled={props.anomalyFile === ""} type="button" className="btn btn-primary" onClick={props.detectModel}>
                            {props.buttonLabel}
                        </button>
                    </OverlayTrigger>
                </div>
            </form>
    )
}

export default UploadAnomalyForm;
