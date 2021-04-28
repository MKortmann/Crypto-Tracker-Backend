/**
 * Fields in a request to update a single TRADE item.
 */
export interface UpdateTradeRequest {
	crypto: string
	tradeDate: string
	tradeType: string
	tradeCostPercent: number
	exchange: string
	quantity: number
	price: number
}
