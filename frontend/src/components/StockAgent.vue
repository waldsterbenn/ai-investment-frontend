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
const getHtmlTable = () => LlmOutputCleaner.clean(agentReportStore.htmlTable);
const canRunAnalysis: boolean = selectedStock !== null;
const isRunningAnalysis = ref(false);
const timer = new Timer();

const output = computed(() => {
  try {
    return marked(getReportText(), { pedantic: true, silent: true });
  } catch (error) {
    console.error("Error parsing Markdown:", error);
    return "";
  }
});

const indicatorTable = computed(() => {
  let table = getHtmlTable();
  if (table) {
    table = table
      .replace(/<table/g, '<table class="table table-striped table-bordered table-hover"')
      .replace("b'", "")
      .replace("\\n'", "")
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\n")
      .trim();
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
      agentReportStore.updateTable(table);
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
    <div class="container">
      <div class="card">
        <div class="card-header text-end">
          <span v-if="isRunningAnalysis" class="card-text me-4">{{ timer.formattedElapsedTime }}</span>
          <button @click="copyToClipboard" v-bind:disabled="agentReportStore.report == null"
            class="btn btn-secondary me-2" type="button">
            <i class="bi bi-clipboard"></i>
            Copy
          </button>

          <button class="btn btn-primary" type="button" disabled v-if="isRunningAnalysis">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Run Agent
          </button>
          <button @click="runAdviceAnalysis" v-bind:hidden="isRunningAnalysis" v-bind:disabled="!canRunAnalysis"
            class="btn btn-primary" type="button" v-if="!isRunningAnalysis">
            <i class="bi bi-robot"></i>
            Run Agent
          </button>
        </div>
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

.error-message {
  font-weight: bold;
  color: var(--color-text);
}
</style>
