import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyALNUiUxnUDW5MDBxXOs8VUjDSCrFgkYkk",
  authDomain: "masar-altamreed-62334.firebaseapp.com",
  projectId: "masar-altamreed-62334",
  storageBucket: "masar-altamreed-62334.firebasestorage.app",
  messagingSenderId: "313911491183",
  appId: "1:313911491183:web:a8492030f8f18568e2eb9a",
  measurementId: "G-HL35BEEKK2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
