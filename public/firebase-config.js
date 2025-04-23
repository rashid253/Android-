// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

// Your Firebase project configuration
// Copied directly from your Firebase Console → Project Settings → SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyA4QhGNwxn7lmvIzU6mpFL2Mz4B8134h6A",
  authDomain: "e-commerce-acad9.firebaseapp.com",
  projectId: "e-commerce-acad9",
  storageBucket: "e-commerce-acad9.firebasestorage.app",
  messagingSenderId: "228138409600",
  appId: "1:228138409600:web:0a122885f7dbe08eb95065",
  measurementId: "G-NV1MG7R55W"
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);
