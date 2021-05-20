import React, {useState} from 'react';
import '../App.css';
import UploadFile from "./UploadFile";

function UploadTrainForm(props) {

    /**
     *  set model's type as the train' algorithm
     */
    const [modelType, setModelType] = useState(props.choice1);
    // set "train" button to be disable until csv file has been uploaded
    const [enableUpload, setEnableUpload] =  useState(true);

    // upload csv train-data
    function setTrainFiles(file, csv) {
        props.setDisplayFiles(file, csv);
        // make "train" button enable
        if (file !== "") {
            setEnableUpload(false);
        } else {
            setEnableUpload(true);
        }
    }
    // add selected train-algorithm to modelType
    function setType(event) {
        setModelType(event.target.value);
    }
    // train a new model with all given info
    function train() {
        props.trainModel(modelType);
    }

    return (
            <form className="col-3 text-left upload-data">
                {/* add logic to upload a csv file */}
                <UploadFile placeholder={props.header} callback={setTrainFiles}/>

                <div className="row mb-3">
                    <label className="form-label">{props.headerChoose}</label>
                    {/* choose the type of the new model */}
                    <div>
                        <div className="form-check">
                            <input disabled={props.models.length === 0 ? props.gatherModels() : false} onClick={setType} className="form-check-input" name="radioFiled"
                                   value="regression" type="radio" defaultChecked/>
                            <label className="form-check-label">{props.choice1}</label>
                        </div>
                        <div className="form-check">
                            <input disabled={props.models.length === 0 ? props.gatherModels() : false} onClick={setType} className="form-check-input" name="radioFiled"
                                   value="hybrid" type="radio"/>
                            <label className="form-check-label">{props.choice2}</label>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <button disabled={enableUpload} type="button" className="btn btn-primary" onClick={train}>
                        {props.buttonLabel}
                    </button>
                </div>
            </form>
    )
}

export default UploadTrainForm;
