import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import HederExperience from "./HederExperience";
// import SupportIcon from "../footer/SupportIcon";
function OutletExperience() {
    return (
        <div >
            <HederExperience />
            <Outlet />
            {/* <SupportIcon /> */}
            <Footer />
        </div>
    )
}

export default OutletExperience;