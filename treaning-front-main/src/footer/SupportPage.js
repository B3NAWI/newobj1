import axios from "axios";
import { useState } from "react";
import React from 'react';
import Swal from "sweetalert2";

function SupportPage() {
    const [selectt, setSelectt] = useState("")
    const [massegee, setMassegee] = useState("")
    const dataa = { select: selectt, massege: massegee }

    const btnSupport = async function send() {
        await axios.post(`${process.env.REACT_APP_API_URL}/support/CreateSupport`, dataa)
            .then((doc) =>
                Swal.fire({
                    icon: 'success',
                    title: 'Success Send Massege',
                    // text: 'Something went wrong!',
                    // footer: '<a href="/login">login?</a>',
                    showConfirmButton: false,
                    timer: 1500,
                })
            )
            .catch((err) => console.log(err))
        window.location.replace("/")
    }

    return (
        <div>
            <div id="aaa"></div>
            <div id="Page">
                نوع التواصل <select onChange={e => setSelectt(e.target.value)}>
                    <option>- اختر الدعم -</option>
                    <option>المساعدة</option>
                    <option>استفسار</option>
                    <option>شكوى</option>
                    <option>فشل تسجيل الدخول</option>
                    <option>طلب منتج</option>
                </select>
                الرسالة :
                <textarea onChange={e => setMassegee(e.target.value)}></textarea>
                <button onClick={btnSupport}>ارسال</button>

            </div>
        </div>
    )
}

export default SupportPage;