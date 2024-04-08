import {
    Grid,
    Card, Button, Icon, FormControlLabel, Checkbox, MenuItem, FormControl, InputAdornment,
} from '@mui/material'
import {styled} from '@mui/system'
import React, {useState} from 'react'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import axios from "../../../../axios";
import {Span} from "../../../helpers/components/Typography";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

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
    const {enqueueSnackbar} = useSnackbar();

    const handleSave = () => {
        async function saveTour() {
            const updatedTour = {
                title: title,
                source: source,
                multimediaObjects: [],
                author: author
            };

            axios.post(process.env.REACT_APP_BACKEND_URI + '/tours', updatedTour)
                .then(() => {
                    enqueueSnackbar('Created successfully!', {variant: 'success'});
                    navigate('/tours');
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, {variant: 'error'});
                });
        }

        saveTour();
    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const {
        title,
        source,
        author,
    } = state

    return (
        <CardRoot elevation={6}>
            <CardTitle>
                {'Create Tour'}
            </CardTitle>
            <div>
                <ValidatorForm onSubmit={handleSave} onError={() => {
                }}>
                    <Grid container columnSpacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                            <TextField
                                type="text"
                                name="title"
                                id="standard-basic"
                                onChange={handleChange}
                                value={title || ''}
                                validators={[
                                    'required',
                                ]}
                                label="Tour Title"
                                errorMessages={['this field is required']}
                            />

                            <TextField
                                type="text"
                                name="source"
                                id="standard-basic"
                                onChange={handleChange}
                                value={source || ''}
                                validators={[
                                    'required',
                                ]}
                                label="Source"
                                errorMessages={['this field is required']}
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                            <TextField
                                type="text"
                                name="author"
                                id="standard-basic"
                                onChange={handleChange}
                                value={author || ''}
                                validators={[
                                    'required',
                                ]}
                                label="Author"
                                errorMessages={['this field is required']}
                            />
                        </Grid>
                    </Grid>
                    <Button color="primary" variant="contained" type="submit">
                        <Icon>add</Icon>
                        <Span sx={{pl: 1, textTransform: 'capitalize'}}>
                            Create
                        </Span>
                    </Button>
                </ValidatorForm>
            </div>
        </CardRoot>
    )
}

export default DetailsForm
