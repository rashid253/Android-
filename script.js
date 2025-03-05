document.addEventListener("DOMContentLoaded", () => {
  // Open pages in a new tab
  window.openPage = (url) => window.open(url, "_blank");

  // Toggle mobile side menu and animate the hamburger icon
  window.toggleSideMenu = (button) => {
    const sideMenu = document.getElementById("side-menu");
    if (button) {
      button.classList.toggle("active");
      const expanded = button.classList.contains("active");
      button.setAttribute("aria-expanded", expanded);
    }
    if (sideMenu) sideMenu.classList.toggle("visible");
  };

  // Close side menu if a click occurs outside of it or the toggle button
  document.addEventListener("click", (event) => {
    const sideMenu = document.getElementById("side-menu");
    const menuToggle = document.querySelector(".menu-toggle");
    if (
      sideMenu &&
      sideMenu.classList.contains("visible") &&
      !sideMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      sideMenu.classList.remove("visible");
      if (menuToggle.classList.contains("active")) {
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Dummy function to update the cart count badge
  const updateCartCount = () => {
    const count = localStorage.getItem("cartCount") || 3;
    ["cartCount", "cartCountMobile", "cartCountMobileBottom"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerText = count;
    });
  };
  updateCartCount();

  // Dummy function to simulate fetching products
  const fetchProducts = () => {
    const dummyProducts = [
      { id: 1, name: "Product A", price: "$10", image: "product-a.jpg" },
      { id: 2, name: "Product B", price: "$20", image: "product-b.jpg" },
      { id: 3, name: "Product C", price: "$30", image: "product-c.jpg" },
    ];
    // Simulate asynchronous data fetching
    setTimeout(() => renderProducts(dummyProducts), 1000);
  };

  // Render products into the products grid
  const renderProducts = (products) => {
    const grid = document.getElementById("products-grid");
    if (!grid) return;
    grid.innerHTML = "";
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <button onclick="openPage('product.html?id=${product.id}')">View Details</button>
      `;
      grid.appendChild(card);
    });
  };

  // Initiate dummy product fetch
  fetchProducts();

  // Load external HTML files into placeholders
  const loadHTML = (elementId, filePath) => {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        return response.text();
      })
      .then((html) => {
        document.getElementById(elementId).innerHTML = html;
      })
      .catch((error) => console.error(error));
  };

  loadHTML("header-placeholder", "header.html");
  loadHTML("footer-placeholder", "footer.html");
});
