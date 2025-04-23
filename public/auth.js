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

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

initializeApp(firebaseConfig);
const auth = getAuth();

const schoolSelect = document.getElementById('schoolSelect');
const emailInput    = document.getElementById('email');
const pwdInput      = document.getElementById('password');
const loginBtn      = document.getElementById('loginBtn');
const signupBtn     = document.getElementById('signupBtn');
const resetBtn      = document.getElementById('resetPwdBtn');
const googleBtn     = document.getElementById('googleBtn');
const authMsg       = document.getElementById('authMsg');
const authDiv       = document.getElementById('auth-container');
const appDiv        = document.getElementById('app-content');

// Multi-tenant: set tenantId per school
schoolSelect.addEventListener('change', () => {
  auth.tenantId = schoolSelect.value || null;
});

// Auth state listener
onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    showApp();
  } else {
    showAuth();
  }
});

loginBtn.onclick = () => {
  clearMsg();
  signInWithEmailAndPassword(auth, emailInput.value, pwdInput.value)
    .catch(e => authMsg.textContent = e.message);
};

signupBtn.onclick = () => {
  clearMsg();
  createUserWithEmailAndPassword(auth, emailInput.value, pwdInput.value)
    .then(({ user }) => sendEmailVerification(user))
    .then(() => authMsg.textContent = 'Verification email sent.')
    .catch(e => authMsg.textContent = e.message);
};

resetBtn.onclick = () => {
  clearMsg();
  sendPasswordResetEmail(auth, emailInput.value)
    .then(() => authMsg.textContent = 'Password reset email sent.')
    .catch(e => authMsg.textContent = e.message);
};

googleBtn.onclick = () => {
  clearMsg();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .catch(e => authMsg.textContent = e.message);
};

document.getElementById('logoutBtn').onclick = () => auth.signOut();

function showApp() {
  authDiv.classList.add('hidden');
  appDiv.classList.remove('hidden');
}

function showAuth() {
  authDiv.classList.remove('hidden');
  appDiv.classList.add('hidden');
}

function clearMsg() {
  authMsg.textContent = '';
}
