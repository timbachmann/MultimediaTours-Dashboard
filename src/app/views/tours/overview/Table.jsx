import * as React from 'react';
import MaterialTable, {MTableBodyRow} from "@material-table/core";
import {createSearchParams, useNavigate} from 'react-router-dom'
import AddIcon from "@mui/icons-material/Add";

const EnhancedTable = ({title, tours}) => {
    let navigate = useNavigate();

    const headCells = [
        {
            field: 'title',
            title: 'Title',
        },
        {
            field: 'source',
            title: 'Source',
        },
        {
            field: 'author',
            title: 'Author',
        },
        {
            field: 'numObjects',
            title: 'Objects',
        },
    ];

    const handleAdd = () => {
        navigate('/tours/add')
    }

    const onRowClicked = (event, rowData) => {
        navigate({
            pathname: '/tours/detail',
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
                    tooltip: "Add tour",
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
                pageSize: tours.length,
                pageSizeOptions: [],
                showFirstLastPageButtons: false,
            }}
            columns={headCells}
            data={tours}/>

    );
}

export default EnhancedTable