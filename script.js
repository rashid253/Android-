document.addEventListener("DOMContentLoaded", function() {
  // Global function to open pages in a new tab/window
  window.openPage = function(url) {
    window.open(url, "_blank");
  };

  // Toggle mobile side menu
  window.toggleSideMenu = function() {
    const sideMenu = document.getElementById("side-menu");
    if (sideMenu) {
      sideMenu.classList.toggle("visible");
    }
  };

  // Close side menu when clicking outside it and the toggle button
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

  // Dummy function to update the cart count badge
  function updateCartCount() {
    // For demonstration, using a dummy value. Later, integrate with your cart system.
    var count = localStorage.getItem("cartCount") || 3;
    if (document.getElementById("cartCount")) {
      document.getElementById("cartCount").innerText = count;
    }
    if (document.getElementById("cartCountMobile")) {
      document.getElementById("cartCountMobile").innerText = count;
    }
    if (document.getElementById("cartCountMobileBottom")) {
      document.getElementById("cartCountMobileBottom").innerText = count;
    }
  }
  updateCartCount();
});
