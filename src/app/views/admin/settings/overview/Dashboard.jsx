import * as React from 'react';
import {useNavigate} from 'react-router-dom'
import FileInput from "./FileUpload";
import {Box, styled} from "@mui/system";
import {Button, Card} from "@mui/material";
import axios from "../../../../../axios";
import {useSnackbar} from "notistack";


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

const DashboardTable = ({title}) => {
    let navigate = useNavigate();
    const [excel, setExcel] = React.useState(null);
    const {enqueueSnackbar} = useSnackbar();

    async function sendMep() {
        const formData = new FormData()

        if(excel !== undefined){
            formData.append('attachments', excel, excel.name)
        }

        axios.post(process.env.REACT_APP_BACKEND_URI + "/mep", formData)
            .then(() => {
                enqueueSnackbar("Datei erfolgreich hochgeladen!", {variant: 'success'})
                navigate({
                    pathname: '/dashboard'
                })
            })
            .catch((err) => {
                console.log(err)
                enqueueSnackbar("Ein Fehler ist aufgetreten: \n" + err.message, {variant: 'error'})
            })

    }

    const handleFileChange = (event) => {
        setExcel(event.target.files[0])
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
            {excel && <Button
                variant="contained"
                color="primary"
                onClick={sendMep}
            >
                Hochladen
            </Button>}
        </CardRoot>
    );
}

export default DashboardTable