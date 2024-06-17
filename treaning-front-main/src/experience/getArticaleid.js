import { useEffect, useState } from "react";
import { Loading } from "../refreshPage/loading";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MdAddShoppingCart } from "react-icons/md";
import Toast from 'react-bootstrap/Toast';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useTranslation } from "react-i18next";
import { MsgToast } from "../components/MsgComponent";




function GetArticaleid() {
    const { t, i18n } = useTranslation();
    const [dataa, setDataa] = useState()
    const params = useParams()
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetArticale/${params.id}`)
            .then((doc) => { setDataa(doc.data) })
            .catch((err) => { console.log("err get : ", err) });
    }, []);
    const [show, setShow] = useState(false);

    const btnAddToCart = () => {
        setShow(true)
    }

    return (<>
        <body style={{ margin: "1%", marginTop: "50px", }}>
            <div style={{ maxWidth: "750px", margin: "2%", border: "solid 1px  rgb(139, 158, 152)", padding: "1%", borderRadius: "5px", minHeight: "500px" }}>
                {dataa ?
                    <div>
                        <div id="carouselExampleCaptions" class="carousel slide">
                            <div class="carousel-indicators">
                                {dataa.file && dataa.file.map((item, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        data-bs-target="#carouselExampleCaptions"
                                        data-bs-slide-to={index}
                                        className={index === 0 ? "active" : ""}
                                        aria-current={index === 0 ? "true" : "false"}
                                        aria-label={`Slide ${index + 1}`}
                                    ></button>
                                ))}
                            </div>

                            <div class="carousel-inner">
                                {dataa.file && dataa.file.map((item, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                        <img src={`${process.env.REACT_APP_API_URL}/files/${item}`} className="d-block w-100" alt={`Slide ${index + 1}`} />
                                        <div className="carousel-caption d-none d-md-block">
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                        <div>
                            <li id="liUserId" ><div>• {t("ProductId.name")} : </div>  {i18n.language == "ar" ? dataa.name.ar : dataa.name.he}</li>
                            <li id="liUserId"><div>• {t("ProductId.title")} : </div>  {i18n.language == "ar" ? dataa.title.ar :dataa.title.he}</li>
                            <li id="liUserId"><div>• {t("ProductId.information")} : </div> {i18n.language == "ar" ? dataa.information.ar : dataa.information.he}</li>
                            <li id="liUserId"><div>• {t("Price")} : </div> {dataa.price} <div> $ </div></li>
                            <li id="liUserId"><div>• {t("ProductId.Existing quantity")} : </div> {dataa.number}</li>
                        </div>
                        <div class="col-12" style={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="success" onClick={btnAddToCart} >{<MdAddShoppingCart style={{ fontSize: "20px" }} />}{t("Add to cart")}</Button>
                        </div>
                    </div>
                    : <Loading />
                }
            </div>
            <ToastContainer >
                <MsgToast setShow={setShow} body={t("You are not registered, please log in and shop immediately")} show={show} title={t("You are not registered")} type={"danger"} />
            </ToastContainer >
        </body>
    </>)
}

export default GetArticaleid