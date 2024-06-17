import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Loading } from "../refreshPage/loading"
import Cookies from "universal-cookie";
import { Accordion, Button, Form, Nav, Toast, ToastContainer } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import { MdAddShoppingCart } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { MdPriceChange } from "react-icons/md";
import { MsgToast } from "../components/MsgComponent";


function Market() {
    const { t, i18n } = useTranslation();

    let params = useParams()
    const cookie = new Cookies()

    useEffect(() => {
        cookie.remove("bearer")
        cookie.remove("refreshToken")
        cookie.remove("userDetals")
    })

    const [search, setSearch] = useState("")
    const [priceCategory, setPriceCategory] = useState("")
    console.log(priceCategory)
    const [filterData, setFilterData] = useState()
    const dataSaerch = { saerch: search, category: params.category, priceCategory: priceCategory }
    async function getSearchData() {
        await axios.post(`${process.env.REACT_APP_API_URL}/clineArticales/SearchProduct`, dataSaerch)
            .then((doc) => { setFilterData(doc.data.movies) })
        // console.log(filterData)
    }
    useEffect(() => {
        const debounce = setTimeout(() => {
            getSearchData()
        }, 800)
        return () => clearTimeout(debounce)
    }, [search, priceCategory])
    const [show, setShow] = useState(false);

    const btnAddToCart = () => {
        setShow(true)
    }
    console.log(filterData)

    // const data = filterData?.map((i) => ({
    //     _id: i._id,
    //     name: i18n.language == "ar" ? i.name.ar : i.name.he,
    //     price: i.price,
    //     title: i18n.language == "ar" ? i.title.ar : i.title.he,
    //     file:i.file,
    // }))
    return (<>
        <div style={{ display: "flex", marginTop: "35px", backgroundColor: "rgb(235, 235, 235)", minHeight: "100vh" }}>
            <Nav style={{ minHeight: "100vh", width: "15%", borderRight: "solid 1px rgb(219, 218, 218)", margin: "0", backgroundColor: "white" }}>
                <Accordion style={{ width: "15%", position: "fixed" }} alwaysOpen >
                    {/* <div style={{ width: "99%", fontSize: "25px", height: "40px", borderBottom: "1px solid ", textAlign: "center" }}>Filter</div> */}
                    <Accordion.Item eventKey="0" style={{ width: "99%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}>{<MdPriceChange style={{ marginRight: "5px", fontSize: "18px" }} />}  {t("Price")}  </Accordion.Header>
                        <Accordion.Body>
                            <form onChange={(e) => setPriceCategory(e.target.value)}>
                                <input type="radio" id="All" name="Role" style={{ width: "20%" }} defaultChecked />
                                <label for={"All"} style={{ width: "80%" }}>{t("All")}</label>
                                <input type="radio" id="0-199" name="Role" value="0-199" style={{ width: "20%" }} />
                                <label for={"0-199"} style={{ width: "80%" }}>0 - 199</label>
                                <input type="radio" id="200-499" name="Role" value="200-499" style={{ width: "20%" }} />
                                <label for={"200-499"} style={{ width: "80%" }}>200 - 499</label>
                                <input type="radio" id="500-999" name="Role" value="500-999" style={{ width: "20%" }} />
                                <label for={"500-999"} style={{ width: "80%" }}>500 - 999</label>
                                <input type="radio" id="1000" name="Role" value="1000" style={{ width: "20%" }} />
                                <label for={"1000"} style={{ width: "80%" }}> {t("more than")} 1000</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Nav>
            <div style={{ width: "85%" }}>
                <div style={{
                    width: "96%", backgroundColor: "white", margin: "10px 2%", borderRadius: "5px", border: "solid 1px rgb(219, 218, 218)", boxShadow: " 5px 0 5px 0 rgb(219, 218, 218)",
                    // position: "sticky",
                    // top: "37px",
                    // zIndex: "3"
                }}>
                    <div className="d-flex" style={{ width: "50%", marginLeft: "25%", marginRight: "25%" }}>
                        <Form.Control
                            type="search"
                            placeholder={t("Search")}
                            className="me-1 "
                            aria-label="Search"
                            value={search}
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.678)", height: "35px", margin: "3px 0" }}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IoSearchSharp style={{ fontSize: "30px", marginTop: "8px" }} />
                    </div>
                </div>
                <div style={{ backgroundColor: "white", width: '96%', margin: "0 2% 1% 2%", borderRadius: "5px", border: "solid 1px rgb(219, 218, 218)", boxShadow: " 5px 5px 5px 0 rgb(219, 218, 218)", minHeight: "85vh" }}>
                    <div id="PageUlProduct">
                        {filterData&&filterData.map((item) =>
                            <div class="card" style={{ width: "170px", margin: "1%", border: "none", backgroundColor: "rgb(248, 248, 248)", borderRadius: "10px", maxHeight: "240px" }}>
                                <Link to={`/GetArticaleid/${item._id}`} style={{ margin: "1%" }} >
                                    <img src={`${process.env.REACT_APP_API_URL}/files/${item.file[0]}`} class="card-img-top" style={{ maxHeight: "300px" }} />
                                    <div class="card-body" style={{ textAlign: "center" }}>
                                        <h5 class="card-title" style={{ textAlign: "end" }}>{item.price} $</h5>
                                        <p class="card-text">{i18n.language == "ar" ?  item.title.ar : item.title.he}</p>
                                    </div>
                                </Link>
                                {/* <div class="col-12" style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
                                    <Button variant="outline-primary" title="اضافة الى السلة" style={{ padding: "0 15px" }} onClick={btnAddToCart} >{<MdAddShoppingCart style={{ fontSize: "20px" }} />}  </Button>
                                </div> */}
                                <div class="col-12" style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
                                    <Button variant="outline-success" title={t("Add to cart")} style={{ padding: "0 15px" }} onClick={btnAddToCart} >{<MdAddShoppingCart style={{ fontSize: "20px" }} />}  </Button>
                                </div>
                            </div>
                        )
                            }
                    </div>
                </div>
            </div>
            <ToastContainer >
                <MsgToast setShow={setShow} body={t("You are not registered, please log in and shop immediately")} show={show} title={t("You are not registered")} type={"danger"} />
            </ToastContainer >
        </div>
    </>)
}

export default Market