export const authRoles = {
    sa: ['SA'], // Only Super Admin has access
    admin: ['SA', 'ADMIN'], // Only SA & Admin has access
    view: ['SA', 'ADMIN', 'VIEW'], // Only SA & Admin & Editor has access
    guest: ['SA', 'ADMIN', 'VIEW', 'GUEST'], // Everyone has access
}