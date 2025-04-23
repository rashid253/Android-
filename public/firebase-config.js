// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth }      from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ⚙️ Your Firebase config — copy exactly from Firebase Console → Project Settings → SDK setup
const firebaseConfig = {
  apiKey:            "AIzaSyA4QhGNwxn7lmvIzU6mpFL2Mz4B8134h6A",
  authDomain:        "e-commerce-acad9.firebaseapp.com",
  projectId:         "e-commerce-acad9",
  storageBucket:     "e-commerce-acad9.firebasestorage.app",
  messagingSenderId: "228138409600",
  appId:             "1:228138409600:web:0a122885f7dbe08eb95065",
  measurementId:     "G-NV1MG7R55W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore instances for use in auth.js and app.js
export const auth = getAuth(app);
export const db   = getFirestore(app);
