<script setup lang="ts">
import { LlmOutputCleaner } from '@/assets/LlmOutputCleaner';
import type { PortfolioItem } from '@/assets/PortfolioItem';
import { useAdviceReportStore } from '@/stores/advice_report';
import { useFundamentalReportStore } from '@/stores/fundamental_report';
import axios from 'axios';
import { marked } from 'marked';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useSelectedStockStore } from '../stores/selectedstock';
import { useReportStore } from '../stores/tareport';

const techicalStore = useReportStore();
const fundamentalStore = useFundamentalReportStore();
const adviceStore = useAdviceReportStore();
const selectedItemStore = useSelectedStockStore();
const selectedStock: PortfolioItem = selectedItemStore.stock ?? null;

const getReportText = () => LlmOutputCleaner.clean(adviceStore.report);
const canRunAnalysis: boolean = selectedStock !== null && (!!techicalStore.report || !!fundamentalStore.report);
const isRunningAnalysis = ref(false);

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

async function runAdviceAnalysis(_event: unknown) {
  if (!isRunningAnalysis.value) {
    isRunningAnalysis.value = true;
    const payload = { 'TECHREPORT': techicalStore.report ?? "Tech test", 'FINREPORT': fundamentalStore.report ?? "Funda test" };
    try {
      const response = await axios.post('http://localhost:3001/api/run-advice',
        payload,
        { headers: { 'Content-Type': 'application/json' }, });
      adviceStore.updateReport(response.data.report);
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
          <button @click="copyToClipboard" v-bind:disabled="adviceStore.report == null" class="btn btn-secondary me-2"
            type="button">Copy
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
          <span v-else-if="canRunAnalysis">You can run an analysis on {{
            selectedStock.name }},
            it may take a while.</span>
          <span v-else>You must run at least a Techical or Fundamental analysis (or both) before you can get
            advice.</span>

          <div v-if="adviceStore.report !== null" class="markdown" v-html="output"></div>
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