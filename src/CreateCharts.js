import React, {useState} from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {randomColor} from "randomcolor";

function GetCharts(props) {

    const data = props.data;
    // const data = JSON.stringify(props.data);
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
            console.log("row")
            console.log(row)
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
        console.log(sets);
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

//
// class ChartsPage extends React.Component {
//   state = {
//     dataLine: {
//       labels: ["January", "February", "March", "April", "May", "June", "July"],
//       datasets: [
//         {
//           label: "My First dataset",
//           fill: true,
//           lineTension: 0.3,
//           backgroundColor: "rgba(225, 204,230, .3)",
//           borderColor: "rgb(205, 130, 158)",
//           borderCapStyle: "butt",
//           borderDash: [],
//           borderDashOffset: 0.0,
//           borderJoinStyle: "miter",
//           pointBorderColor: "rgb(205, 130,1 58)",
//           pointBackgroundColor: "rgb(255, 255, 255)",
//           pointBorderWidth: 10,
//           pointHoverRadius: 5,
//           pointHoverBackgroundColor: "rgb(0, 0, 0)",
//           pointHoverBorderColor: "rgba(220, 220, 220,1)",
//           pointHoverBorderWidth: 2,
//           pointRadius: 1,
//           pointHitRadius: 10,
//           data: [65, 59, 80, 81, 56, 55, 40]
//         },
//         {
//           label: "My Second dataset",
//           fill: true,
//           lineTension: 0.3,
//           backgroundColor: "rgba(184, 185, 210, .3)",
//           borderColor: "rgb(35, 26, 136)",
//           borderCapStyle: "butt",
//           borderDash: [],
//           borderDashOffset: 0.0,
//           borderJoinStyle: "miter",
//           pointBorderColor: "rgb(35, 26, 136)",
//           pointBackgroundColor: "rgb(255, 255, 255)",
//           pointBorderWidth: 10,
//           pointHoverRadius: 5,
//           pointHoverBackgroundColor: "rgb(0, 0, 0)",
//           pointHoverBorderColor: "rgba(220, 220, 220, 1)",
//           pointHoverBorderWidth: 2,
//           pointRadius: 1,
//           pointHitRadius: 10,
//           data: [28, 48, 40, 19, 86, 27, 90]
//         }
//       ]
//     }
//   };
//
//   render() {
//     return (
//       <MDBContainer>
//         <h3 className="mt-5">Line chart</h3>
//         <Line data={this.state.dataLine} options={{ responsive: true }} />
//       </MDBContainer>
//     );
//   }
// }

export default GetCharts;