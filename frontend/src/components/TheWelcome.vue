<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
import { computed, ref } from 'vue'
import { useReportStore } from '../stores/tareport'
import { useSelectedStockStore } from '../stores/selectedstock'

const selectedItem = useSelectedStockStore()
const report = useReportStore()

const isStockSlected = computed(() => Boolean(selectedItem.stock !== null && selectedItem.stock !== undefined))
const isTaComplete = computed(() => Boolean(report.report.length > 0))
</script>

<template>
  <div class="container text-start">
    <div class="row justify-content-md-center">
      <div class="col col-lg-2">
      </div>
      <div class="col col-md-auto">
        <div class="card">
          <header class="card-header">
            <h3 class="card-title">Progress</h3>
            <span class="card-text">Run through the steps you desire to get a comprehensive analysis of a stock</span>
          </header>
          <div class="card-body">
            <WelcomeItem :class="{ 'text-bg-success': isStockSlected }">
              <template #icon>
                <DocumentationIcon />
              </template>
              <template #heading>
                Select Company
              </template>
              <template #actionbutton>
                <RouterLink to="/selectstock">
                  <button class="btn btn-primary" type="button">
                    Select company
                  </button>
                </RouterLink>
              </template>
              <template #content>
                Select the stock you want to analyse.

              </template>


            </WelcomeItem>
          </div>
          <!-- <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>
      Get a personalized assesment
      <input type="checkbox" value="personalize" v-model="completedSteps"></input>
    </template>
    Provide information if you should sell a stock you already have.
    Or if it's a good time to buy it.

  </WelcomeItem> -->

          <!-- <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Fundamental analysis</template>
    The system will analyse key figures in the company's financial reporting.
  </WelcomeItem> -->
          <div class="card-body">


            <WelcomeItem :class="{ 'text-bg-success': isTaComplete }">
              <template #icon>
                <EcosystemIcon />
              </template>
              <template #heading>
                Technical analysis
              </template>
              <template #actionbutton>
                <RouterLink to="/technicalanalysis">
                  <button class="btn btn-primary" type="button">
                    Technical analysis
                  </button>
                </RouterLink>
              </template>
              <template #content>
                Let the system analyse if the timing is right to buy or sell.
              </template>


            </WelcomeItem>
            <!-- <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Advice</template>
    Review your personal assesment.

  </WelcomeItem> -->
          </div>
          <!-- <footer class="card-footer text-end">

          </footer> -->
        </div>
      </div>
      <div class="col col-lg-2">
      </div>
    </div>
  </div>
</template>
