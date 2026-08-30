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
    document.getElementById("leaderboard");

const stageText =
    document.getElementById("stageText");


async function init() {

    const data =
        await protectStudentPage();

    const student =
        data.student;


    stageText.textContent =
        "ترتيب طلاب " +
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
                    "students"
                ),
                where(
                    "stage",
                    "==",
                    student.stage
                )
            );


        const snapshot =
            await getDocs(q);


        const students =
            snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }));


        students.sort(
            (a,b) =>
                Number(b.points || 0)
                -
                Number(a.points || 0)
        );


        if (!students.length) {

            container.innerHTML = `
                <div class="empty">
                    لا يوجد ترتيب حاليًا.
                </div>
            `;

            return;

        }


        container.innerHTML =
            students.map((item,index) => `

                <div class="row">

                    <div class="rank">
                        #${index + 1}
                    </div>

                    <div>
                        ${
                            item.name || "طالب"
                        }

                        ${
                            item.id === student.id
                            ? " ⭐"
                            : ""
                        }
                    </div>

                    <div class="score">
                        ${item.points || 0}
                    </div>

                </div>

            `).join("");


    } catch(error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty">
                تعذر تحميل الترتيب.
            </div>
        `;

    }

}


init();
