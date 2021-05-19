import React, {useState} from 'react';
import './App.css';
import Model from "./Model";
import AlertMessage from "./ModelTable/AlertMessage";
import Footer from "./Footer";

function Body() {
    // STATES

    // using state object to create pop-up alert
    const [popMessage, setPopMessage] = useState({
        isAlert: false, // true if there is a new alert
        header: "", // alert header
        message: "", // alert body
        color: undefined
    });

    // update a new alert with given args
    function updatePopMessage(status, title, reason, color) {
        let updateColor = undefined;
        if (color !== undefined) {
            updateColor = color;
        }
        setPopMessage({
            isAlert: status,
            header: title,
            message: reason,
            color: updateColor
        });
    }

    // make sure alert closes when triggered
    function closeAlert() {
        updatePopMessage(false, "");
    }

    return (
            <div className="body-container">
                <div className="container-fluid row">
                    {/* add Model component, having popMessage and updatePopMessage to create alerts */}
                    <Model popMessage={popMessage} updatePopMessage={updatePopMessage}/>
                </div>
                <div>
                    {/* component for creating an alert, render each time a message added via popMessage */}
                    <AlertMessage alert={popMessage.isAlert} title={popMessage.header} reason={popMessage.message} color={popMessage.color} callback={closeAlert}/>
                </div>
                <Footer/>
            </div>
        )
}

export default Body;