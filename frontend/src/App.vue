<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import ToolingIcon from './components/icons/IconTooling.vue';
import { routes } from './router/index';
import { useSelectedStockStore } from './stores/selected_stock_store';

const selectedItem = useSelectedStockStore();

const links = ref(routes.filter(route => route.name).map(route => ({
  to: route.path,
  text: route.name
})));
</script>

<template>
  <div class="container-fluid-sm container-md py-2 px-3 mt-4 mx-auto card border-primary ">
    <header>
      <nav class="navbar navbar-expand-lg">
        <div class="hstack">
          <span class="nav-text badge text-bg-primary me-2" v-if="selectedItem.stock">
            <RouterLink :to="'/selectstock'" class="nav-link">
              <ToolingIcon /> {{ selectedItem.stock.ticker_symbol }}
            </RouterLink>
          </span>
          <span class="nav-text badge text-bg-warning me-2" v-else>
            <RouterLink :to="'/selectstock'" class="nav-link">
              Select stock
            </RouterLink>
          </span>
        </div>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav nav nav-tabs">
            <li class="nav-item" v-for="(link, index) in links" :key="index">
              <RouterLink :to="link.to" class="nav-link" active-class="active">
                {{ link.text }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <div class="card-body">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
