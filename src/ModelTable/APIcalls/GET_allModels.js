

    function getModels(popMessage, updatePopMessage, callback) {
        let existModels = [];
        setExistModels(popMessage, updatePopMessage, function (models) {
            existModels = [...models];
            callback(existModels);
        })

    }

    function addModels(newModels, callback) {
        let models = [];
        if (newModels.length !== 0) {
            newModels.forEach(m => {
                let model = {
                    "key": m.model_id,
                    "type": "unknown",
                    "tooltip": "there is no information about this model. also, it is not possible to delete it",
                    ...m
                }
                models.push(model);
            })
        } else {
            let model = {
                "key": 1,
                "model_id": 1,
                "type": "hybrid or regression",
                "upload_time": "the creation time of this model",
                "status": "example",
                "tooltip": "this is an example trained model. remove it by train a new model",
            }
            models.push(model);
        }
        callback(models);
    }

    function setExistModels(popMessage, updatePopMessage, callback) {
        fetch("http://localhost:9876/api/models", {
                method: "GET",
            })
            .then(response => {
                const data = response.json();
                if(!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    updatePopMessage(true, "ERROR: Modify this message!", "due to '" + error + "'. It is not possible to update the model's status at the moment.");
                    return undefined;
                }
                return data;
            })
            .then(data => {
                addModels(data, callback);
                if (data.length !== 0)
                    updatePopMessage(true, "Hi there are some existed models!", "they are not yours to use nor to delete");
                else
                    updatePopMessage(true, "Look! you got a dummy model", "train your own model to remove it");
            })
            .catch(error => {
                if (!popMessage.isAlert) {
                    updatePopMessage(true, "We got some bad news..", "there is a failure connection with API server. Please try again later.");
                }
            });
    }

export {setExistModels, getModels};