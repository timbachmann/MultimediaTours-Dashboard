import {
    Grid, Card,
} from '@mui/material'
import {styled} from '@mui/system'
import React, {useState} from 'react'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import axios from "../../../../../axios";
import {useSnackbar} from "notistack";

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const CardRoot = styled(Card)(() => ({
    height: '100%',
    padding: '20px 24px',
    marginTop: '25px'
}))

const CardTitle = styled('div')(({subtitle}) => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: !subtitle && "16px",
    display: 'flex',
    justifyContent: 'space-between',
}))

const PasswordForm = ({title, user}) => {

    const [state, setState] = useState([]);
    const {enqueueSnackbar} = useSnackbar();

    React.useEffect(() => {
        setState({
            ...state,
            id: user.id
        })
        // eslint-disable-next-line
    }, [user])

    if(!ValidatorForm.hasValidationRule('isPasswordMatch')){
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            return value === password;

        });
    }

    const {
        id,
        password,
        passwordConfirm
    } = state

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleSave = () => {
        if(password === passwordConfirm){
            async function savePassword() {
                axios.put(process.env.REACT_APP_BACKEND_URI + `/user/${id}/password`, {
                    password: password,
                    })
                    .then((response) => {
                        enqueueSnackbar('Passwort wurde aktualisiert!', { variant: 'success' });
                    })
                    .catch((error) => {
                        console.log(error);
                        enqueueSnackbar(error.error, { variant: 'error' });
                    });
            }

            savePassword();
        } else {
            enqueueSnackbar("Die Passwörter müssen übereinstimmen!", {variant: "error"});
        }
    }

    return (
        <div>
            <CardRoot elevation={6}>
                <ValidatorForm onSubmit={handleSave} onError={() => null}>
                    <CardTitle>
                        {title}
                        <div>
                            <Tooltip title="Save">
                                <IconButton type="submit">
                                    <SaveIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </CardTitle>
                    <div>

                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                                <TextField
                                    label="Passwort"
                                    onChange={handleChange}
                                    type="password"
                                    name="password"
                                    value={password || ''}
                                    validators={['required']}
                                    errorMessages={['Dieses Feld ist erforderlich']}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                                <TextField
                                    label="Passwort bestätigen"
                                    onChange={handleChange}
                                    type="password"
                                    name="passwordConfirm"
                                    value={passwordConfirm || ''}
                                    valuetwo={passwordConfirm}
                                    validators={['required']}
                                    errorMessages={['Dieses Feld ist erforderlich']}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </ValidatorForm>
            </CardRoot>
        </div>
    )
}

export default PasswordForm