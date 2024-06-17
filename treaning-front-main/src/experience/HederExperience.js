import { Link, NavLink, useNavigate } from "react-router-dom";
import "./hederExperience.css";
import React, { useContext, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { User } from "../context/context";
import { IoLogInOutline } from "react-icons/io5";
import { RiMailSendLine } from "react-icons/ri";
import { LoadingBtn } from "../refreshPage/loading";
import { useTranslation } from "react-i18next";

function HederExperience() {
    const { t ,i18n } = useTranslation();
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const [errMsg, setErrMsg] = useState()
    const [errMsgForgot, setErrMsgForgot] = useState()
    const [emailForgot, setEmailForgot] = useState()
    const [dataaForgot, setDataaForgot] = useState()
    const [statuslogin, setStatusLogin] = useState(<> {t("login")}</>)
    const [statusSendEmail, setStatusSendEmail] = useState(<><RiMailSendLine style={{ fontSize: "20px", paddingBottom: "4px" }} />  {t("Send Email")}</>)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 320);


    const cookie = new Cookies()
    const usernaw = useContext(User)
    const nav = useNavigate()

    const [showLogin, setShowLogin] = useState(false);
    const handleShowLogin = () => (
        setShowLogin(true),
        handleCloseForgot()
    );
    const handleCloseLogin = () => (
        setShowLogin(false),
        setErrMsg(null)
    );

    useEffect(() => {
        document.body.dir = i18n.dir()
    }, [])
    const BtnLanguge = (lan) => (
        i18n.changeLanguage(lan),
        window.location.reload()
    )

    const [showForgot, setShowForgot] = useState(false);
    const handleShowForgot = () => (
        setShowForgot(true),
        handleCloseLogin()
    );
    const handleCloseForgot = () => (
        setShowForgot(false),
        setErrMsgForgot(null),
        setDataaForgot(null)
    );

    const btnSignup = () => {
        nav("/CreateUser")
    }
    const data = { user: user, password: password }
    const btnlog = async () => {
        setStatusLogin(<LoadingBtn />)
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data)
            .then(async (doc) => {
                const token = doc.data.token
                const refreshToken = doc.data.retoken
                const userDetals = doc.data.data
                const decoded = doc.data.decoded
                await usernaw.setAuth({ token: token, userDetals: userDetals, decoded: decoded, refreshToken: refreshToken })
                await cookie.set("bearer", { token: token, refreshToken: refreshToken, userDetals: userDetals, decoded: decoded }, { path: "/" })
                if (userDetals.role === "admin") {
                    nav('/admin/Home/Home2')
                } else {
                    nav('/cline/Articales/GetCategoryMarketCline')
                }
            })
            .catch((err) => {
                setStatusLogin(<><IoLogInOutline style={{ fontSize: '21px' }} /> Login</>)
                {
                    if (err.response.data.errors) {
                        setErrMsg(err.response.data)
                    } { console.log(err) }
                }
            })
    }

    const dataForgot = { email: emailForgot }
    const btnForgot = async () => {
        setStatusSendEmail(<><LoadingBtn /></>)
        await axios.patch(`${process.env.REACT_APP_API_URL}/auth/forgotpassword`, dataForgot)
            .then((doc) => {
                setDataaForgot(doc.data)
                setStatusSendEmail(<><RiMailSendLine style={{ fontSize: "20px", paddingBottom: "4px" }} />  Send Email</>)
            })
            .catch((err) => {
                setStatusSendEmail(<><RiMailSendLine style={{ fontSize: "20px", paddingBottom: "4px" }} />  Send Email</>)
                {
                    if (err.response.data.errors) {
                        setErrMsgForgot(err.response.data)
                    } { console.log(err) }
                }
            })
    }
    useEffect(() => {
        cookie.remove("bearer")
        setErrMsgForgot(null)
    }, [dataaForgot])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 320);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (<>
        <nav id="MenuBig" style={{ backgroundColor: "white", width: "100%" }}>
            <div style={{ position: "fixed", width: "100%", top: "0", zIndex: "3", maxHeight: "35px", padding: "0", backgroundColor: "white", boxShadow: "0 0 8px #898989 ", display: "flex", justifyContent: 'space-between' }}>
                <div className="HederExperienceActive" style={{ display: "flex" }}>
                    <div style={{ padding: " 2px 2%", backgroundColor: "rgb(25 135 84)", color: "white", height: '35px', fontSize: "21px", fontWeight: "500", width: "100px", textAlign: "center" }} >{t("Menu")}</div>
                    <NavLink to={"/GetCategoryMarket"} className="custom-button" activeClassName="active-link" ><div>{t("Market")}</div></NavLink>
                </div>
                <div style={{ display: 'flex' }}>
                    
                    <div style={{ margin: "3px 10px 0 10px" }}>
                        <Button variant="outline-success" onClick={handleShowLogin} style={{ width: "95px", padding: '0', height: '30px', marginRight: "10px" }}>
                            {/* <IoLogInOutline style={{ fontSize: "25px", padding: "0 0px 3px 0" }} />  */}
                            {t("login")}
                        </Button>
                        <Button variant="outline-success" onClick={btnSignup} style={{ width: "95px", padding: '0', height: '30px', marginRight: "10px"  }}>
                            {t("signup")}
                        </Button>
                    </div>
                    <div style={{ display: 'flex' , margin:"0 20px" }}>
                        <Form.Select style={{ width: "100px", padding:"0 20px 0 0 "}} onChange={(e) => BtnLanguge(e.target.value)} value={i18n.language}>
                            {/* <option>en</option> */}
                            <option value={"ar"}>العربية</option>
                            <option value={"he"}>עִברִית</option>
                        </Form.Select>
                    </div>
                </div>
            </div>
            <Modal show={showLogin} onHide={handleCloseLogin}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Login Page")} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>{t("Email address")}</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" autoFocus onChange={e => setUser(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label> {t("Password")} </Form.Label>
                            <Form.Control type="password" placeholder={t("Password")} autoFocus onChange={e => setPassword(e.target.value)} />
                            <div id="errMsg" style={{ color: "red" }} dangerouslySetInnerHTML={{
                                __html: errMsg ? errMsg.errors.map(error => error.msg).join("<br>") : ''
                            }}></div>
                            <div id="errpassword" style={{ color: "red" }}></div>
                            <div id="errincorrect" style={{ color: "red" }}></div>
                        </Form.Group>
                    </Form>
                    <div style={{ fontSize: "13px" }}>{t("did you forget your password? Click")}<Link onClick={handleShowForgot} style={{ color: "#0d6efd" }}>{t("Forgot your password")}</Link></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" style={{ width: "80px", padding: '0px 0 0 0', height: '35px' }} onClick={handleCloseLogin}> {t("Close")} </Button>
                    <Button variant="success" style={{ width: "100px", padding: '2px 7px 0 0', height: '35px', marginRight: "10px" }} onClick={btnlog}>  {statuslogin} </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showForgot} onHide={handleCloseForgot}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Password Recovery")} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>{t("Email address")}</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" autoFocus onChange={e => setEmailForgot(e.target.value)} />
                            <div><div id="err" style={{ color: "red", backgroundColor: '#ffdddd', padding: "0 5px" }}>{errMsgForgot ? errMsgForgot.errors.map(error => error.msg).join("<br>") : ''}</div></div>
                            <div><div id="success" style={{ color: "green", backgroundColor: '#bff5bf', padding: "0 5px" }}>{dataaForgot ? dataaForgot.message : ''}</div></div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseForgot}> {t("Close")} </Button>
                    <Button variant="success" style={{ width: "120px", padding: '3px 7px 0 0', height: '35px', marginRight: "10px" }} onClick={btnForgot}>{statusSendEmail}</Button>
                </Modal.Footer>
            </Modal>
        </nav >
    </>)
}

export default HederExperience;