import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSelectedStockStore = defineStore('selected_stock_store', () => {
  const stock = ref()

  function update(newVal: object) {
    stock.value = newVal
  }

  return { stock, update }
})
