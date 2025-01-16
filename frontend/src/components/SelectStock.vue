<script setup lang="ts">
import axios from 'axios';
import { computed, ref, watchEffect } from 'vue';
import { useSelectedStockStore } from '../stores/selectedstock';

const selectedItem = useSelectedStockStore()

class PortfolioItem {
  id: string;
  name: string;
  ticker_symbol: string;
  constructor(id: string, name: string, ticker_symbol: string) {
    this.id = id;
    this.name = name;
    this.ticker_symbol = ticker_symbol;
  }
}

const portfolio = ref<PortfolioItem[]>([]);

watchEffect(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/portfolio');
    portfolio.value = response.data.portfolio;

  } catch (error) {
    console.error(error);
    portfolio.value = [{ id: "1", name: "Error fetching message", ticker_symbol: "" }];
  }
});

const sortedPortfolio = computed(() => {
  return [...portfolio.value].sort((a, b) => a.name.localeCompare(b.name));
})

// defineProps<{
//   msg: string
// }>()
</script>

<template>
  <div class="container text-start">
    <div class="row justify-content-md-center">
      <div class="col col-lg-2">
      </div>
      <div class="col col-md-auto">
        <div class="card">
          <header class="card-header">
            <h3 class="card-title">Portfolio with available companies</h3>
            <span class="card-text">Select a company to continue with the investigation.</span>
          </header>
          <div class="card-body">
            <div v-for="item in sortedPortfolio" :key="item.name" class="form-check">
              <input type="radio" class="form-check-input" :id="item.id" :value="item" v-model="selectedItem.stock" />
              <label :for="item.id" class="form-check-label">
                {{ item.name }} ({{ item.ticker_symbol }})
              </label>
            </div>
          </div>
          <footer class="card-footer text-end">
            <RouterLink to="/">
              <button class="btn btn-primary" type="button">Back</button>
            </RouterLink>
          </footer>
        </div>
      </div>
      <div class="col col-lg-2">
      </div>
    </div>
  </div>


</template>

<style scoped></style>
