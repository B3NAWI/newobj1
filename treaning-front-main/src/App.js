import React from "react";
import './App.css';
import { Route, Routes } from "react-router-dom";
import OutletAdmin from "./admin/Outlet/OutletAdmin";
import OutletVisitor from "./cline/Outlet/OutletVisitor";
import CreateUser from "./Users/CreateUser";
import CreateArticales from "./admin/market/CreateArticales";
import ArticaleId from "./cline/market/ArticaleId";
import ArticalesIdAdmin from "./admin/market/ArticalesId";
import SupportPage from "./footer/SupportPage";
import Home2admin from "./admin/Home/Home2";
import Home3admin from "./admin/Home/Home3";
import Home4admin from "./admin/Home/Home4";
import RequireUser from "./Users/RequireUser";
import RefreshPage from "./refreshPage/RefreshPage"
import { Loading } from "./refreshPage/loading";
import UpDateUser from "./Users/UpDateUser";
import UpDateArticale from "./admin/market/UpDateArticale";
import ValiedToken from "./Users/valiedToken";
import AllAricales from "./cline/market/allAricales";
import ChangePassword from "./Users/ChangePassword";
import CategoryArticale from "./admin/market/CategoryArticale";
import CreateCategoryMarket from "./admin/market/createCategoryMarket";
import OutletExperience from "./experience/OutletExperience";
import GetCategoryMarket from "./experience/GetCategoryMarket";
import Market from "./experience/market";
import GetArticaleid from "./experience/getArticaleid";
import GetCategoryMarketCline from "./cline/market/GetCategoryMarketCline";
import CreateAnOffer from "./admin/market/CreateAnOffer";
import FinishMarket from "./cline/market/FinishMarket";
import MyAccount from "./admin/Account/MyAccount";
import PayCard from "./cline/market/PayCard";
import ResetePassword from "./Users/ResatePassword";
import Invoice from "./cline/market/Invoice";
import MyOrders from "./cline/market/MyOrders/MyOrders";
import BtnVerifyEmail from "./components/VerifyEmail";
import DetalisOrder from "./cline/market/MyOrders/DetalisOrder";
import AllOrders from "./admin/market/Orders/allOrders";
import DetalisOrderAdmin from "./admin/market/Orders/DetalisOrderAdmin";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<OutletExperience />} >
          <Route path="/" element={<GetCategoryMarket />} />
          {/* <Route path="/GetCategoryMarket" element={<GetCategoryMarket />} /> */}
          <Route path="/GetCategoryMarket/:category" element={<Market />} />
          <Route path="/GetArticaleid/:id" element={<GetArticaleid />} />
          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/Articales/getArticales" element={<AllAricales />} />
          <Route path="/ResetePassword/:token" element={<ResetePassword />} />
        </Route>

        <Route element={<RefreshPage />}>

          <Route element={<RequireUser />}>

            <Route path="/cline" element={<OutletVisitor />}>
              <Route path="/cline/Articales">
                <Route path="/cline/Articales/getArticales/:category" element={<AllAricales />} />
                <Route path="/cline/Articales/getArticale/:id" element={<ArticaleId />} />
                <Route path="/cline/Articales/GetCategoryMarketCline" element={<GetCategoryMarketCline />} />
                <Route path="/cline/Articales/FinishMarket" element={<FinishMarket />} />
                <Route path="/cline/Articales/FinishMarket/PayCard" element={<PayCard />} />
                <Route path="/cline/Articales/FinishMarket/Invoice/:id" element={<Invoice />} />
                <Route path="/cline/Articales/MyOrders/:UserId" element={<MyOrders />} />
                <Route path="/cline/Articales/MyOrders/DetalisOrder/:id" element={<DetalisOrder />} />
              </Route>
              <Route path="/cline/user">
                <Route path="/cline/user/ChangePassword/:id" element={<ChangePassword />} />
                <Route path="/cline/user/GetUserId" element={<MyAccount />} />
                <Route path="/cline/user/UpDateUser/:id" element={<UpDateUser />} />
                <Route path="/cline/user/verifyEmail/:token" element={<BtnVerifyEmail />} />
              </Route>
              <Route path="/cline/SupportPage" element={<SupportPage />} />
              <Route path="/cline/Users/ChangePassword/:id" element={<ChangePassword />} />
            </Route>
          </Route>

          <Route element={<ValiedToken />}>

            <Route path="/admin" element={<OutletAdmin />}>
              <Route path="/admin/Home">
                <Route path="/admin/Home/Home2" element={<Home2admin />} />
                <Route path="/admin/Home/Home4/:category" element={<CategoryArticale />} />
                <Route path="/admin/Home/Home3/:id" element={<Home3admin />} />
                <Route path="/admin/Home/Home4" element={<Home4admin />} />
              </Route>
              <Route path="/admin/user">
                <Route path="/admin/user/UpDateUser/:id" element={<UpDateUser />} />
                <Route path="/admin/user/ChangePassword/:id" element={<ChangePassword />} />
                <Route path="/admin/user/GetUserId" element={<MyAccount />} />
              </Route>
              <Route path="/admin/market">
                <Route path="/admin/market/UpDateArticale/:id" element={<UpDateArticale />} />
                <Route path="/admin/market/CreateArticales" element={<CreateArticales />} />
                <Route path="/admin/market/CreateCategory" element={<CreateCategoryMarket />} />
                <Route path="/admin/market/getArticales/:id" element={<ArticalesIdAdmin />} />
                <Route path="/admin/market/CreateAnOffer" element={<CreateAnOffer />} />
                <Route path="/admin/market/orders">
                  <Route path="/admin/market/orders/allorders" element={<AllOrders />} />
                  <Route path="/admin/market/orders/DetalisOrderAdmin/:id" element={<DetalisOrderAdmin />} />
                </Route>
              </Route>
              <Route path="/admin/SupportPage" element={<SupportPage />} />
              <Route path="/admin/Loading" element={<Loading />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;