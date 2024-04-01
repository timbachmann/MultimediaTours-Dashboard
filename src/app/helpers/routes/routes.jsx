import AuthGuard from 'app/helpers/auth/AuthGuard'
import NotFound from 'app/views/sessions/NotFound'
import tourRoutes from 'app/views/tours/TourRoutes'
import adminRoutes from 'app/views/admin/AdminRoutes'
import sessionRoutes from 'app/views/sessions/SessionRoutes'
import MatxLayout from '../components/MatxLayout/MatxLayout'
import {Navigate} from 'react-router-dom'
import multimediaObjectRoutes from "../../views/multimediaObjects/MultimediaObjectRoutes";

export const AllPages = () => {
    const all_routes = [
        {
            element: (
                <AuthGuard>
                    <MatxLayout/>
                </AuthGuard>
            ),
            children: [ ...tourRoutes, ...multimediaObjectRoutes, ...adminRoutes],
        },
        ...sessionRoutes,
        {
            path: '/',
            element: <Navigate to="tours"/>,
        },
        {
            path: '*',
            element: <NotFound/>,
        },
    ]

    return all_routes;
}
