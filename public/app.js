// app.js

document.addEventListener('DOMContentLoaded', () => {
  //
  // ─── LOCALSTORAGE HELPERS ─────────────────────────────────────────────────────
  //
  const STORAGE = {
    setup: 'attendance_setup',
    students: 'attendance_students',
    attendance: 'attendance_records',
  };

  function getSetup() {
    return JSON.parse(localStorage.getItem(STORAGE.setup)) || null;
  }
  function saveSetup(data) {
    localStorage.setItem(STORAGE.setup, JSON.stringify(data));
  }

  function getStudents() {
    return JSON.parse(localStorage.getItem(STORAGE.students)) || [];
  }
  function saveStudents(arr) {
    localStorage.setItem(STORAGE.students, JSON.stringify(arr));
  }

  function getAttendance() {
    return JSON.parse(localStorage.getItem(STORAGE.attendance)) || {};
  }
  function saveAttendance(obj) {
    localStorage.setItem(STORAGE.attendance, JSON.stringify(obj));
  }

  //
  // ─── SETUP SECTION ─────────────────────────────────────────────────────────────
  //
  const schoolNameInput      = document.getElementById('schoolNameInput');
  const teacherClassSelect   = document.getElementById('teacherClassSelect');
  const teacherSectionSelect = document.getElementById('teacherSectionSelect');
  const saveSetupBtn         = document.getElementById('saveSetup');
  const setupForm            = document.getElementById('setupForm');
  const setupDisplay         = document.getElementById('setupDisplay');
  const setupText            = document.getElementById('setupText');
  const editSetupBtn         = document.getElementById('editSetup');

  function renderSetup() {
    const cfg = getSetup();
    if (cfg) {
      setupForm.classList.add('hidden');
      setupDisplay.classList.remove('hidden');
      setupText.textContent = `${cfg.school} — Class ${cfg.className} (${cfg.section})`;
    } else {
      setupForm.classList.remove('hidden');
      setupDisplay.classList.add('hidden');
    }
  }
  saveSetupBtn.addEventListener('click', () => {
    const school    = schoolNameInput.value.trim();
    const className = teacherClassSelect.value;
    const section   = teacherSectionSelect.value;
    if (!school || !className || !section) {
      return alert('Please fill School, Class & Section.');
    }
    saveSetup({ school, className, section });
    renderSetup();
  });
  editSetupBtn.addEventListener('click', () => {
    const cfg = getSetup();
    if (cfg) {
      schoolNameInput.value      = cfg.school;
      teacherClassSelect.value   = cfg.className;
      teacherSectionSelect.value = cfg.section;
    }
    setupForm.classList.remove('hidden');
    setupDisplay.classList.add('hidden');
  });

  //
  // ─── STUDENT REGISTRATION ─────────────────────────────────────────────────────
  //
  const studentNameInput     = document.getElementById('studentName');
  const admissionNoInput     = document.getElementById('admissionNo');
  const parentNameInput      = document.getElementById('parentName');
  const parentContactInput   = document.getElementById('parentContact');
  const parentOccupationInput= document.getElementById('parentOccupation');
  const parentAddressInput   = document.getElementById('parentAddress');
  const addStudentBtn        = document.getElementById('addStudent');
  const studentsBody         = document.getElementById('studentsBody');
  const selectAllChk         = document.getElementById('selectAllStudents');
  const editSelectedBtn      = document.getElementById('editSelected');
  const deleteSelectedBtn    = document.getElementById('deleteSelected');
  const saveRegistrationBtn  = document.getElementById('saveRegistration');

  let editingStudentId = null;

  function renderStudents() {
    const list = getStudents();
    studentsBody.innerHTML = '';
    list.forEach(stu => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="student-chk" data-id="${stu.id}"></td>
        <td>${stu.name}</td>
        <td>${stu.admissionNo}</td>
        <td>${stu.parentName}</td>
        <td>${stu.parentContact}</td>
        <td>${stu.parentOccupation}</td>
        <td>${stu.parentAddress}</td>
        <td><button class="share-btn" data-id="${stu.id}">Share</button></td>
      `;
      studentsBody.appendChild(tr);
    });
    updateStudentActions();
  }

  function updateStudentActions() {
    const checks = Array.from(document.querySelectorAll('.student-chk'));
    const checked = checks.filter(c => c.checked).map(c => c.dataset.id);
    editSelectedBtn.disabled   = checked.length !== 1;
    deleteSelectedBtn.disabled = checked.length === 0;
    selectAllChk.checked = checks.length > 0 && checks.every(c => c.checked);
  }

  addStudentBtn.addEventListener('click', () => {
    const name       = studentNameInput.value.trim();
    const adm        = admissionNoInput.value.trim();
    const pname      = parentNameInput.value.trim();
    const pcontact   = parentContactInput.value.trim();
    const pocc       = parentOccupationInput.value.trim();
    const paddr      = parentAddressInput.value.trim();
    if (!name || !adm || !pname || !pcontact || !pocc || !paddr) {
      return alert('Fill all student fields.');
    }
    let list = getStudents();
    if (editingStudentId) {
      // update
      list = list.map(st => st.id === editingStudentId
        ? { id: st.id, name, admissionNo: adm, parentName: pname, parentContact: pcontact, parentOccupation: pocc, parentAddress: paddr }
        : st);
      editingStudentId = null;
      addStudentBtn.textContent = 'Add';
    } else {
      // new
      list.push({
        id: Date.now().toString(),
        name, admissionNo: adm,
        parentName: pname, parentContact: pcontact,
        parentOccupation: pocc, parentAddress: paddr
      });
    }
    saveStudents(list);
    [studentNameInput, admissionNoInput, parentNameInput, parentContactInput, parentOccupationInput, parentAddressInput]
      .forEach(i => i.value = '');
    renderStudents();
  });

  selectAllChk.addEventListener('change', () => {
    document.querySelectorAll('.student-chk').forEach(c => c.checked = selectAllChk.checked);
    updateStudentActions();
  });
  studentsBody.addEventListener('change', e => {
    if (e.target.matches('.student-chk')) updateStudentActions();
  });

  editSelectedBtn.addEventListener('click', () => {
    const id = document.querySelector('.student-chk:checked').dataset.id;
    const stu = getStudents().find(s => s.id === id);
    if (!stu) return;
    studentNameInput.value       = stu.name;
    admissionNoInput.value       = stu.admissionNo;
    parentNameInput.value        = stu.parentName;
    parentContactInput.value     = stu.parentContact;
    parentOccupationInput.value  = stu.parentOccupation;
    parentAddressInput.value     = stu.parentAddress;
    editingStudentId = id;
    addStudentBtn.textContent = 'Update';
  });

  deleteSelectedBtn.addEventListener('click', () => {
    if (!confirm('Delete selected students?')) return;
    const toRemove = Array.from(document.querySelectorAll('.student-chk:checked')).map(c => c.dataset.id);
    let list = getStudents().filter(s => !toRemove.includes(s.id));
    saveStudents(list);
    renderStudents();
  });

  saveRegistrationBtn.addEventListener('click', () => {
    alert('Student list saved.');
  });

  //
  // ─── ATTENDANCE MARKING ────────────────────────────────────────────────────────
  //
  const dateInput       = document.getElementById('dateInput');
  const loadAttendance  = document.getElementById('loadAttendance');
  const attendanceList  = document.getElementById('attendanceList');
  const saveAttendance  = document.getElementById('saveAttendance');
  const attendanceResult= document.getElementById('attendance-result');
  const summaryBody     = document.getElementById('summaryBody');
  const resetAttendance = document.getElementById('resetAttendance');

  function renderAttendanceForm() {
    const date = dateInput.value;
    if (!date) return alert('Select a date.');
    const records = getAttendance();
    const dayRec = records[date] || {};
    const students = getStudents();
    attendanceList.innerHTML = '';
    students.forEach(st => {
      const div = document.createElement('div');
      div.className = 'attendance-item';
      div.innerHTML = `
        <span>${st.name}</span>
        <div class="attendance-actions">
          <button data-id="${st.id}" data-status="P" class="att-btn ${dayRec[st.id]==='P'? 'selected':''}">P</button>
          <button data-id="${st.id}" data-status="A" class="att-btn ${dayRec[st.id]==='A'? 'selected':''}">A</button>
          <button data-id="${st.id}" data-status="L" class="att-btn ${dayRec[st.id]==='L'? 'selected':''}">L</button>
        </div>
      `;
      attendanceList.appendChild(div);
    });
    saveAttendance.classList.remove('hidden');
  }

  attendanceList.addEventListener('click', e => {
    if (!e.target.matches('.att-btn')) return;
    const btn = e.target;
    const id = btn.dataset.id;
    const status = btn.dataset.status;
    // toggle selection
    btn.parentElement.querySelectorAll('.att-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });

  loadAttendance.addEventListener('click', renderAttendanceForm);

  saveAttendance.addEventListener('click', () => {
    const date = dateInput.value;
    if (!date) return;
    const records = getAttendance();
    const dayRec = {};
    attendanceList.querySelectorAll('.att-btn.selected').forEach(b => {
      dayRec[b.dataset.id] = b.dataset.status;
    });
    records[date] = dayRec;
    saveAttendance(records);
    renderAttendanceSummary(date);
  });

  function renderAttendanceSummary(date) {
    attendanceResult.classList.remove('hidden');
    summaryBody.innerHTML = '';
    const rec = getAttendance()[date] || {};
    getStudents().forEach(st => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${st.name}</td>
        <td>${rec[st.id] || '-'}</td>
        <td><button class="small">Send</button></td>
      `;
      summaryBody.appendChild(tr);
    });
  }

  resetAttendance.addEventListener('click', () => {
    attendanceResult.classList.add('hidden');
    saveAttendance.classList.add('hidden');
    attendanceList.innerHTML = '';
    dateInput.value = '';
  });

  //
  // ─── STUBS FOR ANALYTICS & REGISTER ───────────────────────────────────────────
  //
  document.getElementById('loadAnalytics').addEventListener('click', () => {
    alert('Analytics not yet implemented.');
  });
  document.getElementById('loadRegister').addEventListener('click', () => {
    alert('Register not yet implemented.');
  });

  //
  // ─── INITIALIZATION ───────────────────────────────────────────────────────────
  //
  renderSetup();
  renderStudents();
});
