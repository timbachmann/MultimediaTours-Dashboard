import useAuth from 'app/helpers/hooks/useAuth'
import {flat} from 'app/helpers/utils/utils'
import React, {useEffect, useState} from 'react'
import {Navigate, useLocation} from 'react-router-dom'
import {AllPages} from '../routes/routes'

const getUserRoleAuthStatus = (pathname, user, routes) => {
    if (!user) {
        return false
    }
    const matched = routes.find((r) => r.path === pathname)

    return matched && matched.auth && matched.auth.length
        ? matched.auth.includes(user.role)
        : true
}

const AuthGuard = ({ children }) => {
    const { isAuthenticated, user } = useAuth()
    // return <>{isAuthenticated ? children : <Navigate to="/session/signin" />}</>

    const [previouseRoute, setPreviousRoute] = useState(null)
    const { pathname } = useLocation()
    const routes = flat(AllPages())

    const isUserRoleAuthenticated = getUserRoleAuthStatus(
        pathname,
        user,
        routes
    )
    let authenticated = isAuthenticated && isUserRoleAuthenticated

    useEffect(() => {
        if (previouseRoute !== null) setPreviousRoute(pathname)
    }, [pathname, previouseRoute])

    if (authenticated) return <>{children}</>
    else {
        return (
            <Navigate
                to="/session/signin"
                state={{ redirectUrl: previouseRoute }}
            />
        )
    }
}

export default AuthGuard
