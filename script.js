document.addEventListener("DOMContentLoaded", function() {
  // Global function to open pages in a new tab/window
  window.openPage = function(url) {
    window.open(url, '_blank');
  };

  // Global toggle function for the side menu (using "active" class)
  window.toggleSideMenu = function() {
    const sideMenu = document.getElementById("side-menu");
    if (sideMenu) {
      sideMenu.classList.toggle("active");
    }
  };

  // Close side menu when clicking outside the menu and toggle button
  document.addEventListener("click", function(event) {
    const sideMenu = document.getElementById("side-menu");
    const menuToggle = document.querySelector(".menu-toggle");
    if (
      sideMenu &&
      sideMenu.classList.contains("active") &&
      !sideMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      sideMenu.classList.remove("active");
    }
  });

  // Dummy function to update the cart count badge
  function updateCartCount() {
    // Replace with real integration as needed
    const count = localStorage.getItem("cartCount") || 3;
    // Update all elements with the badge class (or target specific IDs if desired)
    document.querySelectorAll(".badge").forEach(badge => {
      badge.innerText = count;
    });
  }
  updateCartCount();
});
