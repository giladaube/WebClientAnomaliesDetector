import React, {useState} from 'react';
import './App.css';
import ModelTable from "./ModelTable/ModelTable";
import {CreateModel} from "./ModelTable/APIcalls/POST_createModel";
import {checkStatus} from "./ModelTable/APIcalls/GET_statusModel";
import {deleteModel} from "./ModelTable/APIcalls/DELETE_deleteModel";
import {DetectModel} from "./ModelTable/APIcalls/POST_detectAnomalies";
import {getModels} from "./ModelTable/APIcalls/GET_allModels";
import UploadTrainForm from "./AddData/UploadTrainForm";
import UploadAnomalyForm from "./AddData/UploadAnomalyForm";
import DataTable from "./ModelTable/DataTable";
import GetCharts from "./CreateCharts";



function Model(props) {

    // using given data to create new alert pop-up messages
    const popMessage = props.popMessage;
    const updatePopMessage = props.updatePopMessage;

    // STATES

    /*
        array for each model in database (new or old).
        Values:
        - "key" as model_id (can also accessed via "model_id")
        - "type" as the type of the algorithm used to train this model (could be "regression", "hybrid" and "unknown" for pre-existed model in db)
        - "tooltip" as more info about this model
        - "upload_time"
     */
    const [models, addModel] = useState([]);

    /**
     *  represent this data in table and charts
     *  "file" as in DATA structure (like {"column_name": [data]})
     *  "csv" as in string of data (like "column_name\n data")
     */
    const [displayData, setDisplayData] = useState({
        file: "",
        csv: "",
        span: undefined
    });

    /*
        array for each model which detect function was used on
        Values:
        - "key" as model_id (can also accessed via "id")
        - "type" as the type of the algorithm used to train this model (could be "regression" or "hybrid")
        - "span" as detect anomalies result
     */
    const [anomalies, addAnomaly] = useState([]);

    // add previous models to display
    function gatherModels() {
       getModels(popMessage, updatePopMessage, function (models) {
            addModel([...models]);
        });
       return true;
    }

    // add uploaded csv data to displayData
    function setDisplayFiles(file, csv, span) {
        let updateSpan = undefined;
        if (span !== undefined)
            updateSpan = span;
        setDisplayData({
                file: file,
                csv: csv,
                span: updateSpan
        });
    }

    // using displayData to train a new model (using api call)
    function trainModel(type) {
        // make sure csv train-data has been uploaded
        if (displayData.file !== "") {
            CreateModel(models, addModel, popMessage, updatePopMessage, type, displayData.file);
            // CreateModel(models, addModel, popMessage, updatePopMessage, typeModel, trainFile);
        } else {
            updatePopMessage(true, "There is a problem with your request", "you need to add a csv train data. Please do so")
        }
    }

    // using displayData to detect anomalies in the given model (using api call)
    function detectModel(id) {
        // let detect each model only once
         if (anomalies[anomalies.findIndex((obj => obj.id === id))] === undefined) {
             let thisModel = models[models.findIndex((obj => obj.model_id === id))];
             if (thisModel === undefined) {
                 updatePopMessage(true, "There is a problem", "please try again");
             } else {
                  // make sure csv anomaly-data has been uploaded
                 if (displayData.file !== "") {
                    DetectModel(anomalies, addAnomaly, popMessage, updatePopMessage, thisModel, displayData.file, displayData.csv);
                } else {
                    updatePopMessage(true, "There is a problem with your request", "you need to add a csv anomaly data. Please do so");
                }
             }
         } else {
                updatePopMessage(true, "There is a problem with your request", "it is not possible to detect twice on the same model");
         }
    }

    // change displayData to anomalies data from anomalies array (match to given id model)
    function displayAnomalies(id) {
        let thisModel = anomalies[anomalies.findIndex(obj => obj.id === id)];
        // thisModel existed in anomalies
        if (thisModel !== undefined) {
            setDisplayFiles(thisModel.file, thisModel.csv, thisModel.span);
            updatePopMessage(true, "Anomalies has been displayed", "data belongs to the model with the above color is now shown in the chart and table",
                models[models.findIndex((obj => obj.model_id === id))].color);
        }
    }

    // using api call to check and get current status of the given model
    function updateStatus(model, callback) {
        checkStatus(models, addModel, popMessage, updatePopMessage, model, callback);
    }

    const dummyModelId = 1;
    // using api call to delete the given model
    function deleteOneModel(model) {
        // can't delete the dummy model
        if (model.model_id !== dummyModelId) {
            let thisModel = anomalies[anomalies.findIndex(obj => obj.id === model.model_id)];
            // remove files of the deleted model from display
            if ((thisModel !== undefined && displayData.file === thisModel.file) || models.length === 1) {
                setDisplayFiles("", "");
            }
            deleteModel(models, addModel, popMessage, updatePopMessage, model);
        }
    }

    return (
            <div className="body-container">
                <div className="row container-relative">
                    <div className="">
                        <div className="row">
                            {/*  form to upload data in order to train new model  */}
                            <UploadTrainForm header="Load Train data (in csv format)" models={models} gatherModels={gatherModels} setDisplayFiles={setDisplayFiles}
                                             trainModel={trainModel} headerChoose="Choose model's algorithm" choice1="regression" choice2="hybrid"
                                             buttonLabel="Train new model"/>
                        </div>
                        <div className="row">
                            {/*  form to upload data in order to detect anomaly in exist-trained model  */}
                            <UploadAnomalyForm header="Load Anomaly data (in csv format)" setDisplayFiles={setDisplayFiles} models={models} headerChoose="Choose Model to detect"
                                               errorMessage="There are no models to detect" detectModel={detectModel}
                                               buttonLabel="Get Anomalies"/>
                        </div>
                    </div>
                    {/*  chart component */}
                    {/*<div className="container top-0 start-0">*/}
                    {/*    {displayData.file !== "" ?*/}
                    {/*        <div className="overflow-auto">*/}
                    {/*            <GetCharts isTrain={displayData.span === undefined} data={displayData.file} span={displayData.span === "" ? undefined : displayData.span}/>*/}
                    {/*        </div> : undefined*/}
                    {/*    }*/}
                    {/*</div>*/}
                </div>

                <div className="row">
                    <div className="col-3">
                         {/* add each model to a list */}
                         <div className="models overflow-auto">
                            <ModelTable
                                cards={models}
                                checkStatus={updateStatus}
                                deleteModel={deleteOneModel}
                                displayAnomalies={displayAnomalies}
                            />
                        </div>
                    </div>


                    <div className="col-9 overflow-auto models bottom-0 end-0 margin-top">
                        {/* display the given csv-data in a table */}
                        <DataTable data={displayData.csv}/>
                    </div>
                </div>
            </div>
    )
}

export default Model;