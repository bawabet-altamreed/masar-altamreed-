import { signInAnonymously, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import { auth } from "./config.js";

export async function createAnonymousSession() {
  try {
    const result = await signInAnonymously(auth);

    return result.user;
  } catch (error) {
    console.error("Anonymous authentication error:", error);
    throw error;
  }
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
