import axios from "axios"
import { useContext, useEffect, useState } from "react"
import "./HomeAdmin.css"
import { useNavigate } from "react-router-dom";
import { User } from "../../context/context";
import { Loading } from "../../refreshPage/loading";
import { TbListDetails } from "react-icons/tb";
import { Accordion, Form, Nav } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import PaginatedItems from "../../components/pagination";
import { useTranslation, initReactI18next } from "react-i18next";
import i18n from "i18next"

function Home2admin() {
    const { t } = useTranslation();

    const [dataa, setDataa] = useState()
    const context = useContext(User)
    const token = context.auth.token
    const nav = useNavigate()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/users/GetUser`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            }
        )
            .then((doc) => setDataa(doc.data))
            .catch((err) => { console.log("err get : ", err) })
    }, [token])

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const start = (page - 1) * limit
    const end = Number(start) + Number(limit)
    const final = dataa && dataa.slice(start, end)

    const [search, setSearch] = useState("")
    const [searchRole, setSearchRole] = useState("")
    const [searchactivity, setSearchActivity] = useState("")
    const [filterData, setFilterData] = useState()
    const dataSaerch = { search: search, searchRole: searchRole, searchactivity: searchactivity, limit, page }

    async function getSearchData() {
        await axios.post(`${process.env.REACT_APP_API_URL}/users/SearchUser`, dataSaerch,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                }
            }
        )
            .then((doc) => { setFilterData(doc.data) })
            .catch((err) => console.log("err 1 : ", err))
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            getSearchData()
        }, 800)
        return () => clearTimeout(debounce)
    }, [token, search, searchactivity, searchRole, dataSaerch])

    const btnDetalsuser = (id) => {
        nav(`/admin/Home/Home3/${id}`)
    }

    return (
        <div id="allPage" style={{ display: "flex", padding: "0" }}>
            <Nav style={{ width: "15%", borderRight: "solid 1px rgb(219, 218, 218)", margin: "0", backgroundColor: "white" }}>
                <Accordion style={{ width: "15%", position: "fixed" }} alwaysOpen >
                    <Accordion.Item eventKey="0" style={{ width: "100%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}><span style={{ flexGrow: 1, textAlign: "start" }}> {t("Home2.Role")} </span> </Accordion.Header>
                        <Accordion.Body>
                            <form onChange={(e) => { setSearchRole(e.target.value) }}>
                                <input type="radio" id="All" name="Role" value="" style={{ width: "20%" }} defaultChecked />
                                <label for={"All"} style={{ width: "80%" }}>{t("All")}</label>
                                <input type="radio" id="Admin" name="Role" value="admin" style={{ width: "20%" }} />
                                <label for={"Admin"} style={{ width: "80%" }}>{t("Home2.Admin")}</label>
                                <input type="radio" id="Clain" name="Role" value="user" style={{ width: "20%" }} />
                                <label for={"Clain"} style={{ width: "80%" }}>{t("Home2.Clain")}</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" style={{ width: "100%" }} >
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}> <span style={{ flexGrow: 1, textAlign:"start" }}>{t("Home2.Activity")}</span>  </Accordion.Header>
                        <Accordion.Body>
                            <form onChange={(e) => setSearchActivity(e.target.value)}>
                                <input type="radio" id="AllActivity" name="Activity" value="" style={{ width: "20%" }} defaultChecked />
                                <label for={"AllActivity"} name="Activity" style={{ width: "80%" }}>{t("All")}</label>
                                <input type="radio" id="Active" name="Activity" value="true" style={{ width: "20%" }} />
                                <label for={"Active"} name="Activity" style={{ width: "80%" }}>{t("Home2.Active")}</label>
                                <input type="radio" id="UnActive" name="Activity" value="false" style={{ width: "20%" }} />
                                <label for={"UnActive"} style={{ width: "80%" }}>{t("Home2.UnActive")}</label>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Nav>
            <div style={{ width: "85%", }}>
                <div style={{ width: "96%", backgroundColor: "white", margin: "1% 2% 0 2%", borderRadius: "5px", marginBottom: "10px", boxShadow: "5px 0 5px 0 rgb(219, 218, 218)", border: "solid 1px rgb(219, 218, 218)" }}>
                    <div className="d-flex" style={{ width: "50%", marginLeft: "25%",marginRight:"25%", marginTop: "0" }}>
                        <IoSearchSharp style={{ fontSize: "30px", marginTop: "6px" }} />
                        <Form.Control
                            type="search"
                            placeholder={t("Search")}
                            className="me-1"
                            aria-label="Search"
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.678)", height: "35px", margin: "3px 0" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div id="Page" style={{ width: "96%", margin: "1% 2%" , padding:"0" }}>
                    <div style={{ width: "100%", marginTop: "15px" }}>
                        {dataa ? <>
                            <table class="table  table-hover table-light " style={{ fontSize: "20px", height: "10px", borderRadius: "5px" ,textAlign:"start"}}>
                                <thead>
                                    <tr>
                                        <th>#:</th>
                                        <th>{t("CreateUser.User")}:</th>
                                        <th>{t("Home2.Email")}:</th>
                                        <th>{t("Home2.Active")}:</th>
                                        <th >{<TbListDetails />}</th>
                                    </tr>
                                </thead>
                                {filterData ? filterData.movies.map((item, index) =>
                                    <tbody style={{ padding: "0" }}>
                                        <tr key={index} style={{ padding: "0" }} >
                                            <td >{index + 1}</td>
                                            <td >{item.user}</td>
                                            <td >{item.email}</td>
                                            <td >{item.active}</td>
                                            <td style={{ padding: "0", alignContent: "center", color: "white" }} >
                                                <div class="col-12" style={{ padding: "0" }}>
                                                    <button type="submit" class="btn btn-success" onClick={() => btnDetalsuser(item._id)}>  {t("Home2.Account details")}</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : <div style={{ minHeight: "100px", width: "100%", marginLeft: "150%",marginRight:"150%", marginTop: "14%" }}>{t("Loading...")}</div>}
                            </table>
                            <div style={{ display: 'flex', justifyContent: "flex-start", marginRight: "2%", alignItems: 'baseline' }}>
                                <Form.Select style={{ width: "80px" }} onChange={(e) => setLimit(e.target.value)}>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                </Form.Select>
                                <PaginatedItems total={filterData && filterData.total} itemsPerPage={limit} setPage={setPage} />
                            </div>
                        </> : <Loading />}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home2admin