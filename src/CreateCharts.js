import React, {useState} from "react";
import {Scatter} from "react-chartjs-2";
import {MDBContainer} from "mdbreact";
import Select from "react-select";
import 'react-dropdown/style.css';

function GetCharts(props) {

    const [giveData, setGivenData] = useState({
        data: undefined,
        span: undefined
    });

    const [selectedValue, setSelectedValue] = useState("");

    const isTrain = props.isTrain;
    const data = props.data;
    const categories = Object.keys(data);

    const [dataLine, setChartData] = useState({})

    function setData(feature) {
        setSelectedValue(feature);
        let yValues = data[feature.value]
        let points = []
        let anomalousPoints = []

        if (!isTrain) {
            let span = props.span;

            let ranges = []
            let firstFeature = "", secondFeature = ""
            const keys = Object.keys(span);
            keys.forEach(key => {
                let SplitTitles = key.split("-")
                if (feature.value === SplitTitles[0]) {
                    firstFeature = SplitTitles[0]
                    secondFeature = SplitTitles[1]
                    ranges = span[key]
                } else if (feature.value === SplitTitles[1]) {
                    secondFeature = SplitTitles[0]
                    firstFeature = SplitTitles[1]
                    ranges = span[key]
                }
            })

            if (firstFeature === "") {
                featureByTime(feature, yValues, points);
                return;
            }

            let xValues = data[secondFeature]

            for (let i = 0; i < data[feature.value].length; i++) {
                points.push({x: xValues[i], y: yValues[i]})
                ranges.forEach(range => {
                    if (i > range[0] && i < range[1]) {
                        anomalousPoints.push({x: xValues[i], y: yValues[i]})
                    }
                })
            }

            let sets = [
                {
                    label: 'Regular Points',
                    data: points,
                    backgroundColor: 'blue'
                },
            ]

            if (anomalousPoints.length > 0) {
                sets.push(
                    {
                        label: 'Anomalous Points',
                        data: anomalousPoints,
                        backgroundColor: 'red'
                    })
            }
            setChartData({
                datasets: sets
            })

        } else {
            featureByTime(feature, yValues, points);
        }
    }

    function featureByTime(feature, yValues, points) {
        for (let i = 0; i < data[feature.value].length; i += 2) {
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
    }

    function setDefaultValue() {
        let value = {value: categories[0], label: categories[0]};
        if (giveData.data !== data || giveData.span !== props.span) {
            setGivenData({
                data: props.data,
                span: props.span
            });
            setData(value);
            return selectedValue;
        }
    }

    const options = categories.map(value=> {
        return (
            {
                value: value,
                label: value
            }
        )
    })

    return (
        <div className="charts-container overflow-auto">
            <MDBContainer>
                <Select
                    id="dropdown"
                    onChange={(value) => setData(value)}
                    options={options}
                    value={selectedValue}
                    defaultValue={setDefaultValue()}
                />
                <Scatter data={dataLine} options={{responsive: true, plugins: {legend: {display: true}}}}/>
            </MDBContainer>
        </div>
    )

}

export default GetCharts;