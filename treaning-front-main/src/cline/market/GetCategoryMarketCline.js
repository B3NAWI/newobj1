import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Loading } from "../../refreshPage/loading"
import img1 from "../../file/20200917-1600348395146-original.jpg"
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";


function GetCategoryMarketCline() {

    const { t, i18n } = useTranslation();
    const [dataa, setDataa] = useState()
    const [dataOffer, setDataOffer] = useState()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetCategoryMarket`)
            .then((doc) => setDataa(doc.data))
            .catch((err) => console.log("err Get :", err))

        axios.get(`${process.env.REACT_APP_API_URL}/clineArticales/GetAnOffer`)
            .then((doc) => setDataOffer(doc.data))
            .catch((err) => console.log("err Get :", err))
    }, [])

    const data = dataa?.map((item) => ({
        _id: item._id,
        name: (i18n.language === 'ar' ? item.name.ar : item.name.he),
        file: item.file
    })) || [];

    return (
        <div id="allPage" style={{ padding: "0" }}>
            <div id="Page" style={{ width: "100%", margin: "0", borderRadius: "0" }}>
                {dataa ? <>
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
                    <div style={{ borderTop: "soled 1px black", marginTop: "50px", minHeight: "88vh" }}>
                        <div id="PageUlCategory">
                            {data.map((item) =>
                                <div class="card" style={{ width: "200px", margin: "1%", border: "none" }}>
                                    <Link to={`/cline/Articales/getArticales/${item.name}`}>
                                        <div >
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/files/${item.file[0]}`}
                                                class="card-img-top"
                                                style={{ maxHeight: "200px", borderRadius: "10px" }}
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
    )
}


export default GetCategoryMarketCline