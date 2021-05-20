
    // sends array with all pre-existed models, using callback function
    function getModels(uri_apiServer, popMessage, updatePopMessage, callback) {
        let existModels = [];
        setExistModels(uri_apiServer, popMessage, updatePopMessage, function (models) {
            existModels = [...models];
            callback(existModels);
        })

    }

    // sends all the models founded in the api request, using callback function
    function addModels(newModels, callback) {
        let models = [];
        // there are some pre-existed models
        if (newModels.length !== 0) {
            // for every pre-existed model, create a suitable object (with type "unknown")
            newModels.forEach(existModel => {
                let model = {
                    key: existModel.model_id,
                    type: "unknown",
                    tooltip: "there is no information about this model. also, it is not possible to delete it",
                    color: undefined,
                    couldDetect: false,
                    ...existModel
                }
                models.push(model);
            })
        } else {
            // there aren't pre-existed models. add a dummy model instead
            let model = {
                key: 1,
                model_id: 1,
                type: "hybrid or regression",
                upload_time: "the creation time of this model",
                status: "example",
                tooltip: "this is an example trained model (remove it by train a new model)",
                color: "whitesmoke",
                couldDetect: false
            }
            models.push(model);
        }
        // sends back using callback function
        callback(models);
    }

    // using api call. get all pre-existed models
    function setExistModels(uri_apiServer, popMessage, updatePopMessage, callback) {
        const api_uri = uri_apiServer + "/models";
        fetch(api_uri, {
                method: "GET",
            })
            .then(response => {
                const data = response.json();
                // there is a problem with the response data
                if(!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    updatePopMessage(true, "ERROR: Modify this message!", "due to '" + error + "'. It is not possible to update the model's status at the moment.");
                    return undefined;
                }
                return data;
            })
            .then(data => {
                // got data back form the api call, sends it back using callback function
                addModels(data, callback);
                if (data.length !== 0)
                    updatePopMessage(true, "Hi there are some existed models!", "they are not yours to use nor to delete");
                else
                    updatePopMessage(true, "Look! you got a dummy model", "train your own model to remove it");
            })
            .catch(error => {
                // there is a problem with the connection to the API server
                if (!popMessage.isAlert) {
                    updatePopMessage(true, "We got some bad news..", "there is a failure connection with API server. Please try again later.");
                }
            });
    }

export {setExistModels, getModels};