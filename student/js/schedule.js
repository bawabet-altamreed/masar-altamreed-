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
    document.getElementById("schedule");

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
                    "schedules"
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
                    لا يوجد جدول متاح حاليًا.
                </div>
            `;

            return;

        }


        const items =
            snapshot.docs.map(
                doc => ({
                    id: doc.id,
                    ...doc.data()
                })
            );


        items.sort(
            (a,b) =>
                String(a.date || "")
                .localeCompare(
                    String(b.date || "")
                )
        );


        container.innerHTML =
            items.map(item => `

                <div class="item">

                    <div class="day">
                        ${item.day || item.date || ""}
                    </div>

                    <div class="subject">
                        ${item.subject || "محاضرة"}
                    </div>

                    <div class="details">

                        👨‍🏫
                        ${item.teacher || "المدرس"}

                        <br>

                        ⏰
                        ${item.time || "غير محدد"}

                        <br>

                        📍
                        ${item.location || "أونلاين"}

                    </div>

                    ${
                        item.type === "live"
                        ? `<span class="live">
                            🔴 LIVE
                           </span>`
                        : ""
                    }

                </div>

            `).join("");


    } catch(error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty">
                تعذر تحميل الجدول.
            </div>
        `;

    }

}


init();
