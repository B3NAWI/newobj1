import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../footer/Footer";
import HederVisitor from "../heder/HederVisitor";
import SupportIcon from "../../footer/SupportIcon";


function OutletVisitor() {

    return(   
        <div>
            <HederVisitor />
            <Outlet />
            {/* <SupportIcon /> */}
            <Footer />
        </div>
    )
}

export default OutletVisitor;