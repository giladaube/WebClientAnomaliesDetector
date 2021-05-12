
    function setStatus(models, addModel, model, prvModel) {
        if (model.status !== prvModel.status) {
            let updateModels = [...models];
            let alterModel = updateModels.findIndex((obj => obj.model_id === model.model_id));

            updateModels[alterModel].status = model.status;
            addModel([...updateModels]);
        }
        console.log(models);
    }

    function checkStatus(models, addModel, popMessage, updatePopMessage, model, callback) {
        let url = new URL("http://localhost:9876/api/model"),
                        params = {model_id: model.id}
                        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url, {
                method: "GET",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            })
            .then(response => {
                const data = response.json();
                if(!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    updatePopMessage(true, "Sorry houston, we have a problem!", "due to '" + error + "'. It is not possible to update the model's status at the moment.");
                    return undefined;
                }
                return data;
            })
            .then(data => {
                if (data !== undefined) {
                    setStatus(models, addModel, data, model);
                    updatePopMessage(true, "Good news! you got a new status!", "the status for model-id: " + data.model_id + ", has been updated! Go check it out");
                    callback(data);
                }
                return null;
            })
            .catch(error => {
                if (!popMessage.isAlter) {
                    updatePopMessage(true, "We got some bad news..", "there is a failure connection with API server. Please try again later.");
                }
            });
    }

export {checkStatus};