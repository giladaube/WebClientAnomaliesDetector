import React, {useState} from 'react'
import styled from 'styled-components'
import {useTable, ReactTable} from 'react-table'
import {randomColor} from "randomcolor";

const Styles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;

  /* This will make the table scrollable when it gets too small */

  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    border-bottom: 1px solid black;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;
    border-style: solid;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */

      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

function TableD({columns, data, ranges}) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })

    // Render the UI for your table
    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                                // find out if this column has anomalies
                                let anomaly = ranges.find(obj => obj.value === cell.column.Header);
                                if (ranges.length !== 0 && anomaly !== undefined) {
                                    let isAnomaly = false;
                                    anomaly.span.forEach(s => {
                                        if (i + 1 >= s[0] && i + 1 < s[1]) {
                                            isAnomaly = true;
                                        }
                                    })
                                    return <td {...cell.getCellProps()}
                                               style={{backgroundColor: isAnomaly ? anomaly.color : null}}>
                                        {cell.render('Cell')}
                                    </td>
                                }
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            }
                        )}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

function Table(props) {

    const [span, setSpan] = useState("");
    const [ranges, setRanges] = useState([]);

    if (props.data !== "") {

        if (props.span !== span) {

            setSpan(props.span);
            if (props.span !== "" && props.span !== undefined) {
                let rangesSpan = [];
                const keys = Object.keys(props.span);
                keys.forEach(key => {
                    let SplitTitles = key.split("-")
                    let color = randomColor({hue: "red"});
                    rangesSpan.push(
                        {
                            "value": SplitTitles[0],
                            "span": props.span[key],
                            "color": color
                        },
                        {
                            "value": SplitTitles[1],
                            "span": props.span[key],
                            "color": color
                        }
                    )
                })
                setRanges([...rangesSpan]);
            } else {
                setRanges([]);
            }
        }

        const categories = Object.keys(props.data);

        function getRows(data, categories) {
            let tempRows = [];
            const rowSize = data[categories[0]].length;
            for (let r = 0; r < rowSize; r++) {
                let row = {};
                categories.forEach((key, index) => {
                    row[categories[index]] = data[key][r];
                })
                tempRows.push(row);
            }
            return tempRows;
        }

        const data = getRows(props.data, categories);

        function getCol() {
            let columns = [];
            categories.forEach((key) => {
                columns.push({
                    Header: key,
                    accessor: key
                })
            })
            return columns;
        }

        return (
            <Styles>
                <TableD columns={getCol()} data={data} ranges={ranges}/>
            </Styles>
        )
    } else {
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        )
    }
}

export default Table
