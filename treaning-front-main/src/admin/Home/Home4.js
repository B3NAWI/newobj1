import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./HomeAdmin.css"
import { User } from "../../context/context"
import { Loading } from "../../refreshPage/loading"
import CloseButton from 'react-bootstrap/CloseButton';
import img1 from "../../file/20200917-1600348395146-original.jpg"
import Form from 'react-bootstrap/Form';
import { MsgModal } from "../../components/MsgComponent"
import { useTranslation } from "react-i18next";

function Home4admin() {
    const { t, i18n } = useTranslation();
    const [dataa, setDataa] = useState()

    const context = useContext(User)
    const token = context.auth.token

    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [show, setShow] = useState(false);
    const [itemId, setItemId] = useState();

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true)
        setItemId(id)
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/articales/GetCategoryMarket`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            })
            .then((doc) => setDataa(doc.data))
            .catch((err) => {
                console.log("err Get :", err)
            })
    }, [token])
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const shwfile = (id) => {
        axios.delete(`${process.env.REACT_APP_API_URL}/articales/DeleteCategoryMarket/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            }
        })
            .then(() => { setShow(false) })
            .then(() => { window.location.replace(`/admin/Home/Home4`) })
            .catch((err) => {
                console.log("err delet id : ", err)
            })
    }

    const data = dataa?.map((item) => ({
        _id: item._id,
        name: (i18n.language === 'ar' ? item.name.ar : item.name.he),
        file: item.file
    })) || [];

    return (
        <div id="allPage" style={{ paddingTop: '0', paddingBottom: "0" }}>
            {dataa ? <>
                <MsgModal show={show} handleClose={handleClose} opj={() => shwfile(itemId)} title={"رسالة تأكيد "} body={"هل حقا تريد حذف هذه الفئة؟ "} BtnState={"نعم متأكد"} />
                <div id="Page" style={{ borderTop: "soled 1px black", width: "100%", margin: '0', padding: "0", borderRadius: '0' }}>
                    <div
                        style={{
                            backgroundImage: `url(${img1})`,
                            backgroundSize: "100%",
                            width: "90%",
                            margin: "0 5%",
                            minHeight: "88vh",
                            display: "flex",
                            alignItems: "center",
                            backgroundPosition: "center",
                            marginTop: "20px"
                        }} >
                        <Form className="d-flex" style={{ width: "50%", marginLeft: "5%" }}>
                            <Form.Control
                                type="search"
                                placeholder={t("Search")}
                                className="me-2 "
                                aria-label="Search"
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.678)" }}
                            />
                            {/* <button type="submit" class="btn btn-primary" >Search</button> */}
                        </Form>
                    </div>
                    <div id="PageUlCategory" style={{ marginTop: "40px", zIndex: "1" }}>
                        {data.map((item) => (
                            <div
                                key={item._id}
                                className="card"
                                style={{ width: "200px", margin: "1%", border: "none", position: "relative" }}
                                onMouseEnter={() => setHoveredItemId(item._id)}
                                onMouseLeave={() => setHoveredItemId(null)}
                            >
                                {isMobile ? (
                                    <CloseButton
                                        style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}
                                        onClick={() => handleShow(item._id)}
                                    />
                                ) : hoveredItemId === item._id && (
                                    <CloseButton
                                        style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}
                                        onClick={() => handleShow(item._id)}
                                    />
                                )}
                                <Link to={`/admin/Home/Home4/${item.name}`}>
                                    <div>
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}/files/${item.file[0]}`}
                                            className="card-img-top"
                                            style={{ maxHeight: "300px", borderRadius: "10px" }}
                                            alt="item image"
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ textAlign: "center" }}>
                                                {item.name}
                                            </h5>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </> : <Loading />}

        </div >
    )
}

export default Home4admin