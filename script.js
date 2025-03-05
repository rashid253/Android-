document.addEventListener("DOMContentLoaded", function () {
  // Global function to open pages in a new tab/window
  window.openPage = function (url) {
    window.open(url, "_blank");
  };

  // Toggle mobile side menu and animate hamburger icon
  window.toggleSideMenu = function (buttonElement) {
    const sideMenu = document.getElementById("side-menu");
    // If buttonElement is passed (for hamburger icon), toggle active class on it
    if (buttonElement && buttonElement.classList) {
      buttonElement.classList.toggle("active");
      // Update ARIA attribute for accessibility
      const expanded = buttonElement.classList.contains("active");
      buttonElement.setAttribute("aria-expanded", expanded);
    }
    if (sideMenu) {
      sideMenu.classList.toggle("visible");
    }
  };

  // Close side menu when clicking outside of it and the toggle button
  document.addEventListener("click", function (event) {
    const sideMenu = document.getElementById("side-menu");
    const menuToggle = document.querySelector(".menu-toggle");
    if (
      sideMenu &&
      sideMenu.classList.contains("visible") &&
      !sideMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      sideMenu.classList.remove("visible");
      // Also remove active state from hamburger icon if present
      if (menuToggle && menuToggle.classList.contains("active")) {
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Dummy function to update the cart count badge
  function updateCartCount() {
    // For demonstration, using a dummy value (3). Replace with real integration later.
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

  // Dummy function to simulate fetching products
  function fetchProducts() {
    // Simulated dummy product data
    const dummyProducts = [
      { id: 1, name: "Product A", price: "$10", image: "product-a.jpg" },
      { id: 2, name: "Product B", price: "$20", image: "product-b.jpg" },
      { id: 3, name: "Product C", price: "$30", image: "product-c.jpg" },
    ];
    // Simulate a delay to mimic async fetch
    setTimeout(() => {
      renderProducts(dummyProducts);
    }, 1000);
  }

  // Function to render products into the DOM
  function renderProducts(products) {
    const productsGrid = document.getElementById("products-grid");
    if (!productsGrid) return;
    productsGrid.innerHTML = ""; // Clear existing content
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <button onclick="openPage('product.html?id=${product.id}')">View Details</button>
      `;
      productsGrid.appendChild(productCard);
    });
  }

  // Call the dummy fetchProducts function to load products
  fetchProducts();

  // Load header and footer dynamically
  function loadHTML(elementId, filePath) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching " + filePath);
        }
        return response.text();
      })
      .then((html) => {
        document.getElementById(elementId).innerHTML = html;
      })
      .catch((error) => console.error(error));
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadHTML("header-placeholder", "header.html");
    loadHTML("footer-placeholder", "footer.html");
  });
});
