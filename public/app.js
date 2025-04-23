// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// — Your Firebase config (replace with yours) —
const firebaseConfig = {
  apiKey:            "AIzaSyA4QhGNwxn7lmvIzU6mpFL2Mz4B8134h6A",
  authDomain:        "e-commerce-acad9.firebaseapp.com",
  projectId:         "e-commerce-acad9",
  storageBucket:     "e-commerce-acad9.firebasestorage.app",
  messagingSenderId: "228138409600",
  appId:             "1:228138409600:web:0a122885f7dbe08eb95065",
  measurementId:     "G-NV1MG7R55W"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// AUTH HELPERS
const showMsg = msg => { document.getElementById('authMsg').textContent = msg; };
const togglePwd = (inpId, btnId) => {
  const inp = document.getElementById(inpId), btn = document.getElementById(btnId);
  btn.onclick = () => {
    inp.type = inp.type==='password' ? 'text' : 'password';
    btn.textContent = inp.type==='password' ? 'Show' : 'Hide';
  };
};
togglePwd('loginPwd','toggleLoginPwd');
togglePwd('signupPwd','toggleSignupPwd');

const applyValidation = (form, handler) => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    await handler();
  });
};

// SIGN-UP
applyValidation(document.getElementById('signupForm'), async () => {
  const btn = document.getElementById('signupBtn'), sp = document.getElementById('signupSpinner');
  btn.disabled = true; sp.classList.remove('d-none'); showMsg('');
  try {
    const { user } = await createUserWithEmailAndPassword(auth, signupEmail.value, signupPwd.value);
    await sendEmailVerification(user);
    const schoolCode = localStorage.getItem('schoolName').trim();
    await setDoc(doc(db,'schools',schoolCode,'users',user.uid),{ email:user.email, createdAt:serverTimestamp() });
    showMsg('Verification email sent – check your inbox.');
  } catch (e) { showMsg(e.message); }
  btn.disabled = false; sp.classList.add('d-none');
});

// LOGIN
applyValidation(document.getElementById('loginForm'), async () => {
  const btn = document.getElementById('loginBtn'), sp = document.getElementById('loginSpinner');
  btn.disabled = true; sp.classList.remove('d-none'); showMsg('');
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPwd.value);
    if (!auth.currentUser.emailVerified) throw new Error('Email not verified');
    const code = localStorage.getItem('schoolName').trim();
    const snap = await getDoc(doc(db,'schools',code,'users',auth.currentUser.uid));
    if (!snap.exists()) { await signOut(auth); throw new Error('Not registered under this school'); }
    document.getElementById('app-content').classList.remove('hidden');
    document.querySelector('.auth-card').classList.add('hidden');
    loadSetup(); renderStudents();
  } catch (e) { showMsg(e.message); }
  btn.disabled = false; sp.classList.add('d-none');
});

// RESET
applyValidation(document.getElementById('resetForm'), async () => {
  const btn = document.getElementById('resetBtn'), sp = document.getElementById('resetSpinner');
  btn.disabled = true; sp.classList.remove('d-none'); showMsg('');
  try {
    await sendPasswordResetEmail(auth, resetEmail.value);
    showMsg('Password reset email sent.');
  } catch (e) { showMsg(e.message); }
  btn.disabled = false; sp.classList.add('d-none');
});

// MONITOR AUTH STATE
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById('app-content').classList.remove('hidden');
    document.querySelector('.auth-card').classList.add('hidden');
    loadSetup(); renderStudents();
  } else {
    document.getElementById('app-content').classList.add('hidden');
    document.querySelector('.auth-card').classList.remove('hidden');
  }
});

// ==== ATTENDANCE APP LOGIC (original public/app.js) ====
window.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const colors = { P: '#4CAF50', A: '#f44336', Lt: '#FFEB3B', HD: '#FF9800', L: '#03a9f4' };

  // 1. SETUP
  const schoolIn     = $('schoolNameInput');
  const classSel     = $('teacherClassSelect');
  const secSel       = $('teacherSectionSelect');
  const saveSetup    = $('saveSetup');
  const setupForm    = $('setupForm');
  const setupDisplay = $('setupDisplay');
  const setupText    = $('setupText');
  const editSetup    = $('editSetup');

  function loadSetup() {
    const school = localStorage.getItem('schoolName');
    const cls    = localStorage.getItem('teacherClass');
    const sec    = localStorage.getItem('teacherSection');
    if (school && cls && sec) {
      schoolIn.value = school;
      classSel.value = cls;
      secSel.value   = sec;
      setupText.textContent = `${school} 🏫 | Class: ${cls} | Section: ${sec}`;
      setupForm.classList.add('hidden');
      setupDisplay.classList.remove('hidden');
    }
  }

  saveSetup.onclick = e => {
    e.preventDefault();
    if (!schoolIn.value || !classSel.value || !secSel.value)
      return alert('Complete setup');
    localStorage.setItem('schoolName', schoolIn.value);
    localStorage.setItem('teacherClass', classSel.value);
    localStorage.setItem('teacherSection', secSel.value);
    loadSetup();
  };

  editSetup.onclick = e => {
    e.preventDefault();
    setupForm.classList.remove('hidden');
    setupDisplay.classList.add('hidden');
  };

  // 2. STUDENT REGISTRATION
  let students = JSON.parse(localStorage.getItem('students') || '[]');
  const studentNameIn   = $('studentName');
  const admissionNoIn   = $('admissionNo');
  const parentNameIn    = $('parentName');
  const parentContactIn = $('parentContact');
  const parentOccIn     = $('parentOccupation');
  const parentAddrIn    = $('parentAddress');
  const addStudentBtn   = $('addStudent');
  const studentsBody    = $('studentsBody');
  const selectAll       = $('selectAllStudents');
  const editSelBtn      = $('editSelected');
  const deleteSelBtn    = $('deleteSelected');
  const saveRegBtn      = $('saveRegistration');
  const shareRegBtn     = $('shareRegistration');
  const editRegBtn      = $('editRegistration');
  const downloadRegBtn  = $('downloadRegistrationPDF');
  let regSaved = false, inlineEdit = false;

  function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
  }

  function renderStudents() {
    studentsBody.innerHTML = '';
    students.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML =
        `<td><input type="checkbox" class="sel" data-index="${i}" ${regSaved ? 'disabled' : ''}></td>` +
        `<td>${s.name}</td><td>${s.adm}</td><td>${s.parent}</td>` +
        `<td>${s.contact}</td><td>${s.occupation}</td><td>${s.address}</td>` +
        `<td>${regSaved ? '<button class="share-one">Share</button>' : ''}</td>`;
      if (regSaved) {
        tr.querySelector('.share-one').onclick = ev => {
          ev.preventDefault();
          const hdr = `School: ${localStorage.getItem('schoolName')}\nClass: ${localStorage.getItem('teacherClass')}\nSection: ${localStorage.getItem('teacherSection')}`;
          const msg = `${hdr}\n\nName: ${s.name}\nAdm#: ${s.adm}\nParent: ${s.parent}\nContact: ${s.contact}\nOccupation: ${s.occupation}\nAddress: ${s.address}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
        };
      }
      studentsBody.appendChild(tr);
    });
    bindSelection();
  }

  function bindSelection() {
    const boxes = Array.from(document.querySelectorAll('.sel'));
    boxes.forEach(cb => {
      cb.onchange = () => {
        cb.closest('tr').classList.toggle('selected', cb.checked);
        const any = boxes.some(x => x.checked);
        editSelBtn.disabled = deleteSelBtn.disabled = !any;
      };
    });
    selectAll.disabled = regSaved;
    selectAll.onchange = () => {
      if (!regSaved) boxes.forEach(cb => {
        cb.checked = selectAll.checked;
        cb.dispatchEvent(new Event('change'));
      });
    };
  }

  addStudentBtn.onclick = ev => {
    ev.preventDefault();
    const name    = studentNameIn.value.trim();
    const adm     = admissionNoIn.value.trim();
    const parent  = parentNameIn.value.trim();
    const contact = parentContactIn.value.trim();
    const occ     = parentOccIn.value.trim();
    const addr    = parentAddrIn.value.trim();
    if (!name || !adm || !parent || !contact || !occ || !addr)
      return alert('All fields required');
    if (!/^\d+$/.test(adm)) return alert('Adm# must be numeric');
    if (students.some(s => s.adm === adm))
      return alert(`Admission# ${adm} already exists`);
    if (!/^\d{7,15}$/.test(contact))
      return alert('Contact must be 7-15 digits');
    students.push({ name, adm, parent, contact, occupation: occ, address: addr, roll: Date.now() });
    saveStudents();
    renderStudents();
    [studentNameIn, admissionNoIn, parentNameIn, parentContactIn, parentOccIn, parentAddrIn].forEach(i => i.value = '');
  };

  // ... continue with the rest of your attendance, analytics, register logic unchanged ...
});
