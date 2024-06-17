import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Loading } from "../../refreshPage/loading"
import { MdPriceChange } from "react-icons/md";
import { Accordion, Form, Nav } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import PaginatedItems from "../../components/pagination";
import { useTranslation } from "react-i18next";

function CategoryArticale() {
    const { t ,i18n} = useTranslation();
    let params = useParams()

    const [search, setSearch] = useState("")
    const [priceCategory, setPriceCategory] = useState("")

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const start = (page - 1) * limit
    const end = Number(start) + Number(limit)
    // const final = dataa && dataa.slice(start, end)

    const [filterData, setFilterData] = useState()
    const dataSaerch = { search: search, category: params.category, priceCategory: priceCategory, page, limit }
    async function getSearchData() {
        await axios.post(`${process.env.REACT_APP_API_URL}/clineArticales/SearchProduct`, dataSaerch)
            .then((doc) => { setFilterData(doc.data) })
            .catch((err)=>console.log("err : " , err))
    }
    useEffect(() => {
        const debounce = setTimeout(() => {
            getSearchData()
        }, 800)
        return () => clearTimeout(debounce)
    }, [search, priceCategory,page, limit ])


    const data = filterData?.movies?.map((Product) => ({
        _id: Product._id,
        title: i18n.language == "ar" ? Product.title.ar : Product.title.he,
        name: i18n.language == "ar" ? Product.name.ar : Product.name.he,
        information: i18n.language == "ar" ? Product.information.ar : Product.information.he,
        price: Product.price,
        file: Product.file,
        number:Product.number
    })) || [];

    return (<>
        <div style={{ borderTop: "soled 1px black", marginTop: "35px", display: "flex", backgroundColor: "rgb(235, 235, 235)" }}>
            <Nav style={{ minHeight: "500px", width: "15%", borderRight: "solid 1px rgb(219, 218, 218)", margin: "0", backgroundColor: "white" }}>
                <Accordion style={{ width: "15%", position: "fixed" }} alwaysOpen >
                    {/* <div style={{ width: "99%", fontSize: "25px", height: "40px", borderBottom: "1px solid ", textAlign: "center" }}>Filter</div> */}
                    <Accordion.Item eventKey="0" style={{ width: "99%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}><span style={{ flexGrow: 1, textAlign:"start" }}>{<MdPriceChange style={{ marginRight: "5px", fontSize: "18px" }} />}  {t("Price")} </span> </Accordion.Header>
                        <Accordion.Body>
                            <form onChange={(e) => setPriceCategory(e.target.value)}>
                                <input type="radio" id="All" name="Role" style={{ width: "20%" }} defaultChecked />
                                <label for={"All"} style={{ width: "80%" }}>{t("All")}</label>
                                <input type="radio" id="Admin" name="Role" value="0-199" style={{ width: "20%" }} />
                                <label for={"Admin"} style={{ width: "80%" }}>0 - 199</label>
                                <input type="radio" id="Clain" name="Role" value="200-499" style={{ width: "20%" }} />
                                <label for={"Clain"} style={{ width: "80%" }}>200 - 499</label>
                                <input type="radio" id="Clain" name="Role" value="500-999" style={{ width: "20%" }} />
                                <label for={"Clain"} style={{ width: "80%" }}>500 - 999</label>
                                <input type="radio" id="Clain" name="Role" value="1000" style={{ width: "20%" }} />
                                <label for={"Clain"} style={{ width: "80%" }}> {t("more than")} 1000</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Nav>
            <div style={{ width: "85%" }}>
                <div style={{ width: "96%", backgroundColor: "white", margin: "10px 2%", borderRadius: "5px", border: "solid 1px rgb(219, 218, 218)", boxShadow: "5px 0 5px 0 rgb(219, 218, 218)" }}>
                    <div className="d-flex" style={{ width: "50%", marginLeft: "25%" , marginRight:"25%" }}>
                        <Form.Control
                            type="search"
                            placeholder={t("Search")}
                            className="me-1"
                            aria-label="Search"
                            value={search}
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.678)", height: "35px", margin: "3px 0" }}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IoSearchSharp style={{ fontSize: "30px", marginTop: "8px " }} />
                    </div>
                </div>
                <div style={{ backgroundColor: "white", minHeight: "70vh", width: '96%', margin: "0 2% 1% 2%", borderRadius: "5px", border: "solid 1px rgb(219, 218, 218)", boxShadow: " 5px 0 5px 0 rgb(219, 218, 218)" }}>
                    <div id="PageUlProduct" >
                        { data.map((item) =>
                            <Link
                                key={item._id}
                                to={`/admin/market/getArticales/${item._id}`}
                                state={{ dataa: item }}
                                style={{ margin: "1%" }}
                            >
                                <div class="card" style={{ width: "170px", margin: "1%", border: "none", borderRadius: "10px", backgroundColor: "rgb(248, 248, 248)" }}>
                                    <img src={`${process.env.REACT_APP_API_URL}/files/${item.file[0]}`} class="card-img-top" style={{ maxHeight: "300px" }} />
                                    <div class="card-body" style={{ textAlign: "center" }}>
                                        <h5 class="card-title" style={{ textAlign: "end" }}>{item.price} $</h5>
                                        <p class="card-text">{item.title}</p>
                                        {/* <p class="card-text">{item.name}</p> */}
                                    </div>
                                </div>
                            </Link>
                        ) }
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

export default CategoryArticale