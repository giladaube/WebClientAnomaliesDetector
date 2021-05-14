import React from 'react';
import '../App.css';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip';
import UploadFile from "./UploadFile";

function UploadTrainForm(props) {


    return (
            <form className="col-3 text-left upload-data">
                <UploadFile placeholder={props.header} callback={props.setTrainFiles}/>

                <div className="row mb-3">
                    <label className="form-label">{props.headerChoose}</label>
                    <div>
                        <div className="form-check">
                            <input disabled={props.models.length === 0 ? props.gatherModels() : false} onClick={props.setType} className="form-check-input" name="radioFiled"
                                   value="regression" type="radio" defaultChecked/>
                            <label className="form-check-label">{props.choice1}</label>
                        </div>
                        <div className="form-check">
                            <input disabled={props.models.length === 0 ? props.gatherModels() : false} onClick={props.setType} className="form-check-input" name="radioFiled"
                                   value="hybrid" type="radio"/>
                            <label className="form-check-label">{props.choice2}</label>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <OverlayTrigger data-bs-toggle="tooltip" data-bs-placement="top" overlay={<Tooltip id="tooltip">{props.tooltipLable}</Tooltip>}>
                        <button disabled={props.trainFile === ""} type="button" className="btn btn-primary" onClick={props.trainModel}>
                            {props.buttonLabel}
                        </button>
                    </OverlayTrigger>
                </div>
            </form>
    )
}

export default UploadTrainForm;
