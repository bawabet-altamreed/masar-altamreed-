import {
    protectStudentPage,
    logoutStudent,
    stageNames
} from "./student-auth.js";


const loading =
    document.getElementById("loading");

const content =
    document.getElementById("content");

const studentName =
    document.getElementById("studentName");

const studentStage =
    document.getElementById("studentStage");

const subscriptionCode =
    document.getElementById("subscriptionCode");

const subscriptionStatus =
    document.getElementById("subscriptionStatus");

const endDate =
    document.getElementById("endDate");

const logoutBtn =
    document.getElementById("logoutBtn");


logoutBtn.addEventListener(
    "click",
    logoutStudent
);


async function init() {

    try {

        const data =
            await protectStudentPage();

        const student =
            data.student;

        studentName.textContent =
            student.name || "الطالب";


        studentStage.textContent =
            "المرحلة: " +
            (
                stageNames[student.stage]
                || student.stage
                || "غير محددة"
            );


        subscriptionCode.textContent =
            student.subscriptionCode
            || student.id
            || "—";


        subscriptionStatus.textContent =
            student.status === "active"
                ? "نشط ✅"
                : "غير نشط";


        endDate.textContent =
            student.endDate || "—";


        loading.style.display =
            "none";

        content.style.display =
            "block";


    } catch (error) {

        console.error(error);

        loading.textContent =
            "تعذر تحميل بيانات الطالب.";

    }

}


init();
