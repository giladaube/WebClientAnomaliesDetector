import React, {useState} from 'react';
import { CsvToHtmlTable } from 'react-csv-to-table';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip'
import './App.css';
import ModelTable from "./ModelTable/ModelTable";
import UploadFile from "./AddData/UploadFile";
import {CreateModel} from "./ModelTable/APIcalls/POST_createModel";
import {checkStatus} from "./ModelTable/APIcalls/GET_statusModel";
import {deleteModel} from "./ModelTable/APIcalls/DELETE_deleteModel";
import {DetectModel} from "./ModelTable/APIcalls/POST_detectAnomalies";
import {getModels} from "./ModelTable/APIcalls/GET_allModels";
import UploadTrainForm from "./AddData/UploadTrainForm";
import UploadAnomalyForm from "./AddData/UploadAnomalyForm";
import GetCharts from "./CreateCharts";



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
                <div className="row container-relative">
                    <div className="">
                        <div className="row">
                        <UploadTrainForm header="Load Train data (in csv format)" setTrainFiles={setTrainFiles} models={models} gatherModels={gatherModels} setType={setType}
                                         trainFile={trainFile} trainModel={trainModel} headerChoose="Choose model's algorithm" choice1="regression" choice2="hybrid"
                                         tooltipLable="train a new model" buttonLabel="Train new model"/>
                        </div>
                        <div className="row">
                            <UploadAnomalyForm header="Load Anomaly data (in csv format)" setAnomalyFiles={setAnomalyFiles} models={models} headerChoose="Choose Model to detect"
                                               errorMessage="There are no models to detect" setIdToDetect={setIdToDetect} tooltipLable="detect anomalies" anomalyFile={anomalyFile}
                                               detectModel={detectModel} buttonLabel="Get Anomalies"/>
                        </div>
                    </div>
                    <div className="container top-0 start-0">
                        {trainFile !== "" ?
                            <div className="overflow-auto ">
                                <GetCharts data={trainFile}/>
                            </div> : undefined
                        }
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


                    <div className="col-9 overflow-auto models bottom-0 end-0 margin-top">
                        <CsvToHtmlTable
                           data={trainCSV}
                           csvDelimiter=","
                           tableClassName="table table-striped table-hover"
                        />
                    </div>
                </div>
            </div>
    )
}

export default Model;