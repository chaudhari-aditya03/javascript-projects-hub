const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

const userError = document.getElementById("userError");
const emailError = document.getElementById("emailError");
const passError = document.getElementById("passError");


// ---------------- USERNAME VALIDATION ----------------
username.addEventListener("input", () => {
  if (username.value.trim() === "") {
    userError.textContent = "Username cannot be empty ";
    username.style.borderColor = "red";
  } else {
    userError.textContent = "";
    username.style.borderColor = "green";
  }
});


// ---------------- EMAIL VALIDATION ----------------
email.addEventListener("input", () => {
  const value = email.value;

  const hasOnlyLowercase = value === value.toLowerCase();
  const atCount = (value.match(/@/g) || []).length;

  if (value === "") {
    emailError.textContent = "Email cannot be empty ";
    email.style.borderColor = "red";
  } 
  else if (!hasOnlyLowercase) {
    emailError.textContent = "Email must contain only lowercase letters ";
    email.style.borderColor = "red";
  }
  else if (atCount !== 1) {
    emailError.textContent = "Email must contain exactly one @ ";
    email.style.borderColor = "red";
  }
  else {
    emailError.textContent = "Valid Email ";
    emailError.className = "success";
    email.style.borderColor = "green";
  }
});


// ---------------- PASSWORD VALIDATION ----------------
password.addEventListener("input", () => {
  const value = password.value;

  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  const minLength = value.length >= 8;

  if (!hasLower) {
    passError.textContent = "Password must contain at least one lowercase letter ";
    password.style.borderColor = "red";
  }
  else if (!hasUpper) {
    passError.textContent = "Password must contain at least one uppercase letter ";
    password.style.borderColor = "red";
  }
  else if (!hasDigit) {
    passError.textContent = "Password must contain at least one digit ❌";
    password.style.borderColor = "red";
  }
  else if (!hasSymbol) {
    passError.textContent = "Password must contain at least one symbol ";
    password.style.borderColor = "red";
  }
  else if (!minLength) {
    passError.textContent = "Password must be at least 8 characters ";
    password.style.borderColor = "red";
  }
  else {
    passError.textContent = "Strong Password ";
    passError.className = "success";
    password.style.borderColor = "green";
  }
});
