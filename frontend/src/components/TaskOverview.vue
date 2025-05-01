<script setup lang="ts">
import { useAdviceReportStore } from '@/stores/report_advice_store'
import { useAgentReportStore } from '@/stores/report_agent_store'
import { useFundamentalReportStore } from '@/stores/report_fundamental_store'
import { useTechicalReportStore } from '@/stores/report_techical_store'
import { useSelectedStockStore } from '@/stores/selected_stock_store'
import { computed } from 'vue'
import TaskOverviewTemplateItem from './TaskOverviewTemplateItem.vue'

const selectedItem = useSelectedStockStore()
const techicalReport = useTechicalReportStore()
const fundamentalReport = useFundamentalReportStore()
const adviceReport = useAdviceReportStore()
const agentReport = useAgentReportStore()

const isStockSelected = computed(() => Boolean(selectedItem?.stock !== null && selectedItem.stock !== undefined))
const isFundamentalReportComplete = computed(() => Boolean(fundamentalReport?.report?.length > 0))
const isTechicalReportComplete = computed(() => Boolean(techicalReport?.report?.length > 0))
const isAdviceReportComplete = computed(() => Boolean(adviceReport?.report?.length > 0))
const isAgentReportComplete = computed(() => Boolean(agentReport?.report?.length > 0))
</script>

<template>
  <div class="container text-start">
    <div class="row justify-content-center">

      <div class="col col-auto">
        <div class="card">
          <header class="card-header">
            <span class="card-text">Follow the steps to perform a detailed analysis of a stock, including fundamental
              and technical evaluations, and receive expert advice.</span>
            <div class="hr"></div>
            <i>You can either let the AI agent do the
              work,
              or make
              a customized analysis, comprised of the elements you want.</i>
          </header>
          <div class="card-body">
            <TaskOverviewTemplateItem>
              <template #icon>
                <i class="bi bi-diagram-3"></i>
              </template>
              <template #heading>
                Select Company
              </template>
              <template #content>
                <div class="row">
                  <div class="col text-start">
                    <span v-if="isStockSelected">
                      <i class="bi bi-check-square-fill"></i>
                      Stock has been selected.
                    </span>
                    <span v-else>
                      <i class="bi bi-check-square"></i>
                      Select the stock you want to analyse.
                    </span>
                  </div>
                  <div class="col text-end">
                    <RouterLink to="/selectstock">
                      <button class="btn btn-primary btn-sm" type="button">
                        <span v-if="isStockSelected">
                          Select new stock
                        </span>
                        <span v-else>
                          Select stock
                        </span>
                      </button>
                    </RouterLink>
                  </div>
                </div>
              </template>
            </TaskOverviewTemplateItem>
          </div>

          <div class="card-body">
            <TaskOverviewTemplateItem>
              <template #icon>
                <i class="bi bi-robot"></i>
              </template>
              <template #heading>
                Stock Agent
              </template>
              <template #content>
                <div class="row">
                  <div class="col-auto text-start">
                    <span v-if="isAgentReportComplete">
                      <i class="bi bi-check-square-fill"></i>
                      The Agent has run a complete analysis on the stock.
                    </span>
                    <span v-else>
                      <i class="bi bi-check-square"></i>
                      Let the AI agent run autonomously and create an analysis on the stock, for you to read.
                    </span>
                  </div>
                  <div class="col text-end">
                    <RouterLink to="/stockagentanalysis">
                      <button class="btn btn-primary btn-sm" type="button">
                        <span v-if="isAgentReportComplete">
                          View report
                        </span>
                        <span v-else>
                          Stock agent
                        </span>
                      </button>
                    </RouterLink>
                  </div>
                </div>
              </template>
            </TaskOverviewTemplateItem>
          </div>

          <div class="card-body">
            <TaskOverviewTemplateItem>
              <template #icon>
                <i class="bi bi-card-checklist"></i>
              </template>
              <template #heading>
                Custom analysis
              </template>
              <template #content>
                <div class="row">
                  <div class="col-auto text-start">
                    <span v-if="isFundamentalReportComplete">
                      <i class="bi bi-check-square-fill"></i>
                      The Fundamental analysis is complete.
                    </span>
                    <span v-else>
                      <i class="bi bi-check-square"></i>
                      The system will analyse key figures in the company's financial reporting.
                    </span>
                  </div>
                  <div class="col text-end">
                    <RouterLink to="/fundamentalanalysis">
                      <button class="btn btn-primary btn-sm" type="button">
                        <i class="bi bi-book"></i>
                        <span v-if="isFundamentalReportComplete">
                          View report
                        </span>
                        <span v-else>
                          Fundamental analysis
                        </span>
                      </button>
                    </RouterLink>
                  </div>
                </div>

                <div class="row mt-3">
                  <div class="col-auto text-start">
                    <span v-if="isTechicalReportComplete">
                      <i class="bi bi-check-square-fill"></i>
                      The Technical analysis is complete.
                    </span>
                    <span v-else>
                      <i class="bi bi-check-square"></i>
                      Let the system analyse if the timing is right to buy or sell.
                    </span>
                  </div>
                  <div class="col text-end">
                    <RouterLink to="/technicalanalysis">
                      <button class="btn btn-primary btn-sm" type="button">
                        <i class="bi bi-graph-up"></i>
                        <span v-if="isTechicalReportComplete">
                          View report
                        </span>
                        <span v-else>
                          Technical analysis
                        </span>
                      </button>
                    </RouterLink>
                  </div>
                </div>

                <div class="row mt-3">
                  <div class="col-auto text-start">
                    <span v-if="isAdviceReportComplete">
                      <i class="bi bi-check-square-fill"></i>
                      Review the assessment of the stock.
                    </span>
                    <span v-else>
                      <i class="bi bi-check-square"></i>
                      Get advice on whether to buy or sell the stock, based on one or more analyses.
                    </span>
                  </div>
                  <div class="col text-end">
                    <RouterLink to="/stockadviceanalysis">
                      <button class="btn btn-primary btn-sm" type="button">
                        <i class="bi bi-heart"></i>
                        <span v-if="isAdviceReportComplete">
                          View report
                        </span>
                        <span v-else>
                          Get advice
                        </span>
                      </button>
                    </RouterLink>
                  </div>
                </div>
              </template>
            </TaskOverviewTemplateItem>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.btn {
  width: 12rem;
}
</style>
