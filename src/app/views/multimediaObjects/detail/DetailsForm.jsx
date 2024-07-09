import {
    Grid,
    Card, Dialog, Button, MenuItem, FormControl, Checkbox,
} from '@mui/material'
import {Box, styled} from '@mui/system'
import React, {useEffect, useState} from 'react'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {DatePicker} from '@mui/x-date-pickers'
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
import FileInput from "./FileUpload";
import {H3, H6} from "../../../helpers/components/Typography";
import {multimediaTypes, multimediaTypesInput} from "../../../helpers/utils/constant";

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
    marginBottom: !subtitle && "16px",
    display: 'flex',
    justifyContent: 'space-between',
}))

const FormContainer = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
}))

const DetailsForm = ({pageTitle, multimediaObject, updateData, multimediaObjectFile}) => {
    const [state, setState] = useState([])
    const [disabled, setDisabled] = useState(true)
    const navigate = useNavigate();
    const [multimediaTypeOptions] = React.useState(multimediaTypesInput);
    const [isPositionChecked, setIsPositionChecked] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (multimediaObject.position) {
            setIsPositionChecked(multimediaObject.position);
        }
    }, [multimediaObject.position]);

    const handleDelete = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const tagsArray = tags.split(",").filter((tag) => tag.length > 0).map((tag) => tag.toLowerCase());
        const uniqueTags = [...new Set(tagsArray)]
        const updatedMultimediaObject = {
            type: type,
            title: title,
            date: date,
            source: source,
            data: data,
            author: author,
            tags: uniqueTags,
            ...(isPositionChecked &&
            {
                position: {
                    lat: latitude,
                    lng: longitude,
                    bearing: bearing,
                    yaw: yaw,
                }
            })
        }

        if (type === multimediaTypes.Text || file === null) {
            saveObject(updatedMultimediaObject);
        } else {
            const formData = new FormData()
            formData.append('file', file, file.name)

            const requestConfig = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };

            axios.post(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/upload/${id}`, formData, requestConfig)
                .then((response) => {
                    updatedMultimediaObject.data = response.data;
                    saveObject(updatedMultimediaObject);
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, {variant: 'error'});
                });
        }
    }

    function saveObject(updatedMultimediaObject) {
        axios.put(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/${id}`, updatedMultimediaObject)
            .then(() => {
                updateData();
                setDisabled(true);
                enqueueSnackbar('Saved successfully!', {variant: 'success'});
            })
            .catch((error) => {
                console.log(error);
                enqueueSnackbar(error.error, {variant: 'error'});
            });
    }

    const handleDateChange = (date) => {
        setState({...state, date})
    }

    const handleEdit = () => {
        setDisabled(false);
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

    const handleDeleteTrue = () => {
        async function deleteObject() {
            axios.delete(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/${id}`)
                .then(() => {
                    enqueueSnackbar("Object deleted successfully!", {variant: "info"})
                    navigate('/multimedia-objects');
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        deleteObject();
    };

    const {
        id = multimediaObject.id,
        type = multimediaObject.type,
        title = multimediaObject.title,
        date = multimediaObject.date,
        source = multimediaObject.source,
        tags = multimediaObject.tags,
        latitude = multimediaObject.position?.lat,
        longitude = multimediaObject.position?.lng,
        bearing = multimediaObject.position?.bearing,
        yaw = multimediaObject.position?.yaw,
        data = multimediaObject.data,
        author = multimediaObject.author,
    } = state

    const renderFile = (type, file) => {
        if (!multimediaObjectFile) {
            return undefined;
        }
        switch(type) {
            case multimediaTypes.Image:
                return (
                    <Grid item lg={6} md={6} sm={12} xs={12} style={{display: 'flex', justifyContent: 'flex-start'}}>
                        <img src={file} style={{
                            width: '100%',
                            objectFit: 'contain',
                            border: '1px solid #bbbbbb',
                            borderRadius: '6px'
                        }} alt={multimediaObject.title}/>
                    </Grid>
                );
            case multimediaTypes.Video:
                return (
                    <Grid item lg={6} md={6} sm={12} xs={12} style={{display: 'flex', justifyContent: 'flex-start'}}>
                        <video src={file} controls style={{
                            width: '100%',
                            objectFit: 'contain',
                            border: '1px solid #bbbbbb',
                            borderRadius: '6px'
                        }}/>
                    </Grid>
                )
            case multimediaTypes.Audio:
                return (
                    <Grid item lg={12} md={12} sm={12} xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <audio src={file} controls style={{
                            width: '100%',
                            objectFit: 'contain',
                            borderRadius: '6px',
                        }}/>
                    </Grid>
                )
            default:
                return undefined;
        }
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">
                    {"Delete this object?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDeleteTrue} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <CardRoot elevation={6}>
                <CardTitle>
                    <H3>{pageTitle}</H3>
                    <div>
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
                    <ValidatorForm onSubmit={() => {
                    }} onError={() => {
                    }}>
                        <Grid container columnSpacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                                <FormControl sx={{marginBottom: 2, minWidth: '100%'}}>
                                    <InputLabel id="select-helper-label">Multimedia Type</InputLabel>
                                    <Select
                                        id='type'
                                        name='type'
                                        label="Multimedia Type"
                                        disabled={disabled}
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
                                        disabled={disabled}
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
                                                disabled={disabled}
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
                                    disabled={disabled}
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
                                    disabled={disabled}
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
                                    disabled={disabled}
                                    value={author || ''}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>

                            <FormContainer sx={{mt: 4, mb: 2, pl: 7, width: '100%'}}>
                                <H6>{'Position'}</H6>
                                <Checkbox checked={isPositionChecked} disabled={disabled} onChange={handleIsPositionCheckedChange}/>
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
                                            disabled={disabled}
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
                                            disabled={disabled}
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
                                            disabled={disabled}
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
                                            disabled={disabled}
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
                                    disabled={disabled}
                                    value={tags || ''}
                                />
                            </Grid>
                        </Grid>

                        <H6 sx={{mt: 4, mb: 2}}>Content</H6>
                        <Grid container columnSpacing={6}>
                            {renderFile(multimediaObject.type, multimediaObjectFile)}
                            {type === multimediaTypes.Text && (
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <TextField
                                        label="Text"
                                        onChange={handleChange}
                                        type="text"
                                        name="data"
                                        disabled={disabled}
                                        multiline
                                        minRows={3}
                                        value={data || ''}
                                    />
                                </Grid>
                            )}
                            {!disabled && (
                                type !== multimediaTypes.Text &&
                                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                                        <FileInput
                                            multiple={false}
                                            disabled={disabled}
                                            onChange={handleFileChange}
                                        />
                                        <Box sx={{py: '12px'}}/>
                                    </Grid>
                                )
                            }
                        </Grid>
                    </ValidatorForm>
                </div>
            </CardRoot>
        </div>
    )
}

export default DetailsForm
