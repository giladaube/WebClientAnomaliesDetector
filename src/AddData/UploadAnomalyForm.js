import React, {useState} from 'react';
import '../App.css';
import UploadFile from "./UploadFile";
import ColorModel from "../ModelTable/ColorModel";

function UploadAnomalyForm(props) {
    // set the title of the dropdown menu
    const [dropdownHeader, setDropdownHeader] = useState(props.headerChoose);
    // set "anomaly" button to be disable until csv file has been uploaded
    const [enableUpload, setEnableUpload] =  useState(true);
    // array of models which detect was used on
    const [detectedAnomalies, setDetectedAnomalies] = useState([]);

    // define which model should it detect
    const [detectId, setDetectId] = useState(undefined);

    // set selected id model and dropdown header menu
    function setIdToDetect(event) {
        setDetectId(event.target.id);
        setHeader(event.target.id);
    }

    // change dropdown header to match chosen model
    function setHeader(id) {
        let model = props.models.find(function (currentValue) {return currentValue.key === id});

        // create new header (include model's identify color)
        if (model !== undefined) {
            const header =
                ( <div className="p-3 d-inline">
                    {/* add this model color to identify it easily */}
                    <div key={model.key} className="d-inline">
                        {/* add identify color */}
                        <ColorModel color={model.color}/>
                        <div className="d-inline p-2">
                            {model.type} model
                        </div>
                    </div>
                </div>);
            setDropdownHeader(header);
        }
    }

    // upload csv anomaly-data
    function setAnomalyFiles(file, csv) {
        props.setDisplayFiles(file, csv, "");
        // make "anomaly" button enable
        if (file !== "") {
            setEnableUpload(false);
        } else {
            setEnableUpload(true);
        }
    }

    // add the detected model to detectedAnomalies
    function addDetectedAnomalies(id) {
        let detectModel= {
            key: id,
            id: id
        };
        // adds this id to detectedAnomalies
        setDetectedAnomalies([...detectedAnomalies, detectModel]);
    }

    // detect the selected model (by id) with uploaded csv data
    function detect() {
        props.detectModel(detectId, function () {
            // set detectId and dropdownHeader back to default values
            addDetectedAnomalies(detectId);
            setDetectId("");
            setDropdownHeader(props.headerChoose)
        });
    }

    return (
            <form className="col-3 text-left upload-data">
                {/* add logic to upload a csv file */}
                <UploadFile placeholder={props.header} callback={setAnomalyFiles}/>

                <div className="row mb-3">
                    <div className="dropdown">
                        {/* choose the model to detect anomalies on */}
                        <button disabled={enableUpload} className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                aria-expanded="true">
                            {dropdownHeader}
                        </button>
                        <ul className="dropdown-menu dropdown-padding" aria-labelledby="dropdownMenuButton1">
                            {props.models.filter(function (currentValue) {return currentValue.couldDetect}).length === 0
                                ? (
                                // there are no models to choose from or all models are already been detected; show the following message
                                <li className="dropdown-item">
                                    {props.errorMessage}
                                </li>)
                                :
                                props.models.map(model => {
                                    // models' list of models this client created (and only first-one-detect model)
                                    if (model.couldDetect && model.status === "ready" &&
                                        detectedAnomalies.find(function (currentValue) {return currentValue.id === model.model_id}) === undefined) {
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
                    <button disabled={enableUpload} type="button" className="btn btn-primary" onClick={detect}>
                        {props.buttonLabel}
                    </button>
                </div>
            </form>
    )
}

export default UploadAnomalyForm;
