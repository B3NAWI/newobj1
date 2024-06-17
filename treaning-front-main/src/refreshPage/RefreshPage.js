import { Outlet, useNavigate } from "react-router-dom";
import { User } from "../context/context";
import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import Cookies from "universal-cookie";
import { Loading } from "./loading";
import { isExpired, decodeToken } from "react-jwt";

export default function RefreshPage() {
    const [laoding, setLaoding] = useState(true)
    const usernaw = useContext(User)
    const ContextToken = usernaw.auth.token
    const nav = useNavigate()
    // cookie
    const cookie = new Cookies()

    // .finally(()=>setLaoding(false))

    useEffect(() => {
        const getTokenCookie = cookie.get("bearer")
        const TokenCookie = getTokenCookie && getTokenCookie.token ? getTokenCookie.token : nav("/GetCategoryMarket")
        const userDetalsCookie = getTokenCookie && getTokenCookie.userDetals ? getTokenCookie.userDetals : nav("/GetCategoryMarket")
        const RefreshTokenCookie = getTokenCookie && getTokenCookie.refreshToken ? getTokenCookie.refreshToken : nav("/GetCategoryMarket")
        const decodedTokenCookie = getTokenCookie && getTokenCookie.decoded ? getTokenCookie.decoded : nav("/GetCategoryMarket")
        const decodedContextToken = decodeToken(ContextToken)
        const IsExpiredContextToken = isExpired(ContextToken)
        async function refresh() {
            if (TokenCookie) {
                if (IsExpiredContextToken) {
                    axios.post(`${process.env.REACT_APP_API_URL}/auth/refreshToken`, null, {
                        headers: {
                            Accept: "application/json",
                            Authorization: "Bearer " + RefreshTokenCookie,
                        }
                    }).then(async (doc) => {
                        const token = doc.data.token
                        const newuserDetals = doc.data.data
                        const newdecoded = doc.data.decoded
                        await cookie.remove("bearer")
                        await cookie.set("bearer", { token: token, refreshToken: RefreshTokenCookie, userDetals: newuserDetals, decoded: newdecoded }, { path: "/" })
                        await usernaw.setAuth({ token: token, userDetals: newuserDetals, decoded: newdecoded })
                    }).catch((err) => console.log("err refreshPage : ", err))
                }
                else {
                    await cookie.set("bearer", { token: TokenCookie, refreshToken: RefreshTokenCookie, userDetals: userDetalsCookie, decoded: decodedTokenCookie }, { path: "/" })
                    await usernaw.setAuth({ token: TokenCookie, userDetals: userDetalsCookie })
                }
            }
            else { nav("/GetCategoryMarket") }
        }
        !ContextToken ? refresh() : setLaoding(false)
    })
    return laoding ? <Loading /> : <Outlet />
}