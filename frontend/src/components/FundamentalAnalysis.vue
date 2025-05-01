<script setup lang="ts">
import { useFundamentalReportStore } from '@/stores/report_fundamental_store';
import { useSelectedStockStore } from '@/stores/selected_stock_store';
import { LlmOutputCleaner } from '@/utils/LlmOutputCleaner';
import { Timer } from '@/utils/Timer';
import axios from 'axios';
import { marked } from 'marked';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

const reportStore = useFundamentalReportStore();
const selectedItem = useSelectedStockStore();

const getReportText = () => LlmOutputCleaner.clean(reportStore.report);
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

async function runAnalysis(_event: unknown) {
  if (!isRunningAnalysis.value) {
    isRunningAnalysis.value = true;
    timer.start();
    try {
      reportStore.updateReport("");
      const response = await axios.post('http://localhost:3001/api/run-financial-analysis',
        selectedItem.stock,
        { headers: { 'Content-Type': 'application/json' }, });
      reportStore.updateReport(response.data.report);
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
        <header class="card-header text-end">
          <span v-if="isRunningAnalysis" class="card-text me-4">{{ timer.formattedElapsedTime }}</span>
          <button @click="copyToClipboard" v-bind:disabled="reportStore.report == null" class="btn btn-secondary me-2"
            type="button"><i class="bi bi-clipboard"></i>
            Copy
          </button>

          <button class="btn btn-primary" type="button" disabled v-if="isRunningAnalysis">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Fundamental Analysis
          </button>
          <button @click="runAnalysis" v-bind:hidden="isRunningAnalysis" v-bind:disabled="selectedItem.stock == null"
            class="btn btn-primary" type="button" v-if="!isRunningAnalysis">
            <i class="bi bi-robot"></i>
            Fundamental Analysis
          </button>
        </header>
        <div class="card-body">
          <span v-if="selectedItem.stock == null" class="card-text">You must
            <RouterLink class="card-link" to="selectstock">{{ "select a stock" }}</RouterLink>
            before we know what to analyze.
          </span>
          <span v-else-if="selectedItem.stock != null && reportStore.report == null">You can run an analysis on {{
            selectedItem.stock.name }}, it may take a while.</span>

          <div v-if="reportStore.report != null" class="markdown" v-html="output"></div>
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