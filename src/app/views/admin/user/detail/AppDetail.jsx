import React, {useState} from 'react'
import { Breadcrumb } from 'app/helpers/components'
import { styled } from '@mui/system'
import {useSearchParams} from "react-router-dom";
import DetailsForm from "./DetailsForm";
import axios from "../../../../../axios";
import PasswordForm from "./PasswordForm";

const Container = styled('div')(({ theme }) => ({
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
    const [user, setUser] = useState([]);

    React.useEffect(() => {
        function getUser() {
            axios.get(process.env.REACT_APP_BACKEND_URI + `/user/${searchParams.get('id')}`)
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        getUser();
        // eslint-disable-next-line
    }, [searchParams]);

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'User', path: '/admin/user' },
                        { name: 'Details'}
                    ]}
                />
            </div>
            <DetailsForm title={"User"} userObject={user}>
            </DetailsForm>
            <PasswordForm title={"Update Password"} user={user}>
            </PasswordForm>
        </Container>
    )
}

export default AppDetail
