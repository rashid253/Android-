// public/share-pdf.js

const $ = id => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
  // Students PDF & Share
  $('shareRegistration').onclick = ev => {
    ev.preventDefault();
    const hdr = `School: ${localStorage.getItem('schoolName')} | Class: ${localStorage.getItem('teacherClass')} | Section: ${localStorage.getItem('teacherSection')}`;
    const lines = students.map(s=>
      `Name: ${s.name}, Adm#: ${s.adm}, Parent: ${s.parent}, Contact: ${s.contact}, Occupation: ${s.occupation}, Address: ${s.address}`
    ).join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(hdr+'\n\n'+lines)}`, '_blank');
  };
  $('downloadRegistrationPDF').onclick = ev => {
    ev.preventDefault();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text('Student Registration',10,10);
    doc.setFontSize(12); doc.text(`Date: ${new Date().toLocaleDateString()}`,10,20);
    doc.autoTable({ html:'#studentTable', startY:30 });
    doc.save('student_registration.pdf');
  };

  // Attendance Summary Share/PDF
  $('shareAttendanceSummary').onclick = ev => {
    ev.preventDefault();
    const rows = Array.from(document.querySelectorAll('#attendanceSummaryTable tbody tr'))
      .map(tr=>[...tr.children].map(td=>td.textContent).join(' – '));
    window.open(`https://wa.me/?text=${encodeURIComponent(rows.join('\n'))}`, '_blank');
  };
  $('downloadAttendancePDF').onclick = ev => {
    ev.preventDefault();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({ html:'#attendanceSummaryTable', startY:10 });
    doc.save('attendance_summary.pdf');
  };

  // Analytics Share/PDF
  $('shareAnalytics').onclick = ev => {
    ev.preventDefault();
    const hdr = $('instructions').textContent;
    const rows = Array.from(document.querySelectorAll('#analyticsContainer tbody tr'))
      .map(tr=>[...tr.children].map(td=>td.textContent).join(' – '));
    window.open(`https://wa.me/?text=${encodeURIComponent(hdr+'\n\n'+rows.join('\n'))}`, '_blank');
  };
  $('downloadAnalytics').onclick = ev => {
    ev.preventDefault();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({ html:'#analyticsContainer table', startY:10 });
    doc.addImage(window.barChart.toBase64Image(), 'PNG', 10, doc.lastAutoTable.finalY+10, 80,60);
    doc.addImage(window.pieChart.toBase64Image(), 'PNG', 100, doc.lastAutoTable.finalY+10, 80,60);
    doc.save('attendance_analytics.pdf');
  };

  // Register Share/PDF
  $('shareRegister').onclick = ev => {
    ev.preventDefault();
    const month = $('registerMonth').value;
    const rows = Array.from(document.querySelectorAll('#registerSummarySection tbody tr'))
      .map(tr=>[...tr.children].map(td=>td.textContent).join(' – '));
    window.open(`https://wa.me/?text=${encodeURIComponent('Register '+month+'\n\n'+rows.join('\n'))}`, '_blank');
  };
  $('downloadRegisterPDF').onclick = ev => {
    ev.preventDefault();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    doc.autoTable({ html:'#registerTable', startY:10, styles:{fontSize:6} });
    doc.autoTable({ html:'#registerSummarySection table', startY:doc.lastAutoTable.finalY+10, styles:{fontSize:8} });
    doc.save('attendance_register.pdf');
  };
});
