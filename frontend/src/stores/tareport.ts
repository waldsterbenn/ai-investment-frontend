import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReportStore = defineStore('tareport', () => {
  const report = ref()
  function updateReport(text: string) {
    report.value = text
  }

  return { report, updateReport }
})
