// public/attendance.js

const $ = id => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
  let attendanceData = JSON.parse(localStorage.getItem('attendanceData')||'{}');
  const dateInput   = $('dateInput');
  const loadAtt     = $('loadAttendance');
  const attList     = $('attendanceList');
  const saveAtt     = $('saveAttendance');
  const resultSec   = $('attendance-result');
  const summaryBody = $('summaryBody');

  window.attendanceData = attendanceData;  // expose globally

  loadAtt.onclick = ev => {
    ev.preventDefault();
    if (!dateInput.value) return alert('براہِ مہربانی تاریخ منتخب کریں۔');
    attList.innerHTML = '';
    students.forEach(s => {
      const row = document.createElement('div');
      row.className = 'attendance-item'; row.textContent = s.name;
      const btns = document.createElement('div');
      btns.className = 'attendance-actions';
      ['P','A','Lt','HD','L'].forEach(code => {
        const b = document.createElement('button');
        b.type='button'; b.className='att-btn'; b.dataset.code=code; b.textContent=code;
        if (attendanceData[dateInput.value]?.[s.roll]===code) {
          b.style.background=colors[code]; b.style.color='#fff';
        }
        b.onclick = e2 => {
          e2.preventDefault();
          btns.querySelectorAll('.att-btn').forEach(x=>{x.style.background='';x.style.color='#333';});
          b.style.background=colors[code]; b.style.color='#fff';
        };
        btns.append(b);
      });
      attList.append(row,btns);
    });
    saveAtt.classList.remove('hidden');
  };

  saveAtt.onclick = ev => {
    ev.preventDefault();
    const d = dateInput.value; if (!d) return alert('براہِ مہربانی تاریخ منتخب کریں۔');
    attendanceData[d] = {};
    document.querySelectorAll('.attendance-actions').forEach((btns,i) => {
      const sel = btns.querySelector('.att-btn[style*="background"]');
      attendanceData[d][students[i].roll] = sel?sel.dataset.code:'A';
    });
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    $('attendance-section').classList.add('hidden');
    resultSec.classList.remove('hidden');
    summaryBody.innerHTML = '';
    const hdr = `Date: ${d} | School: ${localStorage.getItem('schoolName')} | Class: ${localStorage.getItem('teacherClass')} | Section: ${localStorage.getItem('teacherSection')}`;
    summaryBody.insertAdjacentHTML('beforeend', `<tr><td colspan="3"><em>${hdr}</em></td></tr>`);
    students.forEach(s => {
      const code = attendanceData[d][s.roll]||'A';
      const status = {P:'Present',A:'Absent',Lt:'Late',HD:'Half Day',L:'Leave'}[code];
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.name}</td><td>${status}</td><td><button class="send-btn">Send</button></td>`;
      tr.querySelector('.send-btn').onclick = e2 => {
        e2.preventDefault();
        window.open(`https://wa.me/${s.contact}?text=${encodeURIComponent(hdr+"\n\nName: "+s.name+"\nStatus: "+status)}`, '_blank');
      };
      summaryBody.appendChild(tr);
    });
  };

  $('resetAttendance').onclick = ev => {
    ev.preventDefault();
    resultSec.classList.add('hidden');
    $('attendance-section').classList.remove('hidden');
    summaryBody.innerHTML = '';
  };
});
