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
        name: 'Userverwaltung',
        icon: 'account_circle',
        path: '/admin/user',
        auth: authRoles.admin,

    },
    {
        name: 'Einstellungen',
        icon: 'settings',
        path: '/admin/settings',
        auth: authRoles.admin,

    }
]
