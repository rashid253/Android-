// public/auth.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey:            "AIzaSyA4QhGNwxn7lmvIzU6mpFL2Mz4B8134h6A",
  authDomain:        "e-commerce-acad9.firebaseapp.com",
  projectId:         "e-commerce-acad9",
  storageBucket:     "e-commerce-acad9.firebasestorage.app",
  messagingSenderId: "228138409600",
  appId:             "1:228138409600:web:0a122885f7dbe08eb95065",
  measurementId:     "G-NV1MG7R55W"
};

// Initialize Firebase App & Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Sign up a new user and send email verification.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<import("firebase/auth").User>}
 */
export async function signUp(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // Set display name
  await updateProfile(user, { displayName });
  // Send verification email
  await sendEmailVerification(user);
  return user;
}

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import("firebase/auth").User>}
 */
export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  if (!user.emailVerified) {
    await signOut(auth);
    throw new Error('Please verify your email before logging in.');
  }
  return user;
}

/**
 * Send a password reset email.
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  await signOut(auth);
}

/**
 * Observe auth state changes.
 * @param {(user: import("firebase/auth").User|null) => void} callback
 * @returns {() => void} unsubscribe
 */
export function onAuthState(cb) {
  return onAuthStateChanged(auth, cb);
}

/**
 * Get the currently signed-in user (if any).
 * @returns {import("firebase/auth").User|null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}
