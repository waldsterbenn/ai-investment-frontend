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
  <div class="container py-4 px-3 mx-auto">
    <header>
      <nav class="navbar navbar-expand-lg bg-primary-subtle border border-primary rounded mb-2">
        <div class="container-fluid">
          <div class="hstack">
            <span class="nav-text badge text-bg-primary me-2" v-if="selectedItem.stock">
              <ToolingIcon /> {{ selectedItem.stock.ticker_symbol }}
            </span>
            <span class="nav-text badge text-bg-warning me-2" v-else>
              <RouterLink :to="'/selectstock'" class="nav-link">
                Select stock
              </RouterLink>
            </span>
            <div class="vr"></div>
          </div>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav nav nav-pills nav-justified me-auto mb-2 mb-lg-0">
              <li class="nav-item" v-for="(link, index) in links" :key="index">
                <RouterLink :to="link.to" class="nav-link">
                  {{ link.text }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <div class="wrapper">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
