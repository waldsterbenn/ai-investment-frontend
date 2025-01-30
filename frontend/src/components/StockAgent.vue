<script setup lang="ts">
import { LlmOutputCleaner } from '@/assets/LlmOutputCleaner';
import type { PortfolioItem } from '@/assets/PortfolioItem';
import { useAgentReportStore } from '@/stores/report_agent_store';
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
    try {
      const response = await axios.post('http://localhost:3001/api/run-stock-agent',
        selectedStock,
        { headers: { 'Content-Type': 'application/json' }, });
      agentReportStore.updateReport(response.data.report);
      //markdownText.value = response.data.report;
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      isRunningAnalysis.value = false;
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
            class="btn btn-secondary me-2" type="button">Copy
            to clipboard
          </button>

          <button class="btn btn-primary" type="button" disabled v-if="isRunningAnalysis">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Analysing...
          </button>
          <button @click="runAdviceAnalysis" v-bind:hidden="isRunningAnalysis" v-bind:disabled="!canRunAnalysis"
            class="btn btn-primary" type="button" v-if="!isRunningAnalysis">Run Analysis
          </button>
        </footer>
        <div class="card-body">
          <span v-if="selectedStock === null" class="card-text">You must
            <RouterLink class="card-link" to="selectstock">{{ "select a stock" }}</RouterLink>
            before
            we
            know what to
            analyse
          </span>
          <div v-else-if="canRunAnalysis">
            <span>You can run an analysis on {{
              selectedStock.name }}.</span>
            <div class="hr"></div>
            <span>The agent runs through multiple steps, like fetching stock data, run techical and fundamental analysis
              on the numbers,
              and analyse what the numbers mean.</span>
            <div class="hr"></div>
            <span>Afterwards it cretiques it's own work and produce a report, so you can make an informed desission.
              It's a lot of work, so it may take a while.
            </span>
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
  /* Keeps line breaks */
  word-break: break-word;
  /* Breaks words on line breaks */
  width: 100%;
  height: 100%;
  overflow: scroll;
  /* Scrolls when content is larger than container */
}

.error-message {
  font-weight: bold;
  color: var(--color-text);
}
</style>