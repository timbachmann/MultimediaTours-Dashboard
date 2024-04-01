import React, { createContext, useEffect, useReducer } from 'react'
import axios from '../../../axios'

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_NOTIFICATIONS': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        case 'DELETE_NOTIFICATION': {
            return {
                ...state,
                notifications: state.notifications.filter((notification) => notification._id !== action.payload),
            }
        }
        case 'CLEAR_NOTIFICATIONS': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const NotificationContext = createContext({
    notifications: [],
    deleteNotification: () => {},
    clearNotifications: () => {},
    getNotifications: () => {},
    createNotification: () => {},
})

export const NotificationProvider = ({ settings, children }) => {
    const [state, dispatch] = useReducer(reducer, [])

    const deleteNotification = async (notificationID) => {
        try {
            await axios.get(process.env.REACT_APP_BACKEND_URI + '/notification/done/' + notificationID);
            dispatch({
                type: 'DELETE_NOTIFICATION',
                payload: notificationID,
            })
        } catch (e) {
            console.error(e)
        }
    }

    const getNotifications = async () => {
        try {
            const res = await axios.get(process.env.REACT_APP_BACKEND_URI + '/notification')
            dispatch({
                type: 'LOAD_NOTIFICATIONS',
                payload: res.data,
            })
        } catch (e) {
            console.error(e)
        }
    }
    const createNotification = async (notification) => {
        try {
            const res = await axios.post(process.env.REACT_APP_BACKEND_URI + '/notification', {
                notification,
            })
            dispatch({
                type: 'CREATE_NOTIFICATION',
                payload: res.data,
            })
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getNotifications()
    }, [])

    return (
        <NotificationContext.Provider
            value={{
                notifications: state.notifications,
                deleteNotification,
                getNotifications,
                createNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext
