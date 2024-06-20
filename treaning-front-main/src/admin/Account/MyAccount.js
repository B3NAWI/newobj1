import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { User } from "../../context/context";
import { Loading, LoadingBtn } from "../../refreshPage/loading";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { MsgModal } from "../../components/MsgComponent";
import { useTranslation, initReactI18next } from "react-i18next";


const MyAccount = () => {
    const { t } = useTranslation();
    const usercontext = useContext(User)
    const IdUser = usercontext.auth.userDetals._id
    const token = usercontext.auth.token
    const [dataa, setDataa] = useState()
    const [show, setShow] = useState(false)
    const [status, setStatus] = useState(t("Yes sure"))
    const nav = useNavigate()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/users/GetUser/${IdUser}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            }
        })
            .then((doc) => { setDataa(doc.data) })
            .catch((err) => console.log("err get user : ", err))
    }, [])

    const UpDateUser = () => {
        if (usercontext.auth.userDetals.role == "admin") {
            nav(`/admin/user/UpDateUser/${IdUser}`, { state: { dataa } })
        } else {
            nav(`/cline/user/UpDateUser/${IdUser}`, { state: { dataa } })
        }
    }

    const btnVerifyEmail = async () => {
        setStatus(<LoadingBtn />)
        await axios.patch(`${process.env.REACT_APP_API_URL}/auth/verifyEmail`, { email: usercontext.auth.userDetals.email })
            .then(() => setStatus("نعم ,متأكد"))
            .then(() => setShow(false))
            .catch((err) => console.log(err))
    }

    return (<>
        <div>
            <div id="allPage">
                <div id="Page">
                    {dataa ?
                        <div style={{ width: "100%", padding: "5%" }}>
                            <div id="H1Login">
                                <h1>{t("Account Information")}</h1>
                            </div>
                            <li id="liUserId"><div>• {t("CreateUser.User")} : </div>{dataa.user}.</li>
                            <li id="liUserId" style={{ display: 'flex' , overflowX:"auto" , maxWidth:"320px",flexDirection:'column' ,alignItems:"flex-start"}}><div>
                                • {t("Email address")} : </div><div>{dataa.email}.</div>
                                <div style={{ marginLeft: "auto", marginRight: "15%" }}>
                                    {dataa.verifyEmail == "true" ? <>{t("Home2.verify")} {t("true")}</>
                                        : <> {t("Home2.verify")} : {t("false")} <Button variant="outline-success" onClick={() => setShow(true)}> {t("verify Email")}</Button></>}
                                </div>
                            </li>
                            <li id="liUserId"><div>• {t("CreateUser.Phone")} : </div>{dataa.phone}.</li>
                            <li id="liUserId"><div>• {t("Country")} : </div>{dataa.select}.</li>
                            <li id="liUserId"><div>• {t("CreateUser.Date")} : </div>{dataa.date}.</li>
                            <div class="col-12" style={{ display: "flex", justifyContent: "center", paddingTop: "2%", borderTop: "1px solid #c5c2c2" }}>
                                <button type="submit" class="btn btn-success" onClick={UpDateUser}> {t("UpDate User")}</button>
                            </div>
                        </div>
                        : <Loading />}
                </div>
            </div>
            <MsgModal show={show} handleClose={() => setShow(false)} title={t("Confirm email")} body={t('A confirmation message will be sent to your email')} opj={btnVerifyEmail} BtnState={status} />
        </div>
    </>)
}
export default MyAccount;