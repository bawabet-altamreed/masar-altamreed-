import {
    auth,
    db
} from "../../src/firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


let currentStudent = null;
let authReady = false;


/*
|--------------------------------------------------------------------------
| Student Authentication Guard
|--------------------------------------------------------------------------
*/

export function requireStudent(callback) {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href =
                "../login.html";

            return;
        }


        try {

            /*
             * users/{uid}
             */

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );

            const userSnapshot =
                await getDoc(userRef);


            if (!userSnapshot.exists()) {

                await logoutStudent();

                return;
            }


            const userData =
                userSnapshot.data();


            /*
             * التأكد من أن الحساب طالب
             */

            if (
                userData.role !== "student" ||
                userData.isActive !== true
            ) {

                await logoutStudent();

                return;
            }


            /*
             * studentId
             */

            if (!userData.studentId) {

                showAuthError(
                    "حساب الطالب غير مرتبط ببيانات الطالب."
                );

                return;
            }


            /*
             * students/{studentId}
             */

            const studentRef =
                doc(
                    db,
                    "students",
                    userData.studentId
                );

            const studentSnapshot =
                await getDoc(studentRef);


            if (!studentSnapshot.exists()) {

                showAuthError(
                    "لم يتم العثور على بيانات الطالب."
                );

                return;
            }


            const studentData =
                studentSnapshot.data();


            /*
             * التحقق من حالة الطالب
             */

            if (
                studentData.isActive === false
            ) {

                showAuthError(
                    "حساب الطالب موقوف حاليًا."
                );

                return;
            }


            /*
             * حفظ بيانات الجلسة في الذاكرة
             */

            currentStudent = {

                uid: user.uid,

                user: userData,

                student: studentData

            };


            authReady = true;


            /*
             * تشغيل الصفحة
             */

            callback(currentStudent);


        } catch (error) {

            console.error(
                "Student auth error:",
                error
            );

            showAuthError(
                "حدث خطأ أثناء تحميل حساب الطالب."
            );

        }

    });

}


/*
|--------------------------------------------------------------------------
| Current Student
|--------------------------------------------------------------------------
*/

export function getCurrentStudent() {

    return currentStudent;

}


/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export async function logoutStudent() {

    try {

        await signOut(auth);

    } catch (error) {

        console.error(error);

    }

    window.location.href =
        "../login.html";

}


/*
|--------------------------------------------------------------------------
| Auth Error
|--------------------------------------------------------------------------
*/

function showAuthError(message) {

    document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            background:#f4f7fb;
            font-family:Tahoma,Arial;
            text-align:center;
        ">

            <div style="
                max-width:450px;
                width:100%;
                background:white;
                padding:30px;
                border-radius:20px;
                box-shadow:0 15px 40px rgba(0,0,0,.08);
            ">

                <div style="
                    font-size:50px;
                    margin-bottom:15px;
                ">
                    ⚠️
                </div>

                <h2 style="
                    color:#172033;
                    margin-bottom:10px;
                ">
                    تعذر فتح المنصة
                </h2>

                <p style="
                    color:#718096;
                    line-height:1.8;
                    font-size:14px;
                ">
                    ${message}
                </p>

                <button
                    onclick="location.href='../login.html'"
                    style="
                        margin-top:20px;
                        border:none;
                        background:#1769aa;
                        color:white;
                        padding:12px 25px;
                        border-radius:10px;
                        font-family:inherit;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    العودة لتسجيل الدخول
                </button>

            </div>

        </div>

    `;

}
