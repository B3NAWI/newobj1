import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../refreshPage/loading';
import { Button } from 'react-bootstrap';
import { useShoppingCart } from '../../../context/shoppingCartContext';
import { useTranslation } from "react-i18next";

const DetalisOrder = () => {
    const { t, i18n } = useTranslation();
    const { reorderCartQuantity } = useShoppingCart();
    const nav = useNavigate();

    const location = useLocation();
    const { Order } = location.state || {};

    const Stages = {
        IN_PREPARATION: i18n.language === "ar" ? "قيد التجهيز" : "בהכנה",
        IN_THE_WAY: i18n.language === "ar" ? "في الطريق" : "בדרך",
        RECEIVED: i18n.language === "ar" ? "تم التسليم" : "קיבלו"
    };

    const stagesArray = [
        Stages.IN_PREPARATION,
        Stages.IN_THE_WAY,
        Stages.RECEIVED
    ];

    const BtnReOrder = () => {
        Order.cart.map((item) => reorderCartQuantity({ data: item, id: item._id, NumQuantity: item.quantity }));
        nav("/cline/Articales/FinishMarket");
    };

    const isStageCompleted = (stage) => {
        const currentIndex = stagesArray.indexOf(i18n.language == "ar" ? Order?.status.ar : Order?.status.he);
        const stageIndex = stagesArray.indexOf(stage);
        return stageIndex <= currentIndex;
    };

    const orderStatus = () => {
        if (Order.status.ar === "جديد") {
            return <span style={{ color: "red" }}>{t("Orders.Status.ok")}</span>;
        } else if (Order.status.ar === "تم المشاهدة") {
            return <span style={{ color: "red" }}>{t("Orders.Status.ok")}</span>;
        } else if (Order.status.ar === "قيد التجهيز") {
            return <span style={{ color: "red" }}>{t("Orders.Status.in preparation")}</span>;
        } else if (Order.status.ar === "في الطريق") {
            return <span style={{ color: "red" }}>{t("Orders.Status.in the way")}</span>;
        } else if (Order.status.ar === "تم التسليم") {
            return <span style={{ color: "green" }}>{t("Orders.Status.received")}</span>;
        }
    };

    const dataCart = Order?.cart?.map((i) => ({
        _id: i._id,
        name: i18n.language === "ar" ? i.name.ar : i.name.he,
        quantity: i.quantity,
        price: i.price
    }));

    return (
        <div id="allPage">
            <div id="Page" style={{ width: "60%", marginLeft: "20%", marginRight: "20%" }}>
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
                            <table className="table table-hover table-light" style={{ fontSize: "20px", height: "10px", width: "96%", backgroundColor: "white", marginLeft: "2%", borderRadius: "5px", boxShadow: "2px 2px 5px 0 rgb(219, 218, 218)" }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{t("Orders.Orderdetails.item")}</th>
                                        <th>{t("Orders.Orderdetails.quantity")}</th>
                                        <th>{t("Price")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCart.map((item, index) => (
                                        <tr key={index} style={{ padding: "0" }}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price} $</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ display: 'flex', color: 'red', borderTop: "1px solid #dbdada", justifyContent: "space-evenly", padding: "2% 0" }}>
                            <div>{t("Orders.Orderdetails.Total Price")} : {Order.totalPrice} $</div>
                            <div>{t("Orders.Payment.Payment")} : {i18n.language === "ar" ? Order.payment.ar : Order.payment.he}</div>
                        </div>
                        <div style={{ borderTop: "1px solid #dbdada", padding: "2% 0" }}>{t("Orders.Orderdetails.Receipt")} : {i18n.language === "ar" ? Order.receipt.ar : Order.receipt.he}</div>
                        {Order.receipt.ar == "استلام من المكان" ? null : <div style={{ borderTop: "1px solid #dbdada", paddingTop: "2%" }}>
                            <div style={{ textAlign: "start", marginLeft: "20%", marginRight: "20%", paddingBottom: "2px" }}>{t("Orders.Orderdetails.Receipt Address")} :</div>
                            <div style={{ border: "1px solid", borderRadius: "5px", width: "60%", margin: "0 20%", textAlign: "right", padding: "2%" }}>
                                <div>
                                    {Order.receiptAddress.city} ,
                                    {Order.receiptAddress.district}
                                </div>
                                <div>
                                    {t("Orders.Orderdetails.Street")} {Order.receiptAddress.street} ,
                                    {t("Orders.Orderdetails.Architecture")} {Order.receiptAddress.architectureName} ,
                                    {t("Orders.Orderdetails.Floor")} {Order.receiptAddress.floorNumber} ,
                                    {t("Orders.Orderdetails.Apartment")}  {Order.receiptAddress.apartmentNumber}.
                                </div>
                            </div>
                        </div>}
                        <div style={{ borderTop: "1px solid #dbdada", marginTop: "3%", paddingTop: "1%", fontSize: "18px" }}>
                            {t("hedarAdmin.Status")} :
                            {orderStatus()}
                        </div>
                        {Order.receipt.ar == "استلام من المكان" ? null :<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "3%" }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {stagesArray.map((stage, index) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 20px' }} key={index}>
                                        <StageCircle stage={stage} completed={isStageCompleted(stage)} text={stage} />
                                    </div>
                                ))}
                            </div>
                        </div>}
                        {Order.status.ar === "تم التسليم" ? (
                            <div style={{ marginTop: "3%" }}>
                                <Button onClick={BtnReOrder} variant='success'>{t("Orders.Reorder")}</Button>
                            </div>
                        ) : null}
                    </div>
                    : <Loading />
                }
            </div>
        </div>
    );
};

const StageCircle = ({ completed, text }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px' }}>
        <div style={{
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            backgroundColor: completed ? 'green' : 'white',
            border: "1px solid green",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}></div>
        <p>{text}</p>
    </div>
);

export default DetalisOrder;