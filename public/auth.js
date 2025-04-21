// public/auth.js

// Helper to get elements by ID
const $ = id => document.getElementById(id);

// Firebase Auth instance
const auth = firebase.auth();

// UI elements
const emailInput        = $('email');
const passwordInput     = $('password');
const signupBtn         = $('signupBtn');
const loginBtn          = $('loginBtn');
const resetPasswordBtn  = $('resetPasswordBtn');
const logoutBtn         = $('logoutBtn');
const authContainer     = $('auth-container');
const appContainer      = $('app-content');

// Monitor auth state: show auth UI or main app
auth.onAuthStateChanged(user => {
  if (user) {
    if (!user.emailVerified) {
      alert('Please verify your email before continuing.');
      auth.signOut();
      return;
    }
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
  } else {
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
  }
});

// Sign‑Up handler
signupBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const pwd   = passwordInput.value;
  if (!email || !pwd) {
    return alert('Enter both email & password.');
  }
  if (pwd.length < 6) {
    return alert('Password must be at least 6 characters.');
  }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pwd);
    await cred.user.sendEmailVerification();
    alert('Signed up! Check your email to verify.');
    await auth.signOut();
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      alert('This email is already registered. Please log in or reset your password.');
    } else {
      alert('Sign‑Up Error: ' + err.message);
    }
  }
});

// Login handler
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const pwd   = passwordInput.value;
  if (!email || !pwd) {
    return alert('Enter both email & password.');
  }
  try {
    await auth.signInWithEmailAndPassword(email, pwd);
  } catch (err) {
    alert('Login Error: ' + err.message);
  }
});

// Password Reset handler
resetPasswordBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email) return alert('Enter your email to reset password.');
  try {
    await auth.sendPasswordResetEmail(email);
    alert('Password reset email sent! Check your inbox.');
  } catch (err) {
    alert('Reset Error: ' + err.message);
  }
});

// Logout handler
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});
