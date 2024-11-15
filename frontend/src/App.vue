<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useSelectedStockStore } from './stores/selectedstock'
import { ref } from 'vue';
const selectedItem = useSelectedStockStore()

const links = ref([
  { to: '/', text: 'Home' },
  { to: '/selectstock', text: 'Select Stock' },
  { to: '/technicalanalysis', text: 'Technical Analysis' },
  { to: '/about', text: 'About' }
]);
</script>

<template>
  <header>
    <div class="wrapper">

      <nav>
        <div v-for="(link, index) in links" :key="index">
          <RouterLink :to="link.to">{{ link.text }}</RouterLink>
        </div>
      </nav>

      <div v-if="selectedItem.stock">

        <h2>{{ selectedItem.stock.name }} ({{ selectedItem.stock.ticker_symbol }})</h2>

        <p>Buy Price: {{ selectedItem.stock.buy_price }} {{ selectedItem.stock.currency }}</p>
        <p>Buy Date: {{ selectedItem.stock.buy_date }}</p>
      </div>

    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-width: 100vh;
}

.logo {
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
}
</style>
