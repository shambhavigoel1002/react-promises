import React, { useState } from "react";
import axios from "axios";
import Login from "./Login";
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { useEffect } from "react";

function App() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState(null);
  const [WFH, setWFH] = useState(null);
  const [leavesAll, setLeavesAll] = useState(null);
  const [WFHAll, setWFHAll] = useState(null);
  const [teamTasks, setTeamTasks] = useState([]);
  const [teamStats, setTeamStats] = useState(null);
  const [tasksPromise, setTasksPromise] = useState([]);
  const [loadingPromise, setLoadingPromise] = useState(false);
  const [errorPromise, setErrorPromise] = useState(null);
  const [userMessage, setUserMessage] = useState(""); // State for storing user message

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Set up axios defaults for authenticated requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      fetchUserDetailsCallback((message) => setUserMessage(message)); // Get user details and update state
    }
    setIsLoading(false);
  }, []);

  // Custom hook to handle token updates
  const handleTokenUpdate = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
    setToken(newToken);
  };
  // Fetch user details using Callback
  const fetchUserDetailsCallback = (callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5000/api/user-details", true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText).message);
      } else {
        console.error("Error fetching user details");
      }
    };
    xhr.onerror = () => {
      console.error("Request failed with Callback");
    };
    xhr.send();
  };

  // Fetch tasks using XMLHttpRequest
  const fetchTasksXMLHttpRequest = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5000/api/tasks", false); // 'false' makes this a synchronous request
    xhr.send();

    if (xhr.status === 200) {
      console.log("Data:", xhr.responseText);
    } else {
      console.error("Request failed");
    }
    // const xhr = new XMLHttpRequest();
    // xhr.open("GET", "http://localhost:5000/api/tasks", true);
    // xhr.onload = () => {
    //   if (xhr.status === 200) {
    //     setTasks(JSON.parse(xhr.responseText));
    //   } else {
    //     console.error("Error fetching tasks with XMLHttpRequest");
    //   }
    // };
    // xhr.onerror = () => {
    //   console.error("Request failed with XMLHttpRequest");
    // };
    // xhr.send();
  };

  // Fetch leaves using Promises
  const fetchLeavesPromise = () => {
    fetch("http://localhost:5000/api/leaves")
      .then((response) => response.json())
      .then((data) => setLeaves(data.leaves))
      .catch((error) => console.error("Error fetching leaves", error));
  };

  // Fetch WFH using Callbacks
  const fetchWFHCallback = (callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5000/api/wfh", true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText).WFH);
      } else {
        console.error("Error fetching WFH data");
      }
    };
    xhr.onerror = () => {
      console.error("Request failed with Callback");
    };
    xhr.send();
  };

  // Fetch team tasks using Axios
  const fetchTeamTasksAxios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/team-tasks");
      setTeamTasks(response.data);
    } catch (error) {
      console.error("Error fetching team tasks with Axios", error);
    }
  };

  // Fetch team stats using Callback
  const fetchTeamStatsCallback = () => {
    getTeamStats((data) => {
      setTeamStats(data);
    });
  };

  const getTeamStats = (callback) => {
    setTimeout(() => {
      callback({ tasksCompleted: 5, tasksPending: 2 });
    }, 1000);
  };

  // Parallel fetching with Promise.all
  const fetchParallelData = () => {
    Promise.all([
      fetch("http://localhost:5000/api/leaves").then((response) =>
        response.json()
      ),
      fetch("http://localhost:5000/api/wfh").then((response) =>
        response.json()
      ),
    ])
      .then(([leavesData, wfhData]) => {
        setLeavesAll(leavesData.leaves);
        setWFHAll(wfhData.WFH);
      })
      .catch((error) => {
        console.error("Error fetching parallel data", error);
      });
  };
  const fetchTasksAsyncAwait = async () => {
    setLoadingPromise(true);
    setErrorPromise(null);

    try {
      const taskResponse = await fetch("http://localhost:5000/api/tasks");
      if (!taskResponse.ok) {
        throw new Error(`HTTP error! status: ${taskResponse.status}`);
      }
      const taskData = await taskResponse.json();

      const enhancedTasks = await Promise.all(
        taskData.map(async (task) => {
          try {
            const detailsResponse = await fetch(
              `http://localhost:5000/api/tasks`
            );
            if (!detailsResponse.ok) {
              return { ...task, details: "Failed to load details" };
            }
            const details = await detailsResponse.json();
            return { ...task, details };
          } catch (error) {
            return { ...task, details: "Error loading details" };
          }
        })
      );

      setTasksPromise(enhancedTasks);
    } catch (error) {
      setErrorPromise(`Failed to fetch tasks: ${error.message}`);
    } finally {
      setLoadingPromise(false);
    }
  };
  const handleLogout = () => {
    handleTokenUpdate(null);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ paddingTop: 4, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!token) {
    return <Login setToken={handleTokenUpdate} />;
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Task Manager Dashboard
      </Typography>
      <Typography variant="h4" gutterBottom align="center">
        {userMessage}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 4,
          marginTop: 4,
        }}
      >
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Tasks
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Button variant="contained" onClick={fetchTasksXMLHttpRequest}>
                Fetch Tasks using XMLHttpRequest
              </Button>
              <List>
                {tasks.map((task) => (
                  <ListItem key={task.id}>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body1">
                      Status: {task.completed ? "Completed" : "Pending"}
                    </Typography>
                    <Divider sx={{ margin: "10px 0" }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </CardContent>
        </Card>
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Tasks with Async/Await
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Button
                variant="contained"
                onClick={fetchTasksAsyncAwait}
                disabled={loadingPromise}
              >
                {loadingPromise
                  ? "Loading..."
                  : "Fetch Tasks using Async/Await"}
              </Button>

              {errorPromise && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {errorPromise}
                </Typography>
              )}

              <List>
                {tasksPromise.map((task) => (
                  <ListItem key={task.id}>
                    <Box sx={{ width: "100%" }}>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="body1">
                        Status: {task.completed ? "Completed" : "Pending"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Details:{" "}
                        {task.details
                          ? JSON.stringify(task.details)
                          : "No details available"}
                      </Typography>
                      <Divider sx={{ margin: "10px 0" }} />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </CardContent>
        </Card>
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Leaves
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Button variant="contained" onClick={fetchLeavesPromise}>
                Fetch Leaves using Promise
              </Button>
              <Typography variant="h6">Leaves: {leaves}</Typography>
            </Paper>
          </CardContent>
        </Card>

        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              WFH
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Button
                variant="contained"
                onClick={() => fetchWFHCallback((data) => setWFH(data))}
              >
                Fetch WFH using Callback
              </Button>
              <Typography variant="h6">WFH: {WFH}</Typography>
            </Paper>
          </CardContent>
        </Card>

        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Parallel Data Fetching
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Button variant="contained" onClick={fetchParallelData}>
                Fetch Leaves & WFH using Promise.all
              </Button>
              <Typography variant="h6">Leaves: {leavesAll}</Typography>
              <Typography variant="h6">WFH: {WFHAll}</Typography>
            </Paper>
          </CardContent>
        </Card>

        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Team Tasks
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Button variant="contained" onClick={fetchTeamTasksAxios}>
                Fetch Team Tasks using Axios
              </Button>
              <List>
                {teamTasks.map((task) => (
                  <ListItem key={task.id}>
                    <Typography variant="h6">{task.task}</Typography>
                    <Typography variant="body1">
                      Status: {task.completed ? "Completed" : "Pending"}
                    </Typography>
                    <Divider sx={{ margin: "10px 0" }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </CardContent>
        </Card>

        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Team Stats
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Button variant="contained" onClick={fetchTeamStatsCallback}>
                Fetch Team Stats using Callback
              </Button>
              <Typography variant="h6">
                Tasks Completed: {teamStats?.tasksCompleted}
              </Typography>
              <Typography variant="h6">
                Tasks Pending: {teamStats?.tasksPending}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          style={{ height: "fit-content" }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default App;
