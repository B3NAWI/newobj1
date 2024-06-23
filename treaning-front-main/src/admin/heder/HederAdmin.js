import { Link, NavLink, useNavigate } from "react-router-dom";
import './heder.css'
import React, { useContext, useEffect, useState } from "react";
import { User } from "../../context/context";
import Cookies from "universal-cookie";
import axios from "axios";
import { isExpired } from "react-jwt";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Badge, Form } from "react-bootstrap";
import { MdNotificationsActive } from "react-icons/md";
import moment from 'moment';
import 'moment/locale/ar';
import 'moment/locale/he';
import { useTranslation } from "react-i18next";
import { IoMdMenu } from "react-icons/io";

const setMomentLanguage = (language) => {
    if (language === 'ar') {
        moment.locale('ar');
    } else {
        moment.locale('he');
    }
};

function HederAdmin() {
    const { t, i18n } = useTranslation();
    setMomentLanguage(i18n.language);
    const usernaw = useContext(User)
    const UserId = usernaw.auth.userDetals._id
    const UserName = usernaw.auth.userDetals.user
    const cookie = new Cookies()
    const nav = useNavigate()

    useEffect(() => {
        document.body.dir = i18n.dir()
    }, [])
    const BtnLanguge = (lan) => (
        i18n.changeLanguage(lan),
        window.location.reload()
    )

    const [dataOrders, setDataOrders] = useState()

    useEffect(() => {
        const ContextToken = usernaw.auth.token
        const IsExpiredContextToken = isExpired(ContextToken)
        const getTokenCookie = cookie.get("bearer")
        const token = getTokenCookie && getTokenCookie.token ? getTokenCookie.token : ""
        const RefreshTokenCookie = getTokenCookie && getTokenCookie.refreshToken ? getTokenCookie.refreshToken : ''
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

    const btnLogout = async () => {
        const getTokenCookie = cookie.get("bearer")
        const token = getTokenCookie.token
        const RefreshTokenCookie = getTokenCookie.refreshToken
        await axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                    token: token,
                    refreshToken: RefreshTokenCookie,
                }
            }
        ).then(async () => {
            await cookie.remove("bearer")
            await cookie.remove("refreshToken")
            await usernaw.setAuth({ userDetals: "", token: "" })
            nav("/")
        })
            .catch((err) => {
                console.log("err : ", err)
            })
    }
    const btnMyAccount = () => {
        nav("/admin/user/GetUserId")
    }
    const btnChangePassword = () => {
        nav(`/admin/user/ChangePassword/${UserId}`)
    }
    const getNotificationsOrders = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetOrder`)
            .then((doc) => setDataOrders(doc.data))
            .catch((err) => console.log("err : ", err))
    }

    const filterDataNew = dataOrders && dataOrders.filter((item) =>
        i18n.language == "ar" ? item.status?.ar.toLowerCase().includes("جديد") : i18n.language == "he" ? item.status?.he.toLowerCase().includes("חָדָשׁ") : ""
    )
    const NumberOrders = filterDataNew && filterDataNew.length
    // const NumberOrders = 4
    // console.log(NumberOrders)
    useEffect(() => {
        const debounce = setTimeout(() => {
            getNotificationsOrders()
        }, 800)
        return () => clearTimeout(debounce)
    })
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const BtnDropdownButton = async (status) => {
        const LStatus = JSON.parse(status);
        console.log(status)
        console.log(LStatus)
        await axios.patch(`${process.env.REACT_APP_API_URL}/clineArticales/patchorder`, { LStatus })
            .then((doc) => console.log(doc.data))
            .catch((err) => console.log("err Patch : ", err))
    }

    const BtnDetalisOrderAdmin = (id) => {
        nav(`/admin/market/orders/DetalisOrderAdmin/${id}`);
    };

    const BtnAllOreders = () => {
        nav('/admin/market/orders/allorders')
    }
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const start = (page - 1) * limit
    const end = Number(start) + Number(limit)
    console.log(dataOrders)
    const data = dataOrders?.map((i) => ({
        status: i18n.language == "ar" ? i.status.ar : i.status.he,
        DateOrder: i.DateOrder,
        UserDetails: i.UserDetails,
        cart: i.cart,
        createdAt: i.createdAt,
        payment: i.payment,
        receipt: i.receipt,
        receiptAddress: i.receiptAddress,
        totalPrice: i.totalPrice,
        _id: i._id
    }))
    const handleLink = (Link) => {
        nav(`${Link}`)
    }

    return (
        <nav>
            {isMobile ?
                <div className="App" style={{ width: "100%", position: "fixed", zIndex: "6" }}><div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", position: "fixed" }} >
                        <div style={{ width: "100%", top: "0", maxHeight: "35px", padding: "0", backgroundColor: "white", boxShadow: "0 0 8px #898989 ", display: "flex", justifyContent: "space-between", position: "fixed" }}>
                            <header style={{ display: "flex" }}>
                                <DropdownButton align={"start"} variant="success" style={{ textAlign: "start" }} id="dropdown-basic-button" title={<IoMdMenu style={{ minWidth: "110px" }} />}>
                                    <Dropdown.Header style={{ textAlign: "center", fontWeight: "600", backgroundColor: "#e9e9e9" }}>Menu</Dropdown.Header>
                                    <Dropdown.Item onClick={() => handleLink("/admin/Home/Home2")} style={{ textAlign: "start" }} >{t("Users")}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleLink("/admin/Home/Home4")} style={{ textAlign: "start" }} >{t("Market")}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleLink("/admin/market/CreateCategory")} style={{ textAlign: "start" }} >{t("hedarAdmin.Create Category")}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleLink("/admin/market/CreateArticales")} style={{ textAlign: "start" }} >{t("hedarAdmin.Create Product")}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleLink("/admin/market/CreateAnOffer")} style={{ textAlign: "start" }} >{t("hedarAdmin.Create Offer")}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleLink("/admin/market/orders/allorders")} style={{ textAlign: "start" }} >{t("hedarAdmin.All Orders")}</Dropdown.Item>
                                    <Dropdown.Header style={{ textAlign: "center", fontWeight: "600", backgroundColor: "#e9e9e9" }}>Account</Dropdown.Header>
                                    <Dropdown.Item onClick={btnMyAccount} style={{ textAlign: "start" }} eventKey="1">{t("hedarAdmin.my Account")}</Dropdown.Item>
                                    <Dropdown.Item onClick={btnChangePassword} style={{ textAlign: "start" }} eventKey="2">{t("hedarAdmin.Change Password")}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={btnLogout} style={{ color: 'red', textAlign: "start" }} eventKey="4">{t("Logout")}</Dropdown.Item>
                                </DropdownButton>
                            </header>
                            <div style={{ margin: "0 5px", height: "40px" }}>
                                <Form.Select style={{ width: "100px", padding: "0 0 0 0 ", height: "30px" }} onChange={(e) => BtnLanguge(e.target.value)} value={i18n.language}>
                                    {/* <option>en</option> */}
                                    <option value={"ar"}>العربية</option>
                                    <option value={"he"}>עִברִית</option>
                                </Form.Select>
                            </div>
                            <div style={{ margin: "2px 5px" }}>
                                <DropdownButton
                                    size="sm"
                                    variant="success"
                                    className="custom-dropdown-button"
                                    title={<>
                                        <Badge bg="#ff2222" style={{ position: "absolute", top: "-2px", right: "80%", backgroundColor: 'red' }}>
                                            {NumberOrders == 0 ?
                                                ""
                                                : NumberOrders}
                                        </Badge>
                                        <MdNotificationsActive style={{ paddingBottom: "3px", fontSize: "22px" }} />
                                    </>}
                                    onClick={() => BtnDropdownButton(JSON.stringify({ ar: "جديد", he: "חָדָשׁ" }))}
                                >
                                    {data && data.map((item) => (
                                        <Dropdown.Item style={{ maxWidth: "100%" }} eventKey="2" onClick={() => BtnDetalisOrderAdmin(item._id)}>
                                            <div style={{ maxWidth: "10%", wordWrap: "break-word", overflowWrap: "break-word" }}>
                                                {t("hedarAdmin.Order from")} <span style={{ fontWeight: "600" }}> {item.UserDetails.name} </span> ,{t("hedarAdmin.Status")} : {item.status == "received" ? <span style={{ color: '#198754', fontWeight: "500" }}>{item.status}</span> : <span style={{ color: 'red' }}>{item.status}</span>}
                                                <div style={{ fontSize: '13px' }}>
                                                    {moment(item.createdAt).fromNow()}
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    ))}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={BtnAllOreders} style={{ textAlign: "start" }} eventKey="2">{t("hedarAdmin.All notifications")} </Dropdown.Item>
                                </DropdownButton>
                            </div>


                        </div>
                    </div>
                </div>
                </div>
                :
                <div class="w3-top form-floating" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", position: "fixed", zIndex: "3" }} >
                    <div style={{ width: "100%", top: "0", maxHeight: "35px", padding: "0", backgroundColor: "white", boxShadow: "0 0 8px #898989 ", display: "flex", justifyContent: "space-between" }}>
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

                            <div className="HederAdmineActive" style={{ display: "flex" }}>
                                <NavLink to={"/admin/Home/Home2"} className="custom-button" activeClassName="active-link" exact><div>{t("Users")}</div></NavLink>
                                <NavLink to={"/admin/Home/Home4"} className="custom-button" activeClassName="active-link" ><div>{t("Market")}</div></NavLink>
                                <NavLink to={"/admin/market/CreateCategory"} className="custom-button" activeClassName="active-link"  ><div>{t("hedarAdmin.Create Category")}</div></NavLink>
                                <NavLink to={"/admin/market/CreateArticales"} className="custom-button" activeClassName="active-link" ><div>{t("hedarAdmin.Create Product")}</div></NavLink>
                                <NavLink to={"/admin/market/CreateAnOffer"} className="custom-button" activeClassName="active-link"  ><div>{t("hedarAdmin.Create Offer")}</div></NavLink>
                                <NavLink to={"/admin/market/orders/allorders"} className="custom-button" activeClassName="active-link"  ><div>{t("hedarAdmin.All Orders")}</div></NavLink>
                            </div>

                        </div>
                        <div style={{ display: 'flex', margin: "0 40px" }}>
                            <div style={{ margin: "2px 7% 0 auto" }}>
                                <DropdownButton
                                    size="sm"
                                    variant="success"
                                    className="custom-dropdown-button"
                                    title={<>
                                        <Badge bg="#ff2222" style={{ position: "absolute", top: "-2px", right: "80%", backgroundColor: 'red' }}>
                                            {NumberOrders == 0 ?
                                                ""
                                                : NumberOrders}
                                        </Badge>
                                        <MdNotificationsActive style={{ paddingBottom: "3px", fontSize: "22px" }} />
                                    </>}
                                    onClick={() => BtnDropdownButton(JSON.stringify({ ar: "جديد", he: "חָדָשׁ" }))}
                                >
                                    {data && data.map((item) => (
                                        <Dropdown.Item style={{ maxWidth: "100%" }} eventKey="2" onClick={() => BtnDetalisOrderAdmin(item._id)}>
                                            <div style={{ maxWidth: "10%", wordWrap: "break-word", overflowWrap: "break-word" }}>
                                                {t("hedarAdmin.Order from")} <span style={{ fontWeight: "600" }}> {item.UserDetails.name} </span> ,{t("hedarAdmin.Status")} : {item.status == "received" ? <span style={{ color: '#198754', fontWeight: "500" }}>{item.status}</span> : <span style={{ color: 'red' }}>{item.status}</span>}
                                                <div style={{ fontSize: '13px' }}>
                                                    {moment(item.createdAt).fromNow()}
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    ))}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={BtnAllOreders} style={{ textAlign: "start" }} eventKey="2">{t("hedarAdmin.All notifications")} </Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div style={{ display: 'flex', margin: "0 20px" }}>
                                <Form.Select style={{ width: "100px", padding: "0 20px 0 0 " }} onChange={(e) => BtnLanguge(e.target.value)} value={i18n.language}>
                                    {/* <option>en</option> */}
                                    <option value={"ar"}>العربية</option>
                                    <option value={"he"}>עִברִית</option>
                                </Form.Select>
                            </div>
                        </div>
                    </div>
                </div>}

        </nav>
    )
}

export default HederAdmin;

