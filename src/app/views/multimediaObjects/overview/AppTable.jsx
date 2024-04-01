import React from 'react'
import EnhancedTable from './Table'
import axios from "../../../../axios";
import {Breadcrumb} from "../../../helpers/components";
import {styled} from "@mui/system";

const AppTable = () => {
    const [multimediaObjects, setMultimediaObjects] = React.useState([]);

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

    React.useEffect(() => {
        async function getMultimediaObjects() {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/multimedia-objects`)
                .then((response) => {
                    setMultimediaObjects(response.data)
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        getMultimediaObjects();

    }, []);

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Multimedia Objects'},
                    ]}
                />
            </div>
            <EnhancedTable title={"Multimedia Objects"} multimediaObjects={multimediaObjects}/>
        </Container>
    )
}

export default AppTable
