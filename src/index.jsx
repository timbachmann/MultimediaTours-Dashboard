import React from 'react'
import App from './app/App'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { StyledEngineProvider } from '@mui/styled-engine'
import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack';


ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <BrowserRouter basename="/">
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
                <App />
            </SnackbarProvider>
        </BrowserRouter>
    </StyledEngineProvider>,
    document.getElementById('root')
)
