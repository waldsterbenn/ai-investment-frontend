import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFundamentalReportStore = defineStore('fundamental_report', () => {
  const report = ref()
  function updateReport(text: string) {
    report.value = text
  }

  return { report, updateReport }
})
