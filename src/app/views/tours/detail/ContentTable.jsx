import * as React from 'react';
import {createSearchParams, useNavigate} from 'react-router-dom'
import axios from "../../../../axios";
import MaterialTable, {MTableBodyRow} from "@material-table/core";
import EditIcon from "@mui/icons-material/Edit";
import {multimediaTypesLookup} from "../../../helpers/utils/constant";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";
import {useSnackbar} from "notistack";

const ContentTable = ({title, tour, multimediaObjectIds}) => {
    let navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();
    const [multimediaObjects, setMultimediaObjects] = React.useState([]);

    const handleAddObject = () => {
        navigate({
            pathname: '/tours/editObjects',
            search: createSearchParams({
                id: tour.id
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

    const handleSave = (objects) => {
        async function saveTour() {
            tour.multimediaObjects = objects.map((e) => e.id)
            axios.put(process.env.REACT_APP_BACKEND_URI + `/tours/${tour.id}`, tour)
                .then(() => {
                    enqueueSnackbar('Saved successfully!', { variant: 'success' });
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, { variant: 'error' });
                });
        }

        saveTour();
    }

    const handleObjectUp = (rowToMove) => {
        const index = multimediaObjects.findIndex((e) => e.id === rowToMove.id)
        moveItem(index, index - 1)
    }

    const handleObjectDown = (rowToMove) => {
        const index = multimediaObjects.findIndex((e) => e.id === rowToMove.id)
        moveItem(index, index + 1)
    }

    const moveItem = (from, to) => {
        const row = multimediaObjects[from];
        const modifiedArray = multimediaObjects.toSpliced(from, 1);
        const finalModified = modifiedArray.toSpliced(to, 0, row)
        setMultimediaObjects(finalModified);
        handleSave(finalModified)
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
                rowData => ({
                    icon: ArrowUpward,
                    tooltip: "Move object up",
                    onClick: (event, rowData) => {
                        handleObjectUp(rowData)
                    },
                    disabled: 0 === multimediaObjects.findIndex((e) => e.id === rowData.id),
                }),
                rowData => ({
                    icon: ArrowDownward,
                    tooltip: "Move object down",
                    onClick: (event, rowData) => {
                        handleObjectDown(rowData)
                    },
                    disabled: multimediaObjects.length - 1 === multimediaObjects.findIndex((e) => e.id === rowData.id),
                }),
            ]}
            options={{
                search: true,
                actionsColumnIndex: -1,
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
                draggable: false,
            }}
            columns={headCells}
            data={multimediaObjects}/>
    );
}

export default ContentTable