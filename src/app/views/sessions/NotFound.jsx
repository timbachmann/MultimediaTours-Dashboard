import React from 'react'
import { Button } from '@mui/material'
import { Box, styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    maxWidth: 320,
    flexDirection: 'column',
    justifyContent: 'center',
}))

const IMG = styled('img')(() => ({
    width: '100%',
    marginBottom: '32px',
}))

const NotFoundRoot = styled(FlexBox)(() => ({
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh !important',
}))

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <NotFoundRoot>
            <JustifyBox>
                <IMG src="/assets/images/logo.png" alt="" />
                <Button
                    color="primary"
                    variant="contained"
                    sx={{ textTransform: 'capitalize' }}
                    onClick={() => navigate(-1)}
                >
                    Back to Dashboard
                </Button>
            </JustifyBox>
        </NotFoundRoot>
    )
}

export default NotFound
