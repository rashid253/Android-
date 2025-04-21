// public/app.js

// shorthand for document.getElementById()
const $ = id => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
  // ==== FIREBASE AUTH ====
  const auth = firebase.auth();

  const loginBtn        = $('loginBtn');
  const signupBtn       = $('signupBtn');
  const logoutBtn       = $('logoutBtn');
  const resetPasswordBtn= $('resetPasswordBtn');
  const authBar         = $('auth-container');
  const appDiv          = $('app-content');

  // show/hide based on auth state
  auth.onAuthStateChanged(user => {
    if (user) {
      if (!user.emailVerified) {
        alert('Verify your email before continuing.');
        auth.signOut();
        return;
      }
      authBar.classList.add('hidden');
      appDiv.classList.remove('hidden');
      loadSetup();
      renderStudents();
    } else {
      authBar.classList.remove('hidden');
      appDiv.classList.add('hidden');
    }
  });

  // Sign‑Up
  signupBtn.onclick = async () => {
    const email = $('email').value.trim();
    const pwd   = $('password').value;
    if (!email||!pwd) return alert('Enter both email & password');
    if (pwd.length<6) return alert('Minimum 6 chars password');
    try {
      const cred = await auth.createUserWithEmailAndPassword(email,pwd);
      await cred.user.sendEmailVerification();
      alert('Signed up! Check your email to verify.');
      auth.signOut();
    } catch(e){ alert('Sign‑Up Error: '+e.message); }
  };

  // Login
  loginBtn.onclick = async () => {
    const email = $('email').value.trim();
    const pwd   = $('password').value;
    if (!email||!pwd) return alert('Enter both email & password');
    try {
      await auth.signInWithEmailAndPassword(email,pwd);
    } catch(e){ alert('Login Error: '+e.message); }
  };

  // Reset Password
  resetPasswordBtn.onclick = async () => {
    const email = $('email').value.trim();
    if (!email) return alert('Enter your email');
    try {
      await auth.sendPasswordResetEmail(email);
      alert('Reset link sent—check your email.');
    } catch(e){ alert('Reset Error: '+e.message); }
  };

  // Logout
  logoutBtn.onclick = () => auth.signOut();

  // ==== APP LOGIC ====
  const colors = { P:'#4CAF50', A:'#f44336', Lt:'#FFEB3B', HD:'#FF9800', L:'#03a9f4' };

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
    const sc = localStorage.getItem('schoolName');
    const cl = localStorage.getItem('teacherClass');
    const se = localStorage.getItem('teacherSection');
    if (sc&&cl&&se) {
      schoolIn.value = sc;
      classSel.value = cl;
      secSel.value   = se;
      setupText.textContent = `${sc} 🏫 | Class: ${cl} | Section: ${se}`;
      setupForm.classList.add('hidden');
      setupDisplay.classList.remove('hidden');
    }
  }
  saveSetup.onclick = e=>{ e.preventDefault();
    if(!schoolIn.value||!classSel.value||!secSel.value)
      return alert('Complete setup');
    localStorage.setItem('schoolName', schoolIn.value);
    localStorage.setItem('teacherClass', classSel.value);
    localStorage.setItem('teacherSection', secSel.value);
    loadSetup();
  };
  editSetup.onclick=e=>{
    e.preventDefault();
    setupForm.classList.remove('hidden');
    setupDisplay.classList.add('hidden');
  };
  loadSetup();

  // 2. STUDENT REGISTRATION
  let students = JSON.parse(localStorage.getItem('students')||'[]');
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
  let regSaved=false, inlineEdit=false;

  function saveStudents(){ localStorage.setItem('students',JSON.stringify(students)); }

  function bindSelection(){
    const boxes=Array.from(document.querySelectorAll('.sel'));
    boxes.forEach(cb=>{
      cb.onchange=()=>{
        cb.closest('tr').classList.toggle('selected', cb.checked);
        const any=boxes.some(x=>x.checked);
        editSelBtn.disabled=deleteSelBtn.disabled=!any;
      };
    });
    selectAll.disabled=regSaved;
    selectAll.onchange=()=>{
      if(!regSaved)boxes.forEach(cb=>{cb.checked=selectAll.checked;cb.dispatchEvent(new Event('change'));});
    };
  }

  function renderStudents(){
    studentsBody.innerHTML='';
    students.forEach((s,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=
        `<td><input type="checkbox" class="sel" data-index="${i}" ${regSaved?'disabled':''}></td>`+
        `<td>${s.name}</td><td>${s.adm}</td><td>${s.parent}</td>`+
        `<td>${s.contact}</td><td>${s.occupation}</td><td>${s.address}</td>`+
        `<td>${regSaved?'<button class="share-one">Share</button>':''}</td>`;
      if(regSaved){
        tr.querySelector('.share-one').onclick=ev=>{
          ev.preventDefault();
          const hdr=`School: ${localStorage.getItem('schoolName')} | Class: ${localStorage.getItem('teacherClass')} | Section: ${localStorage.getItem('teacherSection')}`;
          const msg=`${hdr}\n\nName: ${s.name}\nAdm#: ${s.adm}\nParent: ${s.parent}\nContact: ${s.contact}\nOccupation: ${s.occupation}\nAddress: ${s.address}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,'_blank');
        };
      }
      studentsBody.appendChild(tr);
    });
    bindSelection();
  }

  addStudentBtn.onclick=ev=>{
    ev.preventDefault();
    const name=studentNameIn.value.trim();
    const adm=admissionNoIn.value.trim();
    const parent=parentNameIn.value.trim();
    const contact=parentContactIn.value.trim();
    const occ=parentOccIn.value.trim();
    const addr=parentAddrIn.value.trim();
    if(!name||!adm||!parent||!contact||!occ||!addr)
      return alert('All fields required');
    if(!/^\d+$/.test(adm)) return alert('Adm# must be numeric');
    if(students.some(s=>s.adm===adm)) return alert(`Admission# ${adm} exists`);
    if(!/^\d{7,15}$/.test(contact)) return alert('Contact must be 7-15 digits');
    students.push({name,adm,parent,contact,occupation:occ,address:addr,roll:Date.now()});
    saveStudents(); renderStudents();
    [studentNameIn,admissionNoIn,parentNameIn,parentContactIn,parentOccIn,parentAddrIn].forEach(i=>i.value='');
  };

  // 3. ATTENDANCE
  let attendanceData=JSON.parse(localStorage.getItem('attendanceData')||'{}');
  const dateInput=$('dateInput'), loadAtt=$('loadAttendance'), attList=$('attendanceList');

  loadAtt.onclick=ev=>{
    ev.preventDefault();
    if(!dateInput.value) return alert('Pick a date');
    attList.innerHTML='';
    students.forEach(s=>{
      const row=document.createElement('div'); row.className='attendance-item'; row.textContent=s.name;
      const btns=document.createElement('div'); btns.className='attendance-actions';
      ['P','A','Lt','HD','L'].forEach(code=>{
        const b=document.createElement('button');
        b.type='button'; b.className='att-btn'; b.dataset.code=code; b.textContent=code;
        if(attendanceData[dateInput.value]?.[s.roll]===code){
          b.style.background=colors[code];b.style.color='#fff';
        }
        b.onclick=e2=>{
          e2.preventDefault();
          btns.querySelectorAll('.att-btn').forEach(x=>{x.style.background='';x.style.color='#333';});
          b.style.background=colors[code];b.style.color='#fff';
        };
        btns.append(b);
      });
      attList.append(row,btns);
    });
    $('saveAttendance').classList.remove('hidden');
  };

  // 4. SAVE & SUMMARY
  const saveAtt=$('saveAttendance'), resultSection=$('attendance-result'), summaryBody=$('summaryBody');

  saveAtt.onclick=ev=>{
    ev.preventDefault();
    const d=dateInput.value; if(!d)return alert('Pick a date');
    attendanceData[d]={};
    document.querySelectorAll('.attendance-actions').forEach((btns,i)=>{
      const sel=btns.querySelector('.att-btn[style*="background"]');
      attendanceData[d][students[i].roll]=sel?sel.dataset.code:'A';
    });
    localStorage.setItem('attendanceData',JSON.stringify(attendanceData));
    $('attendance-section').classList.add('hidden');
    resultSection.classList.remove('hidden');
    summaryBody.innerHTML='';
    const hdr=`Date: ${d} | School: ${localStorage.getItem('schoolName')} | Class: ${localStorage.getItem('teacherClass')} | Section: ${localStorage.getItem('teacherSection')}`;
    summaryBody.insertAdjacentHTML('beforeend',`<tr><td colspan="3"><em>${hdr}</em></td></tr>`);
    students.forEach(s=>{
      const code=attendanceData[d][s.roll]||'A'; const status={P:'Present',A:'Absent',Lt:'Late',HD:'Half Day',L:'Leave'}[code];
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${s.name}</td><td>${status}</td><td><button class="send-btn">Send</button></td>`;
      tr.querySelector('.send-btn').onclick=e2=>{
        e2.preventDefault();
        window.open(`https://wa.me/${s.contact}?text=${encodeURIComponent(hdr+"\n\nName: "+s.name+"\nStatus: "+status)}`,'_blank');
      };
      summaryBody.appendChild(tr);
    });
  };

  $('resetAttendance').onclick=ev=>{
    ev.preventDefault();
    resultSection.classList.add('hidden');
    $('attendance-section').classList.remove('hidden');
    summaryBody.innerHTML='';
  };

  // 5. ANALYTICS + 6. REGISTER + SHARE/PDF handlers…
  // (All remaining logic as in your previous code blocks)
});
