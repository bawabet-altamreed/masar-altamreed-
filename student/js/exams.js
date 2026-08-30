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
    document.getElementById("exams");


async function init() {

    const data =
        await protectStudentPage();

    const student =
        data.student;


    try {

        const q =
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


        const snapshot =
            await getDocs(q);


        if (snapshot.empty) {

            container.innerHTML = `
                <div class="empty">
                    لا توجد اختبارات متاحة حاليًا.
                </div>
            `;

            return;

        }


        container.innerHTML =
            snapshot.docs.map(doc => {

                const exam =
                    doc.data();


                if (
                    exam.isActive === false
                ) {

                    return "";

                }


                return `

                    <article class="card">

                        <div class="title">
                            📝
                            ${exam.title || "اختبار"}
                        </div>

                        <div class="info">

                            📚
                            ${exam.subject || "المادة"}

                            ${
                                exam.duration
                                ? `<br>⏱️ المدة:
                                   ${exam.duration} دقيقة`
                                : ""
                            }

                            ${
                                exam.questionsCount
                                ? `<br>❓ عدد الأسئلة:
                                   ${exam.questionsCount}`
                                : ""
                            }

                        </div>

                        ${
                            exam.url
                            ? `
                            <a
                                href="${exam.url}"
                                target="_blank"
                                rel="noopener"
                                class="btn"
                            >
                                بدء الاختبار
                            </a>
                            `
                            : ""
                        }

                    </article>

                `;

            }).join("");


    } catch(error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty">
                تعذر تحميل الاختبارات.
            </div>
        `;

    }

}


init();
