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


const SESSION_KEY =
    "masar_student_session";


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


/*
 * =====================================================
 * SESSION
 * =====================================================
 */

export function getSession(){

    try{

        const raw =
            localStorage.getItem(
                SESSION_KEY
            );

        if(!raw){
            return null;
        }

        return JSON.parse(raw);

    }catch(error){

        console.error(
            "SESSION ERROR:",
            error
        );

        return null;

    }

}


export function saveSession(data){

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(data)
    );

}


export function clearSession(){

    localStorage.removeItem(
        SESSION_KEY
    );

}


/*
 * =====================================================
 * LOGOUT
 * =====================================================
 */

export async function logoutStudent(){

    clearSession();

    try{

        await signOut(auth);

    }catch(error){

        console.error(
            "LOGOUT ERROR:",
            error
        );

    }

    window.location.href =
        "../login.html";

}


/*
 * =====================================================
 * CURRENT FIREBASE USER
 * =====================================================
 */

export function getCurrentUser(){

    return auth.currentUser || null;

}


/*
 * =====================================================
 * LOAD USER PROFILE
 * =====================================================
 */

export async function getUserProfile(){

    const user =
        auth.currentUser;


    if(!user){

        return null;

    }


    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    const snapshot =
        await getDoc(userRef);


    if(!snapshot.exists()){

        return null;

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


/*
 * =====================================================
 * LOAD STUDENT
 * =====================================================
 */

export async function getStudentData(){

    const session =
        getSession();


    if(
        !session ||
        !session.studentId
    ){

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


    if(!snapshot.exists()){

        return null;

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


/*
 * =====================================================
 * PROTECT PAGE
 * =====================================================
 */

export async function protectStudentPage(){

    return new Promise(
        (resolve)=>{

            let finished = false;


            const redirectLogin = ()=>{

                if(finished){
                    return;
                }

                finished = true;

                clearSession();

                window.location.replace(
                    "../login.html"
                );

            };


            const unsubscribe =
                onAuthStateChanged(
                    auth,
                    async(user)=>{

                        if(!user){

                            unsubscribe();

                            redirectLogin();

                            return;

                        }


                        const session =
                            getSession();


                        if(
                            !session ||
                            !session.studentId
                        ){

                            unsubscribe();

                            redirectLogin();

                            return;

                        }


                        try{

                            /*
                             * ==================================
                             * users/{uid}
                             * ==================================
                             */

                            const profile =
                                await getUserProfile();


                            if(!profile){

                                unsubscribe();

                                redirectLogin();

                                return;

                            }


                            /*
                             * ==================================
                             * Role
                             * ==================================
                             */

                            if(
                                profile.role !==
                                "student"
                            ){

                                unsubscribe();

                                redirectLogin();

                                return;

                            }


                            /*
                             * ==================================
                             * Active
                             * ==================================
                             */

                            if(
                                profile.isActive === false
                            ){

                                unsubscribe();

                                redirectLogin();

                                return;

                            }


                            /*
                             * ==================================
                             * Student
                             * ==================================
                             */

                            const student =
                                await getStudentData();


                            if(!student){

                                unsubscribe();

                                redirectLogin();

                                return;

                            }


                            if(
                                student.isActive === false
                            ){

                                unsubscribe();

                                redirectLogin();

                                return;

                            }


                            /*
                             * ==================================
                             * تأكيد التطابق
                             * ==================================
                             */

                            if(
                                profile.studentId
                                !==
                                session.studentId
                            ){

                                unsubscribe();

                                redirectLogin();

                                return;

                            }


                            /*
                             * ==================================
                             * تحديث Session
                             * ==================================
                             */

                            saveSession({

                                uid:
                                    user.uid,

                                studentId:
                                    student.id,

                                subscriptionCode:
                                    profile.subscriptionCode
                                    ||
                                    session.subscriptionCode
                                    ||
                                    "",

                                stage:
                                    student.stage
                                    ||
                                    profile.stage
                                    ||
                                    "",

                                name:
                                    student.name
                                    ||
                                    profile.name
                                    ||
                                    "طالب"

                            });


                            unsubscribe();


                            if(!finished){

                                finished = true;


                                resolve({

                                    user:

                                        user,

                                    profile:

                                        profile,

                                    student:

                                        student,

                                    session:

                                        getSession()

                                });

                            }

                        }catch(error){

                            console.error(
                                "STUDENT AUTH ERROR:",
                                error
                            );


                            unsubscribe();

                            document.body.innerHTML = `

                                <div style="
                                    min-height:100vh;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    padding:25px;
                                    font-family:Tahoma,Arial;
                                    text-align:center;
                                    background:#f5f7fb;
                                ">

                                    <div style="
                                        max-width:450px;
                                        background:white;
                                        padding:30px;
                                        border-radius:20px;
                                        box-shadow:0 15px 40px rgba(0,0,0,.08);
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
                                            margin-top:12px;
                                            color:#777;
                                            line-height:1.8;
                                        ">
                                            تأكد من نشر Firestore Rules
                                            ثم حاول تسجيل الدخول مرة أخرى.
                                        </p>

                                        <button
                                            onclick="location.href='../login.html'"
                                            style="
                                                margin-top:18px;
                                                border:0;
                                                background:#1769aa;
                                                color:white;
                                                padding:12px 20px;
                                                border-radius:10px;
                                                cursor:pointer;
                                                font-family:inherit;
                                                font-weight:bold;
                                            "
                                        >
                                            العودة لتسجيل الدخول
                                        </button>

                                    </div>

                                </div>

                            `;

                        }

                    }
                );

        }
    );

}
