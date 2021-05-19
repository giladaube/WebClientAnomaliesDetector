import React from 'react';
import '../App.css';
import { CsvToHtmlTable } from 'react-csv-to-table';

function DataTable(props) {
    if (props.data !== "") {
        return (
            // create table with the given data
            <CsvToHtmlTable
                data={props.data}
                csvDelimiter=","
                tableClassName="table table-striped table-hover"
            />
        )
    } else {
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        )
    }

}

export default DataTable;
