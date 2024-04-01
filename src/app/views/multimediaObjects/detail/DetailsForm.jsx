import {
    Grid,
    Card, Dialog, Button, InputAdornment, MenuItem, FormControl, FormControlLabel, Checkbox, CircularProgress,
} from '@mui/material'
import {styled} from '@mui/system'
import React, {useEffect, useState} from 'react'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../../../axios";
import {useNavigate} from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import {de} from "date-fns/locale";
import {useSnackbar} from "notistack";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {parseISO} from "date-fns";
import {Email, NoteAdd} from "@mui/icons-material";

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

const DetailsForm = ({title, camp}) => {
    const [state, setState] = useState([])
    const [disabled, setDisabled] = useState(true)
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [openCreateInvoice, setOpenCreateInvoice] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [activeChecked, setActiveChecked] = useState(false);
    const [partnerOptions, setPartnerOptions] = React.useState([]);
    const [invoicesInProgress, setInvoicesInProgress] = useState(false);
    const [invoicesToCreate, setInvoicesToCreate] = React.useState(false);

    useEffect(() => {
        if (camp.active) {
            setActiveChecked(camp.active);
        }
        if (camp.bookings) {
            setInvoicesToCreate(camp.bookings.filter((i) => (i.invoice === undefined || i.invoice === "") && i.invoiceNeeded !== false).length > 0)
        }
    }, [camp.active, camp.bookings]);

    React.useEffect(() => {
        async function getPartnerOptions() {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/partner`)
                .then((response) => {
                    setPartnerOptions(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        getPartnerOptions();
    }, []);

    const handleDelete = () => {
        setOpen(true);
    };

    const handleCreateInvoices = () => {
        setOpenCreateInvoice(true);
    };

    const handleCloseCreateInvoice = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        setOpenCreateInvoice(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        async function saveCamp() {
            const updatedCamp = partner !== "" ? {
                name: name,
                partner: partner,
                startDate: startDate,
                endDate: endDate,
                lunchPrice: lunchPrice,
                campPrice: campPrice,
                memberPrice: memberPrice,
                active: activeChecked,
                halfDayPrice: halfDayPrice,
                halfDayMemberPrice: halfDayMemberPrice,
                notes: notes,
                invoicesCreated: invoicesCreated,
                participantsLimit: participantsLimit,
                waitingList: waitingList,
                bookings: bookings,
            } : {
                name: name,
                startDate: startDate,
                endDate: endDate,
                lunchPrice: lunchPrice,
                campPrice: campPrice,
                memberPrice: memberPrice,
                active: activeChecked,
                halfDayPrice: halfDayPrice,
                halfDayMemberPrice: halfDayMemberPrice,
                notes: notes,
                invoicesCreated: invoicesCreated,
                participantsLimit: participantsLimit,
                waitingList: waitingList,
                bookings: bookings,
            };
            axios.put(process.env.REACT_APP_BACKEND_URI + `/camp/${id}`, updatedCamp)
                .then(() => {
                    setDisabled(true);
                    enqueueSnackbar('Erfolgreich gespeichert!', { variant: 'success' });
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, { variant: 'error' });
                });
        }

        saveCamp();
    }

    const handleCheckboxChange = () => {
        setActiveChecked(!activeChecked);
    };

    const handleCheckboxInitial = () => {
        setActiveChecked(camp.active);
    };

    const handleStartDateChange = (startDate) => {
        setState({...state, startDate})
    }

    const handleEndDateChange = (endDate) => {
        setState({...state, endDate})
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

    const handleChangePartner = (event) => {
        setState({
            ...state,
            partner: event.target.value,
        })
    }

    const handleSendEmail = () => {
        navigate(`/email/send?type=camp&id=${id}`)
    }

    const handleDeleteTrue = () => {
        async function deleteCamp() {
            axios.delete(process.env.REACT_APP_BACKEND_URI + `/camp/${id}`)
                .then(() => {
                    enqueueSnackbar("Das Camp wurde erfolgreich gelöscht", {variant: "info"})
                    navigate('/camps/overview');
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        deleteCamp();
    };

    const delay = async (ms) => {
        return new Promise((resolve) =>
            setTimeout(resolve, ms));
    };

    const handleCreateInvoicesTrue = async () => {
        setInvoicesInProgress(true);
        setInvoicesToCreate(false);
        axios.post(process.env.REACT_APP_BACKEND_URI + `/invoice/camp/${id}`)
            .then(async () => {
                await delay(2000);
                handleCloseCreateInvoice();
                enqueueSnackbar('Erfolgreich erstellt!', {variant: 'success'});
                window.open(`https://app.lexoffice.de/permalink/invoices/view/`, '_blank');
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const {
        id = camp._id,
        name = camp.name,
        partner = camp.partner,
        startDate = camp.startDate,
        endDate = camp.endDate,
        lunchPrice = camp.lunchPrice,
        campPrice = camp.campPrice,
        memberPrice = camp.memberPrice,
        halfDayPrice = camp.halfDayPrice,
        halfDayMemberPrice = camp.halfDayMemberPrice,
        notes = camp.notes,
        invoicesCreated = camp.invoicesCreated,
        participantsLimit = camp.participantsLimit,
        waitingList = camp.waitingList,
        bookings = camp.bookings,

    } = state

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">
                    {"Camp löschen?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Abbrechen</Button>
                    <Button onClick={handleDeleteTrue} autoFocus>
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openCreateInvoice}
                onClose={handleCloseCreateInvoice}
                aria-labelledby="alert-dialog-title">
                {invoicesInProgress ?
                    <DialogTitle id="alert-dialog-title">
                        {"Rechnungen werden erstellt..."}
                    </DialogTitle>:
                    <DialogTitle id="alert-dialog-title">
                        {"Wirklich alle Rechnungen erstellen?"}
                        <br/>
                        {"Dies kann nicht rückgängig gemacht werden!"}
                    </DialogTitle>
                }
                <DialogActions>
                    {invoicesInProgress ?
                        <CircularProgress
                            sx={{margin: '0 16px 8px 28px'}}
                            size={28}
                            thickness={4}
                        /> :
                        <>
                            <Button onClick={handleCloseCreateInvoice}>Abbrechen</Button>
                            <Button onClick={handleCreateInvoicesTrue} autoFocus>
                                ERSTELLEN
                            </Button>
                        </>
                    }
                </DialogActions>
            </Dialog>
            <CardRoot elevation={6}>
                <CardTitle>
                    {title}
                    <div>
                        <Tooltip title="E-Mail an Campteilnehmer senden" onClick={handleSendEmail}>
                            <IconButton>
                                <Email/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechnungen erstellen" hidden={!disabled} onClick={handleCreateInvoices}>
                            <IconButton disabled={!disabled || !invoicesToCreate}>
                                <NoteAdd/>
                            </IconButton>
                        </Tooltip>
                        {disabled ? <Tooltip title="Edit" onClick={handleEdit}>
                            <IconButton>
                                <EditIcon/>
                            </IconButton>
                        </Tooltip> : <Tooltip title="Save" onClick={handleSave}>
                            <IconButton>
                                <SaveIcon/>
                            </IconButton>
                        </Tooltip>}
                        <Tooltip title="Delete" onClick={handleDelete}>
                            <IconButton>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </CardTitle>
                <div>
                    <ValidatorForm onSubmit={() => {}} onError={() => {}}>
                        <Grid container columnSpacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                                <TextField
                                    type="text"
                                    name="name"
                                    id="standard-basic"
                                    onChange={handleChange}
                                    value={name || ''}
                                    disabled={disabled}
                                    validators={[
                                        'required',
                                    ]}
                                    label="Camp Name"
                                    errorMessages={['this field is required']}
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
                                    <DatePicker
                                        value={parseISO(startDate)}
                                        disabled={disabled}
                                        label="Start"
                                        sx={{mb: 2, width: '100%'}}
                                        onChange={handleStartDateChange}
                                        mask=""
                                        textField={(props) => (
                                            <TextField
                                                {...props}
                                                // variant="Outlined"
                                                id="startDate"
                                                label="Start"
                                                disabled={disabled}
                                                sx={{mb: 2, width: '100%'}}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>

                                <TextField
                                    label="Preis für Mittagessen"
                                    onChange={handleChange}
                                    type="number"
                                    name="lunchPrice"
                                    step="0.01"
                                    disabled={disabled}
                                    value={lunchPrice || ''}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />

                                <TextField
                                    label="Teilnehmer-Limit"
                                    onChange={handleChange}
                                    type="number"
                                    step="1"
                                    name="participantsLimit"
                                    disabled={disabled}
                                    value={participantsLimit || ''}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />

                                <TextField
                                    label="Halbtagspreis"
                                    onChange={handleChange}
                                    type="number"
                                    step="0.01"
                                    name="halfDayPrice"
                                    disabled={disabled}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                    }}
                                    value={halfDayPrice || ''}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                                <FormControl sx={{ marginBottom: 2, minWidth: '100%' }}>
                                    <InputLabel id="select-helper-label">Sponsor</InputLabel>
                                    <Select
                                        id='partner'
                                        name='partner'
                                        label="Sponsor"
                                        disabled={disabled}
                                        value={partner || ''}
                                        onChange={handleChangePartner}
                                    >
                                        <MenuItem value={''}><b>Ohne Sponsor</b></MenuItem>
                                        {partnerOptions.map(partnerOption => (
                                            <MenuItem key={partnerOption._id} value={partnerOption._id}>{partnerOption.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
                                    <DatePicker
                                        value={parseISO(endDate)}
                                        disabled={disabled}
                                        label="Ende"
                                        sx={{mb: 2, width: '100%'}}
                                        onChange={handleEndDateChange}
                                        mask=""
                                        textField={(props) => (
                                            <TextField
                                                {...props}
                                                // variant="Outlined"
                                                id="endDate"
                                                label="Ende"
                                                disabled={disabled}
                                                sx={{mb: 2, width: '100%'}}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>

                                <TextField
                                    label="Camp-Preis"
                                    onChange={handleChange}
                                    type="number"
                                    step="0.01"
                                    name="campPrice"
                                    disabled={disabled}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                    }}
                                    value={campPrice || ''}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />

                                <TextField
                                    label="Mitglieder-Preis"
                                    onChange={handleChange}
                                    type="number"
                                    step="0.01"
                                    name="memberPrice"
                                    disabled={disabled}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                    }}
                                    value={memberPrice || ''}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />

                                <TextField
                                    label="Halbtagspreis Mitglieder"
                                    onChange={handleChange}
                                    type="number"
                                    step="0.01"
                                    name="halfDayMemberPrice"
                                    disabled={disabled}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                    }}
                                    value={halfDayMemberPrice || ''}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <TextField
                                        label="Notizen"
                                        onChange={handleChange}
                                        type="text"
                                        disabled={disabled}
                                        name="notes"
                                        multiline
                                        minRows={3}
                                        value={notes || ''}
                                    />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <FormControlLabel
                                    disabled={disabled}
                                    control={<Checkbox onLoad={handleCheckboxInitial} checked={activeChecked}
                                                       onChange={handleCheckboxChange}></Checkbox>}
                                    label="Aktiv"
                                />
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </div>
            </CardRoot>
        </div>
    )
}

export default DetailsForm
