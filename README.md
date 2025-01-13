# react-promises
# Project Overview

This project demonstrates various **Promise** handling scenarios in a React and Express application, focusing on handling asynchronous tasks such as fetching data from an API and managing user interactions with different methods like `XMLHttpRequest`, `async/await`, `Promise.all`, and callback chaining.

## Key Features and Scenarios

### 1. **Fetching User Details Using Callback (XHR Request)**  
   - **Scenario**: Fetch user details using `XMLHttpRequest` with a callback to handle the response.
   - **Promises Used**: Callbacks for handling responses sequentially and managing asynchronous operations.
   
   ```js
   const fetchUserDetailsCallback = (callback) => {
     const xhr = new XMLHttpRequest();
     xhr.open("GET", "http://localhost:5000/api/user-details", true);
     xhr.onload = () => {
       if (xhr.status === 200) {
         callback(JSON.parse(xhr.responseText).message);
       }
     };
     xhr.send();
   };
  ```
### 2. **Fetching Tasks Using XMLHttpRequest (Blocking Mode)**  
   - **Scenario**: Fetch tasks using XMLHttpRequest in a synchronous (blocking) manner.
   - **Promises Used**: Although XMLHttpRequest itself is not based on promises, using it synchronously simulates blocking behavior, impacting UI performance in real-world applications.
   
   ```js
  const fetchTasksXMLHttpRequest = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5000/api/tasks", false); // synchronous request
    xhr.send();
  
    if (xhr.status === 200) {
      setTasks(JSON.parse(xhr.responseText));
    } else {
      console.error("Request failed");
    }
};
```
### 3. **Fetching Tasks Using Async/Await (Non-blocking)**  
   - **Scenario**: Fetch tasks using async/await, which provides a cleaner and more readable way to handle asynchronous operations.
   - **Promises Used**: async/await syntax handles asynchronous data fetching and manages errors through try/catch.
   
   ```js
  const fetchTasksAsyncAwait = async () => {
    try {
      const taskResponse = await fetch("http://localhost:5000/api/tasks");
      const taskData = await taskResponse.json();
      setTasks(taskData);
    } catch (error) {
      setError(`Failed to fetch tasks: ${error.message}`);
    }
};
```
### 4. **Fetching Leaves Using Promises**  
   - **Scenario**: Fetch leave data using Promises and `.then()` chaining.
   - **Promises Used**: `.then()` handles the resolved value, and `.catch()` is used for error handling.

   ```js
   const fetchLeavesPromise = () => {
     fetch("http://localhost:5000/api/leaves")
       .then((response) => response.json())
       .then((data) => setLeaves(data.leaves))
       .catch((error) => console.error("Error fetching leaves", error));
   };
```

### 5. **Parallel Data Fetching with Promise.all**  
   - **Scenario**: Fetch multiple resources (leave and work-from-home data) concurrently using `Promise.all()`. This allows fetching the data in parallel, and once both promises are resolved, the data is processed together.
   - **Promises Used**: `Promise.all()` is used to run multiple promises concurrently. It resolves when all the promises passed to it are resolved. If any promise is rejected, the entire `Promise.all()` is rejected.

   ```js
   const fetchParallelData = () => {
     Promise.all([
       fetch("http://localhost:5000/api/leaves").then((res) => res.json()),
       fetch("http://localhost:5000/api/wfh").then((res) => res.json())
     ])
       .then(([leavesData, wfhData]) => {
         setLeavesAll(leavesData.leaves);
         setWFHAll(wfhData.WFH);
       })
       .catch((error) => console.error("Error fetching parallel data", error));
   };
```

### 6. **Sequential Data Fetching Using Callback Chaining**  
   - **Scenario**: Fetch data sequentially using callback functions, where the result of one operation triggers the next operation. This is commonly used when tasks need to be executed in a specific order.
   - **Promises Used**: Although callback chaining doesn't directly involve promises, it uses JavaScript's event loop to manage asynchronous operations sequentially. This can be refactored to use promises in modern JavaScript.

   ```js
   const handleSequentialFetch = () => {
     fetchSequentiallyUsingCallbacks(
       setLeavesCallBack, 
       setWFHCallBack, 
       setSickLeaves
     );
   };

   // Callback Chaining function
   const fetchSequentiallyUsingCallbacks = (setLeaves, setWFH, setSickLeaves) => {
     fetch("http://localhost:5000/api/leaves")
       .then((response) => response.json())
       .then((data) => {
         setLeaves(data.leaves);
         return fetch("http://localhost:5000/api/wfh");
       })
       .then((response) => response.json())
       .then((data) => {
         setWFH(data.WFH);
         return fetch("http://localhost:5000/api/sick-leaves");
       })
       .then((response) => response.json())
       .then((data) => {
         setSickLeaves(data.sickLeaves);
       })
       .catch((error) => console.error("Error in sequential fetch", error));
   };
```

### 7. **Fetching Team Tasks Using Axios**  
   - **Scenario**: Fetch team tasks using Axios, a popular promise-based HTTP client. Axios simplifies working with promises and allows for cleaner and more readable asynchronous code.
   - **Promises Used**: Axios automatically returns promises, which can be handled using `.then()` and `.catch()` for successful or failed requests, respectively.

   ```js
   const fetchTeamTasksAxios = async () => {
     try {
       const response = await axios.get("http://localhost:5000/api/team-tasks");
       setTeamTasks(response.data);
     } catch (error) {
       console.error("Error fetching team tasks with Axios", error);
     }
   };
```

### 8. **Fetching Team Stats Using Callback Function**  
   - **Scenario**: Fetch team statistics using a callback function. In this scenario, a callback is used to handle the result after fetching team data, mimicking a common approach for asynchronous tasks before promises became widely used.
   - **Promises Used**: While the callback itself doesn't use promises, the asynchronous nature of the `setTimeout` mimics the behavior of promises, making it easy to understand how data can be processed once it's available.

   ```js
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
```

### 9. **Parallel Data Fetching Using Promise.all**  
   - **Scenario**: Fetch multiple pieces of data simultaneously using `Promise.all()`, which allows for running multiple promises in parallel and waiting for all of them to resolve before processing the data.
   - **Promises Used**: `Promise.all()` accepts an array of promises and returns a single promise that resolves when all of the input promises resolve. It ensures that all asynchronous operations are executed concurrently.

   ```js
   const fetchParallelData = () => {
     Promise.all([
       fetch("http://localhost:5000/api/leaves").then((response) => response.json()),
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
```
