// public/app.js
// (only “Setup” section)

const $ = id => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
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
    if (sc && cl && se) {
      schoolIn.value = sc;
      classSel.value = cl;
      secSel.value   = se;
      setupText.textContent = `${sc} 🏫 | Class: ${cl} | Section: ${se}`;
      setupForm.classList.add('hidden');
      setupDisplay.classList.remove('hidden');
    }
  }

  saveSetup.onclick = e => {
    e.preventDefault();
    if (!schoolIn.value || !classSel.value || !secSel.value)
      return alert('براہِ مہربانی مکمل سیٹ اپ کریں۔');
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

  loadSetup();
});
