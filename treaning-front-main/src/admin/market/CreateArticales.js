// import { useContext, useEffect, useState } from "react";
// import "../../cline/market/Articales.css"
// import axios from "axios";
// import Swal from "sweetalert2";
// import { User } from "../../context/context";
// import { useNavigate } from "react-router-dom";
// import {Loading} from "../../refreshPage/loading";
// import { useTranslation, initReactI18next } from "react-i18next";


// function CreateArticales() {
//     const { t } = useTranslation();

//     const [dataa, setDataa] = useState([])


//     useEffect(() => {
//         axios.get(`${process.env.REACT_APP_API_URL}/articales/GetCategoryMarket`, {
//             headers: {
//                 Authorization: "Bearer " + token,
//                 "Content-Type": "multipart/form-data"
//             }
//         })
//             .then((doc) => { setDataa(doc.data) })
//             .catch((err) => { console.log("err get1 :", err) })
//     }, [])
//     useEffect(() => {
//         setCategory(dataa[0] ? dataa[0].name : '');
//     }, [dataa[0]]);

//     const usernaw = useContext(User)
//     const token = usernaw.auth.token
//     const nav = useNavigate()
//     const [category, setCategory] = useState(dataa[0] ? dataa[0].name :'');
//     const [namee, setNamee] = useState('');
//     const [titlee, setTitlee] = useState("");
//     const [informationn, setInformationn] = useState();
//     const [pricee, setPricee] = useState();
//     const [numberr, setNumberr] = useState();
//     const [emgg, setEmg] = useState(null);
//     const [formData, setFormData] = useState(new FormData());

//     function handleFileSelect(event) {
//         const files = event.target.files;
//         const selectedFiles = []

//         for (let i = 0; i < files.length; i++) {
//             selectedFiles.push(files[i]);
//         }
//         setEmg(selectedFiles);

//         const updatedFormData = new FormData();
//         updatedFormData.append("category", category);
//         updatedFormData.append("name", namee);
//         updatedFormData.append("title", titlee);
//         updatedFormData.append("information", informationn);
//         updatedFormData.append("price", pricee);
//         updatedFormData.append("number", numberr);
//         for (let i = 0; i < selectedFiles.length; i++) {
//             updatedFormData.append("file", selectedFiles[i]);
//         }
//         setFormData(updatedFormData);
//     }

//     async function btnInsert() {
//         if (!emgg || emgg.length === 0) {
//             console.error("No files selected");
//             return;
//         }

//         await axios.post(`${process.env.REACT_APP_API_URL}/articales/CreateArticales`, formData, {
//             headers: {
//                 Authorization: "Bearer " + token,
//                 "Content-Type": "multipart/form-data"
//             }
//         })
//             .then(async (doc) =>
//                 await Swal.fire({
//                     icon: 'success',
//                     title: '<h1> Success </h1> <br /> تم اضافة المنتج ',
//                     // text: ' تم اضافة المنتج ' ,
//                     // footer: '<a href="/login">login?</a>',
//                     showConfirmButton: false,
//                     timer: 1500,
//                 }))
//             .then((doc) => { nav("/admin/Home/Home4") })
//             .catch((err) => console.log("err Post : ", err))
//     }

//     return (
//         <div id="allPage">
//             {dataa ?
//                 <div id="Page" style={{ width: "80%" }}>

//                     <div id="H1Login">
//                         <h1>{t("hedarAdmin.Create Product")}</h1>
//                     </div>
//                     {t("Category Market Name")}
//                     <select class="form-select form-select-lg mb-3" aria-label="Large select example" style={{ width: "80%" }} onChange={(e) => (setCategory(e.target.value))} >
//                         {dataa && dataa.map((item, index) => <option>{item.name}</option>)}
//                     </select>

//                     <div style={{ width: "80%", display: "flex" }}>
//                         <div class="mb-3" style={{ width: "50%" }}>
//                             <label for="exampleFormControlInput1" class="form-label">{t("ProductId.name")}</label>
//                             <input type="text" class="form-control" id="exampleFormControlInput1" onChange={e => setNamee(e.target.value)} placeholder="Xiaomi Redmi Note 8 Pro" />
//                         </div>
//                         <div class="mb-3" style={{ width: "50%" }}>
//                             <label for="exampleFormControlInput1" class="form-label">{t("ProductId.title")}</label>
//                             <input type="text" class="form-control" id="exampleFormControlInput1" onChange={e => setTitlee(e.target.value)} placeholder="Xiaomi Redmi Note 8 Pro 64GB Green Global version" />
//                         </div>
//                     </div>
//                     <div class="mb-3" style={{ width: "80%" }}>
//                         <label for="exampleFormControlTextarea1" class="form-label">{t("ProductId.information")}</label>
//                         <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" onChange={e => setInformationn(e.target.value)}></textarea>
//                     </div>
//                     <div style={{ width: "80%", display: "flex" }}>
//                         <div class="form-floating mb-3">
//                             <input type="number" class="form-control" id="floatingInputPrice" onChange={(e) => (setPricee(e.target.value))} placeholder="name@example.com" />
//                             <label for="floatingInputPrice">{t("Price")}</label>
//                             <div className="errMsgInbut" id="errphone"></div>
//                         </div>
//                         <div class="form-floating mb-3">
//                             <input type="number" class="form-control" id="floatingInputNumber" onChange={(e) => (setNumberr(e.target.value))} placeholder="name@example.com" />
//                             <label for="floatingInputNumber">{t("ProductId.Existing quantity")}</label>
//                             <div className="errMsgInbut" id="errphone"></div>
//                         </div>
//                     </div>
//                     <div class="form-floating mb-3">
//                         <input type="file" class="form-control" id="floatingInputNumber" onChange={(e) => handleFileSelect(e)} multiple placeholder="name@example.com" />
//                         <label for="floatingInputNumber">{t("ProductId.emg")}</label>
//                         <div className="errMsgInbut" id="errphone"></div>
//                     </div>

//                     <div class="col-12">
//                         <button type="submit" class="btn btn-success" onClick={btnInsert}> {t("hedarAdmin.Create Product")}</button>
//                     </div>
//                 </div>
//                 : <Loading />}

//         </div>
//     )
// }

// export default CreateArticales;




import { useContext, useEffect, useState } from "react";
import "../../cline/market/Articales.css";
import axios from "axios";
import Swal from "sweetalert2";
import { User } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../refreshPage/loading";
import { useTranslation } from "react-i18next";



function CreateArticales() {
    const { t, i18n } = useTranslation();

    const [dataa, setDataa] = useState([]);
    const [category, setCategory] = useState();
    const [nameeAr, setNameeAr] = useState("");
    const [nameeHe, setNameeHe] = useState("");
    const [titleeAr, setTitleeAr] = useState("");
    const [titleeHe, setTitleeHe] = useState("");
    const [informationnAr, setInformationnAr] = useState("");
    const [informationnHe, setInformationnHe] = useState("");
    const [pricee, setPricee] = useState("");
    const [numberr, setNumberr] = useState("");
    const [emg, setEmg] = useState(null);
    const [formData, setFormData] = useState(new FormData());

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/articales/GetCategoryMarket`, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                setDataa(response.data);
                setCategory(response.data[0] ? response.data[0].name : '');
            })
            .catch((error) => {
                console.log("Error fetching categories:", error);
            });
    }, []);

    function handleFileSelect(event) {
        const files = event.target.files;
        const selectedFiles = [];

        for (let i = 0; i < files.length; i++) {
            selectedFiles.push(files[i]);
        }
        setEmg(selectedFiles);

        const updatedFormData = new FormData();
        updatedFormData.append("category_ar", category.ar);
        updatedFormData.append("category_he", category.he);
        updatedFormData.append("name_ar", nameeAr);
        updatedFormData.append("name_he", nameeHe);
        updatedFormData.append("title_ar", titleeAr);
        updatedFormData.append("title_he", titleeHe);
        updatedFormData.append("information_ar", informationnAr);
        updatedFormData.append("information_he", informationnHe);
        updatedFormData.append("price", pricee);
        updatedFormData.append("number", numberr);

        for (let i = 0; i < selectedFiles.length; i++) {
            updatedFormData.append("file", selectedFiles[i]);
        }
        setFormData(updatedFormData);
    }

    async function btnInsert() {
        if (!emg || emg.length === 0) {
            console.error("No files selected");
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/articales/CreateArticales`, formData, {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data"
                }
            });

            await Swal.fire({
                icon: 'success',
                title: '<h1> Success </h1> <br /> تم اضافة المنتج ',
                showConfirmButton: false,
                timer: 1500,
                html: true
            });

            nav("/admin/Home/Home4");
        } catch (error) {
            console.log("Error posting data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create product',
            });
        }
    }

    const usernaw = useContext(User);
    const token = usernaw.auth.token;
    const nav = useNavigate();

    const data = dataa?.map((item) => ({
        name: (i18n.language == "ar" ? item.name.ar : item.name.he),
    })) || {}

    return (
        <div id="allPage">
            {dataa ? (
                <div id="Page">
                    <div id="H1Login">
                        <h1>{t("hedarAdmin.Create Product")}</h1>
                    </div>
                    <label>{t("Category Market Name")}</label>
                    <select className="form-select form-select-lg mb-3" aria-label="Large select example" style={{ width: "80%" }} onChange={(e) => setCategory(e.target.value)} >
                        {data.map((item, index) => <option key={index}>{item.name}</option>)}
                    </select>

                    <div style={{ width: "80%", display: "flex" }}>
                        <div className="mb-3" style={{ width: "48%", margin: "0 0 0 2%" }}>
                            <label htmlFor="exampleFormControlInput1" className="form-label">{t("ProductId.name")}</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" onChange={(e) => setNameeAr(e.target.value)} placeholder="بالعربية" />
                            <input type="text" style={{ marginTop: "5px" }} className="form-control" id="exampleFormControlInput1" onChange={(e) => setNameeHe(e.target.value)} placeholder="בעברית" />
                        </div>
                        <div className="mb-3" style={{ width: "48%", margin: "0 2% 0 0" }}>
                            <label htmlFor="exampleFormControlInput1" className="form-label">{t("ProductId.title")}</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" onChange={(e) => setTitleeAr(e.target.value)} placeholder="بالعربية" />
                            <input type="text" style={{ marginTop: "5px" }} className="form-control" id="exampleFormControlInput1" onChange={(e) => setTitleeHe(e.target.value)} placeholder="בעברית" />
                        </div>
                    </div>

                    <div className="mb-3" style={{ width: "80%" }}>
                        <label className="form-label">{t("ProductId.information")}</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={(e) => setInformationnAr(e.target.value)} placeholder="بالعربية"></textarea>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={(e) => setInformationnHe(e.target.value)} placeholder="בעברית"></textarea>
                    </div>

                    <div style={{ width: "80%", display: "flex" }}>
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control" id="floatingInputPrice" onChange={(e) => setPricee(e.target.value)} placeholder="0" />
                            <label htmlFor="floatingInputPrice">{t("Price")}</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control" id="floatingInputNumber" onChange={(e) => setNumberr(e.target.value)} placeholder="0" />
                            <label htmlFor="floatingInputNumber">{t("ProductId.Existing quantity")}</label>
                        </div>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="file" className="form-control" id="floatingInputNumber" onChange={(e) => handleFileSelect(e)} multiple />
                        <label htmlFor="floatingInputNumber">{t("ProductId.emg")}</label>
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-success" onClick={btnInsert}>{t("hedarAdmin.Create Product")}</button>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default CreateArticales;
