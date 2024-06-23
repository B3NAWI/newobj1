import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useShoppingCart } from '../../context/shoppingCartContext';
import { User } from '../../context/context';
import './Articales.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, initReactI18next } from "react-i18next";


const PayCard = () => {

    const { t } = useTranslation();
    const location = useLocation();
    const { payment, receipt, receiptAddress, userId, cartItems, totalPrice } = location.state || {};
    const DataCreateOrder = { cartItems, payment, receipt, receiptAddress, userId, totalPrice }
    const { cartQuantity, removeAllCart } = useShoppingCart()
    const usernaw = useContext(User)
    const token = usernaw.auth.token
    const nav = useNavigate()

    const stripe = useStripe()
    const element = useElements()

    const [dataaArticales, setDataaArticales] = useState()

    const [cardName, setCardName] = useState()
    const [cardPhone, setCardPhone] = useState()
    const [cardEmail, setCardEmail] = useState()
    const [cardAddress, setCardAddress] = useState()
    const [cardErr, setCardErr] = useState()
    const [status, setStatus] = useState(t("Pay"))

    const [disabledBtnPay, setDisabledBtnPay] = useState()

    useEffect(() => {
        GetProduct()
        handeldisabledBtnPay()
    })
    const handeldisabledBtnPay = () => {
        if (!cartQuantity) {
            setDisabledBtnPay(true)
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
    const GetProduct = (async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetArticales`)
            .then((doc) => setDataaArticales(doc.data))
            .catch((err) => console.log("err Get : ", err))
    })

    const handleCardChange = (e) => {
        if (e.cardErr) return setCardErr(e.cardErr.message)
        setCardErr('')
    }
    const handlaPayment = async (e) => {
        setStatus(t("FinishMarket.Payment being made..."))
        const cardElement = element.getElement('card')
        const billinginfo = {
            name: cardName,
            phone: cardPhone,
            email: cardEmail,
            address: {
                line1: cardAddress,
            }
        }
        try {
            const paymentIntent = await axios.post(`${process.env.REACT_APP_API_URL}/card/payments`,
                {
                    amount: cartItems.reduce((total, cartitem) => {
                        const item = dataaArticales && dataaArticales.find((i) => i._id === cartitem.id)
                        return total + (item?.price || 0) * cartitem.quantity;
                    }, 0) * 100
                },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                    }
                })
            const paymentMethodObj = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: billinginfo,
            })
            if (paymentMethodObj.error) {
                setCardErr(paymentMethodObj.error.message)
                setStatus(t("Pay"))
            }
            const confirmedPayment = await stripe.confirmCardPayment(
                paymentIntent.data,
                { payment_method: paymentMethodObj.paymentMethod.id }
            )
            if (confirmedPayment.error) {
                setCardErr(confirmedPayment.error.message)
                setStatus(t("Pay"))
            }
            setStatus(t("FinishMarket.The payment process was successful"))
            setTimeout(async () => {
                setStatus(t("Pay"))
                await axios.post(`${process.env.REACT_APP_API_URL}/clineArticales/CreateOrder`, DataCreateOrder)
                    .then((doc) => nav(`/cline/Articales/FinishMarket/Invoice/${doc.data._id}` , {state:{Order : doc.data}}))
                    .then(() => removeAllCart())
                    .catch((err) => console.log(err))
            }, 3000)

            console.log("paymentIntent : ", paymentIntent)
            console.log("paymentMethodObj : ", paymentMethodObj)
            console.log("confirmedPayment : ", confirmedPayment)
        } catch (error) {
            console.log("Error card: ", error)
            setCardErr(error.message)
        }
    }

    return (<>
        <div id="allPage" style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", alignContent: "center" }}>
            <div className="ms-auto fw-bold fs-5" style={{ textAlign: "center", width:isMobile?"95%": "450px", backgroundColor: "white", margin: "10px 0", borderRadius: "20px", boxShadow: " 5px 5px 5px 0 rgb(219, 218, 218)", height: "40px", paddingTop: "8px" }}>
                {t("Total")}{" "}
                {cartItems.reduce((total, cartitem) => {
                    const item = dataaArticales && dataaArticales.find((i) => i._id === cartitem.id)
                    return total + (item?.price || 0) * cartitem.quantity;
                }, 0)} $
            </div>
            <div id="PagePayCard" >
                <div style={{ marginTop: "10px" }}>
                    <div style={{ width: "96%", margin: "0 2%" }}>
                        <div class="form-floating mb-3" style={{ width: '100%' }}>
                            <input type="text" name='name' class="form-control" style={{ width: '94%', margin: "0 3%" }} id="floatingInput" onChange={(e) => { setCardName(e.target.value) }} placeholder="name" />
                            <label for="floatingInput" style={{ margin: "0 3%" }}>{t("Name")}</label>
                        </div>
                        <div class="form-floating mb-3" style={{ width: '100%' }}>
                            <input type="number" name='phone' class="form-control" style={{ width: '94%', margin: "0 3%" }} id="floatingInput" onChange={(e) => { setCardPhone(e.target.value) }} placeholder="*********" />
                            <label for="floatingInput" style={{ margin: "0 3%" }}>{t("CreateUser.Phone")}</label>
                        </div>
                        <div class="form-floating mb-3" style={{ width: '100%' }}>
                            <input type="email" name='email' class="form-control" style={{ width: '94%', margin: "0 3%" }} id="floatingInput" onChange={(e) => { setCardEmail(e.target.value) }} placeholder="name@example.com" />
                            <label for="floatingInput" style={{ margin: "0 3%" }}>{t("Home2.Email")}</label>
                        </div>
                        <div class="form-floating mb-3" style={{ width: '100%' }}>
                            <input type="text" name='address' class="form-control" style={{ width: '94%', margin: "0 3%" }} id="floatingInput" onChange={(e) => { setCardAddress(e.target.value) }} placeholder="address" />
                            <label for="floatingInput" style={{ margin: "0 3%" }}>{t("FinishMarket.Add Address")}</label>
                        </div>
                    </div>
                    <div>
                        {cardErr}
                    </div>
                    <div style={{ width: "80%", margin: "4% 10%" }}>
                        <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: "18px" } } }} onChange={handleCardChange} />
                    </div>
                </div>
                <div style={{ width: "96%", margin: "0 2%" }}>
                    <Button variant="outline-success" onClick={handlaPayment} style={{ width: "100%", bottom: "0" }} disabled={disabledBtnPay} >{status}</Button>
                </div>

            </div>
        </div>
    </>)
}

export default PayCard;