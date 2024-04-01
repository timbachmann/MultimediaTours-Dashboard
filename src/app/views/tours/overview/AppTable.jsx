import React from 'react'
import EnhancedTable from './Table'
import axios from "../../../../axios";
import {Breadcrumb} from "../../../helpers/components";
import {styled} from "@mui/system";

const AppTable = () => {
    const [tours, setTours] = React.useState([]);

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
        async function getTours() {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/tours`)
                .then((response) => {
                    setTours(response.data)
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        getTours();

    }, []);

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        {name: 'Tours'},
                    ]}
                />
            </div>
            <EnhancedTable title="Tours" tours={tours}/>
        </Container>
    )
}

export default AppTable
