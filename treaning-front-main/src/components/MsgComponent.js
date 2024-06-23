import React, { useContext, useEffect, useState } from 'react';
import { useTranslation, initReactI18next } from "react-i18next";
import { Button, Col, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { Loading } from '../refreshPage/loading';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { MdAddShoppingCart } from "react-icons/md";
import { User } from '../context/context';
import { useShoppingCart } from '../context/shoppingCartContext';


const MsgToast = ({ setShow, show, type, title, body }) => {
    return (<>
        <Col xs={6} style={{ position: "fixed", top: "50px", left: "10px" }}>
            <Toast bg={type.toLowerCase()} onClose={() => setShow(false)} show={show} delay={4000} autohide>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto"> {title}</strong>
                    <small></small>
                </Toast.Header>
                <Toast.Body style={{ color: "white" }}> {body}</Toast.Body>
            </Toast>
        </Col>
    </>)
}

const MsgModal = ({ handleClose, opj, show, title, body, BtnState }) => {
    // const [status, setStatus] = useState("نعم ,متأكد")
    const { t } = useTranslation();

    return (<>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body> {body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t("Close")}
                </Button>
                <Button variant="success" onClick={opj}>
                    {BtnState}
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

const ModalProduct = ({ handleClose, show, dataa, role }) => {
    const { t } = useTranslation();
    const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart()
    const quantity = getItemQuantity(dataa?._id)


    const context = useContext(User)
    const token = context.auth.token
    const nav = useNavigate()
    const [showMsg, setShowMsg] = useState(false);

    const btnAddToCart = () => {
        setShowMsg(true)
    }
    const btndelete = async function deletee() {
        await axios.delete(`${process.env.REACT_APP_API_URL}/articales/DeleteArticale/${dataa._id}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            }
        })
            .then(() => {
                nav("/admin/Home/Home4")
            })
            .catch((err) => console.log("err delete : ", err))
    }

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const btnUpDateArticale = () => {
        nav(`/admin/market/UpDateArticale/${dataa._id}`, { state: { dataa } })
    }

    return (<>
        <Modal size="xl" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                {dataa ?
                    <div>
                        <div style={{ width: "100%", display: isMobile ? null : "flex" }}>
                            <div id="carouselExampleCaptions" style={{ width: isMobile ? "100%" : "50%" }} class="carousel slide">
                                <div class="carousel-indicators">
                                    {dataa.file && dataa.file.map((item, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            data-bs-target="#carouselExampleCaptions"
                                            data-bs-slide-to={index}
                                            style={{ backgroundColor: "#198754" }}
                                            className={index === 0 ? "active" : ""}
                                            aria-current={index === 0 ? "true" : "false"}
                                            aria-label={`Slide ${index + 1}`}
                                        ></button>
                                    ))}
                                </div>

                                <div class="carousel-inner">
                                    {dataa.file && dataa.file.map((item, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                            <img src={`${process.env.REACT_APP_API_URL}/files/${item}`} style={{ width: "100%", maxWidth: "500px" }} className="d-block w-100" alt={`Slide ${index + 1}`} />
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
                            <div style={{ width: "50%", display: 'flex', flexDirection: "column", justifyContent: "center", marginRight: "5%" }} className="liUserDetalse">
                                <li id="liUserId" style={{ fontSize: "30px" }}> {dataa.title}</li>
                                <li id="liUserId" style={{ fontSize: "25px" }}> {dataa.price} <div style={{ fontSize: "25px" }}> $ </div></li>
                            </div>
                        </div>
                        <div style={{ borderTop: " 1px  solid #e1e1e1", margin: "2% 0" }}>
                            <li id="liUserId" style={{ fontSize: "30px" }}><div style={{ fontSize: "25px" }}> {t("ProductId.information")} : </div> {dataa.information}</li>
                        </div>
                    </div>
                    : <Loading />
                }
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: "center" }}>
                {role == "admin" ?
                    <>
                        <button type="submit" style={{ margin: "0 2%" }} class="btn btn-success" onClick={btnUpDateArticale}> {t("ProductId.Up Date Product")}</button>
                        <button type="submit" style={{ margin: "0 2%" }} class="btn btn-danger" onClick={btndelete}> {t("ProductId.Delete Product")}</button>
                    </>
                    :
                    role == "visitor" ?
                        <Button variant="success" onClick={btnAddToCart} >{<MdAddShoppingCart style={{ fontSize: "20px" }} />}{t("Add to cart")}</Button>
                        :
                        <div class="col-12" style={{ display: "flex", justifyContent: "center" }}>
                            {quantity === 0 ? (
                                <button style={{ height: "fit-content" }} class="btn btn-success" onClick={() => increaseCartQuantity(dataa)} >{<MdAddShoppingCart style={{ fontSize: "20px" }} />}{t("Add to cart")}</button>)
                                :
                                (<div className="d-flex align-items-center flex-column" >
                                    <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px" }}>
                                        <button class="btn btn-success" onClick={() => decreaseCartQuantity(dataa)}>-</button>
                                        <span className="fs-3" style={{ width: "130px" }}> {quantity} {t("in Cart")}</span>
                                        <button class="btn btn-success" onClick={() => increaseCartQuantity(dataa)}>+</button>
                                    </div>
                                    <button class="btn btn-danger" onClick={() => removeFromCart(dataa._id)}>{t("ProductId.Remove")}</button>
                                </div>)}
                        </div>
                }
                <Button variant="secondary" onClick={handleClose}>
                    {t("Close")}
                </Button>
            </Modal.Footer>
        </Modal>
        <ToastContainer >
            <MsgToast setShow={setShowMsg} body={t("You are not registered, please log in and shop immediately")} show={showMsg} title={t("You are not registered")} type={"danger"} />
        </ToastContainer >
    </>)
}


export { MsgToast, MsgModal, ModalProduct } 