const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); //Middleware to parse json

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/ping", (req, res) => {
  res.json({ message: "Pong" });
});

app.get("/api/portfolio", (req, res) => {
  const jsonData = readData();
  res.json(jsonData);
  console.debug(`fetched ${jsonData.portfolio.length} items`);
});

function readData() {
  const filePath = path.join(__dirname, "data/portfolio.json");
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
}

app.post("/api/run-technical-analysis", async (req, res) => {
  console.debug("/api/run-technical-analysis > script caller triggered");
  // Path to your Python script
  const pythonScriptPath = path.join(
    __dirname,
    "../../ai-investment-manager/single_advice_technical.py"
  );

  // Serialize the JSON object to a string
  const jsonDataString = JSON.stringify(req.body, null, 0).replace(/"/g, "'");

  const condaPath = "C:/Users/ls/anaconda3/Scripts/conda.exe";

  // Spawn the Python script with the JSON data as an argument
  const childProcess = spawn(condaPath, [
    "run",
    "-p",
    "c:/src/ai-investment-manager/.conda_invst_mgr",
    "python",
    pythonScriptPath,
    jsonDataString,
  ]);

  let output = "";
  let error = "";

  // Capture stdout data from the script
  childProcess.stdout.on("data", (data) => {
    output += data.toString();
    console.debug("script out: " + output);
  });

  // Capture stderr data from the script
  childProcess.stderr.on("data", (err) => {
    error += err.toString();
    console.debug("script err: " + error);
  });

  // Handle when the script completes
  childProcess.on("close", (code) => {
    if (code === 0) {
      console.debug("script sucess");
      const report = output.split("TECHREPORT:")[1];
      res.json({ success: true, report });
    } else {
      console.debug("script failed", error);
      res.status(500).json({ success: false, error });
    }
  });
});
