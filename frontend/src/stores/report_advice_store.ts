import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdviceReportStore = defineStore('report_advice_store', () => {
  const report = ref()
  function updateReport(text: string) {
    report.value = text
  }

  return { report, updateReport }
})

const test = ``
