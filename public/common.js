// public/common.js

// Shared globals for all modules
window.colors = {
  P:  '#4CAF50',
  A:  '#f44336',
  Lt: '#FFEB3B',
  HD: '#FF9800',
  L:  '#03a9f4'
};

// Initialize our two data arrays in case modules read them before storing:
window.students       = JSON.parse(localStorage.getItem('students')||'[]');
window.attendanceData = JSON.parse(localStorage.getItem('attendanceData')||'{}');
