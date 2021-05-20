
    // add a new anomaly model. connect it to the model with id as key
    function addAnomalies(anomalies, addAnomaly, data, anomaly_file, anomaly_csv, id, typeModel) {
        let anomaly = {
            key: id,
            id: id,
            type: typeModel,
            file: anomaly_file,
            csv: anomaly_csv,
            span: data.anomalies
        }
        // add it to anomalies array using addAnomaly function
        addAnomaly([...anomalies, anomaly]);
    }

    // using api call. detect anomalies in the given model (using anomaly_data)
    function DetectModel(uri_apiServer, anomalies, addAnomaly, popMessage, updatePopMessage, model, anomaly_file, anomaly_csv) {
        const api_uri = uri_apiServer + "/anomaly";
        let url = new URL(api_uri),
                        // asking to detect anomalies in the given model, by it's id
                        params = {model_id: model.model_id}
                        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        // create new POST api request
        fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: new URLSearchParams ({predict_data: JSON.stringify(anomaly_file)})
            })
            .then(response => {
                const data = response.json();
                // there is a problem with the response data
                if(!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    updatePopMessage(true, "Sorry! an error occurred", "due to " + error + ". It is not possible to detect anomalies for the given model at this moment");
                    return undefined;
                }
                return data;
            })
            .then(data => {
                if (data !== undefined) {
                    // got data back form the api call, create new anomaly model connect it to model id of this model
                    updatePopMessage(true,"Some anomalies has been detected", "you can see a chart with the results. enjoy!", model.color);
                    addAnomalies(anomalies, addAnomaly, data, anomaly_file, anomaly_csv, model.model_id, model.type);
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

export {DetectModel};