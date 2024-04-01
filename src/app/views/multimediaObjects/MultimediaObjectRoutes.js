import React, { lazy } from 'react'
import Loadable from 'app/helpers/components/Loadable/Loadable';

const AppTableOverview = Loadable(lazy(() => import("./overview/AppTable")));
const AppDetail = Loadable(lazy(() => import("./detail/AppDetail")));
const AppAdd = Loadable(lazy(() => import("./add/AppDetail")));

const multimediaObjectRoutes = [
    {
        path: '/multimedia-objects',
        element: <AppTableOverview />,
    },
    {
        path: '/multimedia-objects/detail/',
        element: <AppDetail />,
    },
    {
        path: '/multimedia-objects/add',
        element: <AppAdd />,
    },
]

export default multimediaObjectRoutes
