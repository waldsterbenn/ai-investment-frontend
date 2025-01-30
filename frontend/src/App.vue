<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import ToolingIcon from './components/icons/IconTooling.vue';
import { useSelectedStockStore } from './stores/selected_stock_store';

const selectedItem = useSelectedStockStore()

const links = ref([
  { to: '/', text: 'Overview' },
  { to: '/selectstock', text: 'Select Stock' },
  { to: '/fundamentalanlysis', text: 'Fundamental Analysis' },
  { to: '/technicalanalysis', text: 'Technical Analysis' },
  { to: '/stockadviceanlysis', text: 'Stock Advice Analysis' },
  { to: '/stockagentanalysis', text: 'Stock Agent' },
  { to: '/about', text: 'About' }
]);
</script>

<template>
  <div class="container py-4 px-3 mx-auto">
    <header>

      <nav class="navbar navbar-expand-lg bg-primary-subtle border border-primary rounded mb-2">
        <div class="container-fluid">

          <div class="hstack"><span class="nav-text badge text-bg-info me-2" v-if="selectedItem.stock">
              <ToolingIcon /> {{ selectedItem.stock.ticker_symbol }}
              <!-- <p>Buy Price: {{ selectedItem.stock.buy_price }} {{ selectedItem.stock.currency }}</p>
                  <p>Buy Date: {{ selectedItem.stock.buy_date }}</p> -->
            </span>
            <span class="nav-text" v-else>
              No company selected
            </span>
            <div class="vr"></div>
          </div>


          <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <!-- <a class="navbar-brand" href="/"><button class="btn btn-secondary ms-4" type="button">
                Reset
              </button>
            </a> -->
            <ul class="navbar-nav nav nav-pills nav-justified me-auto mb-2 mb-lg-0">
              <li class="nav-item" v-for="(link, index) in links" :key="index">

                <RouterLink :to="link.to" class=" nav-link">
                  <!-- <button class="btn btn-primary" type="button"> -->
                  {{ link.text }}
                  <!-- </button> -->
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

<style scoped>
/* header {
  line-height: 1.5;
  max-width: 100vh;
} */

/* .logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  flex-direction: column;
  align-self: baseline;
  margin-bottom: 0.5rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
