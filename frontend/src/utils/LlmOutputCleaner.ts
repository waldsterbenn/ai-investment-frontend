export class LlmOutputCleaner {
  static clean(report: string): string {
    if (!report) {
      return ''
    }

    const parts = report.split('</think>')
    if (parts.length >= 2) {
      report = parts[1]
    }

    return report
      .replace('`', '')
      .replace('b"', '')
      .trimExcessQuotes()
      .replaceLiteralNewlines()
      .trim()
  }
}

declare global {
  interface String {
    trimExcessQuotes(): string
    replaceLiteralNewlines(): string
  }
}

String.prototype.trimExcessQuotes = function (): string {
  return this.replace(/^"+|"+$/g, '')
}

String.prototype.replaceLiteralNewlines = function (): string {
  return this.replace(/\\n/g, '\n')
}
