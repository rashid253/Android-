/********************************
 * REPLACE THIS WITH YOUR OWN 
 * FIREBASE CONFIGURATION
 ********************************/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app-default-rtdb.firebaseio.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Listen for form submissions on each page
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pageForm");
  const formMessage = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Collect input values
      const pageTitle = document.getElementById("pageTitle").value.trim();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const timestamp = Date.now();

      // Save data to Realtime Database
      database.ref("submissions/" + timestamp).set({
        pageTitle,
        name,
        email,
        phone,
        submittedAt: new Date(timestamp).toISOString()
      })
      .then(() => {
        formMessage.style.color = "green";
        formMessage.textContent = "Thank you for your submission!";
        form.reset();
      })
      .catch((error) => {
        formMessage.style.color = "red";
        formMessage.textContent = "Error: " + error.message;
      });
    });
  }
});
