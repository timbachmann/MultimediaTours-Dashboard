import React from 'react'
import { styled, Box } from '@mui/system'
import Logo from "../Logo/Logo";

const BrandRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 18px 20px 29px',
}))

const Brand = () => {

    return (
        <BrandRoot>
            <Box display="flex" alignItems="center">
                <Logo />
            </Box>
        </BrandRoot>
    )
}

export default Brand
