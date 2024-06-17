import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import "./Users.css";
import { User } from "../context/context";
import { Col, Toast } from "react-bootstrap";
import { useTranslation, initReactI18next } from "react-i18next";
import { MsgToast } from "../components/MsgComponent";

function ChangePassword() {
    const { t } = useTranslation();
    const usernaw = useContext(User)
    const token = usernaw.auth.token
    const id = usernaw.auth.userDetals._id

    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState('')
    const [conNewPassword, setConNewPassword] = useState('')
    const [err, setErr] = useState(null)
    const [show, setShow] = useState(false);

    useEffect(() => {
        setErr(null)
    }, [show])

    const data = { oldPassword: oldPassword, newPassword: newPassword, conNewPassword: conNewPassword }

    const btnChangePassword = async () => {
        await axios.patch(`${process.env.REACT_APP_API_URL}/auth/PatchPassword/${id}`, data, {
            headers: {
                Authorization: "Bearer " + token,
            }
        })
            .then(() => setShow(true))
            .catch((err) => {
                {
                    if (err.response.data) {
                        setErr(err.response.data)
                    } { console.log(err) }
                }
            })
    }

    return (
        <>
            <div id="allPage">
                <div id="Page" style={{width:"50%" , margin:"0 25%"}}>
                    <div id="H1Login" style={{width:"90%"}}>
                        <h1>{t("hedarAdmin.Change Password")}</h1>
                    </div>
                    <div id="errMsg" style={{ color: "red" }} dangerouslySetInnerHTML={{
                        __html: err ? err.errors.map(error => error.msg).join("<br>") : ''
                    }}></div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="floatingoldPassword" onChange={e => setOldPassword(e.target.value)} placeholder="Password" />
                        <label for="floatingPassword">{t("Old Password")}</label>
                        <div id="errpassword" className="errMsgInbut"></div>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="floatingnewPassword" onChange={e => setNewPassword(e.target.value)} placeholder="Password" />
                        <label for="floatingPassword">{t("New Password")}</label>
                        <div id="errpassword" className="errMsgInbut"></div>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="floatingConNewPassword" onChange={e => setConNewPassword(e.target.value)} placeholder="Password" />
                        <label for="floatingPassword">{t("Confirm New Password")}</label>
                        <div id="errpassword" className="errMsgInbut"></div>
                    </div>
                    <div class="col-12" style={{ textAlign: "center" }}>
                        <button type="submit" class="btn btn-success" onClick={btnChangePassword}> {t("hedarAdmin.Change Password")}</button>
                    </div>
                </div>
                <MsgToast setShow={setShow} show={show} type={"success"} title={t("Success")} body={t("Password changed successfully")} />
            </div>
        </>
    )

}

export default ChangePassword