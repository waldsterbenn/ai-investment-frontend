<script setup lang="ts">
import { useAdviceReportStore } from '@/stores/report_advice_store';
import { useFundamentalReportStore } from '@/stores/report_fundamental_store';
import { useTechicalReportStore } from '@/stores/report_techical_store';
import { LlmOutputCleaner } from '@/utils/LlmOutputCleaner';
import type { PortfolioItem } from '@/utils/PortfolioItem';
import { Timer } from '@/utils/Timer';
import axios from 'axios';
import { marked } from 'marked';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useSelectedStockStore } from '../stores/selected_stock_store';

const techicalStore = useTechicalReportStore();
const fundamentalStore = useFundamentalReportStore();
const adviceStore = useAdviceReportStore();
const selectedItemStore = useSelectedStockStore();
const selectedStock: PortfolioItem = selectedItemStore.stock ?? null;

const getReportText = () => LlmOutputCleaner.clean(adviceStore.report);
const canRunAnalysis: boolean = selectedStock !== null && (!!techicalStore.report || !!fundamentalStore.report);
const isRunningAnalysis = ref(false);
const timer = new Timer();

const output = computed(() => {
  try {
    return marked(getReportText(), { pedantic: true, silent: true });
  } catch (error) {
    console.error("Error parsing Markdown:", error);
    alert("Error parsing Markdown: " + error);
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
          <button @click="copyToClipboard" v-bind:disabled="adviceStore.report == null" class="btn btn-secondary me-2"
            type="button"><i class="bi bi-clipboard"></i>
            Copy
          </button>

          <button class="btn btn-primary" type="button" disabled v-if="isRunningAnalysis">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Get Advice
          </button>
          <button @click="runAdviceAnalysis" v-bind:hidden="isRunningAnalysis" v-bind:disabled="!canRunAnalysis"
            class="btn btn-primary" type="button" v-if="!isRunningAnalysis">
            <i class="bi bi-robot"></i>
            Get Advice
          </button>
        </div>
        <div class="card-body">
          <span v-if="selectedStock === null" class="card-text">You must
            <RouterLink class="card-link" to="selectstock">{{ "select a stock" }}</RouterLink>
            before
            we
            know what to
            analyse
          </span>
          <span v-else-if="!canRunAnalysis">You must run at least a Techical or Fundamental analysis (or both) before
            you
            can get
            advice.</span>
          <span v-else-if="canRunAnalysis && adviceStore.report == null">You can run an analysis on {{
            selectedStock.name }},
            it may take a while.</span>

          <div v-if="adviceStore.report !== null" class="markdown" v-html="output"></div>
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