import axios from "axios"
import { useContext, useEffect, useState } from "react"
import "./HomeAdmin.css"
import { useNavigate } from "react-router-dom";
import { User } from "../../context/context";
import { Loading } from "../../refreshPage/loading";
import { TbListDetails } from "react-icons/tb";
import { Accordion, Form, Nav, Offcanvas, Stack } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import PaginatedItems from "../../components/pagination";
import { useTranslation } from "react-i18next";
import { IoFilterSharp } from "react-icons/io5";

function Home2admin() {
    const { t, i18n } = useTranslation();

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

    const [open, setOpen] = useState(false)


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

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            getSearchData()
        }, 800)
        return () => clearTimeout(debounce)
    }, [token, search, searchactivity, searchRole, dataSaerch])

    const btnDetalsuser = (id) => {
        nav(`/admin/Home/Home3/${id}`)
    }

    const CloseFilter = () => {
        setOpen(false)
    }

    return (
        <div id="allPage" style={{ display: "flex", padding: "0" }}>
            <Nav className="NavDisktop" style={{ width: "15%", borderRight: "solid 1px rgb(219, 218, 218)", margin: "0", backgroundColor: "white" }}>
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
                        <Accordion.Header style={{ fontSize: "20px", width: "99%", padding: "2px" }}> <span style={{ flexGrow: 1, textAlign: "start" }}>{t("Home2.Activity")}</span>  </Accordion.Header>
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
            <div style={{ width: isMobile ? "100%" : "85%" }}>
                <div style={{ width: "96%", backgroundColor: "white", margin: "10px 2%", borderRadius: "5px", border: "solid 1px rgb(219, 218, 218)", boxShadow: "5px 0 5px 0 rgb(219, 218, 218)", display: "flex", justifyContent: "center" }}>
                    {isMobile && <><button style={{ backgroundColor: "initial", border: "none" }} onClick={() => { setOpen(true) }}> <IoFilterSharp size={"30"} style={{ margin: "5px 5px 5px 0" }} /></button></>}
                    <div className="d-flex" style={{ width: "100%", justifyContent: "center" }}>
                        <Form.Control
                            type="search"
                            placeholder={t("Search")}
                            className="me-1"
                            aria-label="Search"
                            style={{ width: isMobile ? "80%" : "50%", backgroundColor: "rgba(255, 255, 255, 0.678)", height: "35px", margin: "3px 0" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IoSearchSharp style={{ fontSize: "30px", marginTop: "6px" }} />
                    </div>
                </div>
                {isMobile ?
                    <div id="Page" style={{ width: "96%", margin: "1% 2% 3% 2%", padding: "0" }}>
                        <div style={{ width: "100%", marginTop: "15px", overflowX: "auto" }}>
                            {dataa ? (
                                <>
                                    <table className="table table-hover table-light" style={{ fontSize: "16px", borderRadius: "5px", textAlign: "start", width: "100%", maxWidth: "100%", overflowX: "auto" }}>
                                        {filterData ? (
                                            <tbody>
                                                {filterData.movies.map((item, index) => (
                                                    <tr style={{ display: "flex", flexDirection: "column", borderTop: index + 1 == "1" ? null : "solid 1px black" }} key={index}>
                                                        <td># : {index + 1}</td>
                                                        <td>{t("CreateUser.User")} : {item.user}</td>
                                                        <td>{t("Home2.Email")} : {item.email}</td>
                                                        <td>{t("Home2.Activity")} : {item.active}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <button type="button" className="btn btn-success" onClick={() => btnDetalsuser(item._id)}>
                                                                {t("Home2.Account details")}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        ) : (
                                            <div style={{ minHeight: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>{t("Loading...")}</div>
                                        )}
                                    </table>
                                    <div style={{ display: 'flex', justifyContent: "flex-start", marginRight: "2%", alignItems: 'baseline' }}>
                                        <Form.Select style={{ width: "80px", marginRight: "10px" }} onChange={(e) => setLimit(e.target.value)}>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={30}>30</option>
                                        </Form.Select>
                                        <PaginatedItems total={filterData && filterData.total} itemsPerPage={limit} setPage={setPage} />
                                    </div>
                                </>
                            ) : (
                                <Loading />
                            )}
                        </div>
                    </div>
                    :
                    <div id="Page" style={{ width: "96%", margin: "1% 2%", padding: "0" }}>
                        <div style={{ width: "100%", marginTop: "15px", overflowX: "auto" }}>
                            {dataa ? (
                                <>
                                    <table className="table table-hover table-light" style={{ fontSize: "16px", borderRadius: "5px", textAlign: "start", width: "100%", maxWidth: "100%", overflowX: "auto" }}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>{t("CreateUser.User")}</th>
                                                <th>{t("Home2.Email")}</th>
                                                <th>{t("Home2.Active")}</th>
                                                <th>{<TbListDetails />}</th>
                                            </tr>
                                        </thead>
                                        {filterData ? (
                                            <tbody>
                                                {filterData.movies.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.user}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.active}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <button type="button" className="btn btn-success" onClick={() => btnDetalsuser(item._id)}>
                                                                {t("Home2.Account details")}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        ) : (
                                            <div style={{ minHeight: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>{t("Loading...")}</div>
                                        )}
                                    </table>
                                    <div style={{ display: 'flex', justifyContent: "flex-start", marginRight: "2%", alignItems: 'baseline' }}>
                                        <Form.Select style={{ width: "80px", marginRight: "10px" }} onChange={(e) => setLimit(e.target.value)}>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={30}>30</option>
                                        </Form.Select>
                                        <PaginatedItems total={filterData && filterData.total} itemsPerPage={limit} setPage={setPage} />
                                    </div>
                                </>
                            ) : (
                                <Loading />
                            )}
                        </div>
                    </div>
                }

            </div>
            <Offcanvas i18nIsDynamicList={true} show={open} onHide={CloseFilter} placement="end" style={{ width: '150px', height: '100%' }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title >
                        {t("Filter")}
                    </Offcanvas.Title>
                    {/* <div className="ms-auto fw-bold fs-1" style={{ bottom: "50px", marginRight: "20%" }}>
                        {t("Filter")}
                    </div> */}
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Stack >
                        <div className="ms-auto fw-bold fs-4" style={{ width: "100%", bottom: "50px", textAlign: "center", backgroundColor: "#ededed" }}>
                            {t("Home2.Role")}
                        </div>
                        <form onChange={(e) => { setSearchRole(e.target.value) }}>
                            <input type="radio" id="All" name="Role" value="" style={{ width: "20%" }} defaultChecked />
                            <label for={"All"} style={{ width: "80%" }}>{t("All")}</label>
                            <input type="radio" id="Admin" name="Role" value="admin" style={{ width: "20%" }} />
                            <label for={"Admin"} style={{ width: "80%" }}>{t("Home2.Admin")}</label>
                            <input type="radio" id="Clain" name="Role" value="user" style={{ width: "20%" }} />
                            <label for={"Clain"} style={{ width: "80%" }}>{t("Home2.Clain")}</label>
                        </form>
                    </Stack>
                    <Stack >
                        <div className="ms-auto fw-bold fs-4" style={{ width: "100%", bottom: "50px", textAlign: "center", backgroundColor: "#ededed" }}>
                            {t("Home2.Activity")}
                        </div>
                        <form onChange={(e) => setSearchActivity(e.target.value)}>
                            <input type="radio" id="AllActivity" name="Activity" value="" style={{ width: "20%" }} defaultChecked />
                            <label for={"AllActivity"} name="Activity" style={{ width: "80%" }}>{t("All")}</label>
                            <input type="radio" id="Active" name="Activity" value="true" style={{ width: "20%" }} />
                            <label for={"Active"} name="Activity" style={{ width: "80%" }}>{t("Home2.Active")}</label>
                            <input type="radio" id="UnActive" name="Activity" value="false" style={{ width: "20%" }} />
                            <label for={"UnActive"} style={{ width: "80%" }}>{t("Home2.UnActive")}</label>
                        </form>
                    </Stack>
                </Offcanvas.Body>
                <div style={{ width: "90%", margin: "0 5%" }}>
                    {/* <Button variant="outline-success" style={{ width: "100%", bottom: "0" }} onClick={"btnFinishMarket"}> asdsad</Button> */}
                </div>
            </Offcanvas>
        </div >
    )
}

export default Home2admin