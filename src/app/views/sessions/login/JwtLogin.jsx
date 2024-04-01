import {
    Card,
    Grid,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
} from '@mui/material'
import React, { useState } from 'react'
import useAuth from 'app/helpers/hooks/useAuth'
import {Navigate, useNavigate} from 'react-router-dom'
import { Box, styled, useTheme } from '@mui/system'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Paragraph } from 'app/helpers/components/Typography'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'center',
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    padding: '32px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const IMG = styled('img')(() => ({
    width: '100%',
}))

const JWTRoot = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100% !important',
    '& .card': {
        maxWidth: 800,
        borderRadius: 12,
        margin: '1rem',
    },
}))

const StyledProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '6px',
    left: '25px',
}))

const JwtLogin = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState({
        email: localStorage.getItem('email') !== null ? localStorage.getItem('email') : '',
        password: '',
        agreement: localStorage.getItem('email') !== null
    })
    const [message, setMessage] = useState('')
    const { isAuthenticated, login } = useAuth()

    const handleChange = ({ target: { name, value } }) => {
        let temp = { ...userInfo }
        temp[name] = value
        setUserInfo(temp)
    }

    const { palette } = useTheme()
    const textError = palette.error.main

    const handleFormSubmit = async (event) => {
        setLoading(true)
        try {
            await login(userInfo.email, userInfo.password)
            if(userInfo.agreement){
                localStorage.setItem('email', userInfo.email)
            } else {
                localStorage.removeItem('email')
            }
            navigate('/')
        } catch (e) {
            console.log(e)
            if(e.status === 429){
                setMessage("Zu viele Versuche, bitte probiere es später erneut.")
            } else {
                setMessage("Login fehlgeschlagen")
            }
            setLoading(false)
        }
    }

    if(isAuthenticated) {
        return (<Navigate
            to="/"
        />)
    } else {
        return (
            <JWTRoot>
                <Card className="card">
                    <Grid container>
                        <Grid item lg={5} md={5} sm={5} xs={12}>
                            <ContentBox p={4} mx={4} height="100%">
                                <IMG
                                    src="/assets/images/logo.png"
                                    alt=""
                                />
                            </ContentBox>
                        </Grid>
                        <Grid item lg={7} md={7} sm={7} xs={12}>
                            <ContentBox>
                                <ValidatorForm onSubmit={handleFormSubmit}>
                                    <TextValidator
                                        sx={{mb: 3, width: '100%'}}
                                        variant="outlined"
                                        size="small"
                                        label="Email"
                                        onChange={handleChange}
                                        type="email"
                                        name="email"
                                        value={userInfo.email}
                                        validators={['required', 'isEmail']}
                                        errorMessages={[
                                            'this field is required',
                                            'email is not valid',
                                        ]}
                                    />
                                    <TextValidator
                                        sx={{mb: '12px', width: '100%'}}
                                        label="Passwort"
                                        variant="outlined"
                                        size="small"
                                        onChange={handleChange}
                                        name="password"
                                        type="password"
                                        value={userInfo.password}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                    />
                                    <FormControlLabel
                                        sx={{mb: '12px', maxWidth: 288}}
                                        name="agreement"
                                        onChange={handleChange}
                                        control={
                                            <Checkbox
                                                size="small"
                                                onChange={({
                                                    target: {checked},
                                                }) =>
                                                    handleChange({
                                                        target: {
                                                            name: 'agreement',
                                                            value: checked,
                                                        },
                                                    })
                                                }
                                                checked={userInfo.agreement}
                                            />
                                        }
                                        label="E-Mail merken"
                                    />

                                    {message && (
                                        <Paragraph sx={{color: textError}}>
                                            {message}
                                        </Paragraph>
                                    )}

                                    <FlexBox mb={2} flexWrap="wrap">
                                        <Box position="relative">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disabled={loading}
                                                type="submit"
                                            >
                                                Log in
                                            </Button>
                                            {loading && (
                                                <StyledProgress
                                                    size={24}
                                                    className="buttonProgress"
                                                />
                                            )}
                                        </Box>
                                    </FlexBox>
                                </ValidatorForm>
                            </ContentBox>
                        </Grid>
                    </Grid>
                </Card>
            </JWTRoot>
        )
    }
}

export default JwtLogin
