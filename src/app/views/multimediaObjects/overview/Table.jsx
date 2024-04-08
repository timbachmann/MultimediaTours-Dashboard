import * as React from 'react';
import MaterialTable, {MTableBodyRow} from "@material-table/core";
import AddIcon from "@mui/icons-material/Add";
import {createSearchParams, useNavigate} from "react-router-dom";
import {multimediaTypesLookup} from "../../../helpers/utils/constant";


const EnhancedTable = ({title, multimediaObjects}) => {
    let navigate = useNavigate();

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

    const handleAdd = () => {
        navigate('/multimedia-objects/add')
    }

    const onRowClicked = (event, rowData) => {
        navigate({
            pathname: '/multimedia-objects/detail',
            search: createSearchParams({
                id: rowData.id
            }).toString()
        });
    }

    return (
        <MaterialTable
            title={title}
            style={{padding: '20px 24px', borderRadius: '8px'}}
            actions={[
                {
                    icon: AddIcon,
                    tooltip: "Add multimedia object",
                    isFreeAction: true,
                    onClick: handleAdd,
                },
            ]}
            components={{
                Row: (props) => {
                    return <MTableBodyRow {...props} onRowClick={onRowClicked} />;
                },
            }}
            options={{
                search: false,
                paging: true,
                pageSize: multimediaObjects.length,
                pageSizeOptions: [],
                showFirstLastPageButtons: false,
            }}
            columns={headCells}
            data={multimediaObjects}/>

    );
}

export default EnhancedTable