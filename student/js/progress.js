import {
    protectStudentPage
} from "./student-auth.js";

import {
    db
} from "../../src/firebase/config.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const container =
    document.getElementById("progress");


async function init() {

    const data =
        await protectStudentPage();

    const student =
        data.student;


    try {

        let lecturesCount = 0;
        let examsCount = 0;


        const lecturesQuery =
            query(
                collection(
                    db,
                    "lectures"
                ),
                where(
                    "stage",
                    "==",
                    student.stage
                )
            );


        const lecturesSnapshot =
            await getDocs(
                lecturesQuery
            );


        lecturesCount =
            lecturesSnapshot.size;


        const examsQuery =
            query(
                collection(
                    db,
                    "exams"
                ),
                where(
                    "stage",
                    "==",
                    student.stage
                )
            );


        const examsSnapshot =
            await getDocs(
                examsQuery
            );


        examsCount =
            examsSnapshot.size;


        const completedExams =
            Number(
                student.completedExams || 0
            );


        const points =
            Number(
                student.points || 0
            );


        container.innerHTML = `

            <div class="card">

                <h3>
                    🎥 المحاضرات
                </h3>

                <div class="number">
                    ${lecturesCount}
                </div>

                <div class="label">
                    محاضرة متاحة
                </div>

            </div>


            <div class="card">

                <h3>
                    📝 الاختبارات
                </h3>

                <div class="number">
                    ${examsCount}
                </div>

                <div class="label">
                    اختبار متاح
                </div>

            </div>


            <div class="card">

                <h3>
                    ✅ اختبارات تم حلها
                </h3>

                <div class="number">
                    ${completedExams}
                </div>

                <div class="label">
                    اختبار مكتمل
                </div>

            </div>


            <div class="card">

                <h3>
                    🏆 النقاط
                </h3>

                <div class="number">
                    ${points}
                </div>

                <div class="label">
                    إجمالي النقاط
                </div>

            </div>

        `;


    } catch(error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty">
                تعذر تحميل بيانات التقدم.
            </div>
        `;

    }

}


init();
