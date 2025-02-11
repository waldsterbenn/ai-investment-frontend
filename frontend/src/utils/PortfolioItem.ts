export class PortfolioItem {
  id: string
  name: string
  ticker_symbol: string

  constructor(id: string, name: string, ticker_symbol: string) {
    this.id = id
    this.name = name
    this.ticker_symbol = ticker_symbol
  }
}
