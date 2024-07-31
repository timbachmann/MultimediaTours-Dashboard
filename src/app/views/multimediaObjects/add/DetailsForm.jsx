import {
    Grid,
    Card, Button, Icon, Checkbox, FormControl, MenuItem,
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
        const tagsArray = tags === undefined ? [] : tags.split(",").filter((tag) => tag.length > 0).map((tag) => tag.toLowerCase());
        const uniqueTags = [...new Set(tagsArray)]

        let updatedMultimediaObject = {
            type: type,
            title: title,
            date: date,
            source: source,
            data: data,
            author: author,
            tags: uniqueTags,
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
        saveObject(updatedMultimediaObject, type !== multimediaTypes.Text);
    }

    async function saveObject(updatedMultimediaObject, uploadFile = false) {
        updatedMultimediaObject.data = "";
        axios.post(process.env.REACT_APP_BACKEND_URI + '/multimedia-objects', updatedMultimediaObject)
            .then((response) => {
                if (!uploadFile) {
                    enqueueSnackbar('Created successfully!', {variant: 'success'});
                    navigate('/multimedia-objects');
                } else {
                    const formData = new FormData()
                    formData.append('file', file, file.name)

                    const requestConfig = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    };

                    const id = response.data;
                    axios.post(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/upload/${id}`, formData, requestConfig)
                        .then((response) => {
                            updatedMultimediaObject.data = response.data;
                            axios.put(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/${id}`, updatedMultimediaObject)
                                .then((response) => {
                                    enqueueSnackbar('Created successfully!', {variant: 'success'});
                                    navigate('/multimedia-objects');
                                })
                                .catch((error) => {
                                    console.log(error);
                                    enqueueSnackbar(error.error, {variant: 'error'});
                                });
                        })
                        .catch((error) => {
                            console.log(error);
                            enqueueSnackbar(error.error, {variant: 'error'});
                        });
                }
            })
            .catch((error) => {
                console.log(error);
                enqueueSnackbar(error.error, {variant: 'error'});
            });
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
        tags
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

                    <H6 sx={{mt: 4, mb: 2}}>Tags</H6>
                    <Grid container columnSpacing={6}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                label="Enter tags separated with a comma, e.g. architecture,buildings,..."
                                onChange={handleChange}
                                type="text"
                                name="tags"
                                value={tags || ''}
                            />
                        </Grid>
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
