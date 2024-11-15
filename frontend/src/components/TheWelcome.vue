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

const selectedStockCheckbox = computed(() => Boolean(selectedItem.stock !== null && selectedItem.stock !== undefined))
const taCheckbox = computed(() => Boolean(report.report.length > 0))
</script>

<template>
  <WelcomeItem class="{{  }}">
    <template #icon>
      <RouterLink to="/selectstock">
        <DocumentationIcon />
      </RouterLink>
    </template>
    <template #heading>
      <RouterLink to="/selectstock">
        Select company
        <!-- <input type="checkbox" value="stock" v-model="selectedItem.stock" /> -->
        <input type="checkbox" v-model="selectedStockCheckbox" />
      </RouterLink>
    </template>

    Select the stock you want to analyse.

  </WelcomeItem>

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

  <WelcomeItem>
    <template #icon>
      <RouterLink to="/technicalanalysis">
        <EcosystemIcon />
      </RouterLink>
    </template>
    <template #heading>
      <RouterLink to="/technicalanalysis">
        Technical analysis
        <input type="checkbox" v-model="taCheckbox" />
      </RouterLink>

    </template>
    Let the system analyse if the timing is right to buy or sell.
  </WelcomeItem>

  <!-- <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Advice</template>
    Review your personal assesment.

  </WelcomeItem> -->
</template>
