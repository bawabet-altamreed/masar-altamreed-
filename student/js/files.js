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
    document.getElementById("files");

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
            || ""
        );


    try {

        const q =
            query(
                collection(
                    db,
                    "files"
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
                    لا توجد ملفات متاحة حاليًا.
                </div>
            `;

            return;

        }


        container.innerHTML =
            snapshot.docs.map(doc => {

                const item =
                    doc.data();


                return `

                    <article class="file">

                        <div class="icon">
                            📄
                        </div>

                        <div class="title">
                            ${item.title || "ملف تعليمي"}
                        </div>

                        <div class="info">

                            📚
                            ${item.subject || "مادة"}

                            ${
                                item.teacher
                                ? `<br>👨‍🏫 ${item.teacher}`
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
                                class="download"
                            >
                                فتح الملف
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
                تعذر تحميل الملفات.
            </div>
        `;

    }

}


init();
