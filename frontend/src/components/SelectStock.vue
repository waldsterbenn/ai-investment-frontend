<script setup lang="ts">
import { PortfolioItem } from '@/assets/PortfolioItem';
import axios from 'axios';
import { computed, ref, watchEffect } from 'vue';
import { useSelectedStockStore } from '../stores/selectedstock';

const selectedItem = useSelectedStockStore();

const portfolio = ref<PortfolioItem[]>([]);
const nextId = computed(() => (portfolio.value.length + 1).toString());

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
});

const stockName = ref('');
const tickerCode = ref('');
const errorMessage = ref('');

async function addStock() {
  if (!stockName.value || !tickerCode.value) {
    errorMessage.value = 'Please fill in both fields.';
    return;
  }
  if (portfolio.value.findIndex(x => x.ticker_symbol === tickerCode.value) > 0) {
    errorMessage.value = 'Stock with ticker already exists.';
    return;
  }

  const newStock = new PortfolioItem(nextId.value, stockName.value, tickerCode.value);
  portfolio.value.push(newStock);

  try {
    await axios.post('http://localhost:3001/api/portfolio-add', JSON.stringify(newStock),
      { headers: { 'Content-Type': 'application/json' }, });
    errorMessage.value = ''; // Clear error message on success
  } catch (error) {
    console.error("Failed to send data to backend:", error);
    errorMessage.value = 'Error adding stock. Please try again.';
  }
}

async function deleteStock(ticker_symbol: string) {
  const confirmation = window.confirm('Are you sure you want to delete this item?');

  if (!confirmation) return;

  try {
    await axios.post('http://localhost:3001/api/portfolio-delete', { ticker_symbol },
      { headers: { 'Content-Type': 'application/json' } });

    const index = portfolio.value.findIndex(x => x.ticker_symbol === ticker_symbol)
    if (index > -1) {
      portfolio.value.splice(index, 1);
    }
  } catch (error) {
    console.error('Error deleting stock:', error);
    errorMessage.value = 'Error deleting stock. Please try again.';
  }
}
</script>

<template>
  <div class="container text-start">
    <div class="row justify-content-md-center">
      <div class="col col-md-auto">
        <div class="card">
          <header class="card-header">
            <h3 class="card-title">Portfolio with available companies</h3>
            <span class="card-text">Select a company to continue with the investigation.</span>
          </header>
          <div class="card-body">
            <!-- Form for adding new stock -->
            <form>
              <div v-if="errorMessage" class="col alert alert-danger">{{ errorMessage }}</div>

              <div class="row">
                <div class="col-6">
                  <label class="form-label">Stock Name</label>
                </div>
                <div class="col-4">
                  <label class="form-label">Ticker Code</label>
                </div>
                <div class="col-2">
                </div>
              </div>

              <div class="row">
                <div class="col-6">
                  <input type="text" v-model="stockName" class="form-control" />
                </div>
                <div class="col-4">
                  <input type="text" v-model="tickerCode" class="form-control">
                </div>
                <div class="col-2">
                  <button @click.prevent="addStock" type="submit" class="col btn btn-success">
                    Add
                  </button>
                </div>
              </div>
            </form>
            <!-- List of portfolio items -->
            <div v-for="item in sortedPortfolio" :key="item.id" class="form-check mt-3">
              <input type="radio" class="form-check-input" :id="item.id" :value="item" v-model="selectedItem.stock" />
              <label :for="item.id" class="form-check-label">
                {{ item.name }} ({{ item.ticker_symbol }})
              </label>
              <!-- Remove Button -->
              <button @click.prevent="deleteStock(item.ticker_symbol)" class="btn btn-danger btn-close ml-2">

              </button>
            </div>
          </div>
          <footer class="card-footer text-end">
            <RouterLink to="/">
              <button class="btn btn-primary" type="button">Back</button>
            </RouterLink>
          </footer>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped></style>
