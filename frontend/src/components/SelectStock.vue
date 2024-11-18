<script setup lang="ts">
import axios from 'axios';
import { ref, watchEffect } from 'vue';
import { useSelectedStockStore } from '../stores/selectedstock'

const selectedItem = useSelectedStockStore()

const items = ref([]);

watchEffect(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/portfolio');
    items.value = response.data.portfolio;

  } catch (error) {
    console.error(error);
    items.value = [{ id: -1, name: 'Error fetching message' }];
  }
});

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
            <div v-for="item in items" :key="item.name" class="form-check">
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
