const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:49160/");

ws.on("open", function () {
  console.log("WebSocket Client Connected");
  sendCommand("StartFileGeneration");
});

ws.on("message", function (message) {
  const data = JSON.parse(message);
  if (data.messageType === "start") {
    console.log("File generation started at ", new Date());
  } else if (data.messageType === "fileGenerated") {
    console.log("File Generated: ", data.message);
  } else if (data.messageType === "complete") {
    console.log("File generation is complete: ", data.message);
    ws.close();
  } else if (data.messageType === "status") {
    console.log("Status Update: ", data.message);
  } else if (data.messageType === "error") {
    console.log("Error returned: ", data.message);
  } else {
    console.log("Unknown messageType: ", data.messageType);
  }
});

ws.on("error", function (error) {
  console.log("Connection Error: " + error.toString());
});
ws.on("close", function () {
  console.log("Connection Closed");
});

function sendCommand(command) {
  ws.send(JSON.stringify({ payload: command }));
}

// In some cases, a client may want to occassionally request a status message from the server.  We should be careful
// not to be too pingy.
setInterval(() => {
  sendCommand("Status");
}, 300000);
