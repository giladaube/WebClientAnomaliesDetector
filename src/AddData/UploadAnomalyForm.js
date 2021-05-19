import React, {useState} from 'react';
import '../App.css';
import UploadFile from "./UploadFile";
import ColorModel from "../ModelTable/ColorModel";

function UploadAnomalyForm(props) {

    // set "anomaly" button to be disable until csv file has been uploaded
    const [upload, setUpload] =  useState(true);
    // upload csv anomaly-data
    function setAnomalyFiles(file, csv) {
        props.setDisplayFiles(file, csv, "");
        // make "anomaly" button enable
        setUpload(false);
    }

    // define which model should it detect
    const [detectId, setDetectId] = useState(undefined);
    // set selected id model
    function setIdToDetect(event) {
        setDetectId(event.target.id);
    }
    // detect the selected model (by id) with uploaded csv data
    function detect() {
        props.detectModel(detectId);
    }


    return (
            <form className="col-3 text-left upload-data">
                {/* add logic to upload a csv file */}
                <UploadFile placeholder={props.header} callback={setAnomalyFiles}/>

                <div className="row mb-3">
                    <div className="dropdown">
                        {/* choose the model to detect anomalies on */}
                        <button disabled={upload} className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            {props.headerChoose}
                        </button>
                        <ul className="dropdown-menu dropdown-padding" aria-labelledby="dropdownMenuButton1">
                            {props.models.length === 0 ? (
                                // if there are no models to choose from, show the following message
                                <li className="dropdown-item">
                                    {props.errorMessage}
                                </li>) :
                                props.models.map(model => {
                                    // add only models this client created
                                    if (model.status === "ready" && model.type !== "unknown") {
                                        return (
                                            <div key={model.key}>
                                                <li key={model.key} className="dropdown-item position-relative" id={model.model_id} onClick={setIdToDetect}>
                                                    {model.type} model
                                                    {/* add this model color to identify it easily */}
                                                    <div key={model.key} className="dropdown-color">
                                                        <ColorModel color={model.color}/>
                                                    </div>
                                                </li>

                                            </div>
                                        )

                                    }
                                    return undefined;
                                })}
                        </ul>
                    </div>
                </div>
                <div className="row mb-3">
                    <button disabled={upload} type="button" className="btn btn-primary" onClick={detect}>
                        {props.buttonLabel}
                    </button>
                </div>
            </form>
    )
}

export default UploadAnomalyForm;
