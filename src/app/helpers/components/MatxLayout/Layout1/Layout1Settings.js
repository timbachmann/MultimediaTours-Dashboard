const Layout1Settings = {
    leftSidebar: {
        show: true,
        mode: 'full', // full, close, compact, mobile,
        theme: 'slateDark1', // View all valid theme colors inside MatxTheme/themeColors.js
    },
    topbar: {
        show: true,
        fixed: true,
        theme: localStorage.getItem('topBarLayout') || 'whiteBlue', // slateDark1 View all valid theme colors inside MatxTheme/themeColors.js
    },
}

export default Layout1Settings
