import React from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {randomColor} from "randomcolor";

function GetCharts(props) {

    const data = props.data;
    const categories = Object.keys(data);

    function getRows() {
        let tempRows = [];
        const colSize = categories.length;
        const rowSize = data[categories[0]].length;
        for (let r=0; r<rowSize; r++) {
            let row = [];
            for (let k=0; k<colSize; k++) {
                row.push(data[categories[k]][r]);
            }
            tempRows.push(row);
        }
        return tempRows;
    }

    function getValues() {
        let sets = [];
        let color;
        let rows = getRows();
        for (let i=0; i<data[categories[0]].length; i++) {
            color = randomColor();
            let set = {
                label: "timestep-" + i,
                fill: true,
                lineTension: 0.3,
                backgroundColor: color,
                borderColor: color,
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: color,
                pointBackgroundColor: color,
                pointBorderWidth: 10,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: color,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: rows[i]
            }
            sets.push(set);
        }
        return sets;
    }

    let dataLine = {
        labels: categories,
        datasets: getValues()
    }


    return (
        <div className="charts-container overflow-auto">
            <MDBContainer>
                <h3 className="mt-5">Line chart</h3>
                <Line data={dataLine} options={{ responsive: true, plugins: {legend: {display: false}}}} />
            </MDBContainer>
        </div>
    )

}

export default GetCharts;