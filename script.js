document.addEventListener("DOMContentLoaded", function() {
  // Global function to open pages in a new tab/window
  window.openPage = function(url) {
    window.open(url, '_blank');
  };

  // Toggle mobile side menu
  window.toggleSideMenu = function() {
    const sideMenu = document.getElementById("side-menu");
    if (sideMenu) {
      sideMenu.classList.toggle("visible");
    }
  };

  // Close side menu on outside click
  document.addEventListener("click", function(event) {
    const sideMenu = document.getElementById("side-menu");
    const menuToggle = document.querySelector(".menu-toggle");

    // If side menu is open and the click is outside both the menu and the toggle button, close it
    if (
      sideMenu &&
      sideMenu.classList.contains("visible") &&
      !sideMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      sideMenu.classList.remove("visible");
    }
  });

  // Dummy function to update the cart count badge
  window.updateCartCount = function() {
    // For demonstration, using a dummy value. Later, integrate with your cart system.
    var count = localStorage.getItem("cartCount") || 3; // example dummy count
    // Desktop
    var cartCountElem = document.getElementById("cartCount");
    if (cartCountElem) cartCountElem.innerText = count;
    // Side menu
    var cartCountMobileElem = document.getElementById("cartCountMobile");
    if (cartCountMobileElem) cartCountMobileElem.innerText = count;
    // Bottom nav
    var cartCountMobileBottomElem = document.getElementById("cartCountMobileBottom");
    if (cartCountMobileBottomElem) cartCountMobileBottomElem.innerText = count;
  };

  // Initialize cart count
  updateCartCount();
});
