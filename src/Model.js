import React, {useState} from 'react';
import { CsvToHtmlTable } from 'react-csv-to-table';
import './App.css';
import ModelTable from "./ModelTable/ModelTable";
import UploadFile from "./AddData/UploadFile";
import {CreateModel} from "./ModelTable/APIcalls/POST_createModel";
import {checkStatus} from "./ModelTable/APIcalls/GET_statusModel";
import {deleteModel} from "./ModelTable/APIcalls/DELETE_deleteModel";
import {DetectModel} from "./ModelTable/APIcalls/POST_detectAnomalies";
import {getModels} from "./ModelTable/APIcalls/GET_allModels";


function Model(props) {

    const popMessage = props.popMessage;
    const updatePopMessage = props.updatePopMessage;

    const [models, addModel] = useState([]);

    const [anomalies, addAnomaly] = useState([]);
    const [typeModel, setTypeModel] = useState("regression");
    const [trainFile, setTrainFile] = useState("");
    const [trainCSV, setTrainCSV] = useState("");

    const [detectId, setDetectId] = useState(undefined);
    const [anomalyFile, setAnomalyFile] = useState("");
    const [anomalyCSV, setAnomalyCSV] = useState("");


    console.log("models");
    console.log(models);

    function gatherModels() {
       getModels(popMessage, updatePopMessage, function (models) {
            addModel([...models]);
        });
       return true;
    }

    function setTrainFiles(file, csv) {
        setTrainFile(file)
        setTrainCSV(csv);
    }

    function setAnomalyFiles(file, csv) {
        setAnomalyFile(file)
        setAnomalyCSV(csv);
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

    function deleteOneModel(model) {
        if (model.model_id !== 1) {
            deleteModel(models, addModel, popMessage, updatePopMessage, model);
        }
    }

    return (
            <div className="body-container">
                <div className="row">
                    <form className="col-3 text-left upload-data">
                         <UploadFile placeholder="Load Train data (in csv format)" callback={setTrainFiles}/>

                         <div className="row mb-3">
                             <label className="form-label">Choose model's algorithm</label>
                             <div>
                                 <div className="form-check">
                                     <input onClick={setType} className="form-check-input" name="radioFiled"
                                            value="regression" type="radio" defaultChecked/>
                                     <label className="form-check-label">regression</label>
                                 </div>
                                 <div className="form-check">
                                     <input onClick={setType} className="form-check-input" name="radioFiled"
                                            value="hybrid" type="radio"/>
                                     <label className="form-check-label">hybrid</label>
                                 </div>
                             </div>
                         </div>
                            <div className="row mb-3">
                                <button disabled={models.length === 0 ? gatherModels() : false} type="button" className="btn btn-primary" value="Train new model" onClick={trainModel}>
                                    Train new model
                                </button>
                            </div>
                    </form>
                    <div className="row">
                        <form className="col-3 text-left upload-data">
                            <UploadFile placeholder="Load Anomaly data (in csv format)" callback={setAnomalyFiles}/>

                            <div className="row mb-3">
                                <div className="dropdown">
                                    <button className="btn btn-primary dropdown-toggle" type="button"
                                            id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        Choose Model to detect
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        {models.length === 0 ? (
                                            <li className="dropdown-item">There are no models to detect</li>) :
                                            models.map(model => {
                                                if (model.status === "ready" && model.type !== "unknown") {
                                                    return (<li key={model.key} className="dropdown-item" id={model.model_id}
                                                                onClick={setIdToDetect}>{model.type} model
                                                        (id: {model.model_id})</li>)
                                                }
                                                return undefined;
                                            })}
                                    </ul>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <button disabled={models.length === 0} type="button" className="btn btn-primary" value="create new model" onClick={detectModel}>
                                    Get Anomalies
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row">
                    <div className="col-3">
                         <div className="models overflow-auto">
                            <ModelTable
                                cards={models}
                                checkStatus={updateStatus}
                                deleteModel={deleteOneModel}
                            />
                        </div>
                    </div>


                    <div className="col-9 overflow-auto models bottom-0 end-0">

                        <CsvToHtmlTable
                           data={trainCSV}
                           csvDelimiter=","
                           tableClassName="table table-striped table-hover"
                        />
                    </div>
                </div>
            </div>)
}

export default Model;