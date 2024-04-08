import {
    Button, Dialog,
    Grid, Card,
} from '@mui/material'
import {styled} from '@mui/system'
import React, {useState} from 'react'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {useNavigate} from "react-router-dom";
import axios from "../../../../../axios";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {useSnackbar} from "notistack";

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const CardRoot = styled(Card)(() => ({
    height: '100%',
    padding: '20px 24px',
}))

const CardTitle = styled('div')(({subtitle}) => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: !subtitle && "16px",
    display: 'flex',
    justifyContent: 'space-between',
}))

const DetailsForm = ({title, userObject}) => {

    const [state, setState] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    React.useEffect(() => {
        setState({
            ...state,
            id: userObject.id,
            email: userObject.email
        })
        // eslint-disable-next-line
    }, [userObject])

    const handleDelete = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        async function saveUser() {
            userObject.email = email;
            axios.put(process.env.REACT_APP_BACKEND_URI + `/users/${id}`, userObject)
                .then((response) => {
                    enqueueSnackbar('Erfolgreich gespeichert!', { variant: 'success' });
                    setDisabled(true);
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, { variant: 'error' });
                });
        }

        saveUser();
        setDisabled(true);
    }

    const handleEdit = () => {
        setDisabled(false);
    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleDeleteTrue = () => {
        async function deleteMember() {
            axios.delete(process.env.REACT_APP_BACKEND_URI + `/user/${id}`)
                .then(() => {
                    enqueueSnackbar('User erfolgreich gelöscht!', { variant: 'info' });
                    navigate('/admin/user');
                })
                .catch((error) => {
                    console.log(error)
                    enqueueSnackbar(error.error, { variant: 'error' });
                })
        }

        deleteMember();
    };

    const {
        id,
        email
    } = state

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">
                    {"User löschen?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Abbrechen</Button>
                    <Button onClick={handleDeleteTrue} autoFocus>
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
            <CardRoot elevation={6}>

                <ValidatorForm onSubmit={handleSave} onError={() => null}>
                    <CardTitle>
                        {title}
                        <div>
                            {!disabled ? (<Tooltip title="Save" hidden={!disabled}>
                                <IconButton type={"submit"}>
                                    <SaveIcon/>
                                </IconButton>
                            </Tooltip>) : '' }

                            {disabled ? (<Tooltip title="Edit" hidden={disabled} onClick={handleEdit}>
                                <IconButton type={"button"}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>) : ''}
                            <Tooltip title="Delete" hidden={disabled} onClick={handleDelete}>
                                <IconButton type={"button"}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </CardTitle>
                    <div>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                                <TextField
                                    label="Email"
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    disabled={disabled}
                                    value={email || ''}
                                    validators={['required', 'isEmail']}
                                    errorMessages={[
                                        'this field is required',
                                        'Eingabe keine gültige E-Mail Adresse',
                                    ]}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </ValidatorForm>
            </CardRoot>
        </div>
    )
}

export default DetailsForm
