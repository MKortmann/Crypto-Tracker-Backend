/**
 * Fields in a request to update a single TRADE item.
 */
export interface UpdateTradeRequest {
	crypto: string
	tradeDate: string
	exchange: string
	tradeType: string
	tradeCostPercent: number
	quantity: number
	price: number
}
