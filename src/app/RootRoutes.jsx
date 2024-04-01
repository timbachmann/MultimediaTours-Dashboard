import React from 'react'
import { Navigate } from 'react-router-dom'
import tourRoutes from './views/tours/TourRoutes'
import adminRoutes from './views/admin/AdminRoutes'

const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Navigate to="/tours" />,
    },
]

const errorRoute = [
    {
        component: () => <Navigate to="/session/404" />,
    },
]

const routes = [
    ...tourRoutes,
    ...adminRoutes,
    ...redirectRoute,
    ...errorRoute,
]

export default routes
