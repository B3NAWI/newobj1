import "./Users.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import { useTranslation, initReactI18next } from "react-i18next";

function CreateUser() {
    const { t } = useTranslation();
    const [User, setUser] = useState("")
    const [email, setemail] = useState("")
    const [passwordd, setPassword] = useState('')
    const [passwordd2, setPassword2] = useState('')
    const [phone, setPhone] = useState('')
    const [selectt, setSelect] = useState('Palestine')
    const [datee, setDate] = useState('')
    const [err, setErr] = useState()
    const nav = useNavigate()

    const PostData = { user: User, email: email, password: passwordd, password2: passwordd2, phone: phone, select: selectt, date: datee }
    const clickCreateAc = async () => {
        if (passwordd === passwordd2) {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, PostData)
                .then(async (doc) => {
                    {
                        await Swal.fire({
                            icon: 'success',
                            title: '<h1> Success </h1> <br /> Create User',
                            text: 'تم تسجيل حسابك',
                            // footer: '<a href="/login">login?</a>',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                    } { nav("/GetCategoryMarket") }
                })
                .catch((err) => {
                    if (err.response.data.errors) {
                        setErr(err.response.data.errors)
                    }
                })
        }
        else { document.getElementById("errpassword").innerHTML = "كلمتا المرور غير متطابقات" }
    }

    if (err) {
        const errors = err
        var userError = errors.find(error => error.path === "user")
        var emailError = errors.find(error => error.path === "email")
        var passwordError = errors.find(error => error.path === "password")
        var phoneError = errors.find(error => error.path === "phone")

        if (userError) {
            document.getElementById("erruser").innerHTML = userError.msg
        }
        if (!userError) {
            document.getElementById("erruser").innerHTML = ""
        }
        if (emailError) {
            document.getElementById("erremail").innerHTML = emailError.msg
        }
        if (!emailError) {
            document.getElementById("erremail").innerHTML = ""
        }
        if (passwordError) {
            document.getElementById("errpassword").innerHTML = passwordError.msg
        }
        if (passwordd !== passwordd2) {
            document.getElementById("errpassword").innerHTML = "كلمتا المرور غير متطابقات"
        }
        if (!passwordError) {
            document.getElementById("errpassword").innerHTML = ""
        }
        if (phoneError) {
            document.getElementById("errphone").innerHTML = phoneError.msg
        }
        if (!phoneError) {
            document.getElementById("errphone").innerHTML = ""
        }
    }

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div id="allPage">
            <div id="Page" style={{ width:isMobile?"95%": "60%", margin:isMobile? "0 2.5%":"0 20%" }}>
                <div id="H1Login" style={{width:"90%"}}>
                    <h1>{t("signup")}</h1>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingInputUser" onChange={e => setUser(e.target.value)} placeholder="name@example.com" />
                    <label for="floatingInput" >{t("CreateUser.User")}</label>
                    <div className="errMsgInbut" id="erruser"></div>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInputEmail" onChange={e => setemail(e.target.value)}
                        placeholder="name@example.com" />
                    <label for="floatingInput">{t("Email address")}</label>
                    <div className="errMsgInbut" id="erremail"></div>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="floatingPassword" onChange={e => setPassword(e.target.value)} placeholder="Password" />
                    <label for="floatingInput"> {t("Password")}</label>
                    <div className="errMsgInbut" id="errpassword"></div>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="floatingConfirmePassword" onChange={(e) => (setPassword2(e.target.value))} placeholder="Password" />
                    <label for="floatingInput">{t("CreateUser.Confirme Password")}</label>
                    <div className="errMsgInbut"></div>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" id="floatingInputPhone" onChange={(e) => (setPhone(e.target.value))} placeholder="name@example.com" />
                    <label for="floatingInputPhone">{t("CreateUser.Phone")}</label>
                    <div className="errMsgInbut" id="errphone"></div>
                </div>
                <select class="form-select form-select-lg mb-3" aria-label="Large select example" style={{ width: "80%" }} onChange={(e) => (setSelect(e.target.value))} >
                    <option value="Palestine" >{t("CreateUser.Palestine")}</option>
                    <option value="Egypt">{t("CreateUser.Egypt")}</option>
                    <option value="Jordan">{t("CreateUser.Jordan")}</option>
                    <option value="syria">{t("CreateUser.syria")}</option>
                    <option value="Lebanon">{t("CreateUser.Lebanon")}</option>
                </select>
                <div class="form-floating mb-3">
                    <input type="date" class="form-control" id="floatingInputPhone" onChange={(e) => (setDate(e.target.value))} placeholder="name@example.com" />
                    <label for="floatingInputPhone">{t("CreateUser.Date")}</label>
                    <div className="errMsgInbut" id="errphone"></div>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-success" onClick={clickCreateAc}> {t("signup")}</button>
                </div>
                {/* <div class="col-12">
                    <button class="btn btn-primary" onClick={btngooglelogin}>  google</button>
                </div> */}
            </div>
        </div>
    )
}

export default CreateUser;