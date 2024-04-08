import * as React from 'react';
import {createSearchParams, useNavigate} from 'react-router-dom'
import axios from "../../../../axios";
import MaterialTable, {MTableBodyRow} from "@material-table/core";
import EditIcon from "@mui/icons-material/Edit";
import {multimediaTypesLookup} from "../../../helpers/utils/constant";

const ContentTable = ({title, tourId, multimediaObjectIds}) => {
    let navigate = useNavigate();
    const [multimediaObjects, setMultimediaObjects] = React.useState([]);

    const handleAddObject = () => {
        navigate({
            pathname: '/tours/editObjects',
            search: createSearchParams({
                id: tourId
            }).toString()
        });
    }

    const onRowClicked = (event, rowData) => {
        navigate({
            pathname: '/multimedia-objects/detail',
            search: createSearchParams({
                id: rowData.id
            }).toString()
        });
    }

    React.useEffect(() => {
        const promises = [];
        for (const multimediaObject of multimediaObjectIds) {
            promises.push(axios.get(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/${multimediaObject}`))
        }
        Promise.all(promises)
            .then(function (values) {
                const result = values.map((response) => response.data);
                setMultimediaObjects(result.map(m => {
                    m.positionDetails = m.position ? `${m.position.lat}, ${m.position.lng}` : '-'
                    return m
                }))
            });
    }, [multimediaObjectIds]);

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
            style={{padding: '20px 24px', borderRadius: '8px'}}
            components={{
                Row: (props) => {
                    return <MTableBodyRow {...props} onRowClick={onRowClicked} />;
                },
            }}
            actions={[
                {
                    icon: EditIcon,
                    tooltip: "Edit objects",
                    isFreeAction: true,
                    onClick: handleAddObject,
                },
            ]}
            options={{
                search: true,
                maxColumnSort: 0,
                filtering: true,
                searchFieldStyle: {
                    marginRight: '12px',
                },
                searchFieldVariant: "outlined",
                paging: true,
                pageSize: multimediaObjects.length,
                pageSizeOptions: [],
                showFirstLastPageButtons: false,
            }}
            columns={headCells}
            data={multimediaObjects}/>
    );
}

export default ContentTable