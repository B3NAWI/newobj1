import axios from 'axios';
import { TbListDetails } from 'react-icons/tb';
import React, { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Form, Nav } from 'react-bootstrap';
import { Loading } from '../../../refreshPage/loading';
import { useNavigate } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import { User } from '../../../context/context';
import { useTranslation, initReactI18next } from "react-i18next";
import PaginatedItems from '../../../components/pagination';
import i18n from "i18next"


const AllOrders = () => {
    const { t } = useTranslation();
    const context = useContext(User)
    const token = context.auth.token
    const nav = useNavigate()
    const [dataa, setDataa] = useState()


    const [filterData, setFilterData] = useState()
    const [saerch, setSaerch] = useState("")
    const [searchPayment, setSearchPayment] = useState("")
    const [searchDateOrder, setSearchDateOrder] = useState("")
    const [searchStatus, setSearchStatus] = useState("")

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const start = (page - 1) * limit
    const end = Number(start) + Number(limit)
    // const final = filterData && filterData.slice(start, end)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetOrder`)
            .then((doc) => setDataa(doc.data))
            .catch((err) => console.log("err : ", err))
    }, [])

    const dataSaerch = { saerch, searchStatus, searchDateOrder, searchPayment, page, limit }

    async function getSearchData() {
        await axios.post(`${process.env.REACT_APP_API_URL}/clineArticales/SearchOrders`, dataSaerch,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            }
        )
            .then((doc) => { setFilterData(doc.data) })
            .catch((err) => console.log("err 1 : ", err))
    }
    useEffect(() => {
        const debounce = setTimeout(() => {
            getSearchData()
        }, 800)
        return () => clearTimeout(debounce)
    }, [token, saerch, searchStatus, searchDateOrder, searchPayment, page, limit])

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    console.log(searchStatus)
    const BtnDetalisOrder = (OrderId) => {
        const order = dataa.find((i) => i._id === OrderId)
        nav(`/admin/market/orders/DetalisOrderAdmin/${OrderId}`, { state: { order } })
    }
    const handleChange1 = (e) => {
        const selectedValue = JSON.parse(e.target.value);
        setSearchPayment(selectedValue);
    };
    const handleChange2 = (e) => {
        const selectedValue = JSON.parse(e.target.value);
        setSearchStatus(selectedValue);
    };

    const orderStatus = (item) => {
        if (item.status.ar === "جديد") {
            return <span style={{ color: "red" }}>{t("Orders.Status.ok")}</span>
        } else if (item.status.ar === "تم المشاهدة") {
            return <span style={{ color: "red" }}>{t("Orders.Status.ok")}</span>
        } else if (item.status.ar === "قيد التجهيز") {
            return <span style={{ color: "red" }}>{t("Orders.Status.in preparation")}</span>
        } else if (item.status.ar === "في الطريق") {
            return <span style={{ color: "red" }}>{t("Orders.Status.in the way")}</span>
        } else if (item.status.ar === "تم التسليم") {
            return <span style={{ color: "green" }}>{t("Orders.Status.received")}</span>
        }
    }

    return (<>
        <div id="allPage" style={{ display: "flex", padding: "0" }}>
            <Nav className="NavDisktop" style={{ width: "15%", borderRight: "solid 1px rgb(219, 218, 218)", margin: "0", backgroundColor: "white" }}>
                <Accordion style={{ width: "15%", position: "fixed" }} alwaysOpen >
                    <Accordion.Item eventKey="0" style={{ width: "100%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}><span style={{ flexGrow: 1, textAlign: "start" }}> {t("Orders.Payment.Payment")} </span> </Accordion.Header>
                        <Accordion.Body>
                            <form onChange={handleChange1}>
                                <input type="radio" id="AllPayment" name="Role" value={JSON.stringify({ ar: "", he: "" })} style={{ width: "20%" }} defaultChecked />
                                <label for={"AllPayment"} style={{ width: "80%" }}>{t("All")}</label>
                                <input type="radio" id="Cash" name="Role" value={JSON.stringify({ ar: "كاش", he: "כסף מזומן" })} style={{ width: "20%" }} />
                                <label for={"Cash"} style={{ width: "80%" }}>{t("Orders.Payment.Cash")}</label>
                                <input type="radio" id="Card" name="Role" value={JSON.stringify({ he: "כַּרְטִיס", ar: "بطاقة" })} style={{ width: "20%" }} />
                                <label for={"Card"} style={{ width: "80%" }}>{t("Orders.Payment.Card")}</label>
                                <input type="radio" id="CardinDelivery" name="Role" value={JSON.stringify({ ar: "بطاقة للدلفري", he: "כרטיס משלוח" })} style={{ width: "20%" }} />
                                <label for={"CardinDelivery"} style={{ width: "80%" }}>{t("Orders.Payment.Card in Delivery")}</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" style={{ width: "100%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}> <span style={{ flexGrow: 1, textAlign: "start" }}>{t("Orders.Date Order")}</span> </Accordion.Header>
                        <Accordion.Body>
                            <form onChange={(e) => setSearchDateOrder(e.target.value)}>
                                <input type="radio" id="AllDate" name="DateOrder" value={null} style={{ width: "20%" }} defaultChecked />
                                <label for={"AllDate"} name="DateOrder" style={{ width: "80%" }}>{t("All")}</label>
                                <input type="radio" id="1Day" name="DateOrder" value="1Day" style={{ width: "20%" }} />
                                <label for={"1Day"} name="DateOrder" style={{ width: "80%" }}>1 {t("Orders.Day")}</label>
                                <input type="radio" id="3Day" name="DateOrder" value="3Day" style={{ width: "20%" }} />
                                <label for={"3Day"} style={{ width: "80%" }}>3 {t("Orders.Day")}</label>
                                <input type="radio" id="7Day" name="DateOrder" value="7Day" style={{ width: "20%" }} />
                                <label for={"7Day"} style={{ width: "80%" }}>7 {t("Orders.Day")}</label>
                                <input type="radio" id="30Day" name="DateOrder" value="30Day" style={{ width: "20%" }} />
                                <label for={"30Day"} style={{ width: "80%" }}>30 {t("Orders.Day")}</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" style={{ width: "100%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}><span style={{ flexGrow: 1, textAlign: "start" }}> {t("hedarAdmin.Status")} </span> </Accordion.Header>
                        <Accordion.Body>
                            <form onChange={handleChange2}>
                                <input type="radio" id="AllStatus" name="Status" value={JSON.stringify({ ar: "", he: "" })} style={{ width: "20%" }} defaultChecked />
                                <label for={"AllStatus"} name="Status" style={{ width: "80%" }}>{t("All")}</label>
                                <input type="radio" id="new" name="Status" value={JSON.stringify({ ar: "جديد", he: "חָדָשׁ" })} style={{ width: "20%" }} />
                                <label for={"new"} name="Status" style={{ width: "80%" }}>{t("Orders.Status.new")}</label>
                                <input type="radio" id="watched" name="Status" value={JSON.stringify({ ar: "تم المشاهدة", he: "צפה" })} style={{ width: "20%" }} />
                                <label for={"watched"} style={{ width: "80%" }}>{t("Orders.Status.watched")}</label>
                                <input type="radio" id="inpreparation" name="Status" value={JSON.stringify({ ar: "قيد التجهيز", he: "בהכנה" })} style={{ width: "20%" }} />
                                <label for={"inpreparation"} style={{ width: "80%" }}>{t("Orders.Status.in preparation")}</label>
                                <input type="radio" id="intheway" name="Status" value={JSON.stringify({ ar: "في الطريق", he: "בדרך" })} style={{ width: "20%" }} />
                                <label for={"intheway"} style={{ width: "80%" }}>{t("Orders.Status.in the way")}</label>
                                <input type="radio" id="received" name="Status" value={JSON.stringify({ ar: "تم التسليم", he: "קיבלו" })} style={{ width: "20%" }} />
                                <label for={"received"} style={{ width: "80%" }}>{t("Orders.Status.received")}</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Nav>
            <div style={{ width: isMobile ? "100%" : "85%" }}>
                <div style={{ width: "96%", backgroundColor: "white", margin: "10px 2%", borderRadius: "10px", boxShadow: "5px 0 5px 0 rgb(219, 218, 218)", border: "solid 1px rgb(219, 218, 218)" }}>
                    <div className="d-flex" style={{ width: "50%", marginLeft: "25%", marginTop: "0", marginRight: "25%" }}>
                        <Form.Control
                            type="search"
                            placeholder={t("Search")}
                            className="me-1"
                            aria-label="Search"
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.678)", height: "35px", margin: "3px 0" }}
                            value={saerch}
                            onChange={(e) => setSaerch(e.target.value)}
                        />
                        <IoSearchSharp style={{ fontSize: "30px", margin: "8px 0 0 0" }} />
                    </div>
                </div>
                {isMobile ?
                    <div id='Page' style={{ margin: "1% 2% 2% 2%", width: "96%", padding: "0" }}>
                        {/* <div id='Page' style={{margin:"10px 3%" , width:"94%"}}> */}
                        {filterData ?
                            <div style={{ padding: "5px 0 0 0", width: "100%", marginTop: "10px" }}>
                                <table class="table  table-hover table-light " style={{ width: "100%", fontSize: "20px", backgroundColor: "white", borderRadius: "5px", boxShadow: "2px 2px 5px 0 rgb(219, 218, 218)" }}>
                                    {filterData.movies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (<>
                                        <tbody style={{ padding: "0", width: "100%" }} className="table table-hover table-light">
                                            <tr key={index} style={{ display: "flex", flexDirection: "column", borderTop: index + 1 == "1" ? null : "solid 1px black" }}>
                                                <td ># : {index + 1}</td>
                                                <td >{t("CreateUser.User")} : {item.UserDetails.name}</td>
                                                <td >{t("CreateUser.Phone")}{item.UserDetails.phone}</td>
                                                <td >{t("Orders.Payment.Payment")}{i18n.language == "ar" ? item.payment.ar : item.payment.he}</td>
                                                <td >{t("Orders.Date Order")}{item.DateOrder}</td>
                                                <td > {t("hedarAdmin.Status")}{orderStatus(item)}</td>
                                                {/* <td >{i18n.language == "ar" ? item.status.ar :item.status.he}</td> */}
                                                <td style={{ display: "table-cell", padding: "5px" }} >
                                                    <div style={{ display: "flex", alignItems: "end", padding: "0" }}>
                                                        <div style={{ width: "100%" }}>
                                                            <Button
                                                                variant='success'
                                                                onClick={() => BtnDetalisOrder(item._id)}
                                                                style={{ width: "100%" }}
                                                            >
                                                                {t("Orders.Order details")}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </>))}
                                </table >
                                <div style={{ display: 'flex', justifyContent: "flex-end", marginRight: "2%", alignItems: 'baseline' }}>
                                    <Form.Select style={{ width: "80px" }} onChange={(e) => setLimit(e.target.value)}>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                    </Form.Select>
                                    <PaginatedItems total={filterData.total} itemsPerPage={limit} setPage={setPage} />
                                </div>
                            </div>
                            : <Loading />}
                        {/* </div> */}
                    </div>
                    :
                    <div id='Page' style={{ margin: "1% 2% 2% 2%", width: "96%", padding: "0" }}>
                        {/* <div id='Page' style={{margin:"10px 3%" , width:"94%"}}> */}
                        {filterData ?
                            <div style={{ padding: "5px 0 0 0", width: "100%", marginTop: "10px" }}>
                                <table class="table  table-hover table-light " style={{ width: "100%", fontSize: "20px", backgroundColor: "white", borderRadius: "5px", boxShadow: "2px 2px 5px 0 rgb(219, 218, 218)" }}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>{t("CreateUser.User")}</th>
                                            <th>{t("CreateUser.Phone")}</th>
                                            <th>{t("Orders.Payment.Payment")}</th>
                                            <th>{t("Orders.Date Order")}</th>
                                            <th>{t("hedarAdmin.Status")}</th>
                                            <th >{<TbListDetails />}</th>
                                        </tr>
                                    </thead>
                                    {filterData.movies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (<>
                                        <tbody style={{ padding: "0", width: "100%" }} className="table table-hover table-light">
                                            <tr key={index} style={{ padding: "0", width: "100%" }}>
                                                <td  >{index + 1}</td>
                                                <td >{item.UserDetails.name}</td>
                                                <td >{item.UserDetails.phone}</td>
                                                <td >{i18n.language == "ar" ? item.payment.ar : item.payment.he}</td>
                                                <td >{item.DateOrder}</td>
                                                <td > {orderStatus(item)}</td>
                                                {/* <td >{i18n.language == "ar" ? item.status.ar :item.status.he}</td> */}
                                                <td style={{ display: "table-cell", padding: "5px" }} >
                                                    <div style={{ display: "flex", alignItems: "end", padding: "0" }}>
                                                        <div style={{ width: "100%" }}>
                                                            <Button
                                                                variant='success'
                                                                onClick={() => BtnDetalisOrder(item._id)}
                                                                style={{ width: "100%" }}
                                                            >
                                                                {t("Orders.Order details")}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </>))}
                                </table >
                                <div style={{ display: 'flex', justifyContent: "flex-end", marginRight: "2%", alignItems: 'baseline' }}>
                                    <Form.Select style={{ width: "80px" }} onChange={(e) => setLimit(e.target.value)}>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                    </Form.Select>
                                    <PaginatedItems total={filterData.total} itemsPerPage={limit} setPage={setPage} />
                                </div>
                            </div>
                            : <Loading />}
                        {/* </div> */}
                    </div>
                }
            </div>
        </div>
    </>)
}





export default AllOrders;