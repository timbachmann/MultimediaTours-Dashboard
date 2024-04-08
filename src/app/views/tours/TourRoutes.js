import React, { lazy } from 'react'
import Loadable from 'app/helpers/components/Loadable/Loadable';

const AppTableOverview = Loadable(lazy(() => import("./overview/AppTable")));
const AppDetail = Loadable(lazy(() => import("./detail/AppDetail")));
const AppAdd = Loadable(lazy(() => import("./add/AppDetail")));
const AppAddObject = Loadable(lazy(() => import("./editObjects/AppTable")));

const tourRoutes = [
    {
        path: '/tours',
        element: <AppTableOverview />,
    },
    {
        path: '/tours/detail/',
        element: <AppDetail />,
    },
    {
        path: '/tours/add',
        element: <AppAdd />,
    },
    {
        path: '/tours/editObjects',
        element: <AppAddObject />,
    },

]

export default tourRoutes
