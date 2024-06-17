import axios from "axios";
import { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User } from "../../context/context";
import "./Articales.css"
import { Loading } from "../../refreshPage/loading";
import { useTranslation, initReactI18next } from "react-i18next";

function ArticalesIdAdmin() {
    const { t } = useTranslation();
    let params = useParams()
    const context = useContext(User)
    const token = context.auth.token
    const nev = useNavigate()

    const location = useLocation();
    const { dataa } = location.state || {};

    const btndelete = async function deletee() {
        await axios.delete(`${process.env.REACT_APP_API_URL}/articales/DeleteArticale/${params.id}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            }
        })
            .then((doc) => {
                nev("/admin/Home/Home4")
            })
            .catch((err) => console.log("err delete : ", err))
    }

    const btnUpDateArticale = () => {
        nev(`/admin/market/UpDateArticale/${dataa._id}`, { state: { dataa } })
    }

    return (
        <div id="allPage">
            <div id="Page">
                {dataa ?
                    <div style={{ width: "80%" }}>
                        <div id="carouselExampleCaptions" class="carousel slide">
                            <div class="carousel-indicators">
                                {dataa.file && dataa.file.map((item, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        data-bs-target="#carouselExampleCaptions"
                                        data-bs-slide-to={index}
                                        className={index === 0 ? "active" : ""}
                                        aria-current={index === 0 ? "true" : "false"}
                                        aria-label={`Slide ${index + 1}`}
                                    ></button>
                                ))}
                            </div>

                            <div class="carousel-inner">
                                {dataa.file && dataa.file.map((item, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                        <img src={`${process.env.REACT_APP_API_URL}/files/${item}`} className="d-block w-100" alt={`Slide ${index + 1}`} />
                                        <div className="carousel-caption d-none d-md-block">
                                            {/* <h5>صورة {index +1}</h5> */}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                        <div style={{ minWidth: "500px" }}>
                            <li id="liUserId" ><div>• {t("ProductId.name")} : </div>  {dataa.name}</li>
                            <li id="liUserId"><div>• {t("ProductId.title")} : </div>  {dataa.title}</li>
                            <li id="liUserId"><div>• {t("ProductId.information")} : </div> {dataa.information}</li>
                            <li id="liUserId"><div>• {t("Price")} : </div> {dataa.price} <div> $ </div></li>
                            <li id="liUserId"><div>• {t("ProductId.Existing quantity")} : </div> {dataa.number}</li>
                            {/* <li id="liUserId"><div>• emg : </div> {dataa.file}</li> */}
                        </div>
                        <div class="col-12" style={{ display: "flex", justifyContent: "center" }}>
                            <button type="submit" style={{ margin:"0 2%" }} class="btn btn-success" onClick={btnUpDateArticale}> {t("ProductId.Up Date Product")}</button>
                            <button type="submit" style={{ margin:"0 2%" }} class="btn btn-danger" onClick={btndelete}> {t("ProductId.Delete Product")}</button>
                        </div>
                    </div>
                    : <Loading />
                }
            </div>
        </div>
    )
}

export default ArticalesIdAdmin;