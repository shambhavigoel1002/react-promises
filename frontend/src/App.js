import React, { useState } from "react";
import axios from "axios";
import Login from "./Login";
import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { fetchSequentiallyUsingCallbacks } from "./callbackChaining";
import { Dashboard } from "./Dashboard";

function App() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState(null);
  const [leavesAll, setLeavesAll] = useState(null);
  const [WFHAll, setWFHAll] = useState(null);
  const [teamTasks, setTeamTasks] = useState([]);
  const [teamStats, setTeamStats] = useState(null);
  const [tasksPromise, setTasksPromise] = useState([]);
  const [loadingPromise, setLoadingPromise] = useState(false);
  const [errorPromise, setErrorPromise] = useState(null);
  const [userMessage, setUserMessage] = useState(""); // State for storing user message
  const [sickLeaves, setSickLeaves] = useState(null);
  const [leavesCallBack, setLeavesCallBack] = useState(null);
  const [WFHCallBack, setWFHCallBack] = useState(null);
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
  //(/task being on 10 sec delay)
  // Fetch tasks using XMLHttpRequest
  const fetchTasksXMLHttpRequest = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5000/api/tasks", false); // 'false' makes this a synchronous request
    xhr.send();

    if (xhr.status === 200) {
      setTasks(JSON.parse(xhr.responseText));
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

  // Fetch same task list with Async Await
  const fetchTasksAsyncAwait = async () => {
    setLoadingPromise(true);
    setErrorPromise(null);

    try {
      const taskResponse = await fetch("http://localhost:5000/api/tasks");
      if (!taskResponse.ok) {
        throw new Error(`HTTP error! status: ${taskResponse.status}`);
      }
      const taskData = await taskResponse?.json();

      const enhancedTasks = await Promise.all(
        taskData?.map(async (task) => {
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
  // Fetch leaves using Promises
  const fetchLeavesPromise = () => {
    fetch("http://localhost:5000/api/leaves")
      .then((response) => response.json())
      .then((data) => setLeaves(data.leaves))
      .catch((error) => console.error("Error fetching leaves", error));
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
      fetch("http://localhost:5000/api/wfh").then((response) => response.json())
    ])
      .then(([leavesData, wfhData]) => {
        setLeavesAll(leavesData.leaves);
        setWFHAll(wfhData.WFH);
      })
      .catch((error) => {
        console.error("Error fetching parallel data", error);
      });
  };
  // callback chaining
  const handleSequentialFetch = () => {
    fetchSequentiallyUsingCallbacks(
      setLeavesCallBack,
      setWFHCallBack,
      setSickLeaves
    );
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
    <Dashboard
      tasks={tasks}
      tasksPromise={tasksPromise}
      leaves={leaves}
      leavesAll={leavesAll}
      WFHAll={WFHAll}
      teamTasks={teamTasks}
      teamStats={teamStats}
      userMessage={userMessage}
      handleTokenUpdate={handleTokenUpdate}
      handleLogout={() => handleLogout(null)}
      loadingPromise={loadingPromise}
      errorPromise={errorPromise}
      fetchTasksXMLHttpRequest={fetchTasksXMLHttpRequest}
      fetchTasksAsyncAwait={fetchTasksAsyncAwait}
      fetchLeavesPromise={fetchLeavesPromise}
      fetchParallelData={fetchParallelData}
      fetchTeamTasksAxios={fetchTeamTasksAxios}
      fetchTeamStatsCallback={fetchTeamStatsCallback}
      handleSequentialFetch={handleSequentialFetch}
      leavesCallBack={leavesCallBack}
      WFHCallBack={WFHCallBack}
      sickLeaves={sickLeaves}
    />
  );
}

export default App;
