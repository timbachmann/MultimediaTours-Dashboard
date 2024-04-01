import {
    Grid,
    Card, Button, Icon, FormControlLabel, Checkbox, InputAdornment,
} from '@mui/material'
import {styled} from '@mui/system'
import React, {useState} from 'react'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import axios from "../../../../axios";
import {Span} from "../../../helpers/components/Typography";
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

const CardTitle = styled('div')(({subtitle}) => ({
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
    const [partner] = useState('');
    const {enqueueSnackbar} = useSnackbar();

    const handleSave = () => {
        async function saveCourse() {
            const updatedCourseType = partner !== "" ? {
                name: name,
                rangeFrom: rangeFrom,
                rangeTo: rangeTo,
                partner: partner,
                courses: [],
                price: price,
                discountPrice: discountPrice,
                registration: registrationChecked,
                defaultParticipantsLimit: defaultParticipantsLimit,
                notes: notes,
            } : {
                name: name,
                rangeFrom: rangeFrom,
                rangeTo: rangeTo,
                courses: [],
                price: price,
                discountPrice: discountPrice,
                registration: registrationChecked,
                defaultParticipantsLimit: defaultParticipantsLimit,
                notes: notes,
            };

            axios.post(process.env.REACT_APP_BACKEND_URI + '/courseType', updatedCourseType)
                .then(() => {
                    enqueueSnackbar('Erfolgreich erstellt!', {variant: 'success'});
                    navigate('/courseTypes/overview');
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, {variant: 'error'});
                });
        }

        saveCourse();
    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            registrationChecked: event.target.checked,
        })
    };

    const {
        name,
        rangeFrom,
        rangeTo,
        notes,
        price,
        discountPrice,
        defaultParticipantsLimit,
        registrationChecked = true,
    } = state

    return (
        <CardRoot elevation={6}>
            <CardTitle>
                {'Kurstyp erstellen'}
            </CardTitle>
            <div>
                <ValidatorForm onSubmit={handleSave} onError={() => {
                }}>
                    <Grid container columnSpacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                            <TextField
                                type="text"
                                name="name"
                                id="standard-basic"
                                onChange={handleChange}
                                value={name || ''}
                                validators={[
                                    'required',
                                ]}
                                label="Kurstyp Name"
                                errorMessages={['this field is required']}
                            />

                            <TextField
                                label="Jüngster Jahrgang"
                                onChange={handleChange}
                                type="number"
                                name="rangeFrom"
                                value={rangeFrom || ''}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />

                            <TextField
                                label="Standard Teilnehmerlimit"
                                onChange={handleChange}
                                type="number"
                                name="defaultParticipantsLimit"
                                value={defaultParticipantsLimit || ''}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>

                            <TextField
                                label="Ältester Jahrgang"
                                onChange={handleChange}
                                type="number"
                                name="rangeTo"
                                value={rangeTo || ''}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />

                            <TextField
                                label="Preis (Monatlich)"
                                onChange={handleChange}
                                type="number"
                                name="price"
                                step="0.01"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                }}
                                value={price || ''}
                                validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]}
                            />

                            <TextField
                                label="Geschwisterpreis (Monatlich)"
                                onChange={handleChange}
                                type="number"
                                step="0.01"
                                name="discountPrice"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                }}
                                value={discountPrice || ''}
                                validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]}
                            />
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    label="Notizen"
                                    onChange={handleChange}
                                    type="text"
                                    name="notes"
                                    multiline
                                    minRows={3}
                                    value={notes || ''}
                                />
                            </Grid>
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={registrationChecked}
                                                   onChange={handleCheckboxChange}></Checkbox>}
                                label="Registrierung möglich"
                            />
                        </Grid>
                    </Grid>
                    <Button color="primary" variant="contained" type="submit">
                        <Icon>add</Icon>
                        <Span sx={{pl: 1, textTransform: 'capitalize'}}>
                            Erstellen
                        </Span>
                    </Button>
                </ValidatorForm>
            </div>
        </CardRoot>
    )
}

export default DetailsForm
