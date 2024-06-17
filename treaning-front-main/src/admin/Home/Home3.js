import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { User } from "../../context/context"
import { Loading } from "../../refreshPage/loading"
import { useTranslation, initReactI18next } from "react-i18next";
import Cookies from "universal-cookie"

function Home3admin() {
    const { t } = useTranslation();
    const [dataa, setDataa] = useState([])
    let params = useParams()
    const nev = useNavigate()
    const context = useContext(User)
    const token = context.auth.token
    const [errDecodedTokein, setErrDecodedTokin] = useState()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/users/GetUser/${params.id}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            })
            .then((doc) => setDataa(doc.data))
            .catch((err) => console.log("err get id :", err))
    }, [dataa])

    const UpDateUser = () => {
        nev(`/admin/user/UpDateUser/${params.id}`, { state: { dataa } })
    }
    const btndelete = async () => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/DeleteUser/${params.id}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            })
            .then((doc) =>
                Swal.fire({
                    icon: 'success',
                    title: 'Success Delete User',
                    // text: 'Something went wrong!',
                    // footer: '<a href="/login">login?</a>',
                    showConfirmButton: false,
                    timer: 1500,
                }),
                window.location.replace("/admin/Home/Home2")
            )
            .catch((err) => {
                console.log("err delete : ", err)
                if (err.response.data.errors) {
                    setErrDecodedTokin(err.response.data.errors)
                    console.log("1")
                }
            })
    }

    const btnActiveUser = () => {
        if (dataa.active === "true") {
            axios.patch(`${process.env.REACT_APP_API_URL}/users/PatchUser/${params.id}`, { active: "false" }, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            })
                .then((doc) => { nev(`/admin/Home/Home3/${dataa._id}`) })
                .catch((err) => { console.log("err Active : ", err) })
        }
        if (dataa.active === "false") {
            axios.patch(`${process.env.REACT_APP_API_URL}/users/PatchUser/${params.id}`, { active: "true" },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                    }
                })
                .then((doc) => { nev(`/admin/Home/Home3/${dataa._id}`) })
                .catch((err) => { console.log("err active : ", err) })
        }
    }

    const btnRoleUser = () => {
        if (dataa.role === "user") {
            axios.patch(`${process.env.REACT_APP_API_URL}/users/PatchUser/${params.id}`, { role: "admin" }, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            })
                .then(() => { nev(`/admin/Home/Home3/${dataa._id}`) })
                .catch((err) => { console.log("err role : ", err) })
        }
        if (dataa.role === "admin") {
            axios.patch(`${process.env.REACT_APP_API_URL}/users/PatchUser/${params.id}`, { role: "user" },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                    }
                })
                .then(() => { nev(`/admin/Home/Home3/${dataa._id}`) })
                .catch((err) => { console.log("err role : ", err) })
        }
    }

    return (
        <div>
            <div id="allPage">
                <ul id="Page">
                    {dataa.user ?
                        <div style={{ width: "80%" }}>
                            <div id="H1Login">
                                <h1>{t("Account Information")}</h1>
                            </div>
                            <li id="liUserId"><div>• {t("CreateUser.User")} : </div>{dataa.user}.</li>
                            <li id="liUserId"><div>• {t("Home2.Email")} : </div>{dataa.email}.</li>
                            <li id="liUserId"><div>• {t("CreateUser.Phone")} : </div>{dataa.phone}.</li>
                            <li id="liUserId"><div>• {t("Country")} : </div>{dataa.select}.</li>
                            <li id="liUserId"><div>• {t("CreateUser.Date")} : </div>{dataa.date}.</li>
                            <div style={{ borderBottom: "1px solid #c5c2c2 ", textAlign: 'center', fontSize: "30px", width: "90%" }}>{t("Edit Account")}</div>
                            <div style={{ width: "100%", display: "flex", paddingBottom: "2%", marginTop: "2%" }}>
                                <li style={{ justifyContent: "center" }} id="liUserId"><div> {t("Home2.Role")} : </div>{dataa.role}. <button type="submit" style={{ marginLeft: "5%" }} class="btn btn-success" onClick={btnRoleUser}> {dataa.role == "user" ? "admin" : "user"}</button></li>
                                <li id="liUserId"><div> {t("Home2.Activity")} : </div>{dataa.active}. <button type="submit" style={{ marginLeft: "5%" }} class="btn btn-success" onClick={btnActiveUser}> {dataa.active == "true" ? "false" : "true"}</button></li>
                            </div>

                            <div class="col-12" style={{ display: "flex", justifyContent: "center", paddingTop: "2%", borderTop: "1px solid #c5c2c2", width: "90%" }}>
                                <button type="submit" class="btn btn-outline-success" onClick={UpDateUser}> {t("UpDate User")}</button>
                                <button type="submit" style={{ margin: "0 2%" }} class="btn btn-outline-danger" onClick={btndelete}> {t("Delete User")}</button>
                            </div>
                        </div>
                        : <Loading />}
                </ul>
            </div>
        </div>
    )
}

export default Home3admin