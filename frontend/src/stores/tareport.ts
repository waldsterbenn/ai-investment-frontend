import { defineStore } from 'pinia'
import { ref } from 'vue'

const s =
  '# What are the short and long-term risks, if any? \n ## Tet \n- Based on the technical analysis\n - some potential risks to consider:\n\n **Disclaimer** lease note that this recommendation is based solely on technical analysis and should not be considered as investment advice. It is essential to consult with a financial advisor or conduct your own research before making any investment decisions.'
export const useReportStore = defineStore('tareport', () => {
  const report = ref()
  function updateReport(text: string) {
    report.value = text
  }

  return { report, updateReport }
})
