import React from "react";
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Paper,
  Button,
  List,
  ListItem,
  Divider
} from "@mui/material";

export const Dashboard = ({
  tasks,
  tasksPromise,
  loadingPromise,
  errorPromise,
  leaves,
  leavesCallBack,
  WFHCallBack,
  sickLeaves,
  leavesAll,
  WFHAll,
  teamTasks,
  teamStats,
  userMessage,
  fetchTasksXMLHttpRequest,
  fetchTasksAsyncAwait,
  fetchLeavesPromise,
  handleSequentialFetch,
  fetchParallelData,
  fetchTeamTasksAxios,
  fetchTeamStatsCallback,
  handleLogout
}) => {
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
          marginTop: 4
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
              CALLBACK CHAINING
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Button variant="contained" onClick={handleSequentialFetch}>
                Fetch Sequential Data
              </Button>
              <Typography variant="h6">Leaves: {leavesCallBack}</Typography>
              <Typography variant="h6">WFH: {WFHCallBack}</Typography>
              <Typography variant="h6">Sick Leaves: {sickLeaves}</Typography>
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
};
