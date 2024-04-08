import {
    Grid,
    Card, Button, Icon, FormControlLabel, Checkbox, InputAdornment, FormControl, MenuItem,
} from '@mui/material'
import {Box, styled} from '@mui/system'
import React, {useState} from 'react'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import axios from "../../../../axios";
import {H6, Span} from "../../../helpers/components/Typography";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import {multimediaTypes, multimediaTypesInput} from "../../../helpers/utils/constant";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {de} from "date-fns/locale";
import {DatePicker} from "@mui/x-date-pickers";
import {parseISO} from "date-fns";
import FileInput from "../detail/FileUpload";

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

const FormContainer = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
}))

const DetailsForm = () => {

    const navigate = useNavigate();
    const [state, setState] = useState([]);
    const {enqueueSnackbar} = useSnackbar();
    const [multimediaTypeOptions] = React.useState(multimediaTypesInput);
    const [isPositionChecked, setIsPositionChecked] = useState(true);
    const [file, setFile] = React.useState(null);

    const handleSave = () => {
        async function saveObject() {
            const updatedMultimediaObject = {
                type: type,
                title: title,
                date: date,
                source: source,
                data: data,
                author: author,
                ...{
                    ...isPositionChecked &&
                    {
                        position: {
                            lat: latitude,
                            lng: longitude,
                            bearing: bearing,
                            yaw: yaw,
                        }
                    }
                }
            }

            axios.post(process.env.REACT_APP_BACKEND_URI + '/multimedia-objects', updatedMultimediaObject)
                .then(() => {
                    enqueueSnackbar('Created successfully!', {variant: 'success'});
                    navigate('/multimedia-objects');
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, {variant: 'error'});
                });
        }

        saveObject();
    }

    const handleDateChange = (date) => {
        setState({...state, date})
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0])
    }

    const handleChange = (event) => {
        event.persist()
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    const handleChangeType = (event) => {
        setState({
            ...state,
            type: event.target.value,
        })
    }

    const handleIsPositionCheckedChange = () => {
        setIsPositionChecked(!isPositionChecked);
    };

    async function uploadFile() {
        const formData = new FormData()

        if (file !== undefined) {
            formData.append('attachments', file, file.name)
        }

        axios.post(process.env.REACT_APP_BACKEND_URI + "/file", formData)
            .then(() => {
                enqueueSnackbar("Uploaded successfully!", {variant: 'success'})
                navigate({
                    pathname: '/dashboard'
                })
            })
            .catch((err) => {
                console.log(err)
                enqueueSnackbar("Ein Fehler ist aufgetreten: \n" + err.message, {variant: 'error'})
            })

    }

    const {
        type,
        title,
        date,
        source,
        latitude,
        longitude,
        bearing,
        yaw,
        data,
        author,
    } = state

    return (
        <CardRoot elevation={6}>
            <CardTitle>
                {'Create Multimedia Object'}
            </CardTitle>
            <div>
                <ValidatorForm onSubmit={handleSave} onError={() => {
                }}>
                    <Grid container columnSpacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                            <FormControl sx={{marginBottom: 2, minWidth: '100%'}}>
                                <InputLabel id="select-helper-label">Multimedia Type</InputLabel>
                                <Select
                                    id='type'
                                    name='type'
                                    label="Multimedia Type"
                                    value={type || ''}
                                    onChange={handleChangeType}
                                >
                                    {multimediaTypeOptions.map(typeOption => (
                                        <MenuItem key={typeOption.value}
                                                  value={typeOption.value}>{typeOption.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
                                <DatePicker
                                    value={parseISO(date)}
                                    label="Date"
                                    sx={{mb: 2, width: '100%'}}
                                    onChange={handleDateChange}
                                    mask=""
                                    textField={(props) => (
                                        <TextField
                                            {...props}
                                            // variant="Outlined"
                                            id="date"
                                            label="Date"
                                            sx={{mb: 2, width: '100%'}}
                                        />
                                    )}
                                />
                            </LocalizationProvider>

                            <TextField
                                label="Source"
                                onChange={handleChange}
                                type="text"
                                name="source"
                                value={source || ''}
                                validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]}
                            />
                        </Grid>

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
                                label="Title"
                                errorMessages={['this field is required']}
                            />

                            <TextField
                                label="Author"
                                onChange={handleChange}
                                type="text"
                                name="author"
                                value={author || ''}
                                validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]}
                            />
                        </Grid>

                        <FormContainer sx={{mt: 4, mb: 2, pl: 7, width: '100%'}}>
                            <H6>{'Position'}</H6>
                            <Checkbox checked={isPositionChecked} onChange={handleIsPositionCheckedChange}/>
                        </FormContainer>

                        {isPositionChecked && (
                            <Grid container columnSpacing={6} sx={{pl: 6}}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        label="Latitude"
                                        onChange={handleChange}
                                        type="number"
                                        step="0.000001"
                                        name="latitude"
                                        value={latitude || ''}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        label="Longitude"
                                        onChange={handleChange}
                                        type="number"
                                        step="0.000001"
                                        name="longitude"
                                        value={longitude || ''}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        label="Bearing"
                                        onChange={handleChange}
                                        type="number"
                                        name="bearing"
                                        value={bearing || ''}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        label="Yaw"
                                        onChange={handleChange}
                                        type="number"
                                        name="yaw"
                                        value={yaw || ''}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Grid>

                    <H6 sx={{mt: 4, mb: 2}}>Content</H6>
                    <Grid container columnSpacing={6}>
                        {type === multimediaTypes.Text ?
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    label="Text"
                                    onChange={handleChange}
                                    type="text"
                                    name="data"
                                    multiline
                                    minRows={3}
                                    value={data || ''}
                                />
                            </Grid>
                            :
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                                <FileInput
                                    multiple={false}
                                    onChange={handleFileChange}
                                />
                                <Box sx={{py: '12px'}}/>
                                {file &&
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={uploadFile}
                                        >
                                            Upload
                                        </Button>
                                        <Box sx={{py: '12px'}}/>
                                    </>}
                            </Grid>
                        }

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
