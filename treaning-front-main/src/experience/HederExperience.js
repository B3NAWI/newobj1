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
import { IoMdMenu } from "react-icons/io";
import { Dropdown, DropdownButton } from "react-bootstrap";
import img1 from "../file/images.png"
import img2 from "../file/666555.png"
import { TbShoppingBag } from "react-icons/tb";


function HederExperience() {
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const [errMsg, setErrMsg] = useState()
    const [errMsgForgot, setErrMsgForgot] = useState()
    const [emailForgot, setEmailForgot] = useState()
    const [dataaForgot, setDataaForgot] = useState()
    const [statuslogin, setStatusLogin] = useState(<> {t("login")}</>)
    const [statusSendEmail, setStatusSendEmail] = useState(<><RiMailSendLine style={{ fontSize: "20px", paddingBottom: "4px" }} />  {t("Send Email")}</>)


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

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    const handleLink = (Link) => {
        nav(`${Link}`)
    }
    useEffect(() => {
        cookie.remove("bearer")
        setErrMsgForgot(null)
    }, [dataaForgot])

    return (<>
        <nav style={{ backgroundColor: "white", width: "100%" }}>
            {isMobile ?
                <div className="App" style={{ width: "100%", position: "fixed", zIndex: "6" }}><div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", position: "fixed" }} >
                        <div style={{ width: "100%", top: "0", maxHeight: "35px", padding: "0", backgroundColor: "white", boxShadow: "0 0 8px #898989 ", display: "flex", justifyContent: "space-between", position: "fixed" }}>
                            <header style={{ display: "flex" }}>
                                <DropdownButton align={"start"} variant="success" style={{ textAlign: "start" }} id="dropdown-basic-button" title={<IoMdMenu style={{ minWidth: "110px" }} />}>
                                    <Dropdown.Header style={{ textAlign: "center", fontWeight: "600", backgroundColor: "#e9e9e9" }}>Menu</Dropdown.Header>
                                    <Dropdown.Item onClick={() => handleLink("/GetCategoryMarket")} style={{ textAlign: "start" }} >{t("Market")}</Dropdown.Item>
                                    <Dropdown.Header style={{ textAlign: "center", fontWeight: "600", backgroundColor: "#e9e9e9" }}>Account</Dropdown.Header>
                                    <Dropdown.Item onClick={handleShowLogin} style={{ textAlign: "start" }} >{t("login")}</Dropdown.Item>
                                    <Dropdown.Item onClick={btnSignup} style={{ textAlign: "start" }} >{t("signup")}</Dropdown.Item>
                                    {/* <NavDropdown id="nav-dropdown-light-example" style={{ textAlign: "center" }} title={i18n.language} menuVariant="light">
                                        <NavDropdown.Item onClick={() => { BtnLanguge("ar") }} style={{ textAlign: "start" }}>العربية</NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => { BtnLanguge("he") }} style={{ textAlign: "start" }}>עִברִית</NavDropdown.Item>
                                    </NavDropdown> */}
                                </DropdownButton>
                            </header>
                            <div style={{ margin: "0 10px", height: "40px" }}>
                                <Form.Select style={{ width: "100px", padding: "0 0 0 0 ", height: "30px" }} onChange={(e) => BtnLanguge(e.target.value)} value={i18n.language}>
                                    {/* <option>en</option> */}
                                    <option value={"ar"}>العربية</option>
                                    <option value={"he"}>עִברִית</option>
                                </Form.Select>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                :
                <div style={{ position: "fixed", width: "100%", top: "0", zIndex: "3", minHeight: "64px", maxHeight: "64px", padding: "7px 0", backgroundColor: "white", boxShadow: "0 0 8px #898989 ", display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: "1440px", padding: "0 40px", display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="HederExperienceActive" style={{ display: "flex", alignItems: 'center' }}>
                            {/* <div style={{ padding: " 2px 2%", backgroundColor: "rgb(25 135 84)", color: "white", height: '35px', fontSize: "21px", fontWeight: "500", width: "100px", textAlign: "center" }} >{t("Menu")}</div> */}
                            <NavLink to={"/"} className="custom-button" activeClassName="active-link" ><img style={{maxHeight:"40px" , marginTop:"10px"}} src={img2}></img></NavLink>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ margin: "3px 10px 0 10px" }}>
                                <Button variant="outline-liht" onClick={handleShowLogin} className="btn-new-style">
                                    {t("login")}
                                </Button>
                                <Button variant="outline-liht" className="btn-new-style" onClick={btnSignup} >
                                    {t("signup")}
                                </Button>
                            </div>
                            <div style={{ display: 'flex', margin: "0 20px" }}>
                                <Form.Select style={{
                                    paddingLeft: "40px",
                                    paddingRight: "20px",
                                    width: "80px",
                                    height: "35px",
                                    appearance: "none",
                                    background: `url(${img1}) no-repeat 10px center`,
                                    backgroundSize: "30px 30px, 100%",
                                    backgroundColor: "#ffffff",
                                    textAlign: "center"
                                }} className="language-selector" onChange={(e) => BtnLanguge(e.target.value)} value={i18n.language}>
                                    {/* <option>en</option> */}
                                    <option value={"ar"}>AR</option>
                                    <option value={"he"}>HE</option>
                                </Form.Select>
                            </div>
                            <Button variant="outline-liht" className="Button-hedear" >{<TbShoppingBag style={{ fontSize: "25px", color: "#ea004b" }} />} </Button>
                        </div>
                    </div>
                </div>
            }

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
                    <Button variant="success" style={{ width: "100px", padding: '2px 7px 3px 0', height: '35px', marginRight: "10px" }} onClick={btnlog}>  {statuslogin} </Button>
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