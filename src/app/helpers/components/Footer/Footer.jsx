import React from 'react'
import { Span, Paragraph } from '../Typography'
import useSettings from 'app/helpers/hooks/useSettings'
import { Toolbar, AppBar, ThemeProvider } from '@mui/material'
import { styled, useTheme } from '@mui/system'
import { topBarHeight } from 'app/helpers/utils/constant'

const AppFooter = styled(Toolbar)(() => ({
    display: 'flex',
    alignItems: 'center',
    minHeight: topBarHeight,
    '@media (max-width: 499px)': {
        display: 'table',
        width: '100%',
        minHeight: 'auto',
        padding: '1rem 0',
        '& .container': {
            flexDirection: 'column !important',
            '& a': {
                margin: '0 0 16px !important',
            },
        },
    },
}))

const FooterContent = styled('div')(() => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0px 1rem',
    maxWidth: '1170px',
    margin: '0 auto',
}))

const Footer = () => {
    const theme = useTheme()
    const { settings } = useSettings()

    const footerTheme = settings.themes[settings.footer.theme] || theme

    const IMG = styled('img')(() => ({
        width: '3.5%',
        margin: '5px',
    }))

    const NovisolLogo = ({ className }) => {

        return (
            <IMG src={'/assets/images/logo.png'} alt={'Logo'}/>
        )
    }

    return (
        <ThemeProvider theme={footerTheme}>
            <AppBar
                color="primary"
                position="static"
                sx={{ zIndex: 96 }}
            >
                <AppFooter>
                    <FooterContent>
                        <NovisolLogo/>
                        <Span sx={{ m: "auto" }}></Span>
                        <Paragraph sx={{ m: 0 }}>
                            © Tim Bachmann, 2024
                        </Paragraph>
                    </FooterContent>
                </AppFooter>
            </AppBar>
        </ThemeProvider>
    )
}

export default Footer
