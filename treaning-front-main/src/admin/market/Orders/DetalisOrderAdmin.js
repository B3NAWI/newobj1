import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../refreshPage/loading';
import axios from 'axios';
import { useTranslation, initReactI18next } from "react-i18next";
import { Button } from 'react-bootstrap';


const DetalisOrderAdmin = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState()
    let params = useParams()
    // const [currentStage, setCurrentStage] = useState(Stages.NEW);
    console.log('params :', params);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetOrder/${params.id}`)
            .then((doc) => {
                console.log('Data received:', doc.data);
                setData(doc.data);
            })
            .catch((err) => console.log("err get : ", err))
    }, [params.id])

    const Stages = {
        NEW: i18n.language === "ar" ? "جديد" : "חָדָשׁ",
        WATCHED: i18n.language === "ar" ? "تم المشاهدة" : "צפה",
        IN_PREPARATION: i18n.language === "ar" ? "قيد التجهيز" : "בהכנה",
        IN_THE_WAY: i18n.language === "ar" ? "في الطريق" : "בדרך",
        RECEIVED: i18n.language === "ar" ? "تم التسليم" : "קיבלו"
    };

    const stagesArray = [
        Stages.NEW,
        Stages.WATCHED,
        Stages.IN_PREPARATION,
        Stages.IN_THE_WAY,
        Stages.RECEIVED
    ];

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isStageCompleted = (stage) => {
        const currentIndex = stagesArray.indexOf(i18n.language === "ar" ? data?.status.ar : data?.status.he);
        const stageIndex = stagesArray.indexOf(stage);
        return stageIndex <= currentIndex;
    };
    const nextStageIndex = stagesArray.indexOf(data && i18n.language === "ar" ? data?.status.ar : data?.status.he) + 1;

    const BtnDropdownButton = async (status, id) => {
        const LStatus = JSON.parse(status);
        await axios.patch(`${process.env.REACT_APP_API_URL}/clineArticales/patchorder`, { LStatus, id })
            .then((doc) => window.location.replace(`/admin/market/orders/DetalisOrderAdmin/${doc.data._id}`))
            .catch((err) => console.log("err Patch : ", err))
    }

    const orderStatus = () => {
        if (data.status.ar === "جديد") {
            return <span style={{ color: "red" }}>{t("Orders.Status.ok")}</span>;
        } else if (data.status.ar === "تم المشاهدة") {
            return <span style={{ color: "red" }}>{t("Orders.Status.ok")}</span>;
        } else if (data.status.ar === "قيد التجهيز") {
            return <span style={{ color: "red" }}>{t("Orders.Status.in preparation")}</span>;
        } else if (data.status.ar === "في الطريق") {
            return <span style={{ color: "red" }}>{t("Orders.Status.in the way")}</span>;
        } else if (data.status.ar === "تم التسليم") {
            return <span style={{ color: "green" }}>{t("Orders.Status.received")}</span>;
        }
    };

    const dataCart = data?.cart?.map((i) => ({
        _id: i._id,
        name: i18n.language === "ar" ? i.name.ar : i.name.he,
        quantity: i.quantity,
        price: i.price
    }))

    return (<>
        <div id="allPage">
            <div id="Page" style={{ width: isMobile ? "95%" : "60%", marginLeft: isMobile ? "2.5%" : "20%", marginRight: isMobile ? "2.5%" : "20%" }}>
                {data ?
                    <div style={{ marginTop: "30px", border: "10px", width: "90%" }}>
                        <div style={{ display: "flex", justifyContent: "space-around", textAlign: "start", paddingBottom: "2%" }}>
                            <div>
                                <div>{t("Name")} : {data.UserDetails.name}</div>
                                <div>{t("Orders.Orderdetails.Order Id")} : {data._id}</div>
                            </div>
                            <div>
                                <div>{t("CreateUser.Phone")} :  {data.UserDetails.phone}</div>
                                <div>{t("Orders.Date Order")} : {data.DateOrder}</div>
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
                            <div >{t("Orders.Orderdetails.Total Price")} :   {data.totalPrice} {" $  "}</div>
                            <div >{t("Orders.Payment.Payment")} : {i18n.language == "ar" ? data.payment.ar : data.payment.he} {" "}</div>
                        </div>
                        <div style={{ borderTop: "1px solid #dbdada ", padding: " 2% 0 " }}>{t("Orders.Orderdetails.Receipt")} : {i18n.language == "ar" ? data.receipt.ar : data.receipt.a} {" "}</div>
                        <div style={{ borderTop: "1px solid #dbdada ", paddingTop: "2%" }}>
                            <div style={{ textAlign: "start", marginLeft: "20%", marginRight: "20%", paddingBottom: "2px" }}>{t("Orders.Orderdetails.Receipt Address")} :</div>
                            <div style={{ border: "1px solid ", borderRadius: "5px", width: isMobile ? "96%" : "60%", margin: isMobile ? "0 2%" : "0 20%", textAlign: "right", padding: "2%" }}>
                                <div >
                                    {data.receiptAddress.city} {" "},
                                    {data.receiptAddress.district} {" "}
                                </div>
                                <div>
                                    .{t("Orders.Orderdetails.Street")} {data.receiptAddress.street} {" "},
                                    {t("Orders.Orderdetails.Architecture")} {data.receiptAddress.architectureName} {" "},
                                    {t("Orders.Orderdetails.Floor")} {data.receiptAddress.floorNumber} {" "},
                                    {t("Orders.Orderdetails.Apartment")} {data.receiptAddress.apartmentNumber} {" "}
                                </div>
                            </div>
                        </div>
                        <div style={{ borderTop: "1px solid #dbdada ", marginTop: "3%", paddingTop: "1%", fontSize: "18px" }}>
                            {t("hedarAdmin.Status")} :
                            {/* {i18n.language == "ar" ? data.status.ar : data.status.he} */}
                            {orderStatus()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "3%" }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignItems: "flex-start" }}>
                                {stagesArray.map((stage) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: isMobile ? '0 3px' : '0 20px' }} key={stage}>
                                        <StageCircle stage={stage} completed={isStageCompleted(stage)} text={stage} />
                                    </div>
                                ))}
                            </div>
                            {nextStageIndex < stagesArray.length && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px', marginRight: isMobile ? null : "35px" }}>
                                    <Button variant='success' onClick={() => BtnDropdownButton(JSON.stringify({ ar: data.status.ar, he: data.status.he }), data._id)}>{t("Success")}</Button>
                                </div>
                            )}
                        </div>
                    </div>
                    : <Loading />
                }
            </div>
        </div>
    </>)
}


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
        }}>
        </div>
        <p>{text}</p>
    </div>
);

const StageLine = ({ completed }) => (
    <div style={{
        width: '50px',
        height: '2px',
        backgroundColor: completed ? 'green' : 'gray',
        margin: '5px 0'
    }}></div>
);

export default DetalisOrderAdmin;