// Opens a new page
function openPage(url) {
  window.location.href = url;
}

// Toggles the mobile side menu visibility
function toggleSideMenu() {
  const sideMenu = document.getElementById("side-menu");
  if (sideMenu) {
    sideMenu.classList.toggle("visible");
  }
}

// Close side menu when clicking outside of it
document.addEventListener("click", function(event) {
  const sideMenu = document.getElementById("side-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  if (
    sideMenu &&
    sideMenu.classList.contains("visible") &&
    !sideMenu.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    sideMenu.classList.remove("visible");
  }
});
