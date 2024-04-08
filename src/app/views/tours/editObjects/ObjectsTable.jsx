import * as React from 'react';
import MaterialTable from "@material-table/core";
import {useRef} from "react";
import {multimediaTypesLookup} from "../../../helpers/utils/constant";

const ObjectsTable = ({title, multimediaObjects, setSelected, isWaitingList, campID}) => {
    const tableRef = useRef();

    const handleClick = (event, data) => {
        setSelected(tableRef.current.dataManager.data.filter(o => o.tableData.checked).map((p) => p.id));
    }

    const headCells = [
        {
            field: 'title',
            title: 'Title',
            defaultSort: 'desc',
        },
        {
            field: 'type',
            title: 'Type',
            lookup: multimediaTypesLookup
        },
        {
            field: 'date',
            title: 'Date',
            type: 'date',
        },
        {
            field: 'positionDetails',
            title: 'Position',
        },
        {
            field: 'source',
            title: 'Source',
        },
        {
            field: 'author',
            title: 'Author',
        },
    ];

    return (
        <MaterialTable
            title={title}
            onSelectionChange={() => {
                handleClick();
            }}
            style={{padding: '20px 24px', borderRadius: '8px'}}
            options={{
                search: true,
                selection: true,
                maxColumnSort: 0,
                padding: 'dense',
                showSelectAllCheckbox: true,
                searchFieldStyle: {
                    marginRight: '12px',
                },
                searchFieldVariant: "outlined",
                headerStyle: {
                    paddingRight: '8px',
                    overflow: "hidden",
                    whiteSpace: 'nowrap',
                }
            }}
            tableRef={tableRef}
            columns={headCells}
            data={multimediaObjects}/>
    );
}

export default ObjectsTable