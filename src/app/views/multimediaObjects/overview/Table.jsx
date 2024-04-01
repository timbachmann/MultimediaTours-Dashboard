import * as React from 'react';
import MaterialTable, {MTableBodyRow} from "@material-table/core";
import {H2} from "../../../helpers/components/Typography";
import AddIcon from "@mui/icons-material/Add";
import {createSearchParams, useNavigate} from "react-router-dom";


const EnhancedTable = ({title, multimediaObjects}) => {
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
        navigate('/multimedia-objects/add')
    }

    const onRowClicked = (event, rowData) => {
        navigate({
            pathname: '/multimedia-objects/detail',
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
                headerStyle: {
                    fontSize: '18px',
                },
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