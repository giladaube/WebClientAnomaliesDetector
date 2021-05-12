import React from 'react';
import '../App.css';
import ModelCard from "./ModelCard";

function CreateCard(props) {
    let card = props.card;

    return (
        <ModelCard
            key = {card.key}
            id = {card.model_id}
            time = {card.upload_time}
            status = {card.status}
            type = {card.type}

            checkStatus={props.checkStatus}
            deleteModel={props.deleteModel}
        />
    )
}

export default CreateCard;