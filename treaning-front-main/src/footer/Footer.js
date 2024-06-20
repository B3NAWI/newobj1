import { ModalFooter } from 'react-bootstrap';
import './Footer.css';
import React, { useEffect } from 'react';



function Footer() {


    return (<>
        <div>
            <div >
                <footer class="w3-container w3-padding-16" style={{ backgroundColor: "white", boxShadow: "-1px 4px 20px 0px #a5a5a5", color: "#225f1f" }}>
                    <h5>Footer</h5>
                </footer>

                <footer class="w3-container" style={{ backgroundColor: "#198754", color: "white" }}>
                    <p>Powered by <a target="_blank">HLDSH TECH</a></p>
                </footer>
            </div>
        </div>
    </>)
}

export default Footer