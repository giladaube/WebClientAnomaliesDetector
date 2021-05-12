
    function deleteId(models, addModel, id) {
        console.log("delete id");
        let updateModels = [...models];
        let model = updateModels.pop();
        if (model.model_id !== id) {
            // find index of removable model
            let alterModel = updateModels.findIndex((obj => obj.model_id === id));
            updateModels.splice(alterModel, 1, model);
            // updateModels[alterModel]= model;
        }
        addModel([...updateModels]);
        console.log(models);
    }

    function deleteModel(models, addModel, popMessage, updatePopMessage, model, callback) {
        let url = new URL("http://localhost:9876/api/model"),
                        params = {model_id: model.id}
                        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url, {
                method: "DELETE",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            })
            .then(response => {
                if(response.statusText !== "OK") {
                    const error = (response && response.message) || response.statusText;
                    updatePopMessage(true, "Oh! so sorry..", "due to " + error + ". It is not possible to delete this model at this moment");
                    return undefined;
                }
                return response;
            })
            .then(data => {
                if (data !== undefined) {
                    updatePopMessage(false, "");
                    deleteId(models, addModel, model.id);
                    callback(true);
                }
                return null;
            })
            .catch(error => {
                if (!popMessage.isAlter) {
                    updatePopMessage(true, "It's hard to delete this one!", "there is a failure connection with API server. Please try again later.");
                }
            });
    }

export {deleteModel};