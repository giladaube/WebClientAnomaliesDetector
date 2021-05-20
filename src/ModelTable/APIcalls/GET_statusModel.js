    // update status for the given model with new data
    function setStatus(models, addModel, model, prvModel) {
        // update only if the status has been changed
        if (model.status !== prvModel.status) {
            let updateModels = [...models];
            // find the index in models for this model
            let alterModel = updateModels.findIndex((obj => obj.model_id === model.model_id));

            updateModels[alterModel].status = model.status;
            addModel([...updateModels]);
        }
    }

    // using api call. get update data for given model
    function checkStatus(uri_apiServer, models, addModel, popMessage, updatePopMessage, model, callback) {
        const api_uri = uri_apiServer + "/model";
        let url = new URL(api_uri),
                    // asking for data about the given model, by it's id
                    params = {model_id: model.model_id}
                    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        // create new GET api request
        fetch(url, {
                method: "GET",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            })
            .then(response => {
                const data = response.json();
                // there is a problem with the response data
                if(!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    updatePopMessage(true, "Sorry houston, we have a problem!", "due to '" + error + "'. It is not possible to update the model's status at the moment.");
                    return undefined;
                }
                return data;
            })
            .then(data => {
                if (data !== undefined) {
                    // got data back form the api call, update the data in the given model
                    setStatus(models, addModel, data, model);
                    updatePopMessage(true, "Good news! you got a new status!", "the status for the model with the above color has been updated! Go check it out", model.color);
                    callback(data);
                }
                return null;
            })
            .catch(error => {
                // there is a problem with the connection to the API server
                if (!popMessage.isAlert) {
                    updatePopMessage(true, "We got some bad news..", "there is a failure connection with API server. Please try again later.");
                }
            });
    }

export {checkStatus};