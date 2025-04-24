<script setup lang="ts">
import { useAgentReportStore } from '@/stores/report_agent_store';
import { LlmOutputCleaner } from '@/utils/LlmOutputCleaner';
import type { PortfolioItem } from '@/utils/PortfolioItem';
import { Timer } from '@/utils/Timer';
import axios from 'axios';
import { marked } from 'marked';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useSelectedStockStore } from '../stores/selected_stock_store';

const agentReportStore = useAgentReportStore();
const selectedItemStore = useSelectedStockStore();
const selectedStock: PortfolioItem = selectedItemStore.stock ?? null;

const getReportText = () => LlmOutputCleaner.clean(agentReportStore.report);
const canRunAnalysis: boolean = selectedStock !== null;
const isRunningAnalysis = ref(false);
const timer = new Timer();

const indicatorTableData = ref<string>();
// const indicatorTableData = ref<string>("b'\\n<table border=\"1\">\\n  <tr>\\n    <th colspan=\"2\">Key Technical Indicators and Fundamentals for ABB (ABB.ST)</th>\\n  </tr>\\n  <tr>\\n    <th>Indicator</th>\\n    <th>Value</th>\\n  </tr>\\n  <tr>\\n    <td>MACD (12,26,9)</td>\\n    <td>-17.35 (signal: 3.08, histogram: -20.43)</td>\\n  </tr>\\n  <tr>\\n    <td>ADX (14)</td>\\n    <td>34.59</td>\\n  </tr>\\n  <tr>\\n    <td>RSI</td>\\n    <td>41.2</td>\\n  </tr>\\n  <tr>\\n    <td>SMA (10)</td>\\n    <td>489.97</td>\\n  </tr>\\n  <tr>\\n    <td>SMA (50)</td>\\n    <td>548.63</td>\\n  </tr>\\n  <tr>\\n    <td>Forward P/E Ratio</td>\\n    <td>18.66</td>\\n  </tr>\\n  <tr>\\n    <td>Beta</td>\\n    <td>0.827</td>\\n  </tr>\\n  <tr>\\n    <td>Gross Margin (2024)</td>\\n    <td>40.2%</td>\\n  </tr>\\n  <tr>\\n    <td>Operating Margin (2024)</td>\\n    <td>17.1%</td>\\n  </tr>\\n  <tr>\\n    <td>Net Profit Margin (2024)</td>\\n    <td>13.7%</td>\\n  </tr>\\n  <tr>\\n    <td>Revenue Growth (2024 vs 2023)</td>\\n    <td>2.3%</td>\\n  </tr>\\n  <tr>\\n    <td>Net Income Growth (2024 vs 2023)</td>\\n    <td>5.1%</td>\\n  </tr>\\n  <tr>\\n    <td>Current Price</td>\\n    <td>491.8 SEK</td>\\n  </tr>\\n  <tr>\\n    <td>Target Mean Price</td>\\n    <td>643.62 SEK</td>\\n  </tr>\\n  <tr>\\n    <td>Upside Potential</td>\\n    <td>30.9%</td>\\n  </tr>\\n</table>\\n'");

const output = computed(() => {
  try {
    return marked(getReportText(), { pedantic: true, silent: true });
  } catch (error) {
    console.error("Error parsing Markdown:", error);
    return "";
  }
});

const indicatorTable = computed(() => {
  let table = indicatorTableData.value;
  if (table) {
    table = table
      .replace("<table", '<table class="table table-striped table-bordered table-hover"')
      .replace("b'", "")
      .replace("\\n'", "")
      .replace(/\\n/g, "\n");
  }
  return table;
});

async function copyToClipboard(_event: unknown) {
  await navigator.clipboard.writeText(getReportText());
  alert("Copied to clipboard");
}

async function runAdviceAnalysis(_event: unknown) {
  if (!isRunningAnalysis.value) {
    isRunningAnalysis.value = true;
    timer.start();
    try {
      const response = await axios.post('http://localhost:3001/api/run-stock-agent',
        selectedStock,
        { headers: { 'Content-Type': 'application/json' }, });

      const jsonData = JSON.parse(response.data.OUTPUTDATA);
      const re = LlmOutputCleaner.clean(jsonData.analysis);
      const table = LlmOutputCleaner.clean(jsonData.table);
      agentReportStore.updateReport(re);
      indicatorTableData.value = table;
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      isRunningAnalysis.value = false;
      timer.stop();
    }
  }
}
</script>

<template>
  <div>
    <div class="pre-container">
      <div class="card">
        <footer class="card-footer text-end">
          <button @click="copyToClipboard" v-bind:disabled="agentReportStore.report == null"
            class="btn btn-secondary me-2" type="button">Copy to clipboard
          </button>

          <button class="btn btn-primary" type="button" disabled v-if="isRunningAnalysis">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Working ({{ timer.formattedElapsedTime }})
          </button>
          <button @click="runAdviceAnalysis" v-bind:hidden="isRunningAnalysis" v-bind:disabled="!canRunAnalysis"
            class="btn btn-primary" type="button" v-if="!isRunningAnalysis">Run Agent
          </button>
        </footer>
        <div class="card-body">
          <span v-if="selectedStock === null" class="card-text">You must
            <RouterLink class="card-link" to="selectstock">{{ "select a stock" }}</RouterLink>
            before we know what to analyze.
          </span>
          <div v-else-if="canRunAnalysis && !agentReportStore.report">
            <blockquote class="blockquote">
              <span class="card-text">
                Let the agent analyze {{ selectedStock.name }}.
              </span>
            </blockquote>
            <span>The agent runs through multiple steps during the analysis, so it may take some time.</span>
            <div class="hr"></div>
            <span>Here's what will happen:</span>
            <ol>
              <li>Run a fundamental analysis on the stock's financials to see if the company is healthy.</li>
              <li>Analyze the stock's performance and evaluate its near-term price direction based on technical
                indicators.</li>
              <li>Based on the reports and the information it has gathered, it will evaluate the stock.</li>
              <li>Lastly, it will critique its own work and produce a report so you can make an informed decision.</li>
            </ol>
            <div class="hr"></div>
            <i>You can copy the analysis report and save the Markdown text for later.</i>
          </div>

          <div class="indicatorsTable" v-html="indicatorTable"></div>
          <div v-if="agentReportStore.report !== null" class="markdown" v-html="output"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.markdown {
  overflow: auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 16px;
  background-color: rgb(60, 60, 70);
}

.pre-container {
  white-space: pre-wrap;
  word-break: break-word;
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.error-message {
  font-weight: bold;
  color: var(--color-text);
}
</style>
