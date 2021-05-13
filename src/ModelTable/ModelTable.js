import React from 'react';
import '../App.css';
import CreateCard from "./CreateCard";

function ModelTable(props) {
    return (

        <div className="container model-table">
            <div className="">

                {props.cards.map(card => {
                    return (
                        <CreateCard
                            checkStatus={props.checkStatus}
                            deleteModel={props.deleteModel}
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
