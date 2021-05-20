
    // delete the given model's id from local storage
    function deleteId(models, addModel, anomalies, addAnomaly, id) {
        // delete id from models
        deleteFromArray(models, addModel, id);
        // checks if id exist in anomalies, and delete it
        if (anomalies.find(function (currentValue) {return currentValue.key === id}) !== undefined) {
            deleteFromArray(anomalies, addAnomaly, id);
        }
    }

    function deleteFromArray(items, addItem, id) {
        let updateItems = [...items];
        // replace the last item with the one you delete
        let item = updateItems.pop();
        if (item.key !== id) {
            // find index of removable item
            let alterItem = updateItems.findIndex((obj => obj.key === id));
            updateItems.splice(alterItem, 1, item);
        }
        addItem([...updateItems]);
    }

    // using api call. delete the given model
    function deleteModel(uri_apiServer, models, addModel, anomalies, addAnomaly, popMessage, updatePopMessage, model) {
        // pre-existed models aren't allowed to delete
        if (model.type === "unknown") {
            updatePopMessage(true, "It's not yours to delete..", "it is not possible to delete others models");
        } else {
            const api_uri = uri_apiServer + "/model";
            // create a DELETE api request
            let url = new URL(api_uri),
                        params = {model_id: model.model_id}
                        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            fetch(url, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                })
                .then(response => {
                    // there is a problem with the response data
                    if(response.statusText !== "OK") {
                        const error = (response && response.message) || response.statusText;
                        updatePopMessage(true, "Oh! so sorry..", "due to " + error + ". It is not possible to delete this model at this moment");
                        return undefined;
                    }
                    return response;
                })
                .then(data => {
                     // got data back form the api call, delete it from local storage using deleteId
                    if (data !== undefined) {
                        updatePopMessage(false, "");
                        deleteId(models, addModel, anomalies, addAnomaly, model.model_id);
                    }
                    return null;
                })
                .catch(error => {
                    // there is a problem with the connection to the API server
                    if (!popMessage.isAlert) {
                        updatePopMessage(true, "It's hard to delete this one!", "there is a failure connection with API server. Please try again later.");
                    }
                });
        }
    }

export {deleteModel, deleteId};