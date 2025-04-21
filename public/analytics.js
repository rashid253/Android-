// public/analytics.js

const $ = id => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
  const analyticsTarget = $('analyticsTarget');
  const studentAdmInput = $('studentAdmInput');
  const analyticsType   = $('analyticsType');
  const analyticsDate   = $('analyticsDate');
  const analyticsMonth  = $('analyticsMonth');
  const semesterStart   = $('semesterStart');
  const semesterEnd     = $('semesterEnd');
  const yearStart       = $('yearStart');
  const loadAnalytics   = $('loadAnalytics');
  const resetAnalytics  = $('resetAnalytics');
  const instructionsEl  = $('instructions');
  const analyticsContainer = $('analyticsContainer');
  const graphsEl        = $('graphs');
  const barCtx          = $('barChart').getContext('2d');
  const pieCtx          = $('pieChart').getContext('2d');
  let barChart, pieChart;

  function hideAll() {
    [analyticsDate,analyticsMonth,semesterStart,semesterEnd,yearStart,instructionsEl,analyticsContainer,graphsEl, resetAnalytics]
      .forEach(el=>el.classList.add('hidden'));
  }

  analyticsTarget.onchange = () => {
    studentAdmInput.classList.toggle('hidden', analyticsTarget.value!=='student');
    hideAll();
    analyticsType.value = '';
  };

  analyticsType.onchange = () => {
    hideAll();
    if (analyticsType.value==='date') analyticsDate.classList.remove('hidden');
    if (analyticsType.value==='month') analyticsMonth.classList.remove('hidden');
    if (analyticsType.value==='semester'){
      semesterStart.classList.remove('hidden');
      semesterEnd.classList.remove('hidden');
    }
    if (analyticsType.value==='year') yearStart.classList.remove('hidden');
    resetAnalytics.classList.remove('hidden');
  };

  resetAnalytics.onclick = ev => {
    ev.preventDefault();
    hideAll();
    analyticsType.value='';
  };

  loadAnalytics.onclick = ev => {
    ev.preventDefault();
    // determine from/to...
    // build stats[]
    // render HTML table → analyticsContainer.innerHTML
    analyticsContainer.classList.remove('hidden');
    instructionsEl.classList.remove('hidden');

    if (barChart) barChart.destroy();
    barChart = new Chart(barCtx, { /* … */ });
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, { /* … */ });

    graphsEl.classList.remove('hidden');
    $('analyticsActions').classList.remove('hidden');

    window.barChart = barChart;  // expose for share-pdf
    window.pieChart = pieChart;
  };
});
