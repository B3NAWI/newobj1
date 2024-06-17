import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Loading } from "../refreshPage/loading"
import img1 from "../file/20200917-1600348395146-original.jpg"
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import Cookies from "universal-cookie";


function GetCategoryMarket() {
    const [dataa, setDataa] = useState()
    const { t ,i18n} = useTranslation();
    const cookie = new Cookies()

    const lng = cookie.get("i18next") || "en"

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetCategoryMarket`,
        )
            .then((doc) => setDataa(doc.data))
            .catch((err) => console.log("err Get :", err))
    }, [lng])

    console.log(dataa)
    const data = dataa?.map((item) => ({
        _id: item._id,
        name: (i18n.language === 'ar' ? item.name.ar : item.name.he),
        file: item.file
    })) || [];
    return (<>
        <div id="allPage" style={{ paddingTop: "0", paddingBottom: '0' }}>
            <div id="Page" style={{ width: "100%", margin: '0', padding: "0", borderRadius: "0" }}>
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
                    </Form>
                </div>
                {dataa ? <>
                    <div style={{ borderTop: "soled 1px black", margin: "40px 0" }}>
                        <div id="PageUlCategory">
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
                    </div>
                </> : <Loading />}
            </div>
        </div >
    </>)
}

export default GetCategoryMarket