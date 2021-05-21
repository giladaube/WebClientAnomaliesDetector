import {randomColor} from "randomcolor";

// create new model object and add it to models array (using addModel function)
function addModelObj(models, addModel, data, typeModel) {
    // create new model object with given data
    let model = {
        key: data.model_id,
        type: typeModel,
        tooltip: "hover to see anomalies, one click to delete it",
        color: randomColor(),
        couldDetect: true,
        ...data
    }
    // find out if there is pre-existed dummy model, if there is it will override it
    let dummyModel = models.findIndex((obj => obj.model_id === 1));
    if (dummyModel !== -1) { // there is a dummy model in models
        addModel([model]);
    } else {
        addModel([...models, model]);
    }
}

// using api call. create new model and train it
function CreateModel(uri_apiServer, models, addModel, popMessage, updatePopMessage, typeModel, train_data) {
    const api_uri = uri_apiServer + "/model";
    let url = new URL(api_uri),
        // train the new model based on the typeModel algorithm
        params = {model_type: typeModel}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        // train it with the given train_data
        body: new URLSearchParams({train_data: JSON.stringify(train_data)})
    })
        .then(response => {
            const data = response.json();
            // there is a problem with the response data
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                updatePopMessage(true, "Sorry! an error occurred", "due to " + error + ". It is not possible to create a new model at this moment");
                return undefined;
            }
            return data;
        })
        .then(data => {
            // got data back form the api call, add it to models array
            if (data !== undefined) {
                updatePopMessage(true, "New Model has been created", "it's status is " + data.status);
                addModelObj(models, addModel, data, typeModel);
            }
            return null;
        })
        .catch(error => {
            // there is a problem with the connection to the API server
            if (!popMessage.isAlert) {
                updatePopMessage(true, "Sorry! we have a problem", "there is a failure connection with API server. Please try again later.");
            }
        })
}

export {CreateModel};