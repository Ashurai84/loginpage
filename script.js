import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeWFe7SjnRBTmZbQHQuQcRM914aDQDZ2A",
  authDomain: "otp-sender-f9545.firebaseapp.com",
  projectId: "otp-sender-f9545",
  storageBucket: "otp-sender-f9545.appspot.com",
  messagingSenderId: "99534447140",
  appId: "1:99534447140:web:40e86958c6f0835aa96eb1",
  measurementId: "G-7XV5BRYS1D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign-Up Form Submission
const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signUpEmail").value.trim();
  const password = document.getElementById("signUpPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully! Please log in.");
    document.getElementById("container").classList.remove("right-panel-active");
  } catch (error) {
    alert(`Error during sign-up: ${error.message}`);
  }
});

// Sign-In Form Submission
const signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in successfully!");
    window.location.href = "my.html"; // Redirect to the new HTML page
  } catch (error) {
    alert(`Error during sign-in: ${error.message}`);
  }
});

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
  const currentPath = window.location.pathname;

  if (user && currentPath === "/login.html") {
    // Redirect logged-in users to the movie app if they revisit the login page
    window.location.href = "my.html";
  } else if (!user && currentPath === "/my.html") {
    // Redirect to login if the user is not authenticated and tries to access movieApp.html
    alert("You must be logged in to access this page.");
    window.location.href = "my.html";
  }
});
