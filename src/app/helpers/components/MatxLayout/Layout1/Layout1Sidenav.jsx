import React from 'react'
import Brand from '../../Brand/Brand'
import { convertHexToRGB } from 'app/helpers/utils/utils'
import { Box, styled, useTheme } from '@mui/system'
import Sidenav from '../../Sidenav/Sidenav'
import useSettings from 'app/helpers/hooks/useSettings'
import { Switch, Hidden } from '@mui/material'
import { themeShadows } from 'app/helpers/components/MatxTheme/themeColors'
import { sidenavCompactWidth, sideNavWidth } from 'app/helpers/utils/constant'

const SidebarNavRoot = styled(Box)(({ theme, width, primarybg, bgimgurl }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: width,
    boxShadow: themeShadows[8],
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    zIndex: 111,
    overflow: 'hidden',
    color: theme.palette.text.primary,
    transition: 'all 250ms ease-in-out',
    backgroundImage: `linear-gradient(to bottom, rgba(${primarybg}, 0.96), rgba(${primarybg}, 0.96)), url(${bgimgurl})`,
    '&:hover': {
        width: sideNavWidth,
        '& .sidenavHoverShow': {
            display: 'block',
        },
        '& .compactNavItem': {
            width: '100%',
            maxWidth: '100%',
            '& .nav-bullet': {
                display: 'block',
            },
            '& .nav-bullet-text': {
                display: 'none',
            },
        },
    },
}))

const NavListBox = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}))

const Layout1Sidenav = () => {
    const theme = useTheme()
    const { settings, updateSettings } = useSettings()
    const leftSidebar = settings.layout1Settings.leftSidebar
    const { mode, bgImgURL } = leftSidebar

    const getSidenavWidth = () => {
        switch (mode) {
            case 'compact':
                return sidenavCompactWidth
            default:
                return sideNavWidth
        }
    }
    const primaryRGB = convertHexToRGB(theme.palette.primary.main)

    const updateSidebarMode = (sidebarSettings) => {
        updateSettings({
            layout1Settings: {
                leftSidebar: {
                    ...sidebarSettings,
                },
            },
        })
    }

    const handleSidenavToggle = () => {
        updateSidebarMode({ mode: mode === 'compact' ? 'full' : 'compact' })
    }

    return (
        <SidebarNavRoot
            bgimgurl={bgImgURL}
            primarybg={primaryRGB}
            width={getSidenavWidth()}
        >
            <NavListBox>
                <Brand>
                    <Hidden smDown>
                        <Switch
                            onChange={handleSidenavToggle}
                            checked={leftSidebar.mode !== 'full'}
                            color="secondary"
                            size="small"
                        />
                    </Hidden>
                </Brand>
                <Sidenav />
            </NavListBox>
        </SidebarNavRoot>
    )
}

export default React.memo(Layout1Sidenav)
