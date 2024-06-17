import { useContext } from "react";
import { User } from "../context/context";
import { Navigate, Outlet, useLocation } from "react-router-dom";


export default function ValiedToken() {
    const user = useContext(User)
    const location = useLocation()
    return user.auth.userDetals.role === "admin" ? <Outlet /> : user.auth.userDetals.role === 'user'? <Navigate state={{ frome: location }} replace to="/cline/Articales/GetCategoryMarketCline" /> :<Navigate state={{ frome: location }} replace to="/GetCategoryMarket" />
}