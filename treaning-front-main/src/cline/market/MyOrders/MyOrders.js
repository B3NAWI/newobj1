import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../refreshPage/loading';
import { TbListDetails } from 'react-icons/tb';
import { MdOutlineRestartAlt } from "react-icons/md";
import { Button, Form } from 'react-bootstrap';
import { useShoppingCart } from '../../../context/shoppingCartContext';
import { useTranslation } from "react-i18next";
import PaginatedItems from '../../../components/pagination';


const MyOrders = () => {
    const { t, i18n } = useTranslation();
    const { reorderCartQuantity } = useShoppingCart()
    let params = useParams()
    const nav = useNavigate()

    const [dataa, setDataa] = useState()

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const start = (page - 1) * limit
    const end = Number(start) + Number(limit)
    // const final = dataa && dataa.slice(start, end)

    console.log(dataa && dataa)
    const postData = { page, limit }
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetOrders/${params.UserId}`, { params: postData })
            .then((doc) => setDataa(doc.data))
            .catch((err) => console.log(err))
    }, [page, limit])

    const BtnDetalisOrder = (Order) => {
        nav(`/cline/Articales/MyOrders/DetalisOrder/${Order._id}`, { state: { Order } })
    }

    const BtnReOrder = async (item) => {
        console.log(item.cart)
        console.log(item)
        await item.cart.map((i) => reorderCartQuantity({ data: i, id: i._id, NumQuantity: i.quantity }))
        nav("/cline/Articales/FinishMarket")
    }

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
    // const orderStatusش = () => {
    //     if (Order.status.ar === "جديد") {
    //         return <span style={{ color: "red" }}>{t("Orders.Status.ok")}</span>;
    //     } else if (Order.status.ar === "تم المشاهدة") {
    //         return <span style={{ color: "red" }}>{t("Orders.Status.ok")}</span>;
    //     } else if (Order.status.ar === "قيد التجهيز") {
    //         return <span style={{ color: "red" }}>{t("Orders.Status.in preparation")}</span>;
    //     } else if (Order.status.ar === "في الطريق") {
    //         return <span style={{ color: "red" }}>{t("Orders.Status.in the way")}</span>;
    //     } else if (Order.status.ar === "تم التسليم") {
    //         return <span style={{ color: "green" }}>{t("Orders.Status.received")}</span>;
    //     }
    // };

    return (<>
        <div id="allPage">
            <div id="Page" style={{ alignItems: "stretch" , paddingBottom:"0" }}>
                {dataa ?
                    <div style={{ padding: "0", margin: "3% 0 0 0" }}>
                        <table class="table  table-hover table-light " style={{ fontSize: "15px", backgroundColor: "white", borderRadius: "5px", boxShadow: "2px 2px 5px 0 rgb(219, 218, 218)", textAlign: "start" }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{t("Orders.Orderdetails.item")}</th>
                                    <th>{t("Orders.Orderdetails.Total Price")}</th>
                                    <th>{t("Orders.Date Order")}</th>
                                    <th>{t("hedarAdmin.Status")}</th>
                                    <th >{<TbListDetails />}</th>
                                </tr>
                            </thead>
                            {dataa.doc.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (<>
                                <tbody style={{ padding: "0", width: "100%" }} className="table table-hover table-light">
                                    <tr key={index} style={{ padding: "0", width: "100%" }}>
                                        <td >{index + 1}</td>
                                        <td >{item.cart.map((i) => (<>{i18n.language === "ar" ? i.name.ar : i.name.he} ,</>))}</td>
                                        <td >{item.totalPrice} $</td>
                                        <td >{item.DateOrder}</td>
                                        <td >{orderStatus(item)} </td>
                                        <td style={{ display: "table-cell", padding: "0 1% 0 1%", width: "20%" }} >
                                            <div style={{ display: "flex", alignItems: "end", padding: "0", alignItems: "center" }}>
                                                <div className="btnMyOrders" style={{ paddingLeft: "0", padding: "0", width: "20%" }}>
                                                    <Button
                                                        onClick={() => BtnReOrder(item)}
                                                        title={t("Orders.Reorder")}
                                                        style={{ border: "none", padding: "0", transition: "none", backgroundColor: "initial", color: "red", fontSize: "30px" }}
                                                    >
                                                        <MdOutlineRestartAlt />
                                                    </Button>
                                                </div>
                                                <div style={{ width: "80%", padding: "3px 0" }}>
                                                    <Button
                                                        variant='success'
                                                        onClick={() => BtnDetalisOrder(item)}
                                                        style={{ width: "100%" }}
                                                    >
                                                        {t("Orders.Order details")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </>))
                            }
                        </table >
                        <div style={{ display: 'flex', justifyContent: "flex-end", marginRight: "2%", alignItems: 'baseline' }}>
                            <Form.Select style={{ width: "80px" }} onChange={(e) => setLimit(e.target.value)}>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </Form.Select>
                            <PaginatedItems total={dataa.total} itemsPerPage={limit} setPage={setPage} />
                        </div>
                    </div>
                    : <Loading />}
            </div>
        </div>
    </>)
}

export default MyOrders;