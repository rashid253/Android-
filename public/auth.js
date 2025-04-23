// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// DOM Elements
const schoolCodeInput = document.getElementById('schoolCode');
const emailInput      = document.getElementById('email');
const pwdInput        = document.getElementById('password');
const loginBtn        = document.getElementById('loginBtn');
const signupBtn       = document.getElementById('signupBtn');
const resetBtn        = document.getElementById('resetPwdBtn');
const googleBtn       = document.getElementById('googleBtn');
const authMsg         = document.getElementById('authMsg');
const authDiv         = document.getElementById('auth-container');
const appDiv          = document.getElementById('app-content');

// Set tenantId by school code
schoolCodeInput.addEventListener('input', () => {
  auth.tenantId = schoolCodeInput.value.trim() || null;
});

// Auth state listener
onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    authDiv.classList.add('hidden');
    appDiv.classList.remove('hidden');
  } else {
    authDiv.classList.remove('hidden');
    appDiv.classList.add('hidden');
  }
});

// Login
loginBtn.onclick = () => {
  clearMsg();
  auth.tenantId = schoolCodeInput.value.trim() || null;
  signInWithEmailAndPassword(auth, emailInput.value, pwdInput.value)
    .catch(e => authMsg.textContent = e.message);
};

// Sign Up with email verification
signupBtn.onclick = () => {
  clearMsg();
  auth.tenantId = schoolCodeInput.value.trim() || null;
  createUserWithEmailAndPassword(auth, emailInput.value, pwdInput.value)
    .then(({ user }) => sendEmailVerification(user))
    .then(() => authMsg.textContent = 'Verification email sent.')
    .catch(e => authMsg.textContent = e.message);
};

// Password Reset
resetBtn.onclick = () => {
  clearMsg();
  sendPasswordResetEmail(auth, emailInput.value)
    .then(() => authMsg.textContent = 'Password reset email sent.')
    .catch(e => authMsg.textContent = e.message);
};

// Google Sign-In
googleBtn.onclick = () => {
  clearMsg();
  auth.tenantId = schoolCodeInput.value.trim() || null;
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .catch(e => authMsg.textContent = e.message);
};

// Logout
document.getElementById('logoutBtn').onclick = () => auth.signOut();

function clearMsg() {
  authMsg.textContent = '';
}
