import React from 'react'
import { styled, Box } from '@mui/system'
import useSettings from 'app/helpers/hooks/useSettings'
import Logo from "../Logo/Logo";

const BrandRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 18px 20px 29px',
}))

const Brand = ({ children }) => {
    const { settings } = useSettings()
    const leftSidebar = settings.layout1Settings.leftSidebar

    return (
        <BrandRoot>
            <Box display="flex" alignItems="center">
                <Logo />
            </Box>
        </BrandRoot>
    )
}

export default Brand
