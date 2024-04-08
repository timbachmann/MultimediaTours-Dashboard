import {authRoles} from "./helpers/auth/authRoles";

export const navigations = [
    {
        name: 'Tours',
        path: '/tours',
        icon: 'route',
    },
    {
        name: 'Multimedia Objects',
        path: '/multimedia-objects',
        icon: 'collections',
    },
    {
        label: 'System',
        type: 'label',
        auth: authRoles.admin,
    },
    {
        name: 'Settings',
        icon: 'settings',
        path: '/admin/user',
        auth: authRoles.admin,

    },
]
