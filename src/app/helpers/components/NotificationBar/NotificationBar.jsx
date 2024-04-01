import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Small, Paragraph } from '../Typography'
import { themeShadows } from '../MatxTheme/themeColors'
import { getTimeDifference } from 'app/helpers/utils/utils.js'
import useSettings from 'app/helpers/hooks/useSettings'
import useNotification from 'app/helpers/hooks/useNotification'
import { styled, Box, useTheme } from '@mui/system'
import {
    Icon,
    Badge,
    Card,
    IconButton,
    Drawer,
    ThemeProvider,
} from '@mui/material'
import { sideNavWidth, topBarHeight } from 'app/helpers/utils/constant'

const Notification = styled('div')(() => ({
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    height: topBarHeight,
    boxShadow: themeShadows[6],
    '& h5': {
        marginLeft: '8px',
        marginTop: 0,
        marginBottom: 0,
        fontWeight: '500',
    },
}))

const NotificationCard = styled(Box)(({ theme }) => ({
    position: 'relative',
    '&:hover': {
        '& .messageTime': {
            display: 'none',
        },
        '& .deleteButton': {
            opacity: '1',
        },
    },
    '& .messageTime': {
        color: theme.palette.text.secondary,
    },
    '& .icon': { fontSize: '1.25rem' },
}))

const DeleteButton = styled(IconButton)(({ theme }) => ({
    opacity: '0',
    position: 'absolute',
    right: 5,
    marginTop: 9,
    marginRight: '24px',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const CardLeftContent = styled('div')(({ theme }) => ({
    padding: '12px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(0, 0, 0, 0.01)',
    '& small': {
        fontWeight: '500',
        marginLeft: '16px',
        color: theme.palette.text.secondary,
    },
}))

const Heading = styled('span')(({ theme }) => ({
    fontWeight: '500',
    marginLeft: '16px',
    color: theme.palette.text.secondary,
}))

const NotificationBar = ({ container }) => {
    const { settings } = useSettings()
    const theme = useTheme()
    const secondary = theme.palette.text.secondary
    const [panelOpen, setPanelOpen] = React.useState(false)
    const { deleteNotification, notifications } =
        useNotification()

    const handleDrawerToggle = () => {
        setPanelOpen(!panelOpen)
    }

    const { palette } = useTheme()
    const textColor = palette.text.primary

    const getColor = (notificationType) => {
        switch (notificationType){
            case 'INFO':
                return 'primary';
            case 'WARNING':
                return 'warning';
            case 'ALERT':
                return 'error';
            default:
                return 'primary';
        }
    }

    const getIcon = (notificationType) => {
        switch (notificationType){
            case 'INFO':
                return 'notifications';
            case 'WARNING':
                return 'warning';
            case 'ALERT':
                return 'error';
            default:
                return 'notifications';
        }
    }

    const getHeading = (notificationType) => {
        switch (notificationType){
            case 'INFO':
                return 'Info';
            case 'WARNING':
                return 'Warnung';
            case 'ALERT':
                return 'Fehler';
            default:
                return 'notifications';
        }
    }

    return (
        <Fragment>
            <IconButton onClick={handleDrawerToggle}>
                <Badge color="secondary" badgeContent={notifications?.length}>
                    <Icon sx={{ color: textColor }}>notifications</Icon>
                </Badge>
            </IconButton>

            <ThemeProvider theme={settings.themes[settings.activeTheme]}>
                <Drawer
                    width={'100px'}
                    container={container}
                    variant="temporary"
                    anchor={'right'}
                    open={panelOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    <Box sx={{ width: sideNavWidth }}>
                        <Notification>
                            <Icon color="primary">notifications</Icon>
                            <h5>Benachrichtigungen</h5>
                        </Notification>

                        {notifications?.map((notification) => (
                            <NotificationCard key={notification._id}>
                                <DeleteButton
                                    size="small"
                                    className="deleteButton"
                                    onClick={() =>
                                        deleteNotification(notification._id)
                                    }
                                >
                                    <Icon className="icon">clear</Icon>
                                </DeleteButton>
                                <Link
                                    to={`${notification.link}`}
                                    onClick={handleDrawerToggle}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Card sx={{ mx: 2, mb: 3 }} elevation={3}>
                                        <CardLeftContent>
                                            <Box display="flex">
                                                <Icon
                                                    className="icon"
                                                    color={
                                                        getColor(notification.type)
                                                    }
                                                >
                                                    {getIcon(notification.type)}
                                                </Icon>
                                                <Heading>
                                                    {getHeading(notification.type)}
                                                </Heading>
                                            </Box>
                                            <Small className="messageTime">
                                                {getTimeDifference(
                                                        new Date(notification.timestamp)
                                                )}
                                                &nbsp;ago
                                            </Small>
                                        </CardLeftContent>
                                        <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                                            <Paragraph sx={{ m: 0 }}>
                                                {notification.subject}
                                            </Paragraph>
                                            <Small sx={{ color: secondary }}>
                                                {notification.text}
                                            </Small>
                                        </Box>
                                    </Card>
                                </Link>
                            </NotificationCard>
                        ))}
                    </Box>
                </Drawer>
            </ThemeProvider>
        </Fragment>
    )
}

export default NotificationBar
