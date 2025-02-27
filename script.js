// Replace these with your actual Firebase project details
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

// Attach listener to any page with a form #userInfoForm
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userInfoForm");
  const formMessage = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const timestamp = Date.now();

      database.ref("users/" + timestamp).set({
        name,
        email,
        phone,
        submittedAt: new Date(timestamp).toISOString()
      })
      .then(() => {
        if (formMessage) {
          formMessage.textContent = "Thank you for your submission!";
          formMessage.style.color = "#2ecc71"; // success color
        }
        form.reset();
      })
      .catch((error) => {
        if (formMessage) {
          formMessage.textContent = "Error: " + error.message;
          formMessage.style.color = "red";
        }
      });
    });
  }
});
