import React, {useState} from 'react';
import './App.css';
import Model from "./Model";
import AlertMessage from "./ModelTable/AlertMessage";

function Body() {
    const [popMessage, setPopMessage] = useState({
        isAlert: false,
        header: "",
        message: ""
    });

    function updatePopMessage(status, title, reason) {
        setPopMessage({
            isAlert: status,
            header: title,
            message: reason
        });
    }

    function closeAlert() {
        updatePopMessage(false, "");
    }

    return (
            <div className="body-container">
                <div className="container-fluid row">
                    <Model popMessage={popMessage} updatePopMessage={updatePopMessage}/>
                </div>
                <div>
                    <AlertMessage alert={popMessage.isAlert} title={popMessage.header} reason={popMessage.message} callback={closeAlert}/>
                </div>
            </div>
        )
}

export default Body;