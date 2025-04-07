export class LlmOutputCleaner {
  static clean(report: string): string {
    if (!report) {
      return ''
    }

    const parts = report.split('</think>')
    if (parts.length < 2) {
      return report
    }

    return parts[1].replace('`', '')
  }
}
