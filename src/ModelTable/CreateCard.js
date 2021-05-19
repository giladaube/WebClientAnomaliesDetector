import React from 'react';
import '../App.css';
import ModelCard from "./ModelCard";

function CreateCard(props) {
    // all data needed to create a new card model
    let card = props.card;

    return (
        <ModelCard
            key = {card.key}
            model_id = {card.model_id}
            time = {card.upload_time}
            status = {card.status}
            type = {card.type}
            tooltip = {card.tooltip}
            color = {card.color}
            // function to use when click, hover etc. on card-model
            checkStatus={props.checkStatus}
            deleteModel={props.deleteModel}
            displayAnomalies={props.displayAnomalies}
        />
    )
}

export default CreateCard;