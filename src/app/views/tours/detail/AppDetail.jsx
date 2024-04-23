import React from 'react'
import { Breadcrumb } from 'app/helpers/components'
import {Box, styled} from '@mui/system'
import {useSearchParams} from "react-router-dom";
import DetailsForm from "./DetailsForm";
import axios from "../../../../axios";
import ContentTable from "./ContentTable";

const Container = styled('div')(({ theme }) => ({
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
}))

const AppDetail = () => {
    const [searchParams] = useSearchParams();
    const [tour, setTour] = React.useState([]);
    const [multimediaObjects, setMultimediaObjects] = React.useState([]);

    React.useEffect(() => {
        async function getTour() {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/tours/${searchParams.get('id')}`)
                .then((response) => {
                    setTour(response.data)
                    setMultimediaObjects(response.data.multimediaObjects)
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        getTour();
    }, [searchParams]);

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Tours', path: '/tours'},
                        { name: 'Details'}
                    ]}
                />
            </div>
            <DetailsForm pageTitle={tour.title} tour={tour}>
            </DetailsForm>
            <Box sx={{py: '12px'}}/>
            <ContentTable title='Multimedia Objects' tour={tour} multimediaObjectIds={multimediaObjects} />
        </Container>
    )
}

export default AppDetail
