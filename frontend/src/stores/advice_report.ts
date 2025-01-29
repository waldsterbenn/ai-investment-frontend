import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdviceReportStore = defineStore('advice_report', () => {
  const report = ref()
  function updateReport(text: string) {
    report.value = text
  }

  return { report, updateReport }
})

const test = ``
