import { NavLink, useNavigate } from "react-router-dom";
import "../../admin/heder/heder.css";
import Cookies from "universal-cookie";
import axios from "axios";
import { User } from "../../context/context";
import React, { useContext, useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Badge from 'react-bootstrap/Badge';
import { isExpired, decodeToken } from "react-jwt";
import { useShoppingCart } from "../../context/shoppingCartContext";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Button, Form } from "react-bootstrap";
import i18n from "i18next"
import { useTranslation } from "react-i18next";
import { IoMdMenu } from "react-icons/io";



function HederVisitor() {
    const { t } = useTranslation();
    const usernaw = useContext(User)
    const cookie = new Cookies()
    const token = usernaw.auth.token
    const UserId = usernaw.auth.userDetals._id
    const UserName = usernaw.auth.userDetals.user
    const nav = useNavigate()

    const { openCart, cartQuantity, removeAllCart } = useShoppingCart()

    useEffect(() => {
        document.body.dir = i18n.dir()
    }, [])
    const BtnLanguge = (lan) => (
        i18n.changeLanguage(lan),
        window.location.reload()
    )

    useEffect(() => {
        const ContextToken = usernaw.auth.token
        const IsExpiredContextToken = isExpired(ContextToken)
        const getTokenCookie = cookie.get("bearer")
        const token = getTokenCookie.token
        const RefreshTokenCookie = getTokenCookie.refreshToken
        if (IsExpiredContextToken) {
            axios.post(`${process.env.REACT_APP_API_URL}/auth/refreshToken`, null, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + RefreshTokenCookie,
                }
            }).then(async (doc) => {
                const newtoken = doc.data.token
                const newuserDetals = doc.data.data
                const newdecoded = doc.data.decoded
                await cookie.remove("bearer")
                await cookie.set("bearer", { token: token, refreshToken: RefreshTokenCookie, userDetals: newuserDetals, decoded: newdecoded }, { path: "/" })
                await usernaw.setAuth({ token: newtoken, userDetals: newuserDetals, decoded: newdecoded })
                console.log("ok refresh")
            }).catch((err) => console.log("err refreshPage : ", err))
        }
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 320);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 320);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLink = (Link) => {
        nav(`${Link}`)
    }

    const btnLogout = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                    // token: token,
                }
            }
        ).then(async () => {
            await cookie.remove("bearer")
            await localStorage.removeItem("shopping-cart")
            removeAllCart()
            await usernaw.setAuth({ userDetals: "", token: "" })
            nav("/GetCategoryMarket")
        })

            .catch((err) => console.log("err : ", err))
    }
    const btnMyAccount = () => {
        nav("/cline/user/GetUserId")
    }
    const btnChangePassword = () => {
        nav(`/cline/user/ChangePassword/${UserId}`)
    }
    return (
        <nav id="MenuBig">
            {isMobile ?
                <div className="App" style={{ width: "100%", position: "fixed", zIndex: "6" }}><div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", position: "fixed" }} >
                        <div style={{ width: "100%", top: "0", maxHeight: "35px", padding: "0", backgroundColor: "white", boxShadow: "0 0 8px #898989 ", display: "flex", justifyContent: "space-between", position: "fixed" }}>
                            <header style={{ display: "flex" }}>
                                <DropdownButton align={"start"} variant="success" style={{ textAlign: "start" }} id="dropdown-basic-button" title={<IoMdMenu style={{ minWidth: "110px" }} />}>
                                    <Dropdown.Header style={{ textAlign: "center", fontWeight: "600", backgroundColor: "#e9e9e9" }}>Menu</Dropdown.Header>
                                    <Dropdown.Item onClick={() => handleLink("/cline/Articales/GetCategoryMarketCline")} style={{ textAlign: "start" }} >{t("Market")}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleLink(`/cline/Articales/MyOrders/${UserId}`)} style={{ textAlign: "start" }} >{t("My Orders")}</Dropdown.Item>
                                    <Dropdown.Header style={{ textAlign: "center", fontWeight: "600", backgroundColor: "#e9e9e9" }}>Account</Dropdown.Header>
                                    <Dropdown.Item onClick={btnMyAccount} style={{ textAlign: "start" }} eventKey="1">{t("hedarAdmin.my Account")}</Dropdown.Item>
                                    <Dropdown.Item onClick={btnChangePassword} style={{ textAlign: "start" }} eventKey="2">{t("hedarAdmin.Change Password")}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={btnLogout} style={{ color: 'red', textAlign: "start" }} eventKey="4">{t("Logout")}</Dropdown.Item>
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
                <div style={{ position: "fixed", width: "100%", top: "0", zIndex: "3", maxHeight: "35px", padding: "0", backgroundColor: "white", boxShadow: "0 0 8px #898989 " }}>
                    <div className="HederExperienceActive" style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex" }}>
                            <div className="unitMenu " style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: "110px", maxHeight: "35px", backgroundColor: "rgb(25 135 84)" }}>
                                <DropdownButton
                                    as={ButtonGroup}
                                    size="sm"
                                    variant="success"
                                    title={
                                        <span style={{ marginRight: "1px" }}>
                                            <i className="fa fa-user"></i> {UserName}
                                        </span>
                                    }
                                    style={{ color: "rgb(25 135 84)", minWidth: "88px" }}
                                >
                                    <Dropdown.Item onClick={btnMyAccount} style={{ textAlign: "start" }} eventKey="1">{t("hedarAdmin.my Account")}</Dropdown.Item>
                                    <Dropdown.Item onClick={btnChangePassword} style={{ textAlign: "start" }} eventKey="2">{t("hedarAdmin.Change Password")}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={btnLogout} style={{ color: 'red', textAlign: "start" }} eventKey="4">{t("Logout")}</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div style={{ display: "flex" }}>
                                <NavLink to={"/cline/Articales/GetCategoryMarketCline"} className="custom-button" ><div>{t("Market")}</div></NavLink>
                                <NavLink to={`/cline/Articales/MyOrders/${UserId}`} className="custom-button" ><div>{t("My Orders")}</div></NavLink>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                            <div style={{ position: "relative", margin: "0 20px" }}>
                                <Button variant="success" id="btnLogout" style={{ padding: "2px 0 4px 0", width: "50px", margin: "0 0 2px 0" }} onClick={() => openCart()} >
                                    <FaShoppingCart style={{ paddingBottom: "2px", fontSize: "20px" }} />
                                    <span className="visually-hidden">unread messages</span>
                                </Button>
                                {cartQuantity > 0 && (
                                    <Badge
                                        bg="red"
                                        style={{
                                            backgroundColor: 'red',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '0',
                                            right: '0',
                                            transform: 'translate(50%, -25%)'
                                        }}
                                    >
                                        {cartQuantity}
                                    </Badge>
                                )}
                            </div>
                            <div style={{ display: 'flex', margin: "0 20px" }}>
                                <Form.Select style={{ width: "100px", padding: "0 20px 0 0 ", height: "30px" }} onChange={(e) => BtnLanguge(e.target.value)} value={i18n.language}>
                                    <option>en</option>
                                    <option value={"ar"}>العربية</option>
                                    <option value={"he"}>עִברִית</option>
                                </Form.Select>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </nav >
    )
}


export default HederVisitor;