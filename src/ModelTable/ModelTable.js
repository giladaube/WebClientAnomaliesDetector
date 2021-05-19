import React from 'react';
import '../App.css';
import CreateCard from "./CreateCard";

function ModelTable(props) {
    return (

        <div className="container model-table">
            <div className="">

                {/* create card-model for each model in the given array */}
                {props.cards.map(card => {
                    return (
                        <CreateCard
                            checkStatus={props.checkStatus}
                            deleteModel={props.deleteModel}
                            displayAnomalies={props.displayAnomalies}
                            key = {card.key}
                            card = {card}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default ModelTable;
