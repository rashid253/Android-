function toggleSideMenu() {
  const sideMenu = document.getElementById('side-menu');
  if (sideMenu.style.left === '0px') {
    sideMenu.style.left = '-250px';
  } else {
    sideMenu.style.left = '0px';
  }
}

function openPage(url) {
  window.location.href = url;
}
