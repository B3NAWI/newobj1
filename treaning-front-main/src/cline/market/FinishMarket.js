import React, { useContext, useEffect, useState } from "react";
import { useShoppingCart } from "../../context/shoppingCartContext";
import axios from "axios";
import './Articales.css';
import { Accordion, Button, Stack, Tab, Tabs, Nav } from "react-bootstrap";
import CartItem from "./CartItem";
import { User } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MsgModal, MsgToast } from "../../components/MsgComponent";



const FinishMarket = () => {
    const { t } = useTranslation();
    const { cartItems, removeAllCart } = useShoppingCart()
    const usernaw = useContext(User)
    const userId = usernaw.auth.userDetals._id
    const token = usernaw.auth.token
    const nav = useNavigate()

    const [dataaUser, setDataaUser] = useState()
    const [dataaArticales, setDataaArticales] = useState()
    const [city, setCity] = useState()
    const [district, setDistrict] = useState()
    const [street, setStreet] = useState()
    const [architectureName, setArchitectureName] = useState()
    const [apartmentNumber, setApartmentNumber] = useState()
    const [floorNumber, setFloorNumber] = useState()
    const [additionalDetails, setAdditionalDetails] = useState()
    const [disabledBtnPay, setDisabledBtnPay] = useState(false)
    const [payment, setPayment] = useState({ ar: "كاش", he: "כסף מזומן" })
    const [receipt, setReceipt] = useState({ he: "מְסִירָה", ar: "دلفري" })
    const [msgDeleteAddress, setMsgDeleteAddress] = useState(false)
    const [idAddress, setIdAddress] = useState()

    const [show, setShow] = useState(false);

    const [selectedItemId, setSelectedItemId] = useState();

    const handleChange = (selectedId) => {
        setSelectedItemId(selectedId);
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/users/GetUser/${userId}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            })
            .then((doc) => setDataaUser(doc.data))
            .catch((err) => { console.log("err get user : ", err) })
        // receipt.ar == "استلام من المكان" && setDisabledBtnPay(true)
        // console.log(receipt.ar)
    }, [show, msgDeleteAddress])
    console.log(disabledBtnPay)
    console.log(receipt.ar)
    useEffect(() => {
        GetProduct()
        HandleDisabledBtnPay()
    }, [show, cartItems, selectedItemId, receipt.ar])

    const GetProduct = (async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetArticales`)
            .then((doc) => setDataaArticales(doc.data))
            .catch((err) => console.log("err Get : ", err))
    })

    const dataAddressPost = {
        city: city,
        district: district,
        street: street,
        architectureName: architectureName,
        apartmentNumber: apartmentNumber,
        floorNumber: floorNumber,
        additionalDetails: additionalDetails
    }

    const handleChange1 = (e) => {
        const selectedValue = JSON.parse(e.target.value);
        setPayment(selectedValue);
    };
    const handleChange2 = (e) => {
        const selectedValue = JSON.parse(e.target.value);
        setReceipt(selectedValue);
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const btnAddAddress = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/users/addaddress/${userId}/address`, dataAddressPost,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            }
        )
            .then(() => { setShow(true) })
            .catch((err) => { console.log("err post address : ", err) })
    }

    const btnDeleteAddress = async ({ idAddress }) => {
        await axios.post(`${process.env.REACT_APP_API_URL}/users/removeaddress/${userId}/address/${idAddress}`, dataAddressPost,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            }
        )
            .then(() => { setMsgDeleteAddress(false) })
            .catch((err) => { console.log("err delete address : ", err) })
    }

    const HandleDisabledBtnPay = () => {
        if (!cartItems.length) { setDisabledBtnPay(true) }
        else if (receipt.ar == "استلام من المكان") { return setDisabledBtnPay(false) }
        else if (!selectedItemId) { setDisabledBtnPay(true) }
        else if (selectedItemId) { return setDisabledBtnPay(false) }
    }
    const totalPrice = cartItems.reduce((total, cartitem) => {
        const item = dataaArticales && dataaArticales.find((i) => i._id === cartitem.id)
        return total + (item?.price || 0) * cartitem.quantity;
    }, 0)
    const DataCreateOrder = { payment, receipt, receiptAddress: selectedItemId, cartItems, userId, totalPrice }
    const btnPay = async () => {
        if (payment.ar == "بطاقة") {
            nav('/cline/Articales/FinishMarket/PayCard', { state: DataCreateOrder })
        } else if (payment.ar == "كاش" || payment.ar == "بطاقة للدلفري") {
            await axios.post(`${process.env.REACT_APP_API_URL}/clineArticales/CreateOrder`, DataCreateOrder)
                .then((doc) => nav(`/cline/Articales/FinishMarket/Invoice/${doc.data._id}`, { state: { Order: doc.data } }))
                .then(() => removeAllCart())
                .catch((err) => console.log("err", err))
        }
    }


    return (<>
        <div style={{ display: "flex", marginTop: "35px", minHeight: "100vh", backgroundColor: "rgb(235, 235, 235)", overflow: "hidden" }}>
            <Nav className="NavDisktop" style={{ minHeight: "500px", width: "15%", borderRight: "solid 1px rgb(219, 218, 218)", margin: "0", backgroundColor: "white" }}>
                <Accordion style={{ width: "15%", position: "fixed" }} alwaysOpen defaultActiveKey={['0', '1']}>
                    {/* <div style={{ width: "99%", fontSize: "25px", height: "40px", borderBottom: "1px solid ", textAlign: "center" }}>Filter</div> */}
                    <Accordion.Item eventKey="0" style={{ width: "99%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}> <span style={{ flexGrow: 1, textAlign: "start" }}>{t("Orders.Payment.Payment")}</span>  </Accordion.Header>
                        <Accordion.Body style={{ padding: "15px 0" }}>
                            <form onChange={handleChange1}>
                                <input type="radio" id="Cash" name="paymentMethod" value={JSON.stringify({ ar: "كاش", he: "כסף מזומן" })} style={{ width: "20%", cursor: "pointer" }} defaultChecked />
                                <label for={"Cash"} style={{ width: "80%", cursor: "pointer" }}>{t("Orders.Payment.Cash")}</label>
                                <input type="radio" id="Card" name="paymentMethod" value={JSON.stringify({ he: "כַּרְטִיס", ar: "بطاقة" })} style={{ width: "20%", cursor: "pointer" }} />
                                <label for={"Card"} style={{ width: "80%", cursor: "pointer" }}>{t("Orders.Payment.Card")}</label>
                                <input type="radio" id="CardinDelivery" name="paymentMethod" value={JSON.stringify({ ar: "بطاقة للدلفري", he: "כרטיס משלוח" })} style={{ width: "20%", cursor: "pointer" }} />
                                <label for={"CardinDelivery"} style={{ width: "80%", cursor: "pointer" }}>{t("Orders.Payment.Card in Delivery")}</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" style={{ width: "99%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}> <span style={{ flexGrow: 1, textAlign: "start" }}>{t("FinishMarket.The receipt")}</span> </Accordion.Header>
                        <Accordion.Body style={{ padding: "15px 0" }}>
                            <form onChange={handleChange2}>
                                <input type="radio" id="delivery" name="receipt" value={JSON.stringify({ he: "מְסִירָה", ar: "دلفري" })} style={{ width: "20%", cursor: "pointer" }} defaultChecked />
                                <label for={"delivery"} name="receipt" style={{ width: "80%", cursor: "pointer" }}>{t("FinishMarket.Delivery")}</label>
                                <input type="radio" id="FromThePlace" name="receipt" value={JSON.stringify({ ar: "استلام من المكان", he: "קבלה מהמקום" })} className="custom-radio" style={{ width: "20%", cursor: "pointer" }} />
                                <label for={"FromThePlace"} name="receipt" style={{ width: "80%", cursor: "pointer" }}>{t("FinishMarket.From the place")}</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <div style={{ width: "90%", margin: "5% 5% 5% 5%" }}>
                        <Button variant="outline-success" style={{ width: "100%" }} onClick={btnPay} disabled={disabledBtnPay} >{t("Pay")}</Button>
                    </div>
                </Accordion>
            </Nav>
            <div style={{ width: isMobile ? "100%" : "85%" }}>
                <div style={{ backgroundColor: "white", width: "96%", borderRadius: "10px", boxShadow: " 5px 5px 5px 0 rgb(219, 218, 218)", display: "flex", flexDirection: isMobile && "column", padding: "1%", margin: "2%" }}>
                    <div style={{ width: isMobile ? "100%" : "50%" }}>
                        <div className="ms-auto fw-bold fs-5" style={{ textAlign: "center", marginBottom: "4px", borderBottom: "1px solid rgb(228, 228, 228)", paddingBottom: "2%" }}>
                            {t("Total")}{" "}
                            {cartItems.reduce((total, cartitem) => {
                                const item = dataaArticales && dataaArticales.find((i) => i._id === cartitem.id)
                                return total + (item?.price || 0) * cartitem.quantity;
                            }, 0)} $
                        </div>
                        <Stack style={{ width: "100%", padding: "3%" }}>
                            {cartItems.map((item) => (
                                <CartItem key={item.id} {...item} />
                            ))}
                        </Stack>
                    </div>
                    <div style={{ width: isMobile ? "100%" : "50%" }}>
                        <Tabs
                            defaultActiveKey="address"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                            style={{ justifyContent: "space-evenly" }}
                            disabled={receipt.ar == "استلام من المكان"}
                        >
                            <Tab disabled={receipt.ar == "استلام من المكان"} eventKey="address" title={t("FinishMarket.Specify your address")} style={{ color: "black", padding: " 0 3% 3% 3%" }} >
                                <form >
                                    {dataaUser && dataaUser.address.map((item, index) => (
                                        <div
                                            key={item._id}
                                            style={{
                                                border: "1px solid rgb(219, 218, 218)",
                                                borderRadius: "10px",
                                                padding: '20px 20px 20px 10px',
                                                display: "flex",
                                                margin: "2% 0",
                                                boxShadow: "2px 2px 5px rgb(219, 218, 218)",
                                                cursor: receipt.ar == "استلام من المكان" ? null : "pointer",
                                            }}
                                            onClick={() => handleChange(item._id)}
                                            onMouseEnter={() => setIdAddress(item._id)}
                                        >
                                            <div style={{ width: "10%" }}>
                                                <div>
                                                    <Button variant="outline-danger" style={{ fontSize: "15px", padding: "0 6px" }} onClick={() => setMsgDeleteAddress(true)}> &times;</Button>
                                                </div>
                                            </div>
                                            <div style={{ width: "10%" }}>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        id={`selectA${index}`}
                                                        name="selectA"
                                                        value={item._id}
                                                        style={{ width: "30%", cursor: "pointer" }}
                                                        checked={receipt.ar == "استلام من المكان" ? null : selectedItemId === item._id}
                                                        // readOnly
                                                        disabled={receipt.ar == "استلام من المكان"}
                                                    />
                                                    <label htmlFor={`selectA${index}`} style={{ width: "60%" }}></label>
                                                </div>
                                            </div>
                                            <div style={{ width: "80%" }}>
                                                <div style={{ display: "flex", flexDirection: 'row-reverse' }}>
                                                    <div>
                                                        {item.city}.
                                                    </div>
                                                    <div>
                                                        {item.district} ,
                                                    </div>
                                                </div>
                                                <div style={{ color: "rgb(116 116 116)", display: "flex", flexWrap: "wrap", flexDirection: 'row-reverse' }}>
                                                    <div>
                                                        {t("Orders.Orderdetails.Street")}  {item.street}.
                                                    </div>
                                                    <div>
                                                        {t("Orders.Orderdetails.Architecture")} {item.architectureName} ,
                                                    </div>
                                                    <div>
                                                        {t("Orders.Orderdetails.Floor")} {item.floorNumber} ,
                                                    </div>
                                                    <div>
                                                        {t("Orders.Orderdetails.Apartment")}  {item.apartmentNumber} ,
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </form>
                            </Tab>
                            <Tab disabled={receipt.ar == "استلام من المكان"} eventKey="addaddress" title={t("FinishMarket.Add Address")} style={{ color: "black", padding: "3%" }} >
                                <div style={{ width: "96%", margin: "0 2%" }}>
                                    <div style={{ display: "flex", width: "100%" }}>
                                        <div style={{ width: "50%" }}>
                                            <div class="form-floating mb-3" style={{ width: '95%' }} >
                                                <input type="text" class="form-control" id="floatingInput" onChange={(e) => { setCity(e.target.value) }} placeholder="name@example.com" />
                                                <label for="floatingInput">{t("FinishMarket.City")}</label>

                                            </div>
                                        </div>
                                        <div style={{ width: "50%" }}>
                                            <div class="form-floating mb-3" style={{ width: '95%' }}>
                                                <input type="text" class="form-control" id="floatingInput" onChange={(e) => { setDistrict(e.target.value) }} placeholder="name@example.com" />
                                                <label for="floatingInput">{t("FinishMarket.neighborhood")}</label>

                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: "50%" }}>
                                            <div class="form-floating mb-3" style={{ width: '95%' }}>
                                                <input type="text" class="form-control" id="floatingInput" onChange={(e) => { setStreet(e.target.value) }} placeholder="name@example.com" />
                                                <label for="floatingInput">{t("Orders.Orderdetails.Street")}</label>

                                            </div>
                                        </div>
                                        <div style={{ width: "50%" }}>
                                            <div class="form-floating mb-3" style={{ width: '95%' }}>
                                                <input type="text" class="form-control" id="floatingInput" onChange={(e) => { setArchitectureName(e.target.value) }} placeholder="name@example.com" />
                                                <label for="floatingInput">  {t("FinishMarket.Building name/number")}</label>

                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: "50%" }}>
                                            <div class="form-floating mb-3" style={{ width: '95%' }}>
                                                <input type="number" class="form-control" id="floatingInput" onChange={(e) => { setApartmentNumber(e.target.value) }} placeholder="name@example.com" />
                                                <label for="floatingInput"> {t("Orders.Orderdetails.Apartment")}</label>

                                            </div>
                                        </div>
                                        <div style={{ width: "50%" }}>
                                            <div class="form-floating mb-3" style={{ width: '95%' }}>
                                                <input type="number" class="form-control" id="floatingInput" onChange={(e) => { setFloorNumber(e.target.value) }} placeholder="name@example.com" />
                                                <label for="floatingInput"> {t("Orders.Orderdetails.Floor")}</label>

                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="form-floating mb-3" style={{ width: '97%', alignItems: "center" }}>
                                            <input type="text" class="form-control" style={{ width: '100%' }} id="floatingInput" onChange={(e) => { setAdditionalDetails(e.target.value) }} placeholder="name@example.com" />
                                            <label for="floatingInput"> {t("FinishMarket.Additional details")}</label>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }} >
                                        <Button variant="success" onClick={btnAddAddress}> {t("Add Adress")}</Button>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                        {isMobile &&
                            <div style={{ width: "100%" }}>

                                saddsadsa
                            </div>
                        }
                    </div>
                </div>
            </div>

            <MsgToast type={"success"} show={show} setShow={setShow} title={t("FinishMarket.Title added")} body={t("FinishMarket.The address has been added, choose your address now")} />
            <MsgModal show={msgDeleteAddress} handleClose={() => setMsgDeleteAddress(false)} opj={() => btnDeleteAddress({ idAddress })} title={t("FinishMarket.confirmation message")} body={t("FinishMarket.Do you really want to delete the address?")} BtnState={t("Yes sure")} />
        </div >
    </>)
}

export default FinishMarket;