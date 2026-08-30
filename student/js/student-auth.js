import { auth, db } from "../../src/firebase/config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =====================================================
   SESSION
   ===================================================== */

const SESSION_KEY = "masar_student_session";


/* =====================================================
   STAGE NAMES
   ===================================================== */

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


/* =====================================================
   SESSION FUNCTIONS
   ===================================================== */

export function getSession() {

    try {

        const session =
            localStorage.getItem(SESSION_KEY);

        if (!session) {
            return null;
        }

        return JSON.parse(session);

    } catch (error) {

        console.error(
            "Session read error:",
            error
        );

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


/* =====================================================
   GET CURRENT FIREBASE USER
   ===================================================== */

export function getCurrentUser() {

    return auth.currentUser || null;

}


/* =====================================================
   GET USER PROFILE
   ===================================================== */

export async function getUserProfile(uid) {

    if (!uid) {
        return null;
    }

    const userRef =
        doc(
            db,
            "users",
            uid
        );

    const snapshot =
        await getDoc(userRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {

        id: snapshot.id,

        ...snapshot.data()

    };

}


/* =====================================================
   GET STUDENT DATA
   ===================================================== */

export async function getStudentData() {

    const session =
        getSession();

    if (
        !session ||
        !session.studentId
    ) {

        return null;
    }


    const studentRef =
        doc(
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


/* =====================================================
   PROTECT STUDENT PAGE
   ===================================================== */

export async function protectStudentPage() {

    return new Promise((resolve) => {

        let handled = false;


        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (user) => {

                    if (handled) {
                        return;
                    }


                    /* ===============================
                       NO FIREBASE USER
                       =============================== */

                    if (!user) {

                        handled = true;

                        unsubscribe();

                        clearSession();

                        window.location.replace(
                            "../login.html"
                        );

                        return;
                    }


                    /* ===============================
                       GET SESSION
                       =============================== */

                    const session =
                        getSession();


                    if (
                        !session ||
                        !session.studentId
                    ) {

                        handled = true;

                        unsubscribe();

                        clearSession();

                        await signOut(auth)
                            .catch(() => {});

                        window.location.replace(
                            "../login.html"
                        );

                        return;
                    }


                    try {

                        /* ===============================
                           GET USER PROFILE
                           =============================== */

                        const profile =
                            await getUserProfile(
                                user.uid
                            );


                        if (!profile) {

                            handled = true;

                            unsubscribe();

                            clearSession();

                            await signOut(auth)
                                .catch(() => {});

                            window.location.replace(
                                "../login.html"
                            );

                            return;
                        }


                        /* ===============================
                           ROLE CHECK
                           =============================== */

                        if (
                            profile.role !==
                            "student"
                        ) {

                            handled = true;

                            unsubscribe();

                            clearSession();

                            await signOut(auth)
                                .catch(() => {});

                            window.location.replace(
                                "../login.html"
                            );

                            return;
                        }


                        /* ===============================
                           STUDENT ID CHECK
                           =============================== */

                        if (
                            profile.studentId !==
                            session.studentId
                        ) {

                            handled = true;

                            unsubscribe();

                            clearSession();

                            await signOut(auth)
                                .catch(() => {});

                            window.location.replace(
                                "../login.html"
                            );

                            return;
                        }


                        /* ===============================
                           ACTIVE CHECK
                           =============================== */

                        if (
                            profile.isActive === false
                        ) {

                            handled = true;

                            unsubscribe();

                            clearSession();

                            await signOut(auth)
                                .catch(() => {});

                            window.location.replace(
                                "../login.html"
                            );

                            return;
                        }


                        /* ===============================
                           GET STUDENT
                           =============================== */

                        const student =
                            await getStudentData();


                        if (!student) {

                            handled = true;

                            unsubscribe();

                            clearSession();

                            await signOut(auth)
                                .catch(() => {});

                            window.location.replace(
                                "../login.html"
                            );

                            return;
                        }


                        /* ===============================
                           STUDENT ACTIVE CHECK
                           =============================== */

                        if (
                            student.isActive === false
                        ) {

                            handled = true;

                            unsubscribe();

                            clearSession();

                            await signOut(auth)
                                .catch(() => {});

                            window.location.replace(
                                "../login.html"
                            );

                            return;
                        }


                        /* ===============================
                           UPDATE SESSION
                           =============================== */

                        saveSession({

                            uid:
                                user.uid,

                            studentId:
                                session.studentId,

                            subscriptionCode:
                                profile.subscriptionCode ||
                                session.subscriptionCode ||
                                "",

                            name:
                                student.name ||
                                profile.name ||
                                "الطالب",

                            stage:
                                student.stage ||
                                profile.stage ||
                                "",

                            role:
                                "student"

                        });


                        handled = true;

                        unsubscribe();


                        /* ===============================
                           SUCCESS
                           =============================== */

                        resolve({

                            user,

                            profile,

                            student,

                            session:
                                getSession()

                        });


                    } catch (error) {

                        console.error(
                            "Student auth error:",
                            error
                        );


                        if (handled) {
                            return;
                        }


                        handled = true;

                        unsubscribe();


                        document.body.innerHTML = `

                            <div style="
                                min-height:100vh;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                padding:20px;
                                font-family:Tahoma,Arial;
                                text-align:center;
                                background:#f5f7fb;
                            ">

                                <div style="
                                    background:#fff;
                                    padding:30px;
                                    border-radius:20px;
                                    max-width:420px;
                                    width:100%;
                                    box-shadow:0 10px 30px rgba(0,0,0,.08);
                                ">

                                    <div style="
                                        font-size:45px;
                                        margin-bottom:15px;
                                    ">
                                        ⚠️
                                    </div>

                                    <h2>
                                        تعذر التحقق من الحساب
                                    </h2>

                                    <p style="
                                        color:#777;
                                        line-height:1.8;
                                        margin-top:10px;
                                    ">
                                        حدث خطأ أثناء تحميل بيانات الطالب.
                                        يرجى إعادة تحميل الصفحة.
                                    </p>

                                    <button
                                        onclick="location.reload()"
                                        style="
                                            margin-top:15px;
                                            border:0;
                                            background:#1769aa;
                                            color:#fff;
                                            padding:12px 20px;
                                            border-radius:10px;
                                            font-weight:bold;
                                            cursor:pointer;
                                        "
                                    >
                                        إعادة المحاولة
                                    </button>

                                </div>

                            </div>

                        `;

                    }

                }

            );

    });

}


/* =====================================================
   LOGOUT
   ===================================================== */

export async function logoutStudent() {

    clearSession();

    try {

        await signOut(auth);

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }


    window.location.replace(
        "../login.html"
    );

}
