import React from 'react';
import '../App.css';
import CSVToJSON from 'csvtojson';

function UploadFile(props) {

    function onChangeHandler(event) {
        let result;
        let file = event.target.files[0];
        console.log(event.target.result);
        let reader = new FileReader();
        reader.onload = function(event) {
            // The file's text will be printed here
            // event.target.
            result = event.target.result;
            CSVToJSON().fromString(result).then(listOfJsons =>{
                let features = listOfJsons[0];     // get the first row (which contains the names of the features).
                let dataInCorrectForm = {};     // the data object to be used by the server side (in JSON format)
                for (let key in features) {     // initialize the object by setting the entries to be the features given in the csv
                    dataInCorrectForm[key.toString()] = []     // each feature maps to an array of values.
                }
                listOfJsons.forEach(json=>{     // add the values correctly into each feature accordingly
                    for (let key in json) {
                        dataInCorrectForm[key].push(json[key])    // can convert the value to float with parseFloat(value) if needed
                    }
                })
                props.callback(JSON.stringify(dataInCorrectForm));
            });
        };

        reader.readAsText(file);
    }


    return (
        <div className="row mb-3">
            <div>
                <div className="form-control ">
                    <label className="form-label">{props.placeholder}</label>
                    <input className="form-control" type="file" name="file" onChange={onChangeHandler}/>
                </div>
            </div>
        </div>
    )
}

export default UploadFile;