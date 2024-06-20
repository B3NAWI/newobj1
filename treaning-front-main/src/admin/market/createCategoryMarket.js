import { useContext, useEffect, useState } from "react";
import "../../cline/market/Articales.css"
import axios from "axios";
import Swal from "sweetalert2";
import { User } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


function CreateCategoryMarket() {
    const { t } = useTranslation();

    //tokenContext
    const usernaw = useContext(User)
    const token = usernaw.auth.token
    const nav = useNavigate()


    const [nameeAr, setNameeAr] = useState();
    const [nameeHe, setNameeHe] = useState();
    const [emgg, setEmg] = useState(null);
    const [formData, setFormData] = useState(new FormData());
    const [errMsg, setErrMsg] = useState()
    function handleFileSelect(event) {
        const files = event.target.files;
        const selectedFiles = []

        for (let i = 0; i < files.length; i++) {
            selectedFiles.push(files[i]);
        }
        setEmg(selectedFiles);

        const updatedFormData = new FormData();
        updatedFormData.append("name_ar", nameeAr);
        updatedFormData.append("name_he", nameeHe);
        for (let i = 0; i < selectedFiles.length; i++) {
            updatedFormData.append("file", selectedFiles[i]);
        }
        setFormData(updatedFormData);
    }

    useEffect(() => {

    }, [btnInsert])

    async function btnInsert() {
        if (!nameeAr || !nameeHe) {
            setErrMsg(t("Please fill out the fields"))
            return;
        }
        if (!emgg || emgg.length === 0) {
            console.error("No files selected");
            setErrMsg(t("Please add a photo"))
            return;
        }
        await axios.post(`${process.env.REACT_APP_API_URL}/articales/CreateCategoryMarket`, formData, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data"
            }
        })
            .then(async () =>
                await Swal.fire({
                    icon: 'success',
                    title: '<h1> Success </h1> <br /> تم اضافة الفئة ',
                    // text: ' تم اضافة المنتج ' ,
                    // footer: '<a href="/login">login?</a>',
                    showConfirmButton: false,
                    timer: 1500,
                }))
            .then(() => { nav("/admin/Home/Home4") })
            .catch((err) => console.log("err Post : ", err))
    }

    return (
        <div id="allPage">
            <div id="Page">
                <div id="H1Login">
                    <h1>{t("hedarAdmin.Create Category")}</h1>
                </div>

                <div style={{ width: "80%", display: "flex" }}>
                    <div class="mb-3" style={{ width: "100%" }}>
                        <label for="exampleFormControlInput1" class="form-label">{t("Category Market Name")}</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1" onChange={e => setNameeAr(e.target.value)} placeholder={t("بالعربية")} required />
                        <input type="text" style={{ marginTop: "5px" }} class="form-control" id="exampleFormControlInput1" onChange={e => setNameeHe(e.target.value)} placeholder={t("בעברית")} required />
                    </div>
                </div>
                <div style={{ color: 'red' }}>{errMsg}</div>
                <div class="form-floating mb-3">
                    <input type="file" class="form-control" id="floatingInputNumber" onChange={(e) => handleFileSelect(e)} placeholder="name@example.com" />
                    <label for="floatingInputNumber">{t("ProductId.emg")}</label>
                    <div className="errMsgInbut" id="errphone"></div>
                </div>

                <div class="col-12">
                    <button type="submit" class="btn btn-success" onClick={btnInsert}> {t("hedarAdmin.Create Category")} </button>
                </div>
            </div>
        </div>
    )
}

export default CreateCategoryMarket;