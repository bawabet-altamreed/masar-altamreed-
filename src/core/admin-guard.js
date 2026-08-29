import { auth } from "../firebase/config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const ADMIN_UID =
    "KjLk1k4hcBTecAZlyJ2YvLFHhD43";


export function requireAdmin() {

    return new Promise((resolve) => {

        onAuthStateChanged(auth, (user) => {

            if (!user) {

                window.location.href =
                    "../login.html";

                return;

            }


            if (user.uid !== ADMIN_UID) {

                document.body.innerHTML = `
                    <div style="
                        min-height:100vh;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        text-align:center;
                        font-family:Tahoma,Arial;
                        background:#f4f7fb;
                        padding:20px;
                    ">

                        <div>

                            <div style="
                                font-size:55px;
                                margin-bottom:15px;
                            ">
                                🔒
                            </div>

                            <h2>
                                غير مصرح لك بالدخول
                            </h2>

                            <p style="
                                color:#777;
                                margin-top:10px;
                            ">
                                هذه الصفحة مخصصة لإدارة
                                مسار التمريض.
                            </p>

                        </div>

                    </div>
                `;

                return;

            }


            resolve(user);

        });

    });

}
