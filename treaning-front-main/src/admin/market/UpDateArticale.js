import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "../../cline/market/Articales.css"
import Swal from "sweetalert2";
import { User } from "../../context/context";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation, initReactI18next } from "react-i18next";

function UpDateArticale() {
    const { t } = useTranslation();

    //tokenContext
    const usernaw = useContext(User)
    const token = usernaw.auth.token

    const nav = useNavigate()
    const location = useLocation()
    const { dataa } = location.state || {}

    const [namee, setNamee] = useState(dataa.name ? dataa.name : "");
    const [titlee, setTitlee] = useState(dataa.title);
    const [informationn, setInformationn] = useState(dataa.information);
    const [pricee, setPricee] = useState(dataa.price);
    const [numberr, setNumberr] = useState(dataa.number);
    const [file, setfile] = useState(dataa.file);

    const [emgg, setEmg] = useState(null);
    const [formData, setFormData] = useState(new FormData());

    function handleFileSelect(event) {
        const files = event.target.files;
        const selectedFiles = []

        for (let i = 0; i < files.length; i++) {
            selectedFiles.push(files[i]);
        }
        setEmg(selectedFiles);
        const updatedFormData = new FormData();
        updatedFormData.append("name", namee);
        updatedFormData.append("title", titlee);
        updatedFormData.append("information", informationn);
        updatedFormData.append("price", pricee);
        updatedFormData.append("number", numberr);
        for (let i = 0; i < selectedFiles.length; i++) {
            updatedFormData.append("file", selectedFiles[i]);
        }
        setFormData(updatedFormData);
    }

    async function btnInsert() {
        await axios.patch(`${process.env.REACT_APP_API_URL}/articales/PatchArticale/${dataa._id}`, formData, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data"
            }
        })
            .then(async (doc) =>
                await Swal.fire({
                    icon: 'success',
                    title: '<h1> Success </h1> <br /> تم تعديل المنتج ',
                    // text: ' تم اضافة المنتج ' ,
                    // footer: '<a href="/login">login?</a>',
                    showConfirmButton: false,
                    timer: 1500,
                }))
            .then((doc) => { nav(`/admin/Home/Home4/${dataa.category}`) })
            .catch((err) => console.log("err Post : ", err))
    }

    return (
        <div id="allPage">
            <div id="Page" >
                <div id="H1Login">
                    <h1>{t("ProductId.Up Date Product")}</h1>
                </div>

                <div style={{ width: "80%", display: "flex" }}>
                    <div class="mb-3" style={{ width: "50%" }}>
                        <label for="exampleFormControlInput1" class="form-label"> {t("ProductId.name")}</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1" onChange={e => setNamee(e.target.value)} placeholder="Xiaomi Redmi Note 8 Pro" defaultValue={dataa.name} />
                    </div>
                    <div class="mb-3" style={{ width: "50%" }}>
                        <label for="exampleFormControlInput1" class="form-label">{t("ProductId.title")}</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1" onChange={e => setTitlee(e.target.value)} placeholder="Xiaomi Redmi Note 8 Pro 64GB Green Global version" defaultValue={dataa.title} />
                    </div>
                </div>
                <div class="mb-3" style={{ width: "80%" }}>
                    <label for="exampleFormControlTextarea1" class="form-label">{t("ProductId.information")}</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" onChange={e => setInformationn(e.target.value)} defaultValue={dataa.information}></textarea>
                </div>
                <div style={{ width: "80%", display: "flex" }}>
                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" id="floatingInputPrice" onChange={(e) => (setPricee(e.target.value))} placeholder="name@example.com" defaultValue={dataa.price} />
                        <label for="floatingInputPrice">{t("Price")}</label>
                        <div className="errMsgInbut" id="errphone"></div>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" id="floatingInputNumber" onChange={(e) => (setNumberr(e.target.value))} placeholder="name@example.com" defaultValue={dataa.number} />
                        <label for="floatingInputNumber">{t("ProductId.Existing quantity")}</label>
                        <div className="errMsgInbut" id="errphone"></div>
                    </div>
                </div>
                <div class="form-floating mb-3">
                    <input type="file" class="form-control" id="floatingInputNumber" onChange={(e) => handleFileSelect(e)} multiple placeholder="name@example.com" />
                    <label for="floatingInputNumber">{t("ProductId.emg")}</label>
                    <div className="errMsgInbut" id="errphone"></div>
                </div>


                <div class="col-12">
                    <button type="submit" class="btn btn-success" onClick={btnInsert}> {t("ProductId.Up Date Product")}</button>
                </div>
            </div>
        </div>
    )
}

export default UpDateArticale;