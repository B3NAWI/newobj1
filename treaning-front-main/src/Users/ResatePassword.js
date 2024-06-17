import axios from 'axios';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ResetePassword = () => {
    let params = useParams()
    const [err, setErr] = useState()
    const [msg, setMsg] = useState()
    const [password, setPassword] = useState()
    const [confirmePassword, setConfirmePassword] = useState()
    const btnResetePassword = async () => {
        if (password == confirmePassword) {
            await axios.patch(`${process.env.REACT_APP_API_URL}/auth/resetPassword/${params.token}`, { password })
                .then((doc) => { setMsg(doc.data.msg) })
                .then(()=>{setErr("") })
                .catch((err) => {
                    setErr(err.response.data.errors[0].msg);
                    setMsg("");
                });

        } else if (password != confirmePassword) {
            setErr("كلمتا المرور غير متطابقات")
            setMsg("")
        }
    }
    console.log(err)
    return (<>
        <div id="allPage" style={{ minHeight: "500px" }}>
            <div id="PageResatePassword" style={{ width: "40%" }}>
                <div id="H1Login">
                    <h1>Resete Password</h1>
                </div>
                <div style={{ color: 'red' }}>{err}</div>
                <div style={{ color: "green" }}>{msg}</div>
                <div class="form-floating mb-3">
                    <input type="password" name='password' class="form-control" id="floatingInputUser" onChange={e => setPassword(e.target.value)} placeholder="password" />
                    <label for="floatingInput" >Password</label>
                </div><div class="form-floating mb-3">
                    <input type="password" name="ConfirmePassword" class="form-control" id="floatingInputUser" onChange={e => setConfirmePassword(e.target.value)} placeholder="ConfirmePassword" />
                    <label for="floatingInput" >Confirme Password</label>
                </div>
                <div>
                    <Button variant='success' onClick={btnResetePassword}>Resete Password</Button>
                </div>
            </div>
        </div>
    </>)
}

export default ResetePassword;