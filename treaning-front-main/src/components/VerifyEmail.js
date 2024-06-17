import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const BtnVerifyEmail = () => {
    let params = useParams()
    const nav = useNavigate()
    useEffect(() => {
        axios.patch(`${process.env.REACT_APP_API_URL}/auth/verifyEmail/${params.token}`)
            .then(() => nav("/cline/user/GetUserId"))
            .catch((err) => console.log(err))
    })
    return (<>

    </>)
}

export default BtnVerifyEmail;