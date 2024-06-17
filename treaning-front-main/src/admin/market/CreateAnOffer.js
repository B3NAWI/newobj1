import axios from "axios";
import React, { useContext, useState } from "react";
import { User } from "../../context/context";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation, initReactI18next } from "react-i18next";


const CreateAnOffer = () => {
    const { t } = useTranslation();
    const usernaw = useContext(User)
    const token = usernaw.auth.token
    const nav = useNavigate()


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
        for (let i = 0; i < selectedFiles.length; i++) {
            updatedFormData.append("file", selectedFiles[i]);
        }
        setFormData(updatedFormData);
    }

    async function btnInsert() {
        if (!emgg || emgg.length === 0) {
            console.error("No files selected");
            return;
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/articales/CreateAnOffer`, formData, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data"
            }
        })
            .then(async () =>
                await Swal.fire({
                    icon: 'success',
                    title: '<h1> Success </h1> <br /> تم اضافة العرض ',
                    // text: ' تم اضافة المنتج ' ,
                    // footer: '<a href="/login">login?</a>',
                    showConfirmButton: false,
                    timer: 1500,
                }))
            .then(() => { nav("/admin/Home/Home4") })
            .catch((err) => console.log("err Post : ", err))
    }

    return (<>
        <div id="allPage">
            <div id="Page" style={{ width: "80%" }}>
                <div id="H1Login">
                    <h1>{t("hedarAdmin.Create Offer")}</h1>
                </div>

                <div class="form-floating mb-3">
                    <input type="file" class="form-control" id="floatingInputNumber" onChange={(e) => handleFileSelect(e)} multiple placeholder="name@example.com" />
                    <label for="floatingInputNumber">{t("ProductId.emg")}</label>
                    <div className="errMsgInbut" id="errphone"></div>
                </div>

                <div class="col-12">
                    <button type="submit" class="btn btn-success" onClick={btnInsert}> {t("hedarAdmin.Create Offer")}</button>
                </div>
            </div>
        </div>

    </>)
}

export default CreateAnOffer