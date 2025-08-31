function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}


function showLogin() {
  document.getElementById("formTitle").innerText = "Login Form";
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("btn").style.left = "0px";
}
function showSignup() {
  document.getElementById("formTitle").innerText = "Signup Form";
  document.getElementById("signupForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("btn").style.left = "110px";
}

// Signup
function handleSignup() {
  let username = document.getElementById("signupUsername").value.trim();
  let useremail = document.getElementById("signupEmail").value.trim();
  let password = document.getElementById("signupPassword").value.trim();
  let confirmPassword = document.getElementById("signupConfirmPassword").value.trim();
  let message = document.getElementById("signupMessage");

  let users = loadFromLocalStorage("users");

  // for empty fields
  if (!username || !password || !confirmPassword || !useremail) {
    message.innerText = "⚠️ All fields are required!";
    message.style.color = "red";
    return;
  }

  // check email format using regex code  
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(useremail)) {
    message.innerText = "❌ Enter a valid email address!";
    message.style.color = "red";
    return;
  }

  // Password length 
  if (password.length < 4) {
    message.innerText = "⚠️ Password must be at least 6 characters!";
    message.style.color = "red";
    return;
  }

  // Password match check
  if (password !== confirmPassword) {
    message.innerText = "❌ Passwords do not match!";
    message.style.color = "red";
    return;
  }

  // Check if email already exists
  if (users.find(u => u.useremail === useremail)) {
    message.innerText = "⚠️ Email already exists!";
    message.style.color = "red";
    return;
  }

  // Save user
  users.push({ username, useremail, password });
  saveToLocalStorage("users", users);

  message.innerText = "✅ Signup successful! Please login.";
  message.style.color = "green";

  // Clear inputs
  document.getElementById("signupUsername").value = "";
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";
  document.getElementById("signupConfirmPassword").value = "";
}

// Login Function
function handleLogin() {
  let useremail = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value.trim();
  let messageBox = document.getElementById("loginMessage");

  // Clear old messages
  messageBox.innerText = "";
  messageBox.style.color = "red";

  // Basic validation
  if (!useremail || !password) {
    messageBox.innerText = "⚠️ Please enter both email and password.";
    return;
  }

  let users = loadFromLocalStorage("users");

  let user = users.find(u => u.useremail === useremail && u.password === password);

  if (!user) {
    messageBox.innerText = "❌ Invalid email or password!";
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  messageBox.style.color = "green";
  messageBox.innerText = "✅ Login successful! Redirecting...";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html"; 
}

// Blogs Section
document.addEventListener("DOMContentLoaded", function () {
  const blogForm = document.getElementById("blogForm");
  const blogsContainer = document.getElementById("blogsContainer");
  let blogs = loadFromLocalStorage("blogs");

  // Display logged in username
  function displayUsername() {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      document.getElementById("welcomeUser").innerText = "Welcome, " + user.username;
    }
  }

  // Render blogs
  function renderBlogs() {
    blogsContainer.innerHTML = "";
    blogs.forEach((blog, index) => {
      const blogItem = document.createElement("div");
      blogItem.classList.add("blog-item");
      blogItem.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.content}</p>
        <small>✍️ By ${blog.author} on ${blog.timestamp}</small>
        <div class="blog-actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      `;

      // delete button
      blogItem.querySelector(".delete").addEventListener("click", () => {
        blogs.splice(index, 1);
        saveBlogs();
      });

      // edit button
      blogItem.querySelector(".edit").addEventListener("click", () => {
        document.getElementById("blogTitle").value = blog.title;
        document.getElementById("blogContent").value = blog.content;
        blogs.splice(index, 1); 
        saveBlogs();
      });

      blogsContainer.appendChild(blogItem);
    });

    document.getElementById("totalBlogs").innerText = blogs.length;
  }

  function saveBlogs() {
    saveToLocalStorage("blogs", blogs);
    renderBlogs();
  }

  if (blogForm) {
    blogForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("blogTitle").value.trim();
      const content = document.getElementById("blogContent").value.trim();
      let user = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!title || !content) return;

      blogs.push({
        title,
        content,
        author: user ? user.username : "Anonymous",
        timestamp: new Date().toLocaleString()
      });

      saveBlogs();
      blogForm.reset();
    });
  }

  renderBlogs();
  displayUsername();
});

function displayUsername() {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    document.getElementById("usernameDisplay").innerText = user.username;
  }
}
