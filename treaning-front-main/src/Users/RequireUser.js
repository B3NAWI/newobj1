import { useContext } from "react";
import { User } from "../context/context";
import { Navigate, Outlet, useLocation } from "react-router-dom";


export default function RequireUser() {
    const user = useContext(User)
    const location = useLocation()
    return user.auth.userDetals ? <Outlet /> :user.auth.userDetals.role === 'user'? <Navigate state={{ frome: location }} replace to="/cline/Articales/GetCategoryMarketCline" /> :<Navigate state={{ frome: location }} replace to="/GetCategoryMarket" />
}