import {
    Grid,
    Card,
} from '@mui/material'
import {styled} from '@mui/system'
import React, {useState} from 'react'
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../../../axios";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import {H3, H6} from "../../../helpers/components/Typography";

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

const DetailsForm = ({pageTitle, tour}) => {
    const [state, setState] = useState([])
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const handleSave = () => {
        async function saveTour() {
            const tagsArray = tags.split(",").filter((tag) => tag.length > 0).map((tag) => tag.toLowerCase());
            const uniqueTags = [...new Set(tagsArray)]

            const updatedTour = {
                title: title,
                source: source,
                multimediaObjects: multimediaObjects,
                author: author,
                tags: uniqueTags
            };

            axios.put(process.env.REACT_APP_BACKEND_URI + `/tours/${id}`, updatedTour)
                .then(() => {
                    setDisabled(true);
                    enqueueSnackbar('Saved successfully!', { variant: 'success' });
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(error.error, { variant: 'error' });
                });
        }

        saveTour();
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

    const handleDelete = () => {
        axios.delete(process.env.REACT_APP_BACKEND_URI + `/tours/${id}`)
            .then(() => {
                enqueueSnackbar("Tour deleted successfully!", {variant: "info"})
                navigate('/tours');
            })
            .catch((error) => {
                console.log(error)
            });
    };

    const {
        id = tour.id,
        title = tour.title,
        source = tour.source,
        multimediaObjects = tour.multimediaObjects,
        author = tour.author,
        tags = tour.tags,
    } = state

    return (
        <div>
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
                    <ValidatorForm onSubmit={() => {}} onError={() => {}}>
                        <Grid container columnSpacing={6}>
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
                                    label="Tour Title"
                                    errorMessages={['this field is required']}
                                />

                                <TextField
                                    type="text"
                                    name="source"
                                    id="standard-basic"
                                    onChange={handleChange}
                                    value={source || ''}
                                    disabled={disabled}
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
                                    disabled={disabled}
                                    validators={[
                                        'required',
                                    ]}
                                    label="Author"
                                    errorMessages={['this field is required']}
                                />
                            </Grid>
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
                    </ValidatorForm>
                </div>
            </CardRoot>
        </div>
    )
}

export default DetailsForm
