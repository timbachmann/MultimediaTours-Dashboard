import React from 'react'
import { Breadcrumb } from 'app/helpers/components'
import {Box, styled} from '@mui/system'
import {useSearchParams} from "react-router-dom";
import DetailsForm from "./DetailsForm";
import ParticipantsTable from "./ParticipantsTable";
import axios from "../../../../axios";

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
    const [camp, setCamp] = React.useState([]);
    const [campParticipants, setCampParticipants] = React.useState([]);

    React.useEffect(() => {
        async function getCamp() {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/camp/${searchParams.get('id')}`)
                .then((response) => {
                    setCamp(response.data)
                    setCampParticipants(response.data.bookings)
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        getCamp();
    }, [searchParams]);

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Camps', path: '/camps/overview'},
                        { name: 'Details'}
                    ]}
                />
            </div>
            <DetailsForm title={camp.name} camp={camp}>
            </DetailsForm>
            <Box sx={{py: '12px'}}/>
            <ParticipantsTable title='Teilnehmer/innen' campID={camp._id} campName={camp.name} bookings={campParticipants}/>
        </Container>
    )
}

export default AppDetail
