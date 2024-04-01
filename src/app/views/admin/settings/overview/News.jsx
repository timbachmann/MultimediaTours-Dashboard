import * as React from 'react';
import {Box, styled} from "@mui/system";
import {Button, Card} from "@mui/material";
import FileInput from "./FileUpload";
import axios from "../../../../../axios";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";

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

const NewsTable = ({title}) => {
    let navigate = useNavigate();
    const [pdf, setPdf] = React.useState(null);
    const {enqueueSnackbar} = useSnackbar();

    async function sendMep() {
        const formData = new FormData()

        if(pdf !== undefined){
            formData.append('attachments', pdf, pdf.name)
        }

        axios.post(process.env.REACT_APP_BACKEND_URI + "/news", formData)
            .then(() => {
                enqueueSnackbar("Datei erfolgreich hochgeladen!", {variant: 'success'})
                navigate({
                    pathname: '/news'
                })
            })
            .catch((err) => {
                console.log(err)
                enqueueSnackbar("Ein Fehler ist aufgetreten: \n" + err.message, {variant: 'error'})
            })
    }

    const handleFileChange = (event) => {
        setPdf(event.target.files[0])
    }

    return (
        <CardRoot elevation={6}>
            <CardTitle>
                {title}
            </CardTitle>
            <FileInput
                multiple={false}
                onChange={handleFileChange}
            />
            <Box sx={{py: '12px'}}/>
            {pdf && <Button
                variant="contained"
                color="primary"
                onClick={sendMep}
            >
                Hochladen
            </Button>}
        </CardRoot>
    );
}

export default NewsTable