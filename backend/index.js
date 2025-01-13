const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "user" && password === "1234") {
    const token = "fakeToken12345";
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});
app.get("/api/user-details", (req, res) => {
  setTimeout(() => {
    res.json({ message: "Hello, User" });
  }, 1000);
});

app.get("/api/tasks", (req, res) => {
  setTimeout(() => {
    res.json([
      { id: 1, title: "Task 1", completed: false },
      { id: 2, title: "Task 2", completed: true }
    ]);
  }, 10000);
});

app.get("/api/leaves", (req, res) => {
  setTimeout(() => {
    res.json({ leaves: 5 });
  }, 5000);
});

app.get("/api/wfh", (req, res) => {
  setTimeout(() => {
    res.json({ WFH: 2 });
  }, 5000);
});
app.get("/api/sick-leaves", (req, res) => {
  setTimeout(() => {
    res.json({ sickLeaves: 3 });
  }, 5000);
});

app.get("/api/team-tasks", (req, res) => {
  res.json([
    { id: 1, task: "Team task 1", completed: false },
    { id: 2, task: "Team task 2", completed: true }
  ]);
});

const getTeamStats = (callback) => {
  setTimeout(() => {
    callback({ tasksCompleted: 5, tasksPending: 2 });
  }, 1000);
};

app.get("/api/team-stats", (req, res) => {
  getTeamStats((data) => {
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
