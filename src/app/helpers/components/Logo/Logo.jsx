import React from 'react'
import {styled} from "@mui/system";

const IMG = styled('img')(() => ({
    width: '80%',
}))

const Logo = ({ className }) => {

    return (
        <IMG src={'/assets/images/logo.png'} alt={'Logo'}/>
    )
}

export default Logo
