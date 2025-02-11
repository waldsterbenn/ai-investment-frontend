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

const output = computed(() => {
  try {
    return marked(getReportText(), { pedantic: true, silent: true });
  } catch (error) {
    console.error("Error parsing Markdown:", error);
    return "";
  }
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
      agentReportStore.updateReport(response.data.report);
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
          <div v-else-if="canRunAnalysis">
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