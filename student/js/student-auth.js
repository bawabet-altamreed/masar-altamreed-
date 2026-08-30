import { auth, db } from "../../src/firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const SESSION_KEY = "masar_student_session";


export const stageNames = {

    first_secondary_nursing:
        "الأول الثانوي التمريض",

    second_secondary_nursing:
        "الثاني الثانوي التمريض",

    third_secondary_nursing:
        "الثالث الثانوي التمريض",

    first_institute_nursing:
        "الأول معهد التمريض",

    second_institute_nursing:
        "الثاني معهد التمريض"

};


export function getSession() {

    try {

        return JSON.parse(
            localStorage.getItem(SESSION_KEY)
        );

    } catch {

        return null;

    }

}


export function saveSession(data) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(data)
    );

}


export function clearSession() {

    localStorage.removeItem(
        SESSION_KEY
    );

}


export async function logoutStudent() {

    clearSession();

    try {

        await signOut(auth);

    } catch (error) {

        console.error(error);

    }

    window.location.href =
        "../login.html";

}


export async function getStudentData() {

    const session = getSession();

    if (!session || !session.studentId) {

        return null;

    }


    const studentRef = doc(
        db,
        "students",
        session.studentId
    );


    const snapshot =
        await getDoc(studentRef);


    if (!snapshot.exists()) {

        return null;

    }


    return {

        id: snapshot.id,

        ...snapshot.data()

    };

}


export async function protectStudentPage() {

    return new Promise((resolve) => {

        onAuthStateChanged(
            auth,
            async (user) => {

                if (!user) {

                    window.location.href =
                        "../login.html";

                    return;

                }


                const session =
                    getSession();


                if (
                    !session ||
                    !session.studentId
                ) {

                    window.location.href =
                        "../login.html";

                    return;

                }


                try {

                    const student =
                        await getStudentData();


                    if (!student) {

                        clearSession();

                        window.location.href =
                            "../login.html";

                        return;

                    }


                    if (
                        student.isActive === false
                    ) {

                        clearSession();

                        window.location.href =
                            "../login.html";

                        return;

                    }


                    resolve({

                        user,

                        student,

                        session

                    });


                } catch (error) {

                    console.error(error);

                    document.body.innerHTML = `
                        <div style="
                            min-height:100vh;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            padding:20px;
                            text-align:center;
                            font-family:Tahoma,Arial;
                        ">
                            <div>
                                <div style="font-size:50px;">⚠️</div>
                                <h2>حدث خطأ</h2>
                                <p style="color:#777;margin-top:10px;">
                                    تعذر تحميل بيانات الطالب.
                                </p>
                            </div>
                        </div>
                    `;

                }

            }
        );

    });

}
