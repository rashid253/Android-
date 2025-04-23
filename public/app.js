// app.js
document.addEventListener('DOMContentLoaded', () => {
  // Auth (localStorage)
  const authDiv = document.getElementById('auth-container');
  const appDiv  = document.getElementById('app-content');
  const eInput  = document.getElementById('auth-email');
  const pInput  = document.getElementById('auth-password');
  const login   = document.getElementById('loginBtn');
  const signup  = document.getElementById('signupBtn');
  const reset   = document.getElementById('resetPwdBtn');
  const logout  = document.getElementById('logoutBtn');

  function getUsers() {
    return JSON.parse(localStorage.getItem('users')||'[]');
  }
  function saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)); }

  function showApp() {
    authDiv.classList.add('hidden');
    appDiv.classList.remove('hidden');
    initApp();
  }
  function showAuth() {
    authDiv.classList.remove('hidden');
    appDiv.classList.add('hidden');
    eInput.value = pInput.value = '';
  }

  signup.addEventListener('click', () => {
    const email = eInput.value.trim(), pwd = pInput.value;
    if (!email||pwd.length<6) return alert('Valid email & 6+ chars password');
    let users = getUsers();
    if (users.find(u=>u.email===email)) return alert('Already registered');
    users.push({ email,pwd });
    saveUsers(users);
    alert('Signup successful');
  });

  login.addEventListener('click', () => {
    const email = eInput.value.trim(), pwd = pInput.value;
    let user = getUsers().find(u=>u.email===email && u.pwd===pwd);
    if (user) return showApp();
    alert('Invalid credentials');
  });

  reset.addEventListener('click', () => {
    const email = prompt('Enter your registered email:');
    let users = getUsers();
    let idx = users.findIndex(u=>u.email===email);
    if (idx<0) return alert('Email not found');
    let np = prompt('Enter new password (6+ chars):');
    if (!np||np.length<6) return alert('Password too short');
    users[idx].pwd = np; saveUsers(users);
    alert('Password reset successful');
  });

  logout.addEventListener('click', showAuth);

  // Attendance App Logic
  function initApp() {
    // Setup
    const school = document.getElementById('schoolName');
    const cls    = document.getElementById('classSelect');
    const sec    = document.getElementById('sectionSelect');
    const saveS  = document.getElementById('saveSetup');
    const disp   = document.getElementById('setupDisplay');
    const text   = document.getElementById('setupText');
    const editS  = document.getElementById('editSetup');

    let setup = JSON.parse(localStorage.getItem('setup')||'null');
    function renderSetup() {
      if (setup) {
        disp.classList.remove('hidden');
        document.getElementById('setupForm').classList.add('hidden');
        text.textContent = `${setup.school} — Class ${setup.cls} (${setup.sec})`;
      }
    }
    renderSetup();
    saveS.onclick = () => {
      if (!school.value||!cls.value||!sec.value) return alert('Fill all');
      setup = { school:school.value, cls:cls.value, sec:sec.value };
      localStorage.setItem('setup', JSON.stringify(setup));
      renderSetup();
    };
    editS.onclick = () => {
      school.value=setup.school; cls.value=setup.cls; sec.value=setup.sec;
      disp.classList.add('hidden');
      document.getElementById('setupForm').classList.remove('hidden');
    };

    // Students
    const nInput = document.getElementById('nameInput');
    const aInput = document.getElementById('admInput');
    const addBtn = document.getElementById('addStudent');
    const tbody  = document.querySelector('#studentTable tbody');
    let students = JSON.parse(localStorage.getItem('students')||'[]');
    function renderStudents() {
      tbody.innerHTML = '';
      students.forEach((s,i) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td><td>${s.name}</td><td>${s.adm}</td>`;
        tbody.appendChild(tr);
      });
    }
    renderStudents();
    addBtn.onclick = () => {
      if (!nInput.value||!aInput.value) return alert('Fill name & adm#');
      students.push({ name:nInput.value, adm:aInput.value });
      localStorage.setItem('students', JSON.stringify(students));
      nInput.value=aInput.value='';
      renderStudents();
    };

    // Attendance
    const dateIn = document.getElementById('attDate');
    const loadB  = document.getElementById('loadAtt');
    const list   = document.getElementById('attList');
    const saveB  = document.getElementById('saveAtt');
    const sumSec = document.getElementById('attendance-summary');
    const sumTbody = sumSec.querySelector('tbody');

    let records = JSON.parse(localStorage.getItem('attendance')||'{}');
    function renderAttForm() {
      if (!dateIn.value) return alert('Pick a date');
      list.innerHTML = '';
      students.forEach(s => {
        let div = document.createElement('div');
        div.className = 'row-inline';
        div.innerHTML = `<span>${s.name}</span>
          <button data-id="${s.adm}" data-st="P">P</button>
          <button data-id="${s.adm}" data-st="A">A</button>`;
        list.appendChild(div);
      });
      saveB.classList.remove('hidden');
    }
    loadB.onclick = renderAttForm;
    list.onclick = e => {
      if (e.target.tagName!=='BUTTON') return;
      let btns = e.target.parentNode.querySelectorAll('button');
      btns.forEach(b=>b.style.opacity=0.5);
      e.target.style.opacity=1;
    };
    saveB.onclick = () => {
      let d = dateIn.value;
      records[d] = {};
      list.querySelectorAll('button').forEach(b => {
        if (b.style.opacity>0.9)
          records[d][b.dataset.id] = b.dataset.st;
      });
      localStorage.setItem('attendance', JSON.stringify(records));
      // show summary
      sumTbody.innerHTML='';
      Object.entries(records[d]).forEach(([adm,st]) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${students.find(s=>s.adm===adm).name}</td><td>${st}</td>`;
        sumTbody.appendChild(tr);
      });
      sumSec.classList.remove('hidden');
    };
    document.getElementById('resetAtt').onclick = () => {
      sumSec.classList.add('hidden');
      list.innerHTML=''; saveB.classList.add('hidden'); dateIn.value='';
    };
  }
});
