import { auth } from "./config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

export const ADMIN_UID =
    "KjLk1k4hcBTecAZlyJ2YvLFHhD43";

export function protectAdminPage({
    onAuthorized = () => {},
    onUnauthorized = () => {}
} = {}) {

    return onAuthStateChanged(auth, async (user) => {

        /*
         * لا يوجد Anonymous هنا.
         *
         * الإدارة يجب أن تكون مسجلة
         * بحساب Email + Password.
         */

        if (!user) {

            window.location.href =
                "../login.html";

            return;
        }


        /*
         * التأكد أن المستخدم هو الإدارة
         */

        if (user.uid !== ADMIN_UID) {

            onUnauthorized(user);

            return;
        }


        /*
         * الحساب الإداري الصحيح
         */

        onAuthorized(user);

    });
}


export async function adminLogout() {

    await signOut(auth);

    window.location.href =
        "../login.html";
}
