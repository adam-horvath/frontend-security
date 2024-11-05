const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Middleware to simulate authentication
app.use((req, res, next) => {
  if (req.cookies.authToken === "valid-session") {
    req.user = { id: 1, email: "user@example.com" }; // Simulated user data
  }
  next();
});

// Route to simulate login and set the authentication cookie
app.get("/login", (req, res) => {
  res.cookie("authToken", "valid-session", { httpOnly: true });
  res.send("User logged in with session.");
});

// Vulnerable endpoint to update email
app.post("/update-email", (req, res) => {
  res.cookie("authToken", "valid-session", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }
  const newEmail = req.body.email;
  console.log(`Email updated to: ${newEmail}`);
  res.send(`Email updated to: ${newEmail}`);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
