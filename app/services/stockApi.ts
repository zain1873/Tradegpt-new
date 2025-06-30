const ALPHA_VANTAGE_API_KEY = "04RGF1U9PAJ49VYI"
const FINNHUB_API_KEY = "d08gifhr01qh1ecc2v7gd08gifhr01qh1ecc2v80"

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: string
}

export interface NewsItem {
  id: string
  headline: string
  summary: string
  url: string
  source: string
  datetime: number
  image?: string
  category: string
}

// Get real-time stock quote
export async function getStockQuote(symbol: string): Promise<StockData | null> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
    )
    const data = await response.json()

    if (data["Global Quote"]) {
      const quote = data["Global Quote"]
      return {
        symbol: quote["01. symbol"],
        name: symbol, // We'll enhance this with company name later
        price: Number.parseFloat(quote["05. price"]),
        change: Number.parseFloat(quote["09. change"]),
        changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
        volume: Number.parseInt(quote["06. volume"]),
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching stock quote:", error)
    return null
  }
}

// Get stock news from Finnhub
export async function getStockNews(symbol: string): Promise<NewsItem[]> {
  try {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 7) // Last 7 days
    const toDate = new Date()

    const response = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate.toISOString().split("T")[0]}&to=${toDate.toISOString().split("T")[0]}&token=${FINNHUB_API_KEY}`,
    )
    const data = await response.json()

    return data.slice(0, 10).map((item: any, index: number) => ({
      id: `${symbol}-${index}`,
      headline: item.headline,
      summary: item.summary || item.headline,
      url: item.url,
      source: item.source,
      datetime: item.datetime,
      image: item.image,
      category: "Company News",
    }))
  } catch (error) {
    console.error("Error fetching stock news:", error)
    return []
  }
}

// Search stocks
export async function searchStocks(query: string): Promise<StockData[]> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`,
    )
    const data = await response.json()

    if (data.bestMatches) {
      const promises = data.bestMatches.slice(0, 6).map(async (match: any) => {
        const quote = await getStockQuote(match["1. symbol"])
        return (
          quote || {
            symbol: match["1. symbol"],
            name: match["2. name"],
            price: 0,
            change: 0,
            changePercent: 0,
            volume: 0,
          }
        )
      })

      return await Promise.all(promises)
    }
    return []
  } catch (error) {
    console.error("Error searching stocks:", error)
    return []
  }
}

// Get default popular stocks
export const getPopularStocks = async (): Promise<StockData[]> => {
  const popularSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA"]
  const promises = popularSymbols.map((symbol) => getStockQuote(symbol))
  const results = await Promise.all(promises)
  return results.filter(Boolean) as StockData[]
}
