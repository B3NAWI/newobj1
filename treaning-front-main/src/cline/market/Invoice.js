import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Loading } from '../../refreshPage/loading';
import { useTranslation } from "react-i18next";

const Invoice = () => {
    const { t, i18n } = useTranslation();

    const Location = useLocation()
    const { Order } = Location.state || {}


    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dataCart = Order.cart.map((item) => ({
        _id: item._id,
        category: i18n.language === "ar" ? item.category.ar : item.category.he,
        name: i18n.language === "ar" ? item.name.ar : item.name.he,
        title: i18n.language === "ar" ? item.title.ar : item.title.he,
        information: i18n.language === "ar" ? item.information.ar : item.information.he,
        price: item.price,
        number: item.number,
        quantity: item.quantity,
        file: item.file,
    }))

    return (<>
        <div id="allPage">
            <div id="Page" style={{ width: isMobile ? "95%" : "60%", margin: isMobile ? "0 2.5%" : "0 20%" }}>
                {Order ?
                    <div style={{ marginTop: "30px", border: "10px", width: "90%" }}>
                        <div style={{ display: "flex", justifyContent: "space-around", textAlign: "start", paddingBottom: "2%" }}>
                            <div>
                                <div>{t("Name")} : {Order.UserDetails.name}</div>
                                <div>{t("Orders.Orderdetails.Order Id")} : {Order._id}</div>
                            </div>
                            <div>
                                <div>{t("CreateUser.Phone")} :  {Order.UserDetails.phone}</div>
                                <div>{t("Orders.Date Order")} : {Order.DateOrder}</div>
                            </div>
                        </div>
                        <div style={{ borderTop: "1px solid #dbdada ", padding: "2% 0" }}>
                            <table class="table  table-hover table-light " style={{ fontSize: "20px", height: "10px", width: "96%", backgroundColor: "white", marginLeft: "2%", borderRadius: "5px", boxShadow: "2px 2px 5px 0 rgb(219, 218, 218)", }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{t("Orders.Orderdetails.item")}</th>
                                        <th>{t("Orders.Orderdetails.quantity")}</th>
                                        <th>{t("Price")}</th>
                                    </tr>
                                </thead>
                                {dataCart.map((item, index) => (<>
                                    <tbody style={{ padding: "0" }}>
                                        <tr key={index} style={{ padding: "0" }} >
                                            <td >{index + 1}</td>
                                            <td >{item.name}</td>
                                            <td >{item.quantity}</td>
                                            <td >{item.price} $</td>
                                        </tr>
                                    </tbody>
                                </>))}
                            </table >
                        </div>
                        <div style={{ display: 'flex', color: 'red', borderTop: "1px solid #dbdada ", justifyContent: "space-evenly", padding: "2% 0" }}>
                            <div >{t("Orders.Orderdetails.Total Price")} :   {Order.totalPrice} {" $  "}</div>
                            <div > {t("Orders.Payment.Payment")}: {i18n.language == "ar" ? Order.payment.ar : Order.payment.he} {" "}</div>
                        </div>
                        <div style={{ borderTop: "1px solid #dbdada ", padding: " 2% 0 " }}>{t("Orders.Orderdetails.Receipt")} : {i18n.language == "ar" ? Order.receipt.ar : Order.receipt.he} {" "}</div>
                        {Order.receipt.ar == "استلام من المكان" ? null : <div style={{ borderTop: "1px solid #dbdada ", paddingTop: "2%" }}>
                            <div style={{ textAlign: "start", marginLeft: "20%", marginRight: "20%", paddingBottom: "2px" }}>{t("Orders.Orderdetails.Receipt Address")} :</div>
                            <div style={{ border: "1px solid ", borderRadius: "5px", width: "60%", margin: "0 20%", textAlign: "right", padding: "2%" }}>
                                <div >
                                    {Order.receiptAddress.city} {" "},
                                    {Order.receiptAddress.district} {" "}.
                                </div>
                                <div>
                                    {t("Orders.Orderdetails.Street")} {Order.receiptAddress.street} {" "},
                                    {t("Orders.Orderdetails.Architecture")} {Order.receiptAddress.architectureName} {" "},
                                    {t("Orders.Orderdetails.Floor")} {Order.receiptAddress.floorNumber} {" "},
                                    {t("Orders.Orderdetails.Apartment")}  {Order.receiptAddress.apartmentNumber} {" "}.
                                </div>
                            </div>
                        </div>}

                    </div>
                    : <Loading />
                }
            </div>
        </div>
    </>)
}
export default Invoice;