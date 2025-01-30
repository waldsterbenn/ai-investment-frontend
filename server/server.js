const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const { ServerConfig } = require("./config/server_config.js");

const app = express();
const PORT = process.env.PORT || 3001;
const portfolioJsonFilePath = path.join(__dirname, "data/portfolio.json");

app.use(cors());
app.use(express.json()); //Middleware to parse json

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/ping", (req, res) => {
  res.json({ message: "Pong" });
});

function loadPortfolioData() {
  try {
    const rawData = fs.readFileSync(portfolioJsonFilePath);
    return JSON.parse(rawData);
  } catch (parseErr) {
    console.error("Error parsing portfolio JSON:", parseErr);
    res.status(500).json({ success: false, parseErr });
  }
}

app.get("/api/portfolio", (req, res) => {
  const jsonData = loadPortfolioData();
  res.json(jsonData);
  console.debug(`fetched ${jsonData.portfolio.length} items`);
});

app.post("/api/portfolio-add", async (req, res) => {
  console.debug("/api/portfolio-add " + req.body.ticker_symbol);

  const jsonObj = loadPortfolioData();
  const newItem = {
    name: req.body.name,
    ticker_symbol: req.body.ticker_symbol,
    buy_price: 0,
    currency: "",
    buy_date: "",
  };
  jsonObj.portfolio.push(newItem);

  // Write the updated data back to portfolio.json
  fs.writeFile(
    portfolioJsonFilePath,
    JSON.stringify(jsonObj, null, 2),
    (err) => {
      if (err) {
        res.status(500).json({ success: false, err });
      } else {
        console.log("Portfolio item added successfully.");
        res.json({ success: true });
      }
    }
  );
});

app.post("/api/portfolio-delete", async (req, res) => {
  console.debug("/api/portfolio-delete " + req.body.ticker_symbol);

  const jsonObj = loadPortfolioData();
  jsonObj.portfolio = jsonObj.portfolio.filter(
    (x) => x.ticker_symbol !== req.body.ticker_symbol
  );

  // Write the updated data back to portfolio.json
  fs.writeFile(
    portfolioJsonFilePath,
    JSON.stringify(jsonObj, null, 2),
    (err) => {
      if (err) {
        res.status(500).json({ success: false, err });
      } else {
        console.log("Portfolio item deleted.");
        res.json({ success: true });
      }
    }
  );
});

app.post("/api/save-report", async (req, res) => {
  console.debug("/api/save-report");
  const jsn = JSON.parse(req.body);
  const outputFilePath = path.join(
    __dirname,
    `../../ai-investment-manager/data/${jsn.filename}`
  );
  fs.writeFileSync(outputFilePath, jsn.reportData, "utf-8");
});

function loadFauxReport() {
  const filePath = path.join(__dirname, "data/test.md");
  const report = fs.readFileSync(filePath, "utf-8");
  return report;
  // console.warn(report);
  // res.json({ success: true, report });
  // return;
}

app.post("/api/run-technical-analysis", async (req, res) => {
  console.debug("/api/run-technical-analysis > script caller triggered");

  // Path to your Python script, could be absolute
  const pythonScriptPath = path.join(
    __dirname,
    "../../ai-investment-manager/single_advice_technical.py"
  );

  // Serialize the JSON object to a string
  const jsonDataString = JSON.stringify(req.body, null, 0).replace(/"/g, "'");

  // Spawn the Python script with the JSON data as an argument
  const childProcess = spawn(ServerConfig.conda_exe_path, [
    "run",
    "-p",
    ServerConfig.conda_env_path,
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
    error += err.toString() + "(Make sure OLLAMA is running)";
    console.debug("Error: " + error);
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

app.post("/api/run-financial-analysis", async (req, res) => {
  console.debug("/api/run-financial-analysis > script caller triggered");

  // Path to your Python script, could be absolute
  const pythonScriptPath = path.join(
    __dirname,
    "../../ai-investment-manager/single_advice_fincancial.py"
  );

  // Serialize the JSON object to a string
  const jsonDataString = JSON.stringify(req.body, null, 0).replace(/"/g, "'");

  // Spawn the Python script with the JSON data as an argument
  const childProcess = spawn(ServerConfig.conda_exe_path, [
    "run",
    "-p",
    ServerConfig.conda_env_path,
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
      const report = output.split("FINREPORT:")[1];
      res.json({ success: true, report });
    } else {
      console.debug("script failed", error);
      res.status(500).json({ success: false, error });
    }
  });
});

app.post("/api/run-advice", async (req, res) => {
  console.debug("/api/run-advice > script caller triggered");
  console.debug("*********");

  // Path to your Python script, could be absolute
  const pythonScriptPath = path.join(
    __dirname,
    "../../ai-investment-manager/single_advice.py"
  );

  // Serialize the JSON object to a string
  // const jsonDataString = JSON.stringify(req.body, null, 0).replace(/"/g, "'");
  // const encoded = encodeURIComponent(jsonDataString);
  const jsonDataString = JSON.stringify(req.body);
  const encodedData = Buffer.from(jsonDataString, "utf-8").toString("base64");
  //console.debug(encoded);

  // Spawn the Python script with the JSON data as an argument
  const childProcess = spawn(ServerConfig.conda_exe_path, [
    "run",
    "-p",
    ServerConfig.conda_env_path,
    "python",
    pythonScriptPath,
    encodedData,
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
      const report = output.split("ADVICE:")[1];
      res.json({ success: true, report });
    } else {
      console.debug("script failed", error);
      res.status(500).json({ success: false, error });
    }
  });
});

app.post("/api/run-stock-agent", async (req, res) => {
  console.debug("/api/run-stock-agent > script caller triggered");
  console.debug("*********");
  const outputs = `REPORT:

**Final Answer:**

**Axon Enterprise (AXON) Stock Report Analysis**

**Fundamental Analysis Overview:**
- **Current Price:** $652.06
- **Moving Averages:**
  - 14-day SMA: $637.53
  - 50-day SMA: $618.73
  - 200-day SMA: $417.85

The stock is currently trading above both the 14-day and 50-day moving averages, indicating a bullish trend. However, it remains below the 200-day average, suggesting moderate strength relative to longer-term trends.

**Target High:** The target high of $800 indicates potential for further growth if market conditions improve.

**YTD Change:** A positive increase of 1.57% over the year suggests some upward movement but is relatively modest compared to other metrics.

**Technical Analysis Overview:**
- **MACD (Moving Average Convergence Divergence):**
  - **MACD Line:** Steady rise indicates bullish momentum.
  - **MACD Histogram:** Positive, reinforcing a bullish signal.
  - **Signal Line:** Crosses above the MACD line recently, which is typically bearish as it often precedes corrections.

- **RSI (Relative Strength Index):**
  - **Current RSI Value:** 52.50
  - **Interpretation:** Overbought (above 70), suggesting potential pullback or correction in the near term.

- **Volume Analysis:**
  - **Current Volume:** 2,658,100
  - **Recent Drops:** The volume has been dropping recently (e.g., 362,100 on January 24th), indicating reduced investor interest or market sentiment.

- **SMA (Simple Moving Averages):**
  - The stock's positive trend over the long term is supported by increasing SMA_50 and SMA_200, suggesting sustained upward momentum.

**Conclusion:**
Combining both fundamental and technical analyses:
- The stock shows a bullish trend with positive momentum indicators like MACD.
- However, the overbought RSI suggests potential resistance in the near term.
- The long-term positive trend is favorable for investors looking at the longer horizon.

**Investment Recommendations:**
1. **Strong Buy:** Consider holding or increasing exposure if market sentiment improves.
2. **Moderate Risk:** Be cautious of potential pullbacks due to RSI levels and decreasing volume.
3. **Risk Management:** Monitor for significant support/resistance as the price approaches key technical markers like $800.

**Next Steps:**
- Monitor momentum indicators (MACD, RSI) for changes that could indicate a shift in market sentiment.
- Stay informed about any external factors affecting Axon Enterprise, such as company news or economic conditions impacting law enforcement and security industries.
- Consider diversifying the investment portfolio to mitigate risk exposure.

This analysis suggests that Axon Enterprise is a strong buy with room for growth despite moderate risk factors. However, investors should remain vigilant regarding potential pullbacks and monitor key technical indicators closely.`;
  const report = outputs.split("REPORT:")[1];
  res.json({ success: true, report });
  return;
  // Serialize the JSON object to a string
  const jsonDataString = JSON.stringify(req.body, null, 0).replace(/"/g, "'");

  // Path to your Python script, could be absolute
  const pythonScriptPath = path.join(
    __dirname,
    "../../ai-investment-manager/single_stock_analysis_agent.py"
  );
  // Spawn the Python script with the JSON data as an argument
  const childProcess = spawn(ServerConfig.conda_exe_path, [
    "run",
    "-p",
    ServerConfig.conda_env_path,
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
      const report = output.split("REPORT:")[1];
      res.json({ success: true, report });
    } else {
      console.debug("script failed", error);
      res.status(500).json({ success: false, error });
    }
  });
});
