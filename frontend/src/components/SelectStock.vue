<script setup lang="ts">
import axios from 'axios';
import { ref, watchEffect } from 'vue';
import { useSelectedStockStore } from '../stores/selectedstock'

const selectedItem = useSelectedStockStore()

//const selectedItem = ref();
const items = ref([]);

// async function runTechicalAnalysis(event) {
//   selectedStock.update(selectedItem.value)
// }

watchEffect(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/portfolio');
    items.value = response.data.portfolio;

  } catch (error) {
    console.error(error);
    items.value = [{ id: -1, name: 'Error fetching message' }];
  }
});

defineProps<{
  msg: string
}>()
</script>

<template>
  <div>
    <h1>Portfolio</h1>
    <h3>Available companies</h3>
    <ul>
      <li v-for="item in items" :key="item.name">
        <input type="radio" :id="item.id" :value="item" v-model="selectedItem.stock" />
        <label :for="item.id">
          {{ item.name }} ({{ item.ticker_symbol }})
        </label>
      </li>
    </ul>
    <!-- <div v-if="selectedItem.stock">
      <h2>Selected:</h2>
      <p>Name: {{ selectedItem.stock.name }}</p>
      <p>Ticker Symbol: {{ selectedItem.stock.ticker_symbol }}</p>
      <p>Buy Price: {{ selectedItem.stock.buy_price }} {{ selectedItem.stock.currency }}</p>
      <p>Buy Date: {{ selectedItem.stock.buy_date }}</p>
    </div> -->

    <RouterLink to="/">
      <button>Ok</button>
    </RouterLink>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
