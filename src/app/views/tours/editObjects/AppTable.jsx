import React, {useState} from 'react'
import {Breadcrumb} from 'app/helpers/components'
import {styled} from '@mui/system'
import {Grid} from "@mui/material";
import axios from "../../../../axios";
import {useSearchParams} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import {ArrowBack, ArrowDownward, ArrowForward, ArrowUpward} from "@mui/icons-material";
import ObjectsTable from "./ObjectsTable";
import {useSnackbar} from "notistack";

const Container = styled('div')(({theme}) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px',
        },
    },
}));

const AppTable = () => {
    const [searchParams] = useSearchParams();
    const [tour, setTour] = useState({});
    const [tourObjects, setTourObjects] = useState([]);
    const [allObjects, setAllObjects] = useState([]);
    const [selectedNew, setSelectedNew] = React.useState([]);
    const [selectedObjects, setSelectedObjects] = React.useState([]);
    const {enqueueSnackbar} = useSnackbar();

    React.useEffect(() => {
        async function getTour() {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/tours/${searchParams.get('id')}`)
                .then((response) => {
                    setTour(response.data);
                    getTourObjects(response.data.multimediaObjects);
                    getAllObjects(response.data.multimediaObjects);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        async function getAllObjects(tourObjectIds) {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects`)
                .then((responseAll) => {
                    const filteredResponse = responseAll.data.filter((item) => tourObjectIds.find((o) => o === item.id) === undefined);
                    setAllObjects(filteredResponse.map(m => {
                        m.positionDetails = m.position ? `${m.position.lat}, ${m.position.lng}` : '-'
                        return m
                    }));
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        async function getTourObjects(objectIds) {
            const promises = [];
            for (const multimediaObjectId of Array.from(objectIds)) {
                promises.push(axios.get(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/${multimediaObjectId}`))
            }
            Promise.all(promises)
                .then(function (values) {
                    const result = values.map((response) => response.data);
                    setTourObjects(result.map(m => {
                        m.positionDetails = m.position ? `${m.position.lat}, ${m.position.lng}` : '-'
                        return m
                    }))
                });
        }

        getTour();
    }, [searchParams]);

    const handleRemoveObjects = () => {
        const updatedObjects = tourObjects.filter((o) => !selectedObjects.includes(o.id));

        async function saveCamp() {

            tour.multimediaObjects = updatedObjects.map(i => i.id);

            axios.put(process.env.REACT_APP_BACKEND_URI + `/tours/${tour.id}`, tour)
                .then((response) => {
                    setTourObjects(updatedObjects);
                    getRemovedMembers(updatedObjects);
                    setSelectedObjects([]);
                    setSelectedNew([]);
                    enqueueSnackbar('Updated successfully!', {variant: 'success'});
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, {variant: 'error'});
                });
        }

        async function getRemovedMembers(updatedObjects) {
            axios.get(process.env.REACT_APP_BACKEND_URI + '/multimedia-objects')
                .then((response) => {
                    setAllObjects(response.data.filter((item) =>
                        updatedObjects.find((o) => o.id === item.id) === undefined));
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        saveCamp();
    }

    const handleAddObjects = () => {
        console.log(tourObjects)
        console.log(allObjects)
        console.log(selectedObjects)
        console.log(selectedNew)

        const newObjects = allObjects.filter((item) => selectedNew.includes(item.id));
        tour.multimediaObjects = [...tourObjects.map(i => i.id), ...selectedNew]

        axios.put(process.env.REACT_APP_BACKEND_URI + `/tours/${tour.id}`, tour)
            .then(() => {
                setAllObjects(allObjects.filter((o) => !selectedNew.includes(o.id)));
                setTourObjects([...tourObjects, ...newObjects])
                setSelectedNew([]);
                setSelectedObjects([]);
                enqueueSnackbar('Added successfully!', {variant: 'success'});
            })
            .catch((error) => {
                console.log(error);
                enqueueSnackbar(error.error, {variant: 'error'});
            });
    }

    const updateSelected = (newSelected) => {
        setSelectedNew(newSelected);
    }

    const updateSelectedObjects = (newSelected) => {
        setSelectedObjects(newSelected);
    }

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Tours', path: '/tours'},
                        {name: tour.title, path: `/tours/detail?id=${tour.id}`},
                        {name: 'Edit Objects'},
                    ]}
                />
            </div>
            <Grid container spacing={0}>
                <Grid item lg={5.5} md={12} sm={12} xs={12} sx={{mt: 2}}>
                    <ObjectsTable title="Tour Objects" selected={selectedObjects}
                                  setSelected={updateSelectedObjects} multimediaObjects={tourObjects}>
                    </ObjectsTable>
                </Grid>

                <Grid item lg={1} md={12} sm={12} xs={12}
                      sx={{mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                    <IconButton disabled={selectedNew.length === 0} onClick={() => {
                        handleAddObjects();
                    }}>
                        <ArrowBack sx={{display: {lg: "block", md: "none", sm: "none", xs: "none"}}}/>
                        <ArrowUpward sx={{display: {lg: "none", md: "block", sm: "block", xs: "block"}}}/>
                    </IconButton>
                    <IconButton disabled={selectedObjects.length === 0} onClick={() => {
                        handleRemoveObjects();
                    }}>
                        <ArrowForward sx={{display: {lg: "block", md: "none", sm: "none", xs: "none"}}}/>
                        <ArrowDownward sx={{display: {lg: "none", md: "block", sm: "block", xs: "block"}}}/>
                    </IconButton>
                </Grid>

                <Grid item lg={5.5} md={12} sm={12} xs={12} sx={{mt: 2}}>
                    <ObjectsTable title="All Objects" multimediaObjects={allObjects} selected={selectedNew}
                                  setSelected={updateSelected}>
                    </ObjectsTable>
                </Grid>
            </Grid>
        </Container>
    )
}

export default AppTable
