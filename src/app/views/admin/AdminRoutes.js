import React, { lazy } from 'react'
import Loadable from 'app/helpers/components/Loadable/Loadable';
import {authRoles} from "../../helpers/auth/authRoles";

const AppUserTableOverview = Loadable(lazy(() => import("./user/overview/AppTable")));
const AppUserDetail = Loadable(lazy(() => import("./user/detail/AppDetail")));
const AppUserAdd = Loadable(lazy(() => import("./user/add/AppDetail")));
const AppSettingsTableOverview = Loadable(lazy(() => import("./settings/overview/AppTable")));

const adminRoutes = [
    {
        path: '/admin/user',
        element: <AppUserTableOverview />,
    },
    {
        path: '/admin/user/detail',
        element: <AppUserDetail />,
    },
    {
        path: '/admin/user/add',
        element: <AppUserAdd />,
        auth: authRoles.admin
    },
    {
        path: '/admin/settings',
        element: <AppSettingsTableOverview />,
        auth: authRoles.admin
    },
]

export default adminRoutes
