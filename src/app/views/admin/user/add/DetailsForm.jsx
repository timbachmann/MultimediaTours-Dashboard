import {
    Grid,
    Card, Button, Icon,
} from '@mui/material'
import {styled} from '@mui/system'
import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import axios from "../../../../../axios";
import {Span} from "../../../../helpers/components/Typography";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const CardRoot = styled(Card)(() => ({
    height: '100%',
    padding: '20px 24px',
}))

const CardTitle = styled('div')(({ subtitle }) => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: !subtitle && "16px",
    display: 'flex',
    justifyContent: 'space-between',
}))

const DetailsForm = () => {

    const navigate = useNavigate();
    const [state, setState] = useState([]);
    const {enqueueSnackbar} = useSnackbar();

    const handleSave = () => {
        async function addUser() {
            axios.post( process.env.REACT_APP_BACKEND_URI + '/user', {
                email: email,
            })
                .then((response) => {
                    enqueueSnackbar('Erfolgreich hinzugefügt!', { variant: 'success' });
                    navigate('/admin/user');
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, { variant: 'error' });
                });
        }
        addUser();
    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const {
        email,
    } = state

    return (
        <CardRoot elevation={6}>
            <CardTitle>
                {'User erstellen'}
            </CardTitle>
            <div>
                <ValidatorForm onSubmit={handleSave} onError={() => null}>
                    <Grid container spacing={6}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                type="email"
                                name="email"
                                id="standard-basic"
                                onChange={handleChange}
                                value={email || ''}
                                validators={[
                                    'required',
                                ]}
                                label="E-Mail"
                                errorMessages={['Dieses Feld ist erforderlich']}
                            />
                        </Grid>
                </Grid>
                    <Button color="primary" variant="contained" type="submit">
                        <Icon>add</Icon>
                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                            Erstellen
                        </Span>
                    </Button>
                </ValidatorForm>
            </div>
        </CardRoot>
    )
}

export default DetailsForm
