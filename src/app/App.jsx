import React from 'react'
import { Store } from './helpers/redux/Store'
import { Provider } from 'react-redux'
import { AllPages } from './helpers/routes/routes'
import { MatxTheme } from 'app/helpers/components'
import { useRoutes } from 'react-router-dom'
import { AuthProvider } from 'app/helpers/contexts/JWTAuthContext'
import { SettingsProvider } from 'app/helpers/contexts/SettingsContext'

const App = () => {
    const all_pages = useRoutes(AllPages())

    return (
        <Provider store={Store}>
            <SettingsProvider>
                <MatxTheme>
                    <AuthProvider>{all_pages}</AuthProvider>
                </MatxTheme>
            </SettingsProvider>
        </Provider>
    )
}

export default App
