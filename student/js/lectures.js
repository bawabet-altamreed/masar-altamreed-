import {
    protectStudentPage,
    stageNames
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
    document.getElementById("lectures");

const stageText =
    document.getElementById("stageText");


async function init() {

    const data =
        await protectStudentPage();

    const student =
        data.student;


    stageText.textContent =
        "المرحلة: " +
        (
            stageNames[student.stage]
            || student.stage
            || "غير محددة"
        );


    try {

        const q =
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


        const snapshot =
            await getDocs(q);


        if (snapshot.empty) {

            container.innerHTML = `
                <div class="empty">
                    لا توجد محاضرات متاحة حاليًا.
                </div>
            `;

            return;

        }


        container.innerHTML =
            snapshot.docs.map(doc => {

                const item =
                    doc.data();


                return `

                    <article class="card">

                        <div class="type">
                            ${
                                item.type === "live"
                                ? "🔴 محاضرة مباشرة"
                                : "🎥 محاضرة مسجلة"
                            }
                        </div>

                        <div class="title">
                            ${item.title || "محاضرة"}
                        </div>

                        <div class="info">

                            👨‍🏫
                            ${item.teacher || "المدرس"}

                            <br>

                            📚
                            ${item.subject || "المادة"}

                            ${
                                item.date
                                ? `<br>📅 ${item.date}`
                                : ""
                            }

                        </div>

                        ${
                            item.url
                            ? `
                            <a
                                href="${item.url}"
                                target="_blank"
                                rel="noopener"
                                class="btn"
                            >
                                ${
                                    item.type === "live"
                                    ? "دخول المحاضرة"
                                    : "مشاهدة المحاضرة"
                                }
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
                تعذر تحميل المحاضرات.
            </div>
        `;

    }

}


init();
