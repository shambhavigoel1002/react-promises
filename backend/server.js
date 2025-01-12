const express = require("express");
const app = express();
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "testUser" && password === "testPassword") {
    return res.status(200).json({ token: "fake-jwt-token" });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});

module.exports = app;
