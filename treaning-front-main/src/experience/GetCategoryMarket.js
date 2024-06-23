import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loading } from "../refreshPage/loading"
import img1 from "../file/555.png"
import Form from 'react-bootstrap/Form';
import { IoSearchSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Cookies from "universal-cookie";
import { Button, InputGroup, Offcanvas, Stack } from "react-bootstrap"
import CartItem from "../cline/market/CartItem"
import { useShoppingCart } from "../context/shoppingCartContext"


function GetCategoryMarket() {
    const [dataa, setDataa] = useState()
    const { t, i18n } = useTranslation();
    const cookie = new Cookies()
    const [images, setImages] = useState()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    const lng = cookie.get("i18next") || "ar"

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetCategoryMarket`)
            .then((doc) => setDataa(doc.data))
            .catch((err) => console.log("err Get :", err))
    }, [lng])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetAnOffer`)
            .then((doc) => setImages(doc.data))
            .catch((err) => console.log("err : ", err))
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [currentSetIndex, setCurrentSetIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSetIndex(prevIndex => (prevIndex + 2) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images && images.length, currentSetIndex])

    const handleNext = () => {
        setCurrentSetIndex(prevIndex => (prevIndex + 2) % images.length);
    };

    const handlePrev = () => {
        setCurrentSetIndex(prevIndex => (prevIndex - 2 + images.length) % images.length);
    };

    const data = dataa?.map((item) => ({
        _id: item._id,
        name: (i18n.language === 'ar' ? item.name.ar : item.name.he),
        file: item.file
    })) || [];

    const { cartItems, closeCart, cartQuantity } = useShoppingCart()
    const [dataaCart, setDataaCart] = useState()
    const nav = useNavigate()
    useEffect(() => {
        belal()
    }, [])
    const belal = (() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetArticales`)
            .then((doc) => setDataaCart(doc.data))
            .catch((err) => console.log("err Get : ", err))
    })
    const btnFinishMarket = () => {
        nav("/cline/Articales/FinishMarket")
        closeCart()
    }

    return (<>
        <div id="allPage" style={{ width: "100%", padding: "0", display: "flex", flexDirection: "row" }}>
            <div style={{ width: "300px", minHeight: "100vh", position: "sticky" }}>
                <div style={{position:"fixed"}}>
                    <Offcanvas.Header style={{ marginBottom:"auto" ,width: "300px" }}>
                        <Offcanvas.Title>{t("Cart")}</Offcanvas.Title>
                        <div className="ms-auto fw-bold fs-5" style={{ bottom: "50px", marginRight: "20%" }}>
                            {t("Total")}{" "}
                            {cartItems.reduce((total, cartitem) => {
                                const item = dataaCart && dataaCart.find((i) => i._id === cartitem.id)
                                return total + (item?.price || 0) * cartitem.quantity;
                            }, 0)} $
                        </div>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Stack >
                            {cartItems.map((item) =>
                                <CartItem key={item.id} {...item} />
                            )}
                        </Stack>
                    </Offcanvas.Body>
                    <div style={{ width: "90%", margin: "0 5%",bottom:"0" }}>
                        <Button variant="outline-success" style={{position:"fixed", width: "220px", bottom: "0" }} disabled={!cartQuantity} onClick={btnFinishMarket}>{t("Pay")}</Button>
                    </div>
                </div>

            </div>
            <div style={{ width: "80%" }}>
                <div style={{ width: "100%", minHeight: "100px", backgroundColor: "#ea004b", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <img src={`${img1}`} style={{ maxHeight: "70px", marginLeft: "50px" }}></img> </div>
                <div id="Page" style={{ borderTop: "soled 1px black", padding: "0", borderRadius: '0' }}>
                    <Form className="d-flex search-bar" style={{ width: isMobile ? "70%" : "80%" }}>
                        <InputGroup>
                            <InputGroup.Text style={{ backgroundColor: "white", borderLeft: "none", borderRadius: "0" }}>
                                <IoSearchSharp style={{ color: "#ea004b", fontSize: "20px" }} />
                            </InputGroup.Text>
                            <Form.Control
                                type="search"
                                placeholder={t("Search")}
                                aria-label="Search"
                                style={{ backgroundColor: "white", borderRadius: "0", borderRight: "none" }}
                            />
                        </InputGroup>
                    </Form>
                    {images &&
                        <div style={{ margin: " 50px 0", maxWidth: "1410px", display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', }}>
                            <button
                                onClick={handlePrev}
                                style={{
                                    position: 'absolute',
                                    left: '0px',
                                    background: 'none',
                                    border: '1px solid',
                                    height: "auto",
                                    padding: "5px 10px 5px 10px",
                                    fontSize: '1rem',
                                    backgroundColor: "#ea004b",
                                    color: 'white',
                                    borderRadius: "10px",
                                    cursor: 'pointer'
                                }}
                            >
                                &gt;
                            </button>
                            <div style={{ width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/files/${images[currentSetIndex].file[0]}`}
                                    alt="Advertisement 1"
                                    style={{
                                        maxWidth: '50%',
                                        maxHeight: '100%',
                                        minWidth: '50%',
                                        objectFit: 'cover',
                                        opacity: 1,
                                        transition: '1s',
                                        margin: '0 10px',
                                    }}
                                />
                                <img
                                    src={`${process.env.REACT_APP_API_URL}/files/${images[(currentSetIndex + 1) % images.length].file[0]}`}
                                    alt="Advertisement 2"
                                    style={{
                                        maxWidth: '50%',
                                        minWidth: '50%',
                                        maxHeight: '100%',
                                        objectFit: 'cover',
                                        opacity: 1,
                                        transition: '1s',
                                        margin: '0 10px',
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleNext}
                                style={{
                                    position: 'absolute',
                                    right: '0px',
                                    background: 'none',
                                    border: '1px solid',
                                    padding: "5px 10px 5px 10px",
                                    fontSize: '1rem',
                                    backgroundColor: "#ea004b",
                                    color: 'white',
                                    borderRadius: "10px",
                                    cursor: 'pointer'
                                }}
                            >
                                &lt;
                            </button>
                        </div>
                    }
                    {dataa ? <>
                        <h2 style={{ width: "80%", textAlign: "end" }}>All categories</h2>
                        <div id="PageUlCategory" style={isMobile ? { minHeight: "30vh" } : { marginTop: "40px", minHeight: "88vh" }}>
                            {data.map((item) =>
                                <div class="card" style={{ width: "200px", margin: "1%", border: "none" }}>
                                    <Link to={`/GetCategoryMarket/${item.name}`}>
                                        <div >
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/files/${item.file[0]}`}
                                                class="card-img-top"
                                                style={{ maxHeight: "300px" }}
                                                alt="item image"
                                            />
                                            <div class="card-body">
                                                <h5 class="card-title" style={{ textAlign: "center" }}>
                                                    {item.name}
                                                </h5>
                                            </div>
                                        </div>
                                    </Link>

                                </div>
                            )}
                        </div>
                        {/* </div> */}
                    </> : <Loading />}
                </div>
            </div>

        </div >
    </>)
}

export default GetCategoryMarket