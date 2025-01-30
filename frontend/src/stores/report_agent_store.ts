import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAgentReportStore = defineStore('report_agent_store', () => {
  const report = ref()
  function updateReport(text: string) {
    report.value = text
  }

  return { report, updateReport }
})

const test = ``
