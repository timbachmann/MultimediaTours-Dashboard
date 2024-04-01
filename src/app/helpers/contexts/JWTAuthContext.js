import React, { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'
import axios from '../../../axios'
import { MatxLoading } from '../components'

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (email, password) => {
        const response = await axios.post(process.env.REACT_APP_BACKEND_URI + '/users/auth/login', {
            email,
            password,
        })

        const token = response.data.token
        const user = response.data.user

        axios.defaults.headers.common["X-CSRF-Token"] = user.CSRF;

        setSession(token)

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        axios.post(process.env.REACT_APP_BACKEND_URI + '/users/auth/logout', {
            id: state.user.id
        })
        setSession(null)
        dispatch({type: 'LOGOUT'})
    }

    useEffect(() => {
        ; (async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken')
                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)
                    const response = await axios.get(process.env.REACT_APP_BACKEND_URI + '/users/auth/profile')
                    const user = response.data

                    axios.defaults.headers.common["X-CSRF-Token"] = user.CSRF;

                    if(user.token !== undefined){
                        setSession(user.token)
                    }


                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
