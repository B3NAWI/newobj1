import React, { useContext, useEffect, useState } from 'react';
import { useTranslation, initReactI18next } from "react-i18next";
import { Button, Col, Modal, Toast } from 'react-bootstrap';
import { Loading } from '../refreshPage/loading';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../context/context';


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

const ModalProduct = ({ handleClose, show, dataa, body }) => {
    const context = useContext(User)
    const token = context.auth.token
    const params = useParams()
    const nav = useNavigate()

    const btndelete = async function deletee() {
        await axios.delete(`${process.env.REACT_APP_API_URL}/articales/DeleteArticale/${dataa._id}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            }
        })
            .then((doc) => {
                nav("/admin/Home/Home4")
            })
            .catch((err) => console.log("err delete : ", err))
    }

    const btnUpDateArticale = () => {
        nav(`/admin/market/UpDateArticale/${dataa._id}`, { state: { dataa } })
    }
    const { t } = useTranslation();

    return (<>
        <Modal size="xl" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                {dataa ?
                    <div>
                        <div style={{ width: "80%", display: "flex" }}>
                            <div id="carouselExampleCaptions" style={{ width: "50%" }} class="carousel slide">
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
                                            <img src={`${process.env.REACT_APP_API_URL}/files/${item}`} style={{ maxWidth: "500px", minWidth: "500px" }} className="d-block w-100" alt={`Slide ${index + 1}`} />
                                            <div className="carousel-caption d-none d-md-block">
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>

                                <button style={{ color: "#198754" }} className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
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
                <button type="submit" style={{ margin: "0 2%" }} class="btn btn-success" onClick={btnUpDateArticale}> {t("ProductId.Up Date Product")}</button>
                <button type="submit" style={{ margin: "0 2%" }} class="btn btn-danger" onClick={btndelete}> {t("ProductId.Delete Product")}</button>
                <Button variant="secondary" onClick={handleClose}>
                    {t("Close")}
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}


export { MsgToast, MsgModal, ModalProduct } 