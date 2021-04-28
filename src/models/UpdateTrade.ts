/**
 * Contains a structure of the data that we update in our DynamoDB table
 */
export interface UpdateTrade {
	tradeDate: string
	tradeType: string
	tradeCostPercent: number
	crypto: string
	quantity: number
	exchange: string
	attachmentUrl?: string
}
