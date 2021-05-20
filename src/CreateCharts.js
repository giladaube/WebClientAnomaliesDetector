import React, {useState} from "react";
import {Scatter} from "react-chartjs-2";
import {MDBContainer} from "mdbreact";
import {randomColor} from "randomcolor";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function GetCharts(props) {

    const isTrain = props.isTrain;
    const data = props.data;
    const categories = Object.keys(data);

    function getRows() {
        let tempRows = [];
        const colSize = categories.length;
        const rowSize = data[categories[0]].length;
        for (let r = 0; r < rowSize; r++) {
            let row = [];
            for (let k = 0; k < colSize; k++) {
                row.push(data[categories[k]][r]);
            }
            tempRows.push(row);
        }
        return tempRows;
    }

    function getCol(feature) {
        let colValues = [];
        let colNum = -1;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i] === feature) {
                colNum = i;
            }
        }

        console.log(data[feature]);


    }

    function getValues() {
        let sets = [];
        let color;
        let rows = getRows();
        for (let i = 0; i < data[categories[0]].length; i++) {
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

    const [dataLine, setChartData] = useState({})

    function setData(feature) {

        let yValues = data[feature.value]
        let points = []
        let anomalousPoints = []

        if (isTrain) {
            for (let i = 0; i < data[feature].length; i += 2) {
                points.push({x: i, y: yValues[i]})
            }

            setChartData({
                datasets: [
                    {
                        label: 'Regular Points',
                        data: points,
                        backgroundColor: 'blue'
                    },
                ],
            })

        } else {

            let span = {
                "A-B": [[4, 5], [6, 2]],
                "C-D": [[24, 30], [10, 12]]
            }

            //let span = props.span.anomalies;

            let ranges = []
            let firstFeature = "", secondFeature = ""
            for (let key in span) {
                let SplitTitles = key.split("-")
                if (feature === SplitTitles[0]) {
                    firstFeature = SplitTitles[0]
                    secondFeature = SplitTitles[1]
                    ranges = span[key]
                }
            }

            if (firstFeature === "") {
                return
            }

            let xValues = data[secondFeature]

            for (let i = 0; i < data[feature].length; i++) {
                points.push({x: xValues[i], y: yValues[i]})
                for (let range in ranges) {
                    if (i > range[0] && i < range[1]) {
                        anomalousPoints.push({x: xValues[i], y: yValues[i]})
                    }
                }
            }

            setChartData({
                datasets: [
                    {
                        label: 'Anomalous Points',
                        data: anomalousPoints,
                        backgroundColor: 'red'
                    },
                    {
                        label: 'Regular Points',
                        data: points,
                        backgroundColor: 'blue'
                    },
                ],
            })
        }
    }



return (
    <div className="charts-container overflow-auto">
        <MDBContainer>
            <h3 className="mt-5">Line Chart</h3>
            <Dropdown
                placeholder="Select an option"
                options={categories}
                value="Choose a Feature"
                onChange={(value) => setData(value)}

            />
            {/*<Dropdown options={options} onChange={()=>{console.log("HELLO")}} value={defaultOption} placeholder="Select an option" />*/}
            <Scatter data={dataLine} options={{responsive: true, plugins: {legend: {display: true}}}}/>
        </MDBContainer>
    </div>
)

}

export default GetCharts;