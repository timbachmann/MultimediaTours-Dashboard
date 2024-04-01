import React from 'react'
import Dashboard from './Dashboard'
import News from './News'
import { Breadcrumb } from 'app/helpers/components'
import {Box, styled} from '@mui/system'

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

const AppTable = () => {
    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Einstellungen' },
                    ]}
                />
            </div>
            <Dashboard title="Dashboard" />
            <Box sx={{py: '12px'}}/>
            <News title="News" />
        </Container>
    )
}

export default AppTable
