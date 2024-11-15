import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSelectedStockStore = defineStore('selectedstock', () => {
  const stock = ref()

  function update(newVal: object) {
    stock.value = newVal
  }

  return { stock, update }
})
