
    function addCard(models, addModel, data, typeModel) {
        let model = {
            "key": data.model_id,
            "type": typeModel,
            "tooltip": "double click to delete it",
            ...data
        }
        let dummyModel = models.findIndex((obj => obj.model_id === 1));
        if (dummyModel !== -1) { // there is a dummy model in models
            addModel([model]);
        } else {
            addModel([...models, model]);
        }
    }

    function CreateModel(models, addModel, popMessage, updatePopMessage, typeModel, train_data) {
        let url = new URL("http://localhost:9876/api/model"),
                        params = {model_type: typeModel}
                        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: new URLSearchParams ({train_data: JSON.stringify(train_data)})
            })
            .then(response => {
                const data = response.json();
                if(!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    updatePopMessage(true, "Sorry! an error occurred", "due to " + error + ". It is not possible to create a new model at this moment");
                    return undefined;
                }
                return data;
            })
            .then(data => {
                if (data !== undefined) {
                    updatePopMessage(true,"New Model have been created", "it's status is " + data.status);
                    addCard(models, addModel, data, typeModel);
                }
                return null;
            })
            .catch(error => {
                if (!popMessage.isAlert) {
                    updatePopMessage(true, "Sorry! we have a problem", "there is a failure connection with API server. Please try again later.");
                }
            })
    }

export {CreateModel};