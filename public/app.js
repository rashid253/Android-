// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore, collection, doc,
  getDoc, getDocs, setDoc, addDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// TODO: Use same Firebase config as in auth.js
initializeApp({});
const auth = getAuth();
const db   = getFirestore();

function schoolCollection(...path) {
  const tenant = auth.tenantId || 'public';
  return collection(db, 'schools', tenant, ...path);
}

// SETUP
const schoolNameEl = document.getElementById('schoolName');
const classEl      = document.getElementById('classSelect');
const sectionEl    = document.getElementById('sectionSelect');
const saveSetupBtn = document.getElementById('saveSetup');
const setupForm    = document.getElementById('setupForm');
const setupDisp    = document.getElementById('setupDisplay');
const setupText    = document.getElementById('setupText');

async function loadSetup() {
  const ref = doc(db, 'schools', auth.tenantId, 'config', 'setup');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    schoolNameEl.value = data.school;
    setupForm.classList.add('hidden');
    setupDisp.classList.remove('hidden');
    setupText.textContent = `${data.school} — Class ${data.className} (${data.section})`;
  }
}

saveSetupBtn.onclick = async () => {
  if (!classEl.value || !sectionEl.value) return alert('Select class & section');
  const cfg = {
    school: schoolNameEl.value || schoolSelect.options[schoolSelect.selectedIndex].text,
    className: classEl.value,
    section: sectionEl.value
  };
  await setDoc(doc(db, 'schools', auth.tenantId, 'config', 'setup'), cfg);
  await loadSetup();
};

document.getElementById('editSetup').onclick = () => {
  setupForm.classList.remove('hidden');
  setupDisp.classList.add('hidden');
};

// STUDENTS
const nameEl  = document.getElementById('studentName');
const admEl   = document.getElementById('admissionNo');
const addStu  = document.getElementById('addStudent');
const tbody   = document.querySelector('#studentTable tbody');

async function loadStudents() {
  tbody.innerHTML = '';
  const snaps = await getDocs(schoolCollection('students'));
  snaps.forEach((docSnap, i) => {
    const data = docSnap.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${data.name}</td><td>${data.admNo}</td>`;
    tbody.appendChild(tr);
  });
}

addStu.onclick = async () => {
  if (!nameEl.value || !admEl.value) return alert('Fill name & admission number');
  await addDoc(schoolCollection('students'), {
    name: nameEl.value,
    admNo: admEl.value
  });
  nameEl.value = admEl.value = '';
  await loadStudents();
};

// ATTENDANCE
const dateEl   = document.getElementById('attDate');
const loadAtt  = document.getElementById('loadAtt');
const attList  = document.getElementById('attList');
const saveAtt  = document.getElementById('saveAtt');
const sumSec   = document.getElementById('attendance-summary');
const sumTbody = sumSec.querySelector('tbody');

let currentDate = null;

loadAtt.onclick = async () => {
  if (!dateEl.value) return alert('Pick a date');
  currentDate = dateEl.value;
  attList.innerHTML = '';
  const snaps = await getDocs(schoolCollection('students'));
  snaps.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement('div');
    row.className = 'row-inline';
    row.innerHTML = `
      <span>${data.name}</span>
      <button data-id="${docSnap.id}" data-st="P">P</button>
      <button data-id="${docSnap.id}" data-st="A">A</button>
    `;
    attList.appendChild(row);
  });
  saveAtt.classList.remove('hidden');
};

attList.onclick = e => {
  if (e.target.tagName !== 'BUTTON') return;
  const btns = e.target.parentElement.querySelectorAll('button');
  btns.forEach(b => b.classList.remove('selected'));
  e.target.classList.add('selected');
};

saveAtt.onclick = async () => {
  const rec = {};
  attList.querySelectorAll('button.selected').forEach(b => {
    rec[b.dataset.id] = b.dataset.st;
  });
  await setDoc(doc(db, 'schools', auth.tenantId, 'attendance', currentDate), rec);

  // render summary
  sumTbody.innerHTML = '';
  const snaps = await getDocs(schoolCollection('students'));
  snaps.forEach(docSnap => {
    const id = docSnap.id;
    if (rec[id]) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${docSnap.data().name}</td><td>${rec[id]}</td>`;
      sumTbody.appendChild(tr);
    }
  });
  sumSec.classList.remove('hidden');
};

document.getElementById('resetAtt').onclick = () => {
  sumSec.classList.add('hidden');
  attList.innerHTML = '';
  saveAtt.classList.add('hidden');
  dateEl.value = '';
};

// Initialize after auth
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    loadSetup();
    loadStudents();
  }
});
