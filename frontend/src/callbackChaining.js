// the apis below being on a 5 seconds delay
// Fetch leaves data with a callback
export const fetchLeavesData = (setLeavesCallBack, callback) => {
  const xhrLeaves = new XMLHttpRequest();
  xhrLeaves.open("GET", "http://localhost:5000/api/leaves", true);
  xhrLeaves.onreadystatechange = function () {
    if (xhrLeaves.readyState === 4 && xhrLeaves.status === 200) {
      const leavesData = JSON.parse(xhrLeaves.responseText);
      console.log("Fetched Leaves:", leavesData.leaves);
      setLeavesCallBack(leavesData.leaves);

      // After fetching leaves, invoke the callback to fetch WFH data
      if (callback) callback();
    }
  };
  xhrLeaves.send();
};

// Fetch WFH data with a callback
export const fetchWFHData = (setWFHCallBack, callback) => {
  const xhrWFH = new XMLHttpRequest();
  xhrWFH.open("GET", "http://localhost:5000/api/wfh", true);
  xhrWFH.onreadystatechange = function () {
    if (xhrWFH.readyState === 4 && xhrWFH.status === 200) {
      const wfhData = JSON.parse(xhrWFH.responseText);
      console.log("Fetched WFH:", wfhData.WFH);
      setWFHCallBack(wfhData.WFH);

      // After fetching WFH, invoke the callback to fetch Sick Leaves
      if (callback) callback();
    }
  };
  xhrWFH.send();
};

// Fetch sick leaves data with a callback
export const fetchSickLeavesData = (setSickLeaves, callback) => {
  const xhrSickLeaves = new XMLHttpRequest();
  xhrSickLeaves.open("GET", "http://localhost:5000/api/sick-leaves", true);
  xhrSickLeaves.onreadystatechange = function () {
    if (xhrSickLeaves.readyState === 4 && xhrSickLeaves.status === 200) {
      const sickLeavesData = JSON.parse(xhrSickLeaves.responseText);
      console.log("Fetched Sick Leaves:", sickLeavesData.sickLeaves);
      setSickLeaves(sickLeavesData.sickLeaves);

      // Callback or log message indicating completion
      if (callback) callback();
    }
  };
  xhrSickLeaves.send();
};

// Sequentially fetch leaves, WFH, and sick leaves using nested callbacks
export const fetchSequentiallyUsingCallbacks = (
  setLeaves,
  setWFH,
  setSickLeaves
) => {
  fetchLeavesData(setLeaves, () => {
    fetchWFHData(setWFH, () => {
      fetchSickLeavesData(setSickLeaves, () => {
        console.log("Fetched all data: Leaves, WFH, Sick Leaves.");
      });
    });
  });
};
