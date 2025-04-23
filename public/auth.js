// auth.js
import { app } from "./firebase-config.js";
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

const auth = getAuth(app);

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

// Dynamic tenant: any school code
loginBtn.onclick = () => {
  clearMsg();
  auth.tenantId = schoolCodeInput.value.trim() || null;
  signInWithEmailAndPassword(auth, emailInput.value, pwdInput.value)
    .catch(e => authMsg.textContent = e.message);
};

signupBtn.onclick = () => {
  clearMsg();
  auth.tenantId = schoolCodeInput.value.trim() || null;
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
  auth.tenantId = schoolCodeInput.value.trim() || null;
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .catch(e => authMsg.textContent = e.message);
};

document.getElementById('logoutBtn').onclick = () => auth.signOut();

onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    authDiv.classList.add('hidden');
    appDiv.classList.remove('hidden');
  } else {
    authDiv.classList.remove('hidden');
    appDiv.classList.add('hidden');
  }
});

function clearMsg() {
  authMsg.textContent = '';
}
