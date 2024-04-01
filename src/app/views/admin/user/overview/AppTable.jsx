import React from 'react'
import Table from './Table'
import { Breadcrumb } from 'app/helpers/components'
import { styled } from '@mui/system'

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
                        { name: 'User' },
                    ]}
                />
            </div>
                <Table title="User" />
        </Container>
    )
}

export default AppTable
