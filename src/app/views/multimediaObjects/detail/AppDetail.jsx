import React from 'react'
import {Breadcrumb} from 'app/helpers/components'
import {styled} from '@mui/system'
import {useSearchParams} from "react-router-dom";
import DetailsForm from "./DetailsForm";
import axios from "../../../../axios";
import {multimediaTypes} from "../../../helpers/utils/constant";

const Container = styled('div')(({theme}) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px',
        },
    },
}))

const AppDetail = () => {
    const [searchParams] = useSearchParams();
    const [multimediaObject, setMultimediaObject] = React.useState({});
    const [multimediaObjectFile, setMultimediaObjectFile] = React.useState(undefined);

    React.useEffect(() => {
        getMultimediaObject();
    }, [searchParams]);

    function getMultimediaObject() {
        axios.get(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/${searchParams.get('id')}`)
            .then((response) => {
                setMultimediaObject(response.data)
                if (response.data.type !== multimediaTypes.Text) {
                    getMultimediaObjectFile()
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function getMultimediaObjectFile() {
        axios.get(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/${searchParams.get('id')}/object`, {responseType: 'blob'})
            .then((response) => {
                const url = URL.createObjectURL(response.data)
                setMultimediaObjectFile(url)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Multimedia Objects', path: '/multimedia-objects'},
                        {name: 'Details'}
                    ]}
                />
            </div>
            <DetailsForm pageTitle={multimediaObject.title} multimediaObject={multimediaObject}
                         updateData={getMultimediaObject} multimediaObjectFile={multimediaObjectFile}>
            </DetailsForm>
        </Container>
    )
}

export default AppDetail
