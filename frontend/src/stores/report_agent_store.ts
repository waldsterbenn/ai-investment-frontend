import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAgentReportStore = defineStore('report_agent_store', () => {
  const report = ref()
  const htmlTable = ref()
  function updateReport(text: string) {
    report.value = text
  }

  function updateTable(htmltext: string) {
    htmlTable.value = htmltext
  }

  return { report, updateReport, htmlTable, updateTable }
})

const test = ``
