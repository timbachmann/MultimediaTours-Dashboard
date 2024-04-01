import React from 'react'
import { Breadcrumb } from 'app/helpers/components'
import {styled} from '@mui/system'
import DetailsForm from "./DetailsForm";

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

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'User', path: '/admin/user'},
                        { name: 'User erstellen'}
                    ]}
                />
            </div>
            <DetailsForm/>
        </Container>
    )
}

export default AppDetail
