
    // delete the given model's id from local storage
    function deleteId(models, addModel, id) {
        let updateModels = [...models];
        // replace the last model with the one you delete
        let model = updateModels.pop();
        if (model.model_id !== id) {
            // find index of removable model
            let alterModel = updateModels.findIndex((obj => obj.model_id === id));
            updateModels.splice(alterModel, 1, model);
        }
        addModel([...updateModels]);
    }

    // using api call. delete the given model
    function deleteModel(models, addModel, popMessage, updatePopMessage, model) {
        // pre-existed models aren't allowed to delete
        if (model.type === "unknown") {
            updatePopMessage(true, "It's not yours to delete..", "it is not possible to delete others models");
        } else {
            // create a DELETE api request
            let url = new URL("http://localhost:9876/api/model"),
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
                        deleteId(models, addModel, model.model_id);
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