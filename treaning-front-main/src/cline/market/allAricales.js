import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import "./Articales.css"
import { Loading } from "../../refreshPage/loading"
import { Accordion, Button, Form, Nav } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import { MdPriceChange } from "react-icons/md";
import { MdAddShoppingCart } from "react-icons/md";
import { useShoppingCart } from "../../context/shoppingCartContext"
import PaginatedItems from "../../components/pagination"
import { useTranslation } from "react-i18next";

function AllArticales() {

    const { t, i18n } = useTranslation();
    let params = useParams()
    const nav = useNavigate()
    const [hoveredItem, setHoveredItem] = useState(null);

    const [search, setSearch] = useState("")
    const [priceCategory, setPriceCategory] = useState("")

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const start = (page - 1) * limit
    const end = Number(start) + Number(limit)
    // const final = dataa && dataa.slice(start, end)

    const [filterData, setFilterData] = useState()
    const dataSaerch = { saerch: search, category: params.category, priceCategory: priceCategory, page, limit }
    async function getSearchData() {
        await axios.post(`${process.env.REACT_APP_API_URL}/clineArticales/SearchProduct`, dataSaerch)
            .then((doc) => { setFilterData(doc.data) })
    }
    // useEffect(() => {
    //     const debounce = setTimeout(() => {
    //         getSearchData()
    //     }, 800)
    //     return () => clearTimeout(debounce)
    // }, [search, priceCategory,dataSaerch])
    useEffect(() => {
        const debounce = setTimeout(() => {
            getSearchData()
            console.log("asd")
        }, 800)
        return () => clearTimeout(debounce)
    }, [ search])

    const buttonProduct = (item) => {
        nav(`/cline/Articales/getArticale/${item._id}`, { state: { item } })
    }



    console.log(1)
    const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity } = useShoppingCart()
    console.log(filterData)
    const data = filterData?.movies?.map((Product) => ({
        _id: Product._id,
        title: i18n.language == "ar" ? Product.title.ar : Product.title.he,
        name: i18n.language == "ar" ? Product.name.ar : Product.name.he,
        information: i18n.language == "ar" ? Product.information.ar : Product.information.he,
        price: Product.price,
        file: Product.file,
        number: Product.number
    })) || [];

    return (<>
        <div style={{ minHeight: "100vh", marginTop: "35px", display: "flex", backgroundColor: "rgb(235, 235, 235)" }}>
            <Nav style={{ minHeight: "80vh", width: "15%", borderRight: "solid 1px rgb(219, 218, 218)", margin: "0", backgroundColor: "white" }}>
                <Accordion style={{ width: "15%", position: "fixed" }} alwaysOpen >
                    <Accordion.Item className="asdasd" eventKey="0" style={{ width: "99%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}>  <span style={{ flexGrow: 1, textAlign: "start"}}>{<MdPriceChange style={{ marginRight: "5px", fontSize: "18px" }} />}{t("Price")}</span>   </Accordion.Header>
                        <Accordion.Body>
                            <form onChange={(e) => setPriceCategory(e.target.value)}>
                                <input type="radio" id="All" name="Role" style={{ width: "20%" }} defaultChecked />
                                <label for={"All"} style={{ width: "80%" }}>{t("All")}</label>
                                <input type="radio" id="1Price" name="Role" value="0-199" style={{ width: "20%" }} />
                                <label for={"1Price"} style={{ width: "80%" }}>0 - 199</label>
                                <input type="radio" id="2Price" name="Role" value="200-499" style={{ width: "20%" }} />
                                <label for={"2Price"} style={{ width: "80%" }}>200 - 499</label>
                                <input type="radio" id="3Price" name="Role" value="500-999" style={{ width: "20%" }} />
                                <label for={"3Price"} style={{ width: "80%" }}>500 - 999</label>
                                <input type="radio" id="4Price" name="Role" value="1000" style={{ width: "20%" }} />
                                <label for={"4Price"} style={{ width: "80%" }}> {t("more than")} 1000</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Nav>
            <div style={{ width: "85%" }}>
                <div style={{ width: "96%", backgroundColor: "white", margin: "10px 2%", borderRadius: "5px", border: "solid 1px rgb(219, 218, 218)", boxShadow: " 5px 0 5px 0 rgb(219, 218, 218)" }}>
                    <div className="d-flex" style={{ width: "50%", marginLeft: "25%", marginRight: "25%" }}>
                        <Form.Control
                            type="search"
                            placeholder={t("Search")}
                            className="me-1 "
                            aria-label="Search"
                            value={search}
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.678)", height: "35px", margin: "3px 0 " }}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IoSearchSharp style={{ fontSize: "30px", marginTop: "7px" }} />
                    </div>
                </div>
                <div style={{ minHeight: "85vh", backgroundColor: "white", width: '96%', margin: "0 2% 1px 2%", borderRadius: "5px", border: "solid 1px rgb(219, 218, 218)", boxShadow: " 5px 0 5px 0 rgb(219, 218, 218)", marginBottom: "1%" }}>
                    <div id="PageUlProduct"  >
                        {data.map((item, index) =>
                            <div class="card" style={{ width: "170px", margin: "1%", border: "none", backgroundColor: "rgb(248, 248, 248)", borderRadius: "10px", maxHeight: "250px" }}>
                                <button style={{ border: "none", backgroundColor: "rgb(248, 248, 248)" }} onClick={() => buttonProduct(item)}>
                                    <img src={`${process.env.REACT_APP_API_URL}/files/${item.file[0]}`} class="card-img-top" style={{ maxHeight: "200px" }} />
                                    <div class="card-body" style={{ textAlign: "center", paddingBottom: "0" }}>
                                        <h5 class="card-title" style={{ textAlign: "end" }}>{item.price} $</h5>
                                        <p class="card-text">{item.title}</p>
                                    </div>
                                </button>
                                {getItemQuantity(item._id) == 0 ?
                                    <div class="col-12" style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
                                        <Button variant="outline-success" title={t("Add to cart")} style={{ padding: "0 15px" }} onClick={() => increaseCartQuantity(item)} >{<MdAddShoppingCart style={{ fontSize: "20px" }} />}</Button>
                                    </div>
                                    :
                                    <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px", marginTop: "auto" }} >
                                        {<Button variant="outline-success" onClick={() => decreaseCartQuantity(item)} style={{ paddingBottom: "0", paddingTop: "0" }}>-</Button>}
                                        <div style={{ fontSize: '13px', color: 'rgb(117 140 153)', display: "flex", gap: "5px", alignItems: "baseline" }}> <div style={{ color: "black", fontSize: '20px', fontWeight: '500' }}>{getItemQuantity(item._id)}</div> {t("in Cart")}</div>
                                        {<Button variant="outline-success" onClick={() => increaseCartQuantity(item)} style={{ paddingBottom: "0", paddingTop: "0" }}>+</Button>}
                                    </div>}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: "flex-start", marginRight: "2%", alignItems: 'baseline' }}>
                        <Form.Select style={{ width: "80px" }} onChange={(e) => setLimit(e.target.value)}>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                        </Form.Select>
                        <PaginatedItems total={filterData && filterData.total} itemsPerPage={limit} setPage={setPage} />
                    </div>
                </div>
            </div>
        </div>
    </>)


}


export default AllArticales