
    function addAnomalies(anomalies, addAnomaly, data, id, typeModel) {
        let anomaly = {
            "key": id,
            "id": id,
            "type": typeModel,
            ...data
        }
        addAnomaly([...anomalies, anomaly]);
    }

    function DetectModel(anomalies, addAnomaly, popMessage, updatePopMessage, model, anomaly_data) {
        let url = new URL("http://localhost:9876/api/anomaly"),
                        params = {model_id: model.model_id}
                        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: new URLSearchParams ({predict_data: JSON.stringify(anomaly_data)})
            })
            .then(response => {
                const data = response.json();
                if(!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    updatePopMessage(true, "Sorry! an error occurred", "due to " + error + ". It is not possible to detect anomalies for the given model at this moment");
                    return undefined;
                }
                return data;
            })
            .then(data => {
                if (data !== undefined) {
                    updatePopMessage(true,"Some anomalies has been detected", "you can see a chart with the results. enjoy!");
                    addAnomalies(anomalies, addAnomaly, data, model.model_id, model.type);
                }
                return null;
            })
            .catch(error => {
                if (!popMessage.isAlert) {
                    updatePopMessage(true, "Sorry! we have a problem", "there is a failure connection with API server. Please try again later.");
                }
            })
    }

export {DetectModel};