import React from 'react'
import {Breadcrumb} from 'app/helpers/components'
import {styled} from '@mui/system'
import {useSearchParams} from "react-router-dom";
import DetailsForm from "./DetailsForm";
import axios from "../../../../axios";

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
    const [multimediaObject, setMultimediaObject] = React.useState([]);

    React.useEffect(() => {
        async function getCamp() {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects/${searchParams.get('id')}`)
                .then((response) => {
                    setMultimediaObject(response.data)
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        getCamp();
    }, [searchParams]);

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
            <DetailsForm pageTitle={multimediaObject.title} multimediaObject={multimediaObject}>
            </DetailsForm>
        </Container>
    )
}

export default AppDetail
