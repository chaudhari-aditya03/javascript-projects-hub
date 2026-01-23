// Fixed credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin@123";

// Selecting elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

// Button click event
loginBtn.addEventListener("click", function () {

  const enteredEmail = emailInput.value.trim();
  const enteredPassword = passwordInput.value.trim();

  // Empty validation
  if (enteredEmail === "" || enteredPassword === "") {
    message.textContent = " Please fill all fields!";
    message.style.color = "orange";
    return;
  }

  // Credential validation
  if (enteredEmail === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
    message.textContent = " Login Successful! Welcome Admin.";
    message.style.color = "green";

    // Optional: Clear fields
    emailInput.value = "";
    passwordInput.value = "";
  } 
  else {
    message.textContent = "Invalid Username or Password!";
    message.style.color = "red";
  }

});
