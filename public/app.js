// app.js
import { app } from "./firebase-config.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const auth = getAuth(app);
const db   = getFirestore(app);

function schoolCollection(...path) {
  const tenant = auth.tenantId || 'public';
  return collection(db, 'schools', tenant, ...path);
}

// 1. Setup
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
    school: schoolNameEl.value || 'Your School',
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

// 2. Student Registration
const nameEl = document.getElementById('studentName');
const admEl  = document.getElementById('admissionNo');
const addStu = document.getElementById('addStudent');
const tbody  = document.querySelector('#studentTable tbody');

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
  if (!nameEl.value || !admEl.value) return alert('Fill name & admission no');
  await addDoc(schoolCollection('students'), { name: nameEl.value, admNo: admEl.value });
  nameEl.value = admEl.value = '';
  await loadStudents();
};

// 3. Attendance Marking
const dateEl   = document.getElementById('attDate');
const loadAtt  = document.getElementById('loadAtt');
const attList  = document.getElementById('attList');
const saveAtt  = document.getElementById('saveAtt');

loadAtt.onclick = async () => {
  if (!dateEl.value) return alert('Pick a date');
  attList.innerHTML = '';
  const snaps = await getDocs(schoolCollection('students'));
  snaps.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement('div'); row.className = 'row-inline';
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
  if (e.target.tagName!=='BUTTON') return;
  e.target.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));
  e.target.classList.add('selected');
};

saveAtt.onclick = async () => {
  const rec = {};
  attList.querySelectorAll('button.selected').forEach(b=>rec[b.dataset.id]=b.dataset.st);
  await setDoc(doc(db,'schools',auth.tenantId,'attendance',dateEl.value),rec);
  alert('Attendance saved');
};

// 4. Attendance Summary
const resetAtt = document.getElementById('resetAtt');
resetAtt.onclick = () => {
  document.getElementById('attendance-summary').classList.add('hidden');
  attList.innerHTML = ''; saveAtt.classList.add('hidden'); dateEl.value = '';
};

// 5. Analytics
const loadAnalyticsBtn = document.getElementById('loadAnalytics');
const analyticsContainer = document.getElementById('analyticsContainer');
const analyticsTbody = analyticsContainer.querySelector('tbody');

loadAnalyticsBtn.onclick = async () => {
  analyticsTbody.innerHTML = '';
  const snaps = await getDocs(schoolCollection('attendance'));
  const stats = {};
  snaps.forEach(docSnap => {
    const rec = docSnap.data();
    for (let id in rec) {
      stats[id] = stats[id] || {present:0,total:0};
      stats[id].total++;
      if (rec[id]==='P') stats[id].present++;
    }
  });
  for (let id in stats) {
    const stuDoc = await getDoc(doc(db,'schools',auth.tenantId,'students',id));
    const name = stuDoc.data().name;
    const s = stats[id];
    const perc = ((s.present/s.total)*100).toFixed(1)+'%';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td>${s.present}/${s.total}</td><td>${perc}</td>`;
    analyticsTbody.appendChild(tr);
  }
  analyticsContainer.classList.remove('hidden');
};

// 6. Attendance Register
const registerMonth = document.getElementById('registerMonth');
const loadRegisterBtn = document.getElementById('loadRegister');
const registerContainer = document.getElementById('registerContainer');
const registerTbody = registerContainer.querySelector('tbody');

loadRegisterBtn.onclick = async () => {
  if (!registerMonth.value) return alert('Select month');
  const [year,month] = registerMonth.value.split('-');
  const snaps = await getDocs(schoolCollection('attendance'));
  const stats = {};
  const studs = await getDocs(schoolCollection('students'));
  studs.forEach(s=>stats[s.id]={name:s.data().name,P:0,A:0,total:0});
  snaps.forEach(docSnap => {
    if (docSnap.id.startsWith(`${year}-${month}`)) {
      const rec = docSnap.data();
      for (let id in stats) {
        stats[id].total++;
        if (rec[id]==='P') stats[id].P++;
        else stats[id].A++;
      }
    }
  });
  registerTbody.innerHTML = '';
  for (let id in stats) {
    const s = stats[id];
    const perc = s.total?((s.P/s.total)*100).toFixed(1)+'%':'-';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${s.P}</td><td>${s.A}</td><td>${perc}</td>`;
    registerTbody.appendChild(tr);
  }
  registerContainer.classList.remove('hidden');
};

// Initialize after auth
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    loadSetup(); loadStudents(); // also call these on load
  }
});
