/**
 * Fields in a request to create a single TRADE item.
 */
export interface CreateTradeRequest {
	crypto: string
	tradeDate: string
	tradeType: string
	tradeCostPercent: number
	exchange: string
	quantity: number
	price: number
}
