import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../../context/shoppingCartContext";
import { useTranslation } from "react-i18next";


const CartItem = ({ data, id, quantity }) => {
    const { t, i18n } = useTranslation();
    const { removeFromCart, decreaseCartQuantity, increaseCartQuantity } = useShoppingCart()
    const [hoveredItem, setHoveredItem] = useState(null);

    // const item = data?.map((i) => ({
    //     _id: i._id,
    //     name: i18n.language === "ar" ? i.name.ar : i.name.he,
    //     file: i.file,
    //     price: i.price
    // }))
    const item=data

    if (item == null) return null
    return (<>
        <Stack direction="horizontal" className="d-flex align-items-center" style={{ padding: "3px 0", borderBottom: "1px solid rgb(228, 228, 228)" }} onMouseEnter={() => setHoveredItem(item)} onMouseLeave={() => setHoveredItem(null)}>
            <img src={`${process.env.REACT_APP_API_URL}/files/${item.file[0]}`} alt="cart-img" style={{ width: "125px", height: "75px", objectFit: "cover", border: "solid 1px rgb(228, 228, 228)", borderRadius: "10px" }} />
            <div className="me-auto" style={{ width: '20%' }}>
                <div style={{ fontSize: "15px", fontWeight: "500", marginLeft: "10px" }}>
                    {i18n.language === "ar" ? item.name.ar :item.name.he} {" "}
                    {/* {quantity > 1 && <span className="text-muted" style={{ fontSize: "0.65rem" }}> x{quantity} </span>} */}
                </div>
                <div className="text-muted" style={{ fontSize: "0.75rem", marginLeft: "10px" }}>{item.price} $</div>
            </div>
            <div className="d-flex align-items-center flex-column" style={{ width: "20%" }} >
                <div style={{ display: 'flex', flexDirection: "column", width: "100%", alignItems: "center" }} >
                    {hoveredItem === item && <Button variant="outline-success" style={{ padding: "0 10px" }} onClick={() => increaseCartQuantity(item)}>+</Button>}
                    <span style={{ width: "50px", textAlign: "center" }}> x{quantity}</span>
                    {hoveredItem === item && <Button variant="outline-danger" style={{ padding: "0 13px" }} onClick={() => decreaseCartQuantity(item)}>-</Button>}
                </div>
            </div>
            <div style={{ fontSize: "17px", fontWeight: "500", width: "50px", textAlign: "center", display: "flex" }} >
                {item.price * quantity} <div style={{ textAlign: "end" }}>$</div>
            </div>
            <div style={{ width: "20px" }}>
                {hoveredItem === item && <Button variant="outline-danger" style={{ margin: "2px", padding: "2px 8px" }} size="l" onClick={() => removeFromCart(id)}>
                    &times;
                </Button>}
            </div>
        </Stack>
    </>)
}


export default CartItem;