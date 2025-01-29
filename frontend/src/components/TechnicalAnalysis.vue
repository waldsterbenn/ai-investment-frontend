<script setup lang="ts">
import { LlmOutputCleaner } from '@/assets/LlmOutputCleaner';
import { useTechicalReportStore } from '@/stores/report_techical_store';
import axios from 'axios';
import { marked } from 'marked';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useSelectedStockStore } from '../stores/selected_stock_store';

const reportStore = useTechicalReportStore()
const selectedItem = useSelectedStockStore()

const isRunningAnalysis = ref(false);
const getReportText = () => LlmOutputCleaner.clean(reportStore.report);

const output = computed(() => {
  try {
    return marked(getReportText());
  } catch (error) {
    console.error("Error parsing Markdown:", error);
    return "";
  }
});

async function copyToClipboard(_event: unknown) {
  await navigator.clipboard.writeText(getReportText());
  alert("Copied to clipboard");
}

async function runTechicalAnalysis(_event: unknown) {
  if (!isRunningAnalysis.value) {
    isRunningAnalysis.value = true;
    reportStore.updateReport("");
    try {
      const response = await axios.post('http://localhost:3001/api/run-technical-analysis',
        selectedItem.stock,
        { headers: { 'Content-Type': 'application/json' }, });
      reportStore.updateReport(response.data.report);
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
          <button @click="copyToClipboard" v-bind:disabled="reportStore.report == null" class="btn btn-secondary me-2"
            type="button">Copy
            to clipboard
          </button>

          <button class="btn btn-primary" type="button" disabled v-if="isRunningAnalysis">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Analysing...
          </button>
          <button @click="runTechicalAnalysis" v-bind:hidden="isRunningAnalysis"
            v-bind:disabled="selectedItem.stock == null" class="btn btn-primary" type="button"
            v-if="!isRunningAnalysis">Run Analysis
          </button>
        </footer>
        <div class="card-body">
          <span v-if="selectedItem.stock == null" class="card-text">You must
            <RouterLink class="card-link" to="selectstock">{{ "select a stock" }}</RouterLink>
            before
            we
            know what to
            analyse
          </span>
          <span v-else-if="selectedItem.stock != null && reportStore.report == null">You can run an analysis on {{
            selectedItem.stock.name }},
            it may take a while.</span>

          <div v-if="reportStore.report != null" class="markdown" v-html="output"></div>

        </div>

      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.markdown {
  /* display: inline-block; */
  overflow: auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 16px;
}

.pre-container {
  /* border-color: var(--color-border);
  border-width: 1px;
  border-style: solid; */

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
  /* red color */
}
</style>