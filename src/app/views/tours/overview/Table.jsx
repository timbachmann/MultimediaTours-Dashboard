import * as React from 'react';
import MaterialTable, {MTableBodyRow} from "@material-table/core";
import {createSearchParams, useNavigate} from 'react-router-dom'
import {H2} from "../../../helpers/components/Typography";
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
    ];

    const handleAdd = () => {
        navigate('/tours/add')
    }

    const onRowClicked = (event, rowData) => {
        navigate({
            pathname: '/tours/detail',
            search: createSearchParams({
                id: rowData._id
            }).toString()
        });
    }

    return (
        <MaterialTable
            title={<H2>{title}</H2>}
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
                headerStyle: {
                    fontSize: '18px',
                },
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