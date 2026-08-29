import {
    db
} from "../../src/firebase/config.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/*
|--------------------------------------------------------------------------
| Get Lectures
|--------------------------------------------------------------------------
*/

export async function getStudentLectures(stage) {

    const lecturesRef =
        collection(
            db,
            "lectures"
        );


    const q =
        query(
            lecturesRef,
            where("stage", "==", stage),
            where("isPublished", "==", true),
            orderBy("createdAt", "desc")
        );


    const snapshot =
        await getDocs(q);


    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}


/*
|--------------------------------------------------------------------------
| Get Files
|--------------------------------------------------------------------------
*/

export async function getStudentFiles(stage) {

    const filesRef =
        collection(
            db,
            "files"
        );


    const q =
        query(
            filesRef,
            where("stage", "==", stage),
            where("isPublished", "==", true)
        );


    const snapshot =
        await getDocs(q);


    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}


/*
|--------------------------------------------------------------------------
| Get Schedule
|--------------------------------------------------------------------------
*/

export async function getStudentSchedule(stage) {

    const scheduleRef =
        collection(
            db,
            "schedule"
        );


    const q =
        query(
            scheduleRef,
            where("stage", "==", stage),
            where("isPublished", "==", true)
        );


    const snapshot =
        await getDocs(q);


    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}
