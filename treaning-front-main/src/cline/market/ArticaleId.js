import { useLocation } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { useShoppingCart } from "../../context/shoppingCartContext";
import { useTranslation, initReactI18next } from "react-i18next";


function ArticaleId() {
    const { t } = useTranslation();
    const location = useLocation()
    const { item } = location.state || {};
    const id = item._id

    const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart()

    const quantity = getItemQuantity(id)
    return (
        <body id="allPage" style={{ backgroundColor: "white" }}>
            <div style={{ margin: "2%", padding: "1%", borderRadius: "5px" }}>
                <div style={{ display: "flex" }}>
                    <div id="carouselExampleCaptions" class="carousel slide" >
                        <div class="carousel-indicators">
                            {item.file.map((item, index) => (
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
                            {item.file.map((item, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img src={`${process.env.REACT_APP_API_URL}/files/${item}`} className="d-block w-100" alt={`Slide ${index + 1}`} style={{ border: "1px solid #d5d5d5" }} />
                                    <div className="carousel-caption d-none d-md-block">
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
                    <div style={{ display: 'flex', padding: "1%", alignItems: "center" }}>
                        <div style={{ width: "80%", minWidth: "200px" }}>
                            <div id="liUserId"><div> {t("Name")} : </div>  {item.name}</div>
                            <div id="liUserId"><div> {t("ProductId.title")} : </div>  {item.title}</div>
                            <div id="liUserId"><div> {t("ProductId.information")} : </div> {item.information}</div>
                            <div id="liUserId"><div> {t("Price")} : </div> {item.price} <div> $ </div></div>
                            <div id="liUserId"><div> {t("ProductId.Existing quantity")} : </div> {item.number}</div>
                        </div>
                        <div class="col-12" style={{ display: "flex", justifyContent: "center" }}>
                            {quantity === 0 ? (
                                <button style={{ height: "fit-content" }} class="btn btn-success" onClick={() => increaseCartQuantity(item)} >{<MdAddShoppingCart style={{ fontSize: "20px" }} />}{t("Add to cart")}</button>)
                                :
                                (<div className="d-flex align-items-center flex-column" >
                                    <div className="d-flex align-items-center justify-content-center" style={{ gap: "10px" }}>
                                        <button class="btn btn-success" onClick={() => decreaseCartQuantity(item)}>-</button>
                                        <span className="fs-3" style={{ width: "130px" }}> {quantity} in cart</span>
                                        <button class="btn btn-success" onClick={() => increaseCartQuantity(item)}>+</button>
                                    </div>
                                    <button class="btn btn-danger" onClick={() => removeFromCart(item ? id : "")}>{t("ProductId.Remove")}</button>
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </body>
    )
}

export default ArticaleId;