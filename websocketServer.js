const WebSocket = require("ws");
const randomstring = require("randomstring");
const simulationMinutes = 10; // 45; // 1;
let fileCount = 0;
let intervalId = 0;

const wsServer = new WebSocket.Server({ port: 8080 });
console.log("Listening on port 8080...");

wsServer.on("connection", function (connection) {
  console.log("Client connected...");
  connection.on("message", function (message) {
    const data = JSON.parse(message);
    console.log("received:", data.payload);
    if (data.payload && data.payload === "StartFileGeneration") {
      fileCount = 0;
      connection.send(
        JSON.stringify({
          messageType: "start",
          message: `Starting file generation .`,
        })
      );
      SimulateSomeWork(
        (fileGenerated) => {
          connection.send(
            JSON.stringify({
              messageType: "fileGenerated",
              message: `Generated file ${fileGenerated}`,
            })
          );
          console.log(`Generated file ${fileGenerated}`);
          fileCount++;
        },
        () => {
          connection.send(
            JSON.stringify({
              messageType: "complete",
              message: `Complete. Generated ${fileCount} file(s).`,
            })
          );
          StopSimulatingWork();
          console.log(`All done`);
        }
      );
    } else if (data.payload && data.payload === "Status") {
      connection.send(
        JSON.stringify({
          messageType: "status",
          message: `So far I have generated ${fileCount} file(s).`,
        })
      );
    } else {
      connection.send(
        JSON.stringify({
          messageType: "error",
          message: `Unknown messageType or missing payload.`,
        })
      );
    }
  });

  connection.on("close", function () {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
    StopSimulatingWork();
  });
});

const StopSimulatingWork = () => {
  if (intervalId) {
    console.log("Stopping my work...");
    clearInterval(intervalId);
    intervalId = null;
  }
};

const SimulateSomeWork = (fileGenerated, fileGenerationComplete) => {
  // For the sake of this PoC, we are just going to keep simulating file generation every 10 seconds for a period of X minutes.
  // After X minutes, we call the fileGenerationComplete callback.  Set the simulationMinutes variable per your needs.
  const startingDateTime = new Date();
  intervalId = setInterval(() => {
    const currentDateTime = new Date();
    const dateDiff = Math.abs(currentDateTime - startingDateTime);
    const dateDiffMinutes = Math.floor(dateDiff / 1000 / 60);
    if (dateDiffMinutes > simulationMinutes) {
      // Simulate being done generating files.
      fileGenerationComplete();
    } else {
      // Simulate generating a file
      const randomstr = randomstring.generate(8) + ".csv";
      fileGenerated(randomstr);
    }
  }, 10000);
};
