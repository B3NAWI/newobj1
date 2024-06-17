import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../footer/Footer";
import HederAdmin from "../heder/HederAdmin";
import SupportIcon from "../../footer/SupportIcon";
import AAA from "./aaa";

function OutletAdmin() {

    return (
        <div>
            <HederAdmin />
            {/* <AAA /> */}
            <Outlet />
            {/* <SupportIcon /> */}
            <Footer />
        </div>
    )
}

export default OutletAdmin;