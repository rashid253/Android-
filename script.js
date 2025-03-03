document.addEventListener("DOMContentLoaded", function() {
  // Global function to open pages
  window.openPage = function(url) {
    window.location.href = url;
  };

  // Toggle mobile side menu
  window.toggleSideMenu = function() {
    const sideMenu = document.getElementById("side-menu");
    if (sideMenu) {
      sideMenu.classList.toggle("visible");
    }
  };

  // Close side menu when clicking outside the menu and toggle button
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

  // Update cart count for badges in header, side menu, and mobile nav
  function updateCartCount() {
    const count = Number(localStorage.getItem("cartCount")) || 0;
    const desktopBadge = document.getElementById("cart-count-desktop");
    const mobileBadge = document.getElementById("cart-count-mobile");
    const sideBadge = document.getElementById("cart-count-side");
    if (desktopBadge) desktopBadge.innerText = count;
    if (mobileBadge) mobileBadge.innerText = count;
    if (sideBadge) sideBadge.innerText = count;
  }
  updateCartCount();
});
