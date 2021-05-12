import React, {useState} from 'react';
import './App.css';
import ModelTable from "./ModelTable/ModelTable";
import AlterMessage from "./ModelTable/AlterMessage";
import UploadFile from "./AddData/UploadFile";
import {CreateModel} from "./ModelTable/APIcalls/POST_createModel";
import {checkStatus} from "./ModelTable/APIcalls/GET_statusModel";
import {deleteModel} from "./ModelTable/APIcalls/DELETE_deleteModel";
import {DetectModel} from "./ModelTable/APIcalls/POST_detectAnomalies";


function Model() {
    const [models, addModel] = useState([]);
    const [anomalies, addAnomaly] = useState([]);
    const [typeModel, setTypeModel] = useState("regression");
    const [trainFile, setTrainFile] = useState("");
    const [detectId, setDetectId] = useState(undefined);
    const [anomalyFile, setAnomalyFile] = useState("");
    console.log(models);

    const [popMessage, setPopMessage] = useState({
        isAlter: false,
        header: "",
        message: ""
    });

    function updatePopMessage(status, title, reason) {
        setPopMessage({
            isAlter: status,
            header: title,
            message: reason
        });
    }

    function setType(event) {
        setTypeModel(event.target.value);
    }

    function setIdToDetect(event) {
        setDetectId(event.target.id);
    }

    function trainModel() {
        if (trainFile !== "") {
            CreateModel(models, addModel, popMessage, updatePopMessage, typeModel, trainFile);
        } else {
            updatePopMessage(true, "There is a problem with your request", "you need to add a csv train data. Please do so")
        }
    }

    function detectModel() {
        if (anomalyFile !== "") {
            console.log("detect model:");
            console.log(models[models.findIndex((obj => obj.model_id === detectId))]);
            DetectModel(anomalies, addAnomaly, popMessage, updatePopMessage, models[models.findIndex((obj => obj.model_id === detectId))], anomalyFile);
        } else {
            updatePopMessage(true, "There is a problem with your request", "you need to add a csv train data. Please do so")
        }
    }

    function updateStatus(model, callback) {
        checkStatus(models, addModel, popMessage, updatePopMessage, model, callback);
    }

    function deleteOneModel(model, callback) {
        deleteModel(models, addModel, popMessage, updatePopMessage, model, callback);
    }

    function closeAlter() {
        updatePopMessage(false, "");
    }

    return (
        <div className="body-container">
            <div className="row">
                <form className="col-3 text-left upload-data" >
                    <UploadFile placeholder="Load Train data (in csv format)" callback={setTrainFile}/>

                    <div className="row mb-3">
                        <label className="form-label">Choose model's algorithm</label>
                        <div>
                            <div className="form-check">
                                <input onClick={setType} className="form-check-input" name="radioFiled" value="regression" type="radio" defaultChecked/>
                                <label className="form-check-label">regression</label>
                            </div>
                            <div className="form-check">
                                <input onClick={setType} className="form-check-input" name="radioFiled" value="hybrid" type="radio"/>
                                <label className="form-check-label">hybrid</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <button type="button" className="btn btn-primary" value="Train new model" onClick={trainModel}>Train new model</button>
                    </div>
                </form>
                <div className="row">
                    <form className="col-3 text-left upload-data" >
                        <UploadFile placeholder="Load Anomaly data (in csv format)" callback={setAnomalyFile}/>

                        <div className="row mb-3">
                            <div className="dropdown">
                              <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Choose Model to detect
                              </button>
                              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                  {models.length === 0 ? (<li className="dropdown-item">There are no models to detect</li>) :
                                    models.map(model => {
                                        if (model.status === "ready") {
                                            return (<li className="dropdown-item" id={model.key} onClick={setIdToDetect}>{model.type} model (id: {model.key})</li>)
                                        }
                                        return undefined;
                                    })}
                              </ul>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <button type="button" className="btn btn-primary" value="create new model" onClick={detectModel}>Get Anomalies</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="models overflow-auto fixed-bottom">
                <ModelTable
                    cards = {models}
                    checkStatus = {updateStatus}
                    deleteModel = {deleteOneModel}
                />
            </div>
            <div>
                <AlterMessage alert={popMessage.isAlter} title={popMessage.header} reason={popMessage.message} callback={closeAlter}/>
            </div>
        </div>
    )
}

export default Model;